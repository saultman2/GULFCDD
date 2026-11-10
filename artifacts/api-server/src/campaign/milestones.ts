import { db, campaignEvents, type CampaignApplication } from "@workspace/db";
import { attributionOnly } from "./security";

export async function recordMilestone(tx: Pick<typeof db, "insert">, app: Pick<CampaignApplication, "id" | "payload">, name: string) {
  // CRM operational events carry no names, emails, phone numbers or URLs.
  await tx.insert(campaignEvents).values({
    eventKey: `application:${app.id}:${name}`, name, sessionId: `application:${app.id}`,
    attribution: attributionOnly(app.payload.attribution as Record<string, string> | undefined),
  }).onConflictDoNothing();
}
