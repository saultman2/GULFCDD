import assert from "node:assert/strict";
import { CAMPAIGN_OWNER_EMAIL, isCampaignOwner, isGoogleOwnerSession } from "../src/campaign/owner-policy";
const verified = { status: "verified" };
const owner = {
  emailAddresses: [{ emailAddress: CAMPAIGN_OWNER_EMAIL, verification: verified }],
  externalAccounts: [{ provider: "google", emailAddress: CAMPAIGN_OWNER_EMAIL, verification: verified }],
};
assert.equal(isCampaignOwner(owner), true);
assert.equal(isCampaignOwner({ ...owner, externalAccounts: [] }), false);
assert.equal(isCampaignOwner({ ...owner, externalAccounts: [{ ...owner.externalAccounts[0], emailAddress: "someone@example.com" }] }), false);
assert.equal(isCampaignOwner({ ...owner, emailAddresses: [{ ...owner.emailAddresses[0], verification: null }] }), false);
assert.equal(isCampaignOwner({ ...owner, externalAccounts: [{ ...owner.externalAccounts[0], verification: null }] }), false);
assert.equal(isCampaignOwner({ ...owner, externalAccounts: [{ ...owner.externalAccounts[0], provider: "github" }] }), false);
assert.equal(isCampaignOwner({ emailAddresses: [{ emailAddress: "other@example.com", verification: verified }], externalAccounts: [{ provider: "google", emailAddress: "other@example.com", verification: verified }] }), false);
assert.equal(isCampaignOwner({ ...owner, emailAddresses: [{ ...owner.emailAddresses[0], emailAddress: CAMPAIGN_OWNER_EMAIL.toUpperCase() }] }), true);
const session = { id: "session-owner", userId: "user-owner", clientId: "client-owner", status: "active", actor: null };
const client = { id: "client-owner", sessionIds: [session.id], lastActiveSessionId: session.id, lastAuthenticationStrategy: "oauth_google" };
const check = (s = session, c = client) => isGoogleOwnerSession(s, c, session.userId, session.id);
assert.equal(check(), true);
for (const strategy of ["password", "email_code", "oauth_github", null]) {
  assert.equal(isGoogleOwnerSession(session, { ...client, lastAuthenticationStrategy: strategy }, session.userId, session.id), false);
}
assert.equal(check({ ...session, status: "revoked" }), false);
assert.equal(check({ ...session, userId: "another" }), false);
assert.equal(check(session, { ...client, id: "another" }), false);
assert.equal(check(session, { ...client, sessionIds: [] }), false);
assert.equal(check(session, { ...client, lastActiveSessionId: "another" }), false);
assert.equal(isGoogleOwnerSession({ ...session, actor: { sub: "impersonator" } }, client, session.userId, session.id), false);
console.log("Owner-only Google authorization checks passed.");
