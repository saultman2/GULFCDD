import { Router } from "express";
import { db, campaignApplications, campaignSettings, campaignEvents, campaignMail } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { UpdateCampaignAdminBody } from "@workspace/api-zod";
import { getConfig, historyEntry } from "../../campaign/storage";
import { requireCampaignAdmin, requireSameOrigin, digest, token } from "../../campaign/security";
import { STATUSES, PLANS, OWNERSHIP_TERMS, CAMPAIGN_ORIGIN } from "../../campaign/defaults";
import { queueMail, processCampaignMail } from "../../campaign/mail";
import { reconcileCampaignPayment } from "../../campaign/payments";
import { recordMilestone } from "../../campaign/milestones";

export function createCampaignAdminRouter(guard: import("express").RequestHandler = requireCampaignAdmin) {
const router = Router();
router.use("/admin", guard);
router.get("/admin", async (_req, res) => {
  const apps = await db.select().from(campaignApplications).orderBy(desc(campaignApplications.createdAt));
  const events = await db.select().from(campaignEvents).orderBy(desc(campaignEvents.createdAt)).limit(50000);
  const mail = await db.select({ applicationId: campaignMail.applicationId, kind: campaignMail.kind, state: campaignMail.state, attempts: campaignMail.attempts, sentAt: campaignMail.sentAt }).from(campaignMail);
  const applications = apps.map(({ payload, tokenHash: _token, unsubscribeHash: _unsub, fingerprint: _fp, idempotencyKey: _key, signature: _sig, agreementSnapshot: _agreement, ...app }) => ({ ...payload, ...app, mail: mail.filter(m => m.applicationId === app.id) }));
  res.json({
    applications, config: await getConfig(), events,
    analytics: {
      visitors: new Set(events.filter(e => e.name === "landing_view").map(e => e.sessionId)).size,
      starts: new Set(events.filter(e => e.name === "application_started").map(e => e.sessionId)).size,
      applications: apps.length, qualified: apps.filter(a => a.status === "qualified").length,
      approved: apps.filter(a => !!a.tokenHash).length,
      payingCustomers: apps.filter(a => a.paymentStatus === "active").length,
      monthlyRecurringRevenue: apps.filter(a => a.paymentStatus === "active").reduce((sum, a) => sum + (a.agreedPrice ?? 0), 0),
      advertisingCosts: null, note: "Visitor/start counts include only consenting visitors. Payment figures require Stripe verification. Costs are unavailable.",
    },
  });
});
router.patch("/admin", requireSameOrigin, async (req, res): Promise<void> => {
  const parsed = UpdateCampaignAdminBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid action." }); return; }
  const { action, id, values = {} } = parsed.data;
  if (action === "settings") {
    const saved: Record<string, unknown> = {};
    for (const key of ["headline", "intro", "deadline"]) {
      if (typeof values[key] === "string" && values[key].length <= 2000) saved[key] = values[key];
    }
    if (saved.deadline && !/^\d{4}-\d{2}-\d{2}$/.test(String(saved.deadline))) { res.status(400).json({ error: "Use a valid YYYY-MM-DD deadline." }); return; }
    if (typeof values.followupsEnabled === "boolean") saved.followupsEnabled = values.followupsEnabled;
    if (Array.isArray(values.faqs)) {
      if (values.faqs.length > 30 || !values.faqs.every((f: any) => typeof f.question === "string" && typeof f.answer === "string" && f.question.length < 300 && f.answer.length < 3000)) { res.status(400).json({ error: "Check your FAQ entries." }); return; }
      saved.faqs = values.faqs;
    }
    if (Array.isArray(values.projects)) {
      if (values.projects.length > 12 || !values.projects.every((p: any) => ["title", "image", "url", "label"].every(key => typeof p[key] === "string" && p[key].length < 600)
        && /^\/images\/[a-zA-Z0-9/_.-]+$/.test(p.image) && (/^\/(?!\/)/.test(p.url) || /^https:\/\//.test(p.url)))) {
        res.status(400).json({ error: "Projects need a title, local image, valid link, and truthful label." }); return;
      }
      saved.projects = values.projects;
    }
    const current = await getConfig();
    await db.insert(campaignSettings).values({ key: "public", value: { ...current, ...saved } })
      .onConflictDoUpdate({ target: campaignSettings.key, set: { value: { ...current, ...saved } } });
    res.json({ ok: true }); return;
  }
  if (!id) { res.status(400).json({ error: "Choose an application." }); return; }
  const [app] = await db.select().from(campaignApplications).where(eq(campaignApplications.id, id));
  if (!app) { res.status(404).json({ error: "Application not found." }); return; }
  const actor = String(res.locals.adminId);
  if (action === "refresh_payment") {
    await reconcileCampaignPayment(app); res.json({ ok: true }); return;
  }
  if (action === "followup") {
    // Scheduling is consent-, time- and status-gated; never sends arbitrary blasts.
    void processCampaignMail(); res.json({ ok: true, message: "Eligible, due follow-ups will be processed." }); return;
  }
  if (action === "update") {
    const changes: Partial<typeof campaignApplications.$inferInsert> = {};
    if (values.status !== undefined) {
      if (!STATUSES.includes(String(values.status))) { res.status(400).json({ error: "Invalid lead status." }); return; }
      if (["website_in_progress", "website_launched"].includes(String(values.status)) && !app.agreementAcceptedAt) {
        res.status(409).json({ error: "The customer must accept the written agreement before work begins." }); return;
      }
      if (values.status === "website_launched" && app.status !== "website_in_progress" && app.status !== "website_launched") {
        res.status(409).json({ error: "Complete the build first. Mark the site launched only after the customer approves it and it is published." }); return;
      }
      if (values.status === "active_monthly_client" && !["active", "trialing"].includes(app.paymentStatus)) {
        res.status(409).json({ error: "A verified active subscription is required before marking this customer active." }); return;
      }
      changes.status = String(values.status);
      if (["declined", "closed_lost", "active_monthly_client"].includes(String(values.status))) changes.followupStopped = true;
    }
    if (typeof values.notes === "string") changes.notes = values.notes.slice(0, 20000);
    if (app.agreementAcceptedAt && (values.scope !== undefined || values.plan !== undefined)) { res.status(409).json({ error: "An accepted agreement is locked. Arrange any change separately." }); return; }
    if (app.tokenHash && (values.scope !== undefined || values.plan !== undefined)) { res.status(409).json({ error: "This proposal has already been sent. Do not change the applicant's agreement." }); return; }
    if (typeof values.scope === "string") changes.scope = values.scope.slice(0, 12000);
    if (values.plan !== undefined) {
      if (!PLANS.some(p => p.id === values.plan)) { res.status(400).json({ error: "Choose Essential, Growth, or Full Service." }); return; }
      changes.plan = String(values.plan);
    }
    if (typeof values.followupStopped === "boolean") changes.followupStopped = values.followupStopped;
    if (values.responded === true) changes.followupStopped = true;
    const entry = historyEntry(`Updated ${Object.keys(changes).join(", ")}${values.responded ? "; customer responded" : ""}`, actor);
    await db.update(campaignApplications).set({ ...changes, history: sql`history || ${JSON.stringify([entry])}::jsonb` }).where(eq(campaignApplications.id, id));
    if (values.status === "qualified") await recordMilestone(db, app, "qualified_lead");
    if (values.status === "website_launched") await recordMilestone(db, app, "website_launched");
    res.json({ ok: true }); return;
  }
  if (action === "approve") {
    const plan = PLANS.find(p => p.id === app.plan);
    if (!plan || !app.scope.trim()) { res.status(400).json({ error: "Set a plan and a written website scope before approval." }); return; }
    if (app.agreementAcceptedAt) { res.status(409).json({ error: "Agreement already accepted." }); return; }
    const rawToken = token();
    const origin = process.env.NODE_ENV === "production" ? CAMPAIGN_ORIGIN : `${req.protocol}://${req.get("x-forwarded-host") ?? req.get("host")}`;
    const onboardingUrl = `${origin}/free-website/onboarding/${rawToken}/`;
    const snapshot = `Gulf Coast Digital Designs — Free Website Promotion\n\nBusiness: ${app.payload.businessName}\nPlan: ${plan.name} — $${plan.price}/month\n\nWebsite scope, included pages, revisions, monthly content update limits, and handoff arrangements:\n${app.scope}\n\nPlan inclusions:\n${plan.features.map(f => `- ${f}`).join("\n")}\n\n${OWNERSHIP_TERMS}\n\nThe founding monthly rate is retained while your eligible plan remains continuously active. Any changes to the agreed scope must be discussed and approved before work begins. This promotion has separate ownership terms and does not alter standard website project packages. Search rankings and AI recommendations are not guaranteed.`;
    await db.transaction(async tx => {
      await recordMilestone(tx, app, "approved_application");
      await tx.update(campaignApplications).set({
        tokenHash: digest(rawToken), tokenExpiresAt: new Date(Date.now() + 30 * 86400000),
        agreedPrice: plan.price, agreementSnapshot: snapshot, status: "awaiting_agreement",
        followupStopped: true, history: sql`history || ${JSON.stringify([historyEntry("Approved; agreement invitation queued", actor)])}::jsonb`,
      }).where(eq(campaignApplications.id, app.id));
      await queueMail(tx, {
        applicationId: app.id, dedupeKey: `${app.id}:approval:${digest(rawToken).slice(0, 12)}`,
        kind: "agreement", recipient: String(app.payload.email),
        subject: "Your GulfCDD website proposal is ready",
        body: `Hi ${app.payload.fullName},\n\nWe've reviewed your application. Please review your scope, monthly plan, and six-month ownership condition here:\n${onboardingUrl}\n\nThis private link expires in 30 days. No payment is taken until you accept your agreement and choose to pay through Stripe.\n\n${snapshot}\n\nQuestions? Reply to this email.\nGulf Coast Digital Designs\n(228) 278-7782`,
      });
    });
    res.json({ ok: true, onboardingUrl }); return;
  }
  res.status(400).json({ error: "Unsupported action." });
});
return router;
}
export default createCampaignAdminRouter();
