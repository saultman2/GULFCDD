import { Router } from "express";
import { db, campaignApplications, campaignEvents } from "@workspace/db";
import { eq, and, gt, sql } from "drizzle-orm";
import { SubmitCampaignApplicationBody, RecordCampaignEventBody } from "@workspace/api-zod";
import { getConfig, historyEntry } from "../../campaign/storage";
import { digest, token, rateLimit, attributionOnly, requireSameOrigin } from "../../campaign/security";
import { CAMPAIGN_ORIGIN } from "../../campaign/defaults";
import { queueMail } from "../../campaign/mail";
import { recordMilestone } from "../../campaign/milestones";

const router = Router();
router.get("/config", async (_req, res) => { res.json(await getConfig()); });
router.post("/applications", requireSameOrigin, rateLimit(8, 15 * 60000), async (req, res): Promise<void> => {
  const parsed = SubmitCampaignApplicationBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Please check your answers.", fields: parsed.error.flatten().fieldErrors }); return; }
  const input = parsed.data;
  if (input.company_website || input.mathAnswer?.trim() !== "2" || input.privacyConsent !== true) {
    res.status(400).json({ error: "Check the privacy acknowledgment and security answer." }); return;
  }
  if (![input.businessName, input.businessType, input.cityState, input.fullName].every(v => v.trim().length > 0)
    || !/^[+()\d .-]{7,40}$/.test(input.phone)) {
    res.status(400).json({ error: "Enter your business, name, location, and a valid phone number." }); return;
  }
  if (input.websiteStatus === "redesign") {
    try { const url = new URL(input.websiteUrl ?? ""); if (!["https:", "http:"].includes(url.protocol)) throw new Error(); }
    catch { res.status(400).json({ error: "Enter the full address of your existing website." }); return; }
  }
  const config = await getConfig();
  if (new Date(`${config.deadline}T23:59:59-06:00`).getTime() < Date.now()) { res.status(410).json({ error: "This promotion has ended. Please contact us to discuss current options." }); return; }
  const plansShown = config.plans.map(plan => ({ id: plan.id, name: plan.name, monthlyPrice: plan.price }));
  const selectedPlan = plansShown.find(plan => plan.id === input.plan) ?? null;
  const offerSnapshot = {
    source: "Free Website Ad Landing Page",
    page: "/free-website/",
    designFeeUpfront: 0,
    plansShown,
    selectedPlan,
    priceContext: "Campaign price shown at application time; plan selection is not a signed agreement or agreed project price.",
  };
  const fingerprint = digest(`${input.email.trim().toLowerCase()}|${input.businessName.trim().toLowerCase()}`);
  const [existing] = await db.select({ id: campaignApplications.id }).from(campaignApplications)
    .where(and(eq(campaignApplications.fingerprint, fingerprint), gt(campaignApplications.createdAt, new Date(Date.now() - 7 * 86400000)))).limit(1);
  if (existing) { res.status(201).json({ ok: true, receipt: "Application received. We'll be in touch." }); return; }
  const unsubscribe = token();
  const { company_website: _trap, mathAnswer: _math, idempotencyKey, attribution, ...details } = input;
  const payload = {
    ...details,
    email: input.email.trim().toLowerCase(),
    attribution: attributionOnly(attribution),
    leadSource: offerSnapshot.source,
    offerSnapshot,
  };
  const shownPrices = plansShown.map(plan => `${plan.name} $${plan.monthlyPrice}/month`).join(" · ");
  const selectedPlanLabel = selectedPlan ? `${selectedPlan.name} — $${selectedPlan.monthlyPrice}/month` : "Not sure yet";
  await db.transaction(async tx => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${fingerprint}))`);
    const [duplicate] = await tx.select({ id: campaignApplications.id }).from(campaignApplications)
      .where(and(eq(campaignApplications.fingerprint, fingerprint), gt(campaignApplications.createdAt, new Date(Date.now() - 7 * 86400000)))).limit(1);
    if (duplicate) return;
    const [app] = await tx.insert(campaignApplications).values({
      idempotencyKey, fingerprint, payload, plan: input.plan, unsubscribeHash: digest(unsubscribe),
      history: [historyEntry("Application submitted; no payment or subscription created")],
    }).onConflictDoNothing().returning();
    if (!app) return;
    await recordMilestone(tx, app, "application_submitted");
    await queueMail(tx, {
      applicationId: app.id, dedupeKey: `${app.id}:confirmation`, kind: "confirmation",
      recipient: payload.email, subject: "We Received Your Free Website Application",
       body: `Hey ${input.fullName},\n\nThanks for applying through our Free Website Ad Landing Page.\n\nWe recorded your plan interest as: ${selectedPlanLabel}.\nThe campaign offer shown was a $0 upfront design fee for approved applicants, with monthly plans listed as: ${shownPrices}.\n\nYour application has not charged you or started a subscription. The plan you selected is not a signed agreement; we will confirm the scope and price in a written proposal before work begins. The first monthly payment is due only after you approve the completed website and it has been published.\n\nIf you have any questions in the meantime, feel free to reply to this email.\n\nGulf Coast Digital Designs\n${CAMPAIGN_ORIGIN}\nBiloxi, MS\n(228) 278-7782\n\nStop optional follow-ups: ${CAMPAIGN_ORIGIN}/api/campaign/unsubscribe/${unsubscribe}`,
    });
    await queueMail(tx, {
      applicationId: app.id, dedupeKey: `${app.id}:owner`, kind: "owner",
       recipient: "aultman@gulfcoastdigitaldesign.com", subject: `Free website ad lead: ${input.businessName.replace(/[\r\n]/g, " ")}`,
       body: `New application #${app.id}\nLead source: ${offerSnapshot.source} (${offerSnapshot.page})\nOffer shown: $0 upfront design fee; monthly plans: ${shownPrices}\nPlan interest at application: ${selectedPlanLabel}\nPricing note: ${offerSnapshot.priceContext}\n\nName: ${input.fullName}\nBusiness: ${input.businessName}\nType: ${input.businessType}\nLocation: ${input.cityState}\nEmail: ${payload.email}\nPhone: ${input.phone}\nContact preference: ${input.contactMethod}\nWebsite: ${input.websiteUrl ?? input.websiteStatus}\nGoals: ${input.goals.join(", ")}\nAd attribution: ${JSON.stringify(payload.attribution)}\n\nPrivate dashboard: ${CAMPAIGN_ORIGIN}/admin/free-website/?lead=${app.id}`,
    });
  });
  res.status(201).json({ ok: true, receipt: "Application received. We'll be in touch." });
});
router.post("/events", requireSameOrigin, rateLimit(120, 60000), async (req, res): Promise<void> => {
  const parsed = RecordCampaignEventBody.safeParse(req.body);
  if (!parsed.success || parsed.data.consent !== true) { res.status(400).json({ error: "Analytics consent is required." }); return; }
  const { name, sessionId, eventKey, step, attribution } = parsed.data;
  await db.insert(campaignEvents).values({ name, sessionId, eventKey, step, attribution: attributionOnly(attribution) }).onConflictDoNothing();
  res.json({ ok: true });
});
const unsubscribePage = (action: string, done = false) => `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex,nofollow"><title>GulfCDD email preferences</title><body><main style="max-width:40rem;margin:10vh auto;padding:2rem;font:18px system-ui"><h1>${done ? "Follow-ups stopped" : "Stop optional follow-up emails"}</h1><p>${done ? "You won't receive further automated marketing follow-ups for this application. Replies about your requested service may still be sent." : "Confirm below to stop automated marketing follow-ups for your website application."}</p>${done ? '<a href="/contact/">Contact GulfCDD</a>' : `<form action="${action}" method="post"><button>Unsubscribe from follow-ups</button></form>`}</main></body></html>`;
router.get("/unsubscribe/:token", (_req, res) => { res.setHeader("Referrer-Policy", "no-referrer"); res.type("html").send(unsubscribePage(`/api/campaign/unsubscribe/${String(_req.params.token).replace(/[^a-f0-9]/g, "")}`)); });
router.post("/unsubscribe/:token", rateLimit(20, 60000), async (req, res) => {
  const hash = digest(String(req.params.token));
  await db.update(campaignApplications).set({ followupStopped: true }).where(eq(campaignApplications.unsubscribeHash, hash));
  res.type("html").send(unsubscribePage("", true));
});
export default router;
