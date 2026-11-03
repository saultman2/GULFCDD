# GulfCDD free-website campaign

## Scope and commercial terms

This addition preserves the existing website, normal packages, Soro blog, service areas, and checkout. It has not been published.

Approved promotional monthly plans:

- Essential: $150.
- Growth: $250.
- Full Service: $500.

Approved applicants have no upfront design fee. The customer signs the scope before work begins. No payment is collected until the customer approves the completed website and it has been published; the monthly service plan starts then. The signed scope defines pages, revisions, monthly update limits, included services, and handoff arrangements. No unlimited work or ranking results are promised.

**Ownership:** the custom website transfers after six consecutive paid subscription months have elapsed. Cancellation before then forfeits ownership of that custom website, not the customer's own domain or supplied content. The campaign does not impose an invented six-month cancellation charge or change ordinary cancel-anytime care packages. Third-party licenses remain separate.

The application deadline is January 31, 2027. The API stops accepting applications after that deadline. Existing homepage offers remain separate.

## Routes

- `/free-website/`: campaign landing page, plan selection, three-step application.
- `/free-website/thank-you/`: public confirmation, noindex, excluded from sitemap.
- `/free-website/onboarding/:token/`: private proposal, typed acceptance, Stripe-hosted payment. Thirty-day token expiry; noindex, no-store, no-referrer at the public server/API.
- `/admin/free-website/`: owner-only Google sign-in, with server-enforced identity and authentication-method checks.
- `/api/campaign/*`: validated campaign API, consented events, administration and onboarding.
- `/api/campaign/unsubscribe/:token`: confirmation screen and POST unsubscribe. GET never changes preferences.

The public landing page is prerendered, canonicalized with a trailing slash, and included in the sitemap. Private proposals and administrative routes are not in the sitemap.

## Owner access

Open `/admin/free-website/`, choose **Continue with Google**, and use `aultman@gulfcoastdigitaldesign.com`. First-time Google sign-in can establish the account; no separate administrator role-grant script is needed.

The API requires that exact verified email and a verified Google external account for that same email. It also reads the authoritative Clerk session/client: the session must be active, non-impersonated, the client's current active session, and authenticated using `oauth_google`. A metadata `admin` role alone, another Google account, an unverified email, or a password/email-code strategy cannot authorize the campaign API.

The dashboard provides no password/email-code login form. Other customer account login methods are unchanged. Google must be enabled in the workspace Auth pane for the target environment. Development and production identities/provider settings are separate. This work does not publish or change production authentication settings.

## Application and onboarding

Applications collect business information, website status, goals, plan interest, contact preference, and privacy acknowledgment. Email marketing and SMS consents are separate, optional, and unchecked. Applying never creates a charge or subscription.

Drafts remain in session storage in that browser tab; successful submission clears them. Avoid entering sensitive information on a shared device.

The server validates fields, requires the security answer, rejects the honeypot, rate-limits by IP, and deduplicates idempotency keys and recent email/business combinations. A database transaction stores the application and its two notification jobs together.

An administrator saves a specific plan and written scope, then approves the application. Approval snapshots the agreement and sends a private invitation. Plan and scope are locked after sending to prevent changing a proposal underneath an applicant.

The applicant accepts the written scope before the build starts. Stripe-hosted checkout is available only after the customer approves the completed website and it has been published. The price comes from the server's approved agreement, never the browser. No card information is stored. Work-in-progress and launched states require an accepted agreement; an active-customer state requires Stripe-verified payment.

Payment returns are verified with Stripe. The existing signed webhook handler also reconciles campaign payment events. A forged success URL cannot create paid status. Duplicate paid invoices cannot inflate the six-month condition. A cancellation timestamp before the ownership condition prevents a later transfer.

## Data

Four additive PostgreSQL tables:

- `campaign_applications`: submitted details, scope, agreement snapshot, status, audit history, consent and payment references.
- `campaign_events`: unique, non-PII campaign events and operational conversion milestones.
- `campaign_settings`: editable campaign content.
- `campaign_mail`: durable, deduplicated notification and follow-up queue.

The idempotent startup migration creates only these tables/indexes; it does not replace or migrate the existing database or alter existing tables.

## Email and follow-ups

Existing SMTP secrets and infrastructure are reused. Applicant confirmations and owner notifications are queued immediately and processed by the background worker, normally within one minute. Failures remain visible for retry; no lead is lost just because email is unavailable. Pending/sent/failed delivery states appear in the admin lead detail.

Optional follow-ups are **off by default**. When enabled, they require explicit email-marketing consent and are scheduled for days 2 and 5. Dedupe keys and stable message IDs reduce duplicate sends. Enabling automation after day 5 does not send both follow-ups together.

Follow-ups stop for unsubscribed applicants, responses marked by an administrator, accepted proposals, declined/lost leads, and active clients. Every follow-up has an unsubscribe link.

**Incoming reply detection is not connected.** SMTP sends email but does not report replies to the application. The owner must use “customer responded” when a reply arrives; an inbound-email integration is needed for automatic reply detection. Confirm applicable email-marketing obligations and sender-address requirements before enabling marketing automation. The site has no verified street address, so none is invented.

The in-process worker runs while the API process is running; pending jobs survive a restart but are not sent while it is stopped. Rate limiting is per API process, not a distributed anti-abuse service.

## Content and analytics

The dashboard can edit headline, introduction, deadline, FAQs, project labels/links/local image paths, and follow-up enablement. Commercial prices and ownership terms are deliberately not routine dashboard edits; accepted agreements retain their original snapshots.

Campaign examples use the owner-selected screenshots of knppower.com and kennedygutters.com with neutral website-example captions. Their business names need not be repeated in surrounding copy. These real-site examples do not need the fictional-example disclaimer; no endorsement, performance result, or client relationship is claimed. Original fictional capability samples elsewhere keep their disclosures.

Prerender snapshots come from the same approved default configuration as the API. Dashboard edits update the runtime page immediately; a fresh build is needed to regenerate static HTML for those edits.

Campaign visitor/start/step tracking requires explicit opt-in. The first consented UTM/source values remain attached to that browser session. No names, emails, phone numbers, full URLs, or click IDs go to standard analytics events.

The dashboard includes date/source/campaign/plan filters, lead statuses, operational conversion milestones, paying clients, verified active-plan MRR, and applicant-to-customer rate. Visitor counts cover only opted-in sessions, so an all-applicants/consented-visitors conversion rate is deliberately not presented as comparable. Unknown advertising costs remain unavailable.

The existing GA4 loader is consent-gated for campaign routes. Existing `gtag`, GTM `dataLayer`, and Meta `fbq` event bridges are supported; no new Meta Pixel or GTM container was configured or claimed to be connected. Private onboarding/admin routes skip standard page-view events.

## Verification

- Workspace libraries, API and web typechecks.
- Production build, 44 prerendered routes, sitemap checks/regression fixtures, state-page checks.
- Existing performance and delivery checks.
- API integration checks for persistence, durable email queue, duplicates, validation, honeypot, consent, unauthorized admin requests, rate limiting, agreement/approval locking, invalid tokens and forged payment sessions.
- Six-month ownership unit checks, including duplicate periods and interrupted service.
- Real Stripe **test-mode** checkout creation at $250/month, then expiry; no payment taken.
- Browser application journey on desktop and 390px mobile: validation, back/forward/refresh draft recovery, actual successful submission, refreshable public confirmation, pre-consent analytics suppression, and signed-in non-admin denial.

The browser test generated two business-inbox messages: one applicant confirmation and one owner notification. The confirmation lacked an explicit test marker; it was a verification message, not a real customer. No duplicate application, charge, or subscription was created.

An owner-admin browser session and a completed paid Stripe subscription were not exercised. Do not describe those as end-to-end verified. The ordinary legacy E2E suite was not rerun as part of this campaign change.
