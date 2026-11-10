import { Router } from "express";
import { db, campaignApplications } from "@workspace/db";
import { eq, and, gt, sql } from "drizzle-orm";
import { AcceptCampaignOnboardingBody } from "@workspace/api-zod";
import { digest, rateLimit, requireSameOrigin } from "../../campaign/security";
import { OWNERSHIP_TERMS, CAMPAIGN_ORIGIN } from "../../campaign/defaults";
import { historyEntry } from "../../campaign/storage";
import { getUncachableStripeClient } from "../../stripeClient";
import { reconcileCampaignPayment } from "../../campaign/payments";
import { recordMilestone } from "../../campaign/milestones";

const router = Router();
router.use("/onboarding", rateLimit(40, 60000), (_req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  next();
});
async function findApplication(rawToken: string) {
  if (!/^[a-f0-9]{64}$/.test(rawToken)) return null;
  const [app] = await db.select().from(campaignApplications)
    .where(and(eq(campaignApplications.tokenHash, digest(rawToken)), gt(campaignApplications.tokenExpiresAt, new Date())));
  return app ?? null;
}
router.get("/onboarding/:token", async (req, res): Promise<void> => {
  const app = await findApplication(String(req.params.token));
  if (!app) { res.status(404).json({ error: "This proposal link is invalid or has expired. Contact GulfCDD for help." }); return; }
  res.json({
    businessName: app.payload.businessName, plan: app.plan, price: app.agreedPrice,
    scope: app.scope, agreement: app.agreementSnapshot, ownershipTerms: OWNERSHIP_TERMS,
    agreementAcceptedAt: app.agreementAcceptedAt, paymentStatus: app.paymentStatus,
    paidMonths: app.paidMonths, ownershipEligible: app.ownershipEligible, status: app.status,
    checkoutAvailable: app.status === "website_launched",
  });
});
router.post("/onboarding/:token", requireSameOrigin, async (req, res): Promise<void> => {
  const app = await findApplication(String(req.params.token));
  if (!app) { res.status(404).json({ error: "This proposal link is invalid or has expired." }); return; }
  const parsed = AcceptCampaignOnboardingBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Check your response." }); return; }
  const input = parsed.data;
  if (input.action === "accept") {
    if (input.accepted !== true || !input.signature?.trim() || !app.agreementSnapshot) { res.status(400).json({ error: "Read the agreement, enter your name, and confirm acceptance." }); return; }
    if (app.agreementAcceptedAt) { res.json({ ok: true }); return; }
    await db.update(campaignApplications).set({
      agreementAcceptedAt: new Date(), signature: input.signature.trim(), status: "website_in_progress",
      history: sql`history || ${JSON.stringify([historyEntry("Applicant accepted the saved agreement and ownership terms")])}::jsonb`,
    }).where(and(eq(campaignApplications.id, app.id), sql`agreement_accepted_at IS NULL`));
    await recordMilestone(db, app, "agreement_accepted");
    res.json({ ok: true }); return;
  }
  if (!app.agreementAcceptedAt) { res.status(409).json({ error: "Accept the agreement before paying." }); return; }
  if (input.action === "verify_payment") {
    if (!input.sessionId || input.sessionId !== app.checkoutId) { res.status(400).json({ error: "Payment session mismatch." }); return; }
    const updated = await reconcileCampaignPayment(app);
    res.json({ ok: true, paymentStatus: updated.paymentStatus }); return;
  }
  if (app.subscriptionId) {
    res.status(409).json({ error: "A subscription already exists. Contact us for billing help." }); return;
  }
  if (app.status !== "website_launched") {
    res.status(409).json({ error: "Payment is available only after you approve the completed website and it has been published." }); return;
  }
  const stripe = await getUncachableStripeClient();
  if (app.checkoutId) {
    const existing = await stripe.checkout.sessions.retrieve(app.checkoutId);
    if (existing.status === "open" && existing.url) { res.json({ url: existing.url }); return; }
    if (existing.payment_status === "paid") { await reconcileCampaignPayment(app); res.status(409).json({ error: "This payment has already been completed." }); return; }
  }
  const origin = process.env.NODE_ENV === "production" ? CAMPAIGN_ORIGIN : `${req.protocol}://${req.get("x-forwarded-host") ?? req.get("host")}`;
  const path = `/free-website/onboarding/${String(req.params.token)}/`;
  // price_data is server-owned; the browser can never pick an amount.
  const session = await stripe.checkout.sessions.create({
    mode: "subscription", customer_email: String(app.payload.email),
    line_items: [{ price_data: {
      currency: "usd", unit_amount: (app.agreedPrice ?? 0) * 100,
      recurring: { interval: "month" },
      product_data: { name: `GulfCDD Free Website — ${app.plan}`, description: "Monthly service plan after website approval and publication. Custom website ownership after six consecutive paid subscription months." },
    }, quantity: 1 }],
    metadata: { campaign_application_id: String(app.id) },
    subscription_data: { metadata: { campaign_application_id: String(app.id), campaign: "free-website" } },
    success_url: `${origin}${path}?paid=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}${path}?payment_cancelled=1`,
  }, { idempotencyKey: `campaign-checkout-${app.id}-${app.checkoutId ?? "first"}` });
  await db.update(campaignApplications).set({ checkoutId: session.id }).where(eq(campaignApplications.id, app.id));
  res.json({ url: session.url });
});
export default router;
