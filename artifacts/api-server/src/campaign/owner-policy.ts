// This public business address is an explicit owner allowlist, not a role claim.
export const CAMPAIGN_OWNER_EMAIL = "aultman@gulfcoastdigitaldesign.com";

type OwnerIdentity = {
  emailAddresses: readonly { emailAddress: string; verification: { status: string } | null }[];
  externalAccounts: readonly { provider: string; emailAddress: string; verification: { status: string | null } | null }[];
};
export function isCampaignOwner(user: OwnerIdentity): boolean {
  return user.emailAddresses.some(e => e.emailAddress.toLowerCase() === CAMPAIGN_OWNER_EMAIL && e.verification?.status === "verified") &&
    user.externalAccounts.some(e => ["google", "oauth_google"].includes(e.provider) &&
      e.emailAddress.toLowerCase() === CAMPAIGN_OWNER_EMAIL && e.verification?.status === "verified");
}

type SessionIdentity = { id: string; userId: string; clientId: string; status: string; actor: unknown };
type ClientIdentity = { id: string; sessionIds: readonly string[]; lastActiveSessionId: string | null; lastAuthenticationStrategy: string | null };
export function isGoogleOwnerSession(session: SessionIdentity, client: ClientIdentity, userId: string, sessionId: string): boolean {
  // A linked Google account alone is insufficient: check Clerk's authoritative
  // authentication strategy and bind it to this authenticated, active session.
  return session.id === sessionId && session.userId === userId && session.status === "active" &&
    !session.actor && client.id === session.clientId && client.sessionIds.includes(sessionId) &&
    client.lastActiveSessionId === sessionId && client.lastAuthenticationStrategy === "oauth_google";
}
