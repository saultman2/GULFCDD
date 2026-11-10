import { pgTable, serial, text, timestamp, jsonb, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const campaignApplications = pgTable("campaign_applications", {
  id: serial("id").primaryKey(),
  idempotencyKey: text("idempotency_key").notNull().unique(),
  fingerprint: text("fingerprint").notNull(),
  payload: jsonb("payload").notNull().$type<Record<string, unknown>>(),
  status: text("status").notNull().default("new_application"),
  notes: text("notes").notNull().default(""),
  scope: text("scope").notNull().default(""),
  plan: text("plan").notNull(),
  agreedPrice: integer("agreed_price"),
  agreementSnapshot: text("agreement_snapshot"),
  agreementAcceptedAt: timestamp("agreement_accepted_at", { withTimezone: true }),
  signature: text("signature"),
  tokenHash: text("token_hash"),
  tokenExpiresAt: timestamp("token_expires_at", { withTimezone: true }),
  unsubscribeHash: text("unsubscribe_hash").notNull(),
  followupStopped: boolean("followup_stopped").notNull().default(false),
  history: jsonb("history").notNull().default([]).$type<{ at: string; text: string; actor: string }[]>(),
  subscriptionId: text("subscription_id"),
  checkoutId: text("checkout_id"),
  paymentStatus: text("payment_status").notNull().default("not_started"),
  paidMonths: integer("paid_months").notNull().default(0),
  ownershipEligible: boolean("ownership_eligible").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
export const insertCampaignApplicationSchema = createInsertSchema(campaignApplications);
export type CampaignApplication = typeof campaignApplications.$inferSelect;
export type InsertCampaignApplication = typeof campaignApplications.$inferInsert;

export const campaignEvents = pgTable("campaign_events", {
  id: serial("id").primaryKey(),
  eventKey: text("event_key").notNull().unique(),
  name: text("name").notNull(),
  sessionId: text("session_id").notNull(),
  step: integer("step"),
  attribution: jsonb("attribution").notNull().default({}).$type<Record<string, string>>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
export const insertCampaignEventSchema = createInsertSchema(campaignEvents);
export type CampaignEvent = typeof campaignEvents.$inferSelect;

export const campaignSettings = pgTable("campaign_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull().$type<Record<string, unknown>>(),
});
export const insertCampaignSettingsSchema = createInsertSchema(campaignSettings);

export const campaignMail = pgTable("campaign_mail", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").notNull().references(() => campaignApplications.id),
  dedupeKey: text("dedupe_key").notNull().unique(),
  kind: text("kind").notNull(),
  recipient: text("recipient").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  state: text("state").notNull().default("pending"),
  attempts: integer("attempts").notNull().default(0),
  availableAt: timestamp("available_at", { withTimezone: true }).notNull().defaultNow(),
  lockedAt: timestamp("locked_at", { withTimezone: true }),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  lastError: text("last_error"),
});
export const insertCampaignMailSchema = createInsertSchema(campaignMail);
