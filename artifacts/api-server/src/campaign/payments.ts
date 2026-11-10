import { db, campaignApplications, type CampaignApplication } from "@workspace/db";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";
import { getUncachableStripeClient } from "../stripeClient";
import { historyEntry } from "./storage";
import { countPaidPeriods } from "./billingPeriods";
import { recordMilestone } from "./milestones";

export async function reconcileCampaignPayment(app: CampaignApplication) {
  if (!app.checkoutId && !app.subscriptionId) return app;
  const stripe = await getUncachableStripeClient();
  let subscriptionId = app.subscriptionId;
  if (!subscriptionId && app.checkoutId) {
    const session = await stripe.checkout.sessions.retrieve(app.checkoutId);
    if (session.metadata?.campaign_application_id !== String(app.id)) throw new Error("Payment record mismatch.");
    if (session.payment_status !== "paid") return app;
    subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id ?? null;
  }
  if (!subscriptionId) return app;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  if (subscription.metadata.campaign_application_id !== String(app.id)) throw new Error("Subscription record mismatch.");
  // Count authoritative paid renewal periods, never a client-controlled counter.
  const invoices = await stripe.invoices.list({ subscription: subscriptionId, status: "paid", limit: 100 });
  const periods = invoices.data.filter(inv => ["subscription_create", "subscription_cycle"].includes(inv.billing_reason ?? "")
    && inv.amount_paid >= (app.agreedPrice ?? 0) * 100)
    .map(inv => {
      const recurring = inv.lines.data.find(line => line.period.end - line.period.start >= 27 * 86400);
      return { start: recurring?.period.start ?? inv.period_start, end: recurring?.period.end ?? inv.period_end };
    })
    .sort((a, b) => a.start - b.start);
  const cancelledAt = subscription.canceled_at ?? Math.floor(Date.now() / 1000);
  const paid = countPaidPeriods(periods, Math.min(Math.floor(Date.now() / 1000), cancelledAt));
  const paidMonths = paid.paidMonths;
  const paymentStatus = subscription.status;
  const ownershipEligible = app.ownershipEligible || paid.ownershipEligible;
  const firstPayment = app.paymentStatus === "not_started" && invoices.data.length > 0;
  const status = firstPayment ? "active_monthly_client" : app.status;
  const [updated] = await db.update(campaignApplications).set({
    subscriptionId, paymentStatus, paidMonths, ownershipEligible, status,
    history: [...app.history, historyEntry(`Stripe verified: ${paymentStatus}; ${paidMonths} paid monthly periods${ownershipEligible ? "; ownership condition met" : ""}`)],
  }).where(eq(campaignApplications.id, app.id)).returning();
  if (invoices.data.length > 0) {
    await recordMilestone(db, app, "payment_completed");
    await recordMilestone(db, app, "new_monthly_subscription");
  }
  return updated;
}

// Called only AFTER the existing StripeSync handler verifies the signature.
export async function handleCampaignStripeEvent(event: Stripe.Event) {
  if (!["checkout.session.completed", "invoice.paid", "invoice.payment_failed", "customer.subscription.updated", "customer.subscription.deleted"].includes(event.type)) return;
  const apps = await db.select().from(campaignApplications);
  const object = event.data.object as unknown as Record<string, unknown>;
  const objectText = JSON.stringify(object);
  for (const app of apps) {
    if ((app.checkoutId && objectText.includes(app.checkoutId)) || (app.subscriptionId && objectText.includes(app.subscriptionId))
      || (object.metadata && (object.metadata as Record<string, string>).campaign_application_id === String(app.id))) {
      await reconcileCampaignPayment(app);
    }
  }
}
