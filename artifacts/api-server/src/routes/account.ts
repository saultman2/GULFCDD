import { Router } from "express";
import { getAuth, createClerkClient } from "@clerk/express";
import { getUncachableStripeClient } from "../stripeClient";
import { db, messagesTable, purchasesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import nodemailer from "nodemailer";
import { PLANS } from "../plans";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY ?? "" });

const accountRouter = Router();

function requireAuth(req: any, res: any, next: any) {
  const auth = getAuth(req);
  const userId = auth?.sessionClaims?.userId as string | undefined ?? auth?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  req.userId = userId;
  next();
}

accountRouter.get("/account/me", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  const user = await clerk.users.getUser(userId);
  const email = user.emailAddresses[0]?.emailAddress ?? "";
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || email;

  const stripe = await getUncachableStripeClient();
  const customers = await stripe.customers.search({ query: `email:"${email}"` });

  let subscription = null;
  if (customers.data.length > 0) {
    const subs = await stripe.subscriptions.list({
      customer: customers.data[0].id,
      status: "active",
      limit: 1,
    });
    if (subs.data.length > 0) {
      const sub = subs.data[0];
      const item = sub.items.data[0];
      subscription = {
        status: sub.status,
        planKey: (sub.metadata?.plan_key as string | undefined) ?? "",
        currentPeriodEnd: sub.billing_schedules?.[0]?.bill_until.computed_timestamp
          ? new Date(sub.billing_schedules[0].bill_until.computed_timestamp * 1000).toISOString()
          : null,
        amount: item?.price?.unit_amount ?? 0,
        interval: item?.price?.recurring?.interval ?? "month",
      };
    }
  }

  res.json({ ok: true, user: { id: userId, email, name }, subscription });
});

accountRouter.get("/account/payments", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  const user = await clerk.users.getUser(userId);
  const email = user.emailAddresses[0]?.emailAddress ?? "";

  const stripe = await getUncachableStripeClient();
  const customers = await stripe.customers.search({ query: `email:"${email}"` });

  if (customers.data.length === 0) {
    res.json({ ok: true, invoices: [] });
    return;
  }

  const invoices = await stripe.invoices.list({
    customer: customers.data[0].id,
    limit: 24,
  });

  const result = invoices.data.map((inv) => ({
    id: inv.id,
    number: inv.number,
    date: new Date(inv.created * 1000).toISOString(),
    description: inv.lines.data[0]?.description ?? "Payment",
    amount: inv.amount_paid,
    currency: inv.currency,
    status: inv.status,
    hostedUrl: inv.hosted_invoice_url,
    pdf: inv.invoice_pdf,
  }));

  res.json({ ok: true, invoices: result });
});

accountRouter.get("/account/messages", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  const messages = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.clerkUserId, userId))
    .orderBy(desc(messagesTable.createdAt));
  res.json({ ok: true, messages });
});

accountRouter.post("/account/messages", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  const { content } = req.body as { content?: string };

  if (!content?.trim()) {
    res.status(400).json({ error: "Message content is required" });
    return;
  }

  const user = await clerk.users.getUser(userId);
  const userEmail = user.emailAddresses[0]?.emailAddress ?? "";
  const userName = [user.firstName, user.lastName].filter(Boolean).join(" ") || userEmail;

  const [message] = await db
    .insert(messagesTable)
    .values({
      clerkUserId: userId,
      userEmail,
      userName,
      content: content.trim(),
      fromAdmin: false,
    })
    .returning();

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (smtpUser && smtpPass) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user: smtpUser, pass: smtpPass },
    });
    transporter
      .sendMail({
        from: smtpUser,
        to: smtpUser,
        replyTo: userEmail,
        subject: `Client message from ${userName}`,
        text: `From: ${userName} (${userEmail})\n\n${content.trim()}`,
      })
      .catch((err: unknown) => req.log.warn({ err }, "Message notification email failed"));
  }

  req.log.info({ userId, userName }, "Client message recorded");
  res.json({ ok: true, message });
});

accountRouter.post("/account/register-purchase", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  const { sessionId } = req.body as { sessionId?: string };

  if (!sessionId) {
    res.status(400).json({ error: "sessionId is required" });
    return;
  }

  const stripe = await getUncachableStripeClient();

  let session: import("stripe").Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    res.status(404).json({ error: "Stripe session not found" });
    return;
  }

  if (session.payment_status !== "paid") {
    res.status(400).json({ error: "Payment not completed" });
    return;
  }

  const user = await clerk.users.getUser(userId);
  const userEmail = user.emailAddresses[0]?.emailAddress ?? "";
  const sessionEmail = session.customer_email ?? session.customer_details?.email ?? "";

  if (!sessionEmail || sessionEmail.trim().toLowerCase() !== userEmail.trim().toLowerCase()) {
    res.status(403).json({ error: "This purchase does not belong to your account" });
    return;
  }

  const successUrl = session.success_url ?? "";
  const planKeyMatch = successUrl.match(/[?&]plan=([^&]+)/);
  const planKey = planKeyMatch ? planKeyMatch[1] : "";
  const plan = PLANS[planKey];

  if (!plan) {
    res.status(400).json({ error: "Could not determine plan from session" });
    return;
  }

  const amountCents = session.amount_total ?? 0;

  const existing = await db
    .select()
    .from(purchasesTable)
    .where(eq(purchasesTable.stripeSessionId, sessionId))
    .limit(1);

  if (existing.length > 0) {
    res.json({ ok: true, purchase: existing[0], alreadyRegistered: true });
    return;
  }

  const [purchase] = await db
    .insert(purchasesTable)
    .values({
      clerkUserId: userId,
      userEmail,
      stripeSessionId: sessionId,
      planKey,
      planName: plan.name,
      amountCents,
    })
    .returning();

  req.log.info({ userId, planKey }, "Purchase registered to account");
  res.json({ ok: true, purchase, alreadyRegistered: false });
});

accountRouter.get("/account/purchases", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  const purchases = await db
    .select()
    .from(purchasesTable)
    .where(eq(purchasesTable.clerkUserId, userId))
    .orderBy(desc(purchasesTable.createdAt));
  res.json({ ok: true, purchases });
});

export default accountRouter;
