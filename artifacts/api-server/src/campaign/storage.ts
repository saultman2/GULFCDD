import { pool, db, campaignSettings } from "@workspace/db";
import { eq } from "drizzle-orm";
import { DEFAULT_CONFIG, normalizeCampaignFaqs } from "./defaults";

let migration: Promise<void> | undefined;
export function ensureCampaignTables(): Promise<void> {
  return migration ??= migrate().catch(err => { migration = undefined; throw err; });
}
// Additive, idempotent migration. Never changes existing application tables.
async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS campaign_applications (
      id serial PRIMARY KEY, idempotency_key text NOT NULL UNIQUE, fingerprint text NOT NULL,
      payload jsonb NOT NULL, status text NOT NULL DEFAULT 'new_application',
      notes text NOT NULL DEFAULT '', scope text NOT NULL DEFAULT '', plan text NOT NULL,
      agreed_price integer, agreement_snapshot text, agreement_accepted_at timestamptz, signature text,
      token_hash text, token_expires_at timestamptz, unsubscribe_hash text NOT NULL,
      followup_stopped boolean NOT NULL DEFAULT false, history jsonb NOT NULL DEFAULT '[]',
      subscription_id text, checkout_id text, payment_status text NOT NULL DEFAULT 'not_started',
      paid_months integer NOT NULL DEFAULT 0, ownership_eligible boolean NOT NULL DEFAULT false,
      created_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS campaign_fingerprint_idx ON campaign_applications(fingerprint);
    CREATE TABLE IF NOT EXISTS campaign_settings (key text PRIMARY KEY, value jsonb NOT NULL);
    CREATE TABLE IF NOT EXISTS campaign_events (
      id serial PRIMARY KEY, event_key text NOT NULL UNIQUE, name text NOT NULL, session_id text NOT NULL,
      step integer, attribution jsonb NOT NULL DEFAULT '{}', created_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS campaign_mail (
      id serial PRIMARY KEY, application_id integer NOT NULL REFERENCES campaign_applications(id),
      dedupe_key text NOT NULL UNIQUE, kind text NOT NULL, recipient text NOT NULL, subject text NOT NULL,
      body text NOT NULL, state text NOT NULL DEFAULT 'pending', attempts integer NOT NULL DEFAULT 0,
      available_at timestamptz NOT NULL DEFAULT now(), locked_at timestamptz, sent_at timestamptz, last_error text
    );
    CREATE INDEX IF NOT EXISTS campaign_mail_due_idx ON campaign_mail(state, available_at);
  `);
}

export async function getConfig() {
  const [saved] = await db.select().from(campaignSettings).where(eq(campaignSettings.key, "public"));
  const config = { ...DEFAULT_CONFIG, ...saved?.value, plans: DEFAULT_CONFIG.plans, ownershipTerms: DEFAULT_CONFIG.ownershipTerms };
  return { ...config, faqs: normalizeCampaignFaqs(config.faqs) };
}
export function historyEntry(text: string, actor = "system") {
  return { at: new Date().toISOString(), text, actor };
}
