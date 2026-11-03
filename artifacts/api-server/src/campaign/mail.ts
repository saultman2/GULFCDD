import nodemailer from "nodemailer";
import { db, pool, campaignApplications, campaignMail } from "@workspace/db";
import { eq, and, lt } from "drizzle-orm";
import { getConfig, historyEntry } from "./storage";
import { CAMPAIGN_ORIGIN, TERMINAL_STATUSES } from "./defaults";
import { logger } from "../lib/logger";

export async function queueMail(tx: Pick<typeof db, "insert">, input: typeof campaignMail.$inferInsert) {
  await tx.insert(campaignMail).values(input).onConflictDoNothing();
}

export async function scheduleFollowups() {
  const config = await getConfig();
  if (!config.followupsEnabled) return;
  const applications = await db.select().from(campaignApplications)
    .where(and(eq(campaignApplications.followupStopped, false), lt(campaignApplications.createdAt, new Date(Date.now() - 2 * 86400000))));
  for (const app of applications) {
    if (app.payload.marketingConsent !== true || TERMINAL_STATUSES.includes(app.status) || app.agreementAcceptedAt) continue;
    for (const day of [2, 5]) {
      if (Date.now() - app.createdAt.getTime() < day * 86400000) continue;
      // Enabling automation later must not send day-2 and day-5 emails together.
      if (day === 2 && Date.now() - app.createdAt.getTime() >= 5 * 86400000) continue;
      const [confirmation] = await db.select({ body: campaignMail.body }).from(campaignMail).where(eq(campaignMail.dedupeKey, `${app.id}:confirmation`));
      const unsubscribeUrl = confirmation?.body.match(/https:\/\/www\.gulfcdd\.com\/api\/campaign\/unsubscribe\/[a-f0-9]{64}/)?.[0];
      await queueMail(db, {
        applicationId: app.id, dedupeKey: `${app.id}:followup:${day}`, kind: "followup",
        recipient: String(app.payload.email), subject: "Any questions about your GulfCDD website application?",
        body: `Hi ${app.payload.fullName},\n\nJust checking whether you'd like to talk through your free-website application. There is no purchase or subscription from applying. Reply with any questions, or reply STOP and we will turn off follow-ups.\n\n${unsubscribeUrl ? `Unsubscribe: ${unsubscribeUrl}\n\n` : ""}Gulf Coast Digital Designs\nBiloxi, MS\n(228) 278-7782\naultman@gulfcoastdigitaldesign.com\n${CAMPAIGN_ORIGIN}/contact/`,
      });
    }
  }
}

let processing = false;
export async function processCampaignMail() {
  if (processing) return;
  processing = true;
  try {
    await scheduleFollowups();
    // Recover a crashed worker's lease. Message-ID is stable on retries.
    await pool.query("UPDATE campaign_mail SET state='pending' WHERE state='sending' AND locked_at < now() - interval '10 minutes'");
    const smtpUser = process.env.SMTP_USER, smtpPass = process.env.SMTP_PASS;
    if (!smtpUser || !smtpPass) return; // Durable pending items remain visible in admin.
    const transport = nodemailer.createTransport({ host: "smtp.gmail.com", port: 587, secure: false, auth: { user: smtpUser, pass: smtpPass }, connectionTimeout: 15000, socketTimeout: 30000 });
    for (let index = 0; index < 10; index++) {
      const result = await pool.query(`UPDATE campaign_mail SET state='sending',locked_at=now(),attempts=attempts+1
        WHERE id=(SELECT id FROM campaign_mail WHERE state='pending' AND available_at<=now() ORDER BY id FOR UPDATE SKIP LOCKED LIMIT 1) RETURNING *`);
      const mail = result.rows[0];
      if (!mail) break;
      if (mail.kind === "followup") {
        const [app] = await db.select().from(campaignApplications).where(eq(campaignApplications.id, mail.application_id));
        const config = await getConfig();
        if (!config.followupsEnabled || !app || app.followupStopped || app.payload.marketingConsent !== true || TERMINAL_STATUSES.includes(app.status) || app.agreementAcceptedAt) {
          await pool.query("UPDATE campaign_mail SET state='cancelled' WHERE id=$1", [mail.id]); continue;
        }
      }
      try {
        await transport.sendMail({
          from: { name: "Gulf Coast Digital Designs", address: smtpUser },
          to: mail.recipient, replyTo: "aultman@gulfcoastdigitaldesign.com",
          subject: mail.subject, text: mail.body,
          messageId: `<gulfcdd-campaign-${mail.id}@gulfcoastdigitaldesign.com>`,
        });
        await db.transaction(async tx => {
          await tx.update(campaignMail).set({ state: "sent", sentAt: new Date(), lastError: null }).where(eq(campaignMail.id, mail.id));
          // Atomic append avoids overwriting a simultaneous admin action.
          await tx.execute((await import("drizzle-orm")).sql`UPDATE campaign_applications SET history=history || ${JSON.stringify([historyEntry(`${mail.kind} email sent`)])}::jsonb WHERE id=${mail.application_id}`);
        });
      } catch {
        await pool.query("UPDATE campaign_mail SET state=$2,available_at=now()+interval '15 minutes',last_error='Email delivery failed; inspect mail configuration' WHERE id=$1", [mail.id, mail.attempts >= 5 ? "failed" : "pending"]);
        logger.warn({ mailId: mail.id }, "Campaign email delivery failed; retained for retry");
      }
    }
  } catch (err) { logger.error({ err }, "Campaign mail worker failed"); }
  finally { processing = false; }
}
