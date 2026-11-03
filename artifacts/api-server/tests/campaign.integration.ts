import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import app from "../src/app";
import { ensureCampaignTables } from "../src/campaign/storage";
import { countPaidPeriods } from "../src/campaign/billingPeriods";
import { pool } from "@workspace/db";
import express from "express";
import { createCampaignAdminRouter } from "../src/routes/campaign/admin";
import onboardingRouter from "../src/routes/campaign/onboarding";
import { getUncachableStripeClient } from "../src/stripeClient";

// Imports app, NOT index: no background mail worker or Stripe startup runs.
// Application mail is queued transactionally and deleted with this test's data.
await ensureCampaignTables();
const key = randomUUID();
const eventKey = randomUUID();
const server = app.listen(0, "127.0.0.1");
await new Promise<void>(resolve => server.once("listening", resolve));
const address = server.address() as { port: number };
const origin = `http://127.0.0.1:${address.port}`;
const data = {
  businessName: `Campaign automated verification ${key}`, businessType: "Test only",
  cityState: "Biloxi, MS", websiteStatus: "first", goals: ["Get more phone calls"],
  plan: "essential", fullName: "Automated verification", email: "campaign-test@example.invalid",
  phone: "2285550100", contactMethod: "email", privacyConsent: true,
  marketingConsent: false, smsConsent: false, mathAnswer: "2", company_website: "",
  idempotencyKey: key, attribution: { utm_source: "automated-check", utm_campaign: "verification" },
};
// Business-logic fixture uses an injected guard only on this loopback test
// server. The real app above must still reject unauthenticated admin requests.
const fixture = express();
fixture.use(express.json());
fixture.use("/api/campaign", createCampaignAdminRouter((_req, res, next) => { res.locals.adminId = "integration-test"; next(); }), onboardingRouter);
const fixtureServer = fixture.listen(0, "127.0.0.1");
await new Promise<void>(resolve => fixtureServer.once("listening", resolve));
const fixtureOrigin = `http://127.0.0.1:${(fixtureServer.address() as { port: number }).port}`;
let testCheckoutId: string | undefined;
async function fixturePost(path: string, body: unknown, method = "POST") {
  return fetch(`${fixtureOrigin}/api/campaign${path}`, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
}
async function post(path: string, body: unknown) {
  return fetch(`${origin}/api/campaign${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
}
try {
  const config = await fetch(`${origin}/api/campaign/config`).then(r => r.json()) as any;
  assert.deepEqual(config.plans.map((p: any) => p.price), [150, 250, 500]);
  assert.match(config.ownershipTerms, /six consecutive paid/);
  assert.equal((await post("/applications", data)).status, 201);
  assert.equal((await post("/applications", data)).status, 201);
  const records = await pool.query("SELECT id FROM campaign_applications WHERE idempotency_key=$1", [key]);
  assert.equal(records.rowCount, 1, "Idempotency must not create duplicate leads");
  const mail = await pool.query("SELECT state FROM campaign_mail WHERE application_id=$1", [records.rows[0].id]);
  assert.equal(mail.rowCount, 2);
  assert.ok(mail.rows.every(m => m.state === "pending"), "No real email should be sent by this test");
  assert.equal((await post("/applications", { ...data, company_website: "spam" })).status, 400);
  assert.equal((await post("/applications", { ...data, privacyConsent: false })).status, 400);
  assert.equal((await post("/applications", { ...data, websiteStatus: "redesign", websiteUrl: "javascript:alert(1)" })).status, 400);
  assert.equal((await post("/applications", { ...data, mathAnswer: "3" })).status, 400);
  assert.equal((await fetch(`${origin}/api/campaign/admin`)).status, 401);
  const appId = records.rows[0].id;
  assert.equal((await fixturePost("/admin", { action: "approve", id: appId }, "PATCH")).status, 400, "Approval needs a scope");
  assert.equal((await fixturePost("/admin", { action: "update", id: appId, values: { plan: "growth", scope: "Five-page test scope, two review rounds, two small content updates per month. Handoff discussed separately." } }, "PATCH")).status, 200);
  const approved = await fixturePost("/admin", { action: "approve", id: appId }, "PATCH");
  assert.equal(approved.status, 200);
  const approvedData = await approved.json() as any;
  const proposalPath = new URL(approvedData.onboardingUrl).pathname.replace("/free-website", "").replace(/\/$/, "");
  const proposal = await fetch(`${fixtureOrigin}/api/campaign${proposalPath}`).then(r => r.json()) as any;
  assert.equal(proposal.price, 250);
  assert.match(proposal.agreement, /six consecutive paid subscription months/);
  assert.match(proposal.agreement, /only after you approve the completed website and it has been published/i);
  assert.doesNotMatch(proposal.agreement, /third.party costs/i);
  assert.match(proposal.agreement, /Five-page test scope/);
  assert.equal(proposal.checkoutAvailable, false);
  assert.equal((await fixturePost(proposalPath, { action: "checkout" })).status, 409);
  assert.equal((await fixturePost(proposalPath, { action: "accept", accepted: false, signature: "Test" })).status, 400);
  assert.equal((await fixturePost(proposalPath, { action: "accept", accepted: true, signature: "Automated verification" })).status, 200);
  assert.equal((await fixturePost("/admin", { action: "update", id: appId, values: { scope: "Changed after acceptance" } }, "PATCH")).status, 409);
  assert.equal((await fixturePost("/admin", { action: "update", id: appId, values: { status: "website_in_progress" } }, "PATCH")).status, 200);
  assert.equal((await fixturePost(proposalPath, { action: "checkout" })).status, 409, "Payment must stay locked while the site is being built");
  assert.equal((await fixturePost("/admin", { action: "update", id: appId, values: { status: "website_launched" } }, "PATCH")).status, 200);
  const publishedProposal = await fetch(`${fixtureOrigin}/api/campaign${proposalPath}`).then(r => r.json()) as any;
  assert.equal(publishedProposal.checkoutAvailable, true);
  assert.equal((await fixturePost(proposalPath, { action: "verify_payment", sessionId: "cs_forged" })).status, 400);
  try {
    const stripe = await getUncachableStripeClient();
    const balance = await stripe.balance.retrieve();
    if (!balance.livemode) {
      const checkoutResponse = await fixturePost(proposalPath, { action: "checkout" });
      assert.equal(checkoutResponse.status, 200);
      const checkoutData = await checkoutResponse.json() as any;
      assert.match(checkoutData.url, /^https:\/\/checkout\.stripe\.com\//);
      const checkoutRecord = await pool.query("SELECT checkout_id FROM campaign_applications WHERE id=$1", [appId]);
      testCheckoutId = checkoutRecord.rows[0].checkout_id;
      const session = await stripe.checkout.sessions.retrieve(testCheckoutId!);
      assert.equal(session.livemode, false);
      assert.equal(session.mode, "subscription");
      assert.equal(session.amount_total, 25000);
      assert.equal(session.payment_status, "unpaid");
      process.stdout.write("Stripe TEST-mode hosted checkout verified at $250/month; no payment taken. Session expired after test.\n");
      await stripe.checkout.sessions.expire(testCheckoutId!);
      testCheckoutId = undefined;
    } else {
      process.stdout.write("Stripe live-mode connection detected: no checkout or charge created. Test-mode payment verification remains required.\n");
    }
  } catch (err) {
    if (err instanceof assert.AssertionError) throw err;
    process.stdout.write("Stripe checkout check unavailable; no payment completion claimed.\n");
  }
  assert.equal((await post("/onboarding/not-a-token", { action: "checkout" })).status, 404);
  assert.equal((await post("/events", { name: "landing_view", sessionId: key, eventKey, consent: false })).status, 400);
  assert.equal((await post("/events", { name: "landing_view", sessionId: key, eventKey, consent: true, attribution: { utm_source: "safe-source", utm_content: "person@example.com" } })).status, 200);
  assert.equal((await post("/events", { name: "landing_view", sessionId: key, eventKey, consent: true })).status, 200);
  const events = await pool.query("SELECT attribution FROM campaign_events WHERE event_key=$1", [eventKey]);
  assert.equal(events.rowCount, 1);
  assert.deepEqual(events.rows[0].attribution, { utm_source: "safe-source" });
  const periods = Array.from({ length: 6 }, (_, i) => ({ start: i * 30 * 86400, end: (i + 1) * 30 * 86400 }));
  assert.deepEqual(countPaidPeriods(periods, 181 * 86400), { paidMonths: 6, ownershipEligible: true });
  assert.equal(countPaidPeriods(periods, 170 * 86400).ownershipEligible, false, "Six payments before six months elapse do not transfer ownership");
  assert.equal(countPaidPeriods([...periods.slice(0, 3), { start: 121 * 86400, end: 151 * 86400 }], 181 * 86400).ownershipEligible, false);
  assert.equal(countPaidPeriods([...periods, periods[0]], 181 * 86400).paidMonths, 6, "Duplicate invoices cannot count twice");
  for (let i = 0; i < 3; i++) await post("/applications", { ...data, mathAnswer: "wrong" });
  assert.equal((await post("/applications", data)).status, 429);
  process.stdout.write("Campaign integration checks passed: storage, durable mail queue, duplicate prevention, validation, consent, authorization, token rejection, rate limit, and six-month ownership.\n");
} finally {
  await pool.query("DELETE FROM campaign_mail WHERE application_id IN (SELECT id FROM campaign_applications WHERE idempotency_key=$1)", [key]);
  await pool.query("DELETE FROM campaign_events WHERE session_id IN (SELECT 'application:' || id FROM campaign_applications WHERE idempotency_key=$1)", [key]);
  await pool.query("DELETE FROM campaign_applications WHERE idempotency_key=$1", [key]);
  await pool.query("DELETE FROM campaign_events WHERE event_key=$1", [eventKey]);
  server.close();
  fixtureServer.close();
  if (testCheckoutId) { try { await (await getUncachableStripeClient()).checkout.sessions.expire(testCheckoutId); } catch { /* Never charge a test checkout. */ } }
  await pool.end();
}
