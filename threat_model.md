# Threat Model

## Project Overview

GulfCDD (Gulf Coast Digital Designs) is a small-business website-building service. The stack is Node.js 24 + Express 5 (API server), React/Vite (frontend), PostgreSQL + Drizzle ORM (database), Clerk for authentication, and Stripe for payments. The deployed site is public at `https://www.gulfcdd.com`. Visitors can request quotes, contact the business, and purchase website-building packages (one-time or subscription). Authenticated clients get a portal with messages, payment history, and project status.

## Assets

- **User sessions and Clerk tokens** — used to authenticate client portal access; compromise allows account takeover.
- **Stripe payment records** — checkout sessions and subscription data; unauthorized access exposes customer payment history.
- **Client messages** — stored in PostgreSQL, scoped per user; exposure is a PII concern.
- **SMTP credentials (SMTP_USER / SMTP_PASS)** — used to send email notifications; compromise enables spam/phishing.
- **Stripe secret key** — fetched from Replit connector; unauthorized access allows arbitrary charge creation.
- **Clerk secret key** — authorizes server-side Clerk API calls (user lookups); exposure allows reading all users.
- **DATABASE_URL** — Postgres connection string; exposure gives full database read/write access.

## Trust Boundaries

- **Browser ↔ API (`/api/*`)** — All requests cross this boundary. Authentication is via Clerk session tokens/cookies. The API must validate every authenticated request server-side.
- **API ↔ Stripe** — API uses a secret key fetched from Replit's connectors endpoint to create checkout sessions and verify webhooks.
- **API ↔ Clerk** — Clerk SDK validates sessions; a separate `createClerkClient` instance handles server-side user lookups.
- **API ↔ PostgreSQL** — ORM-mediated; all queries use Drizzle parameterized statements.
- **Public ↔ Authenticated routes** — `/api/account/*` requires Clerk authentication; `/api/contact`, `/api/intake`, `/api/widget`, and `/api/checkout` are public.

## Scan Anchors

- **API entry points**: `artifacts/api-server/src/routes/` — `account.ts`, `stripe.ts`, `contact.ts`, `intake.ts`, `widget.ts`
- **Auth middleware**: `artifacts/api-server/src/app.ts` (CORS, Clerk middleware) and `artifacts/api-server/src/middlewares/clerkProxyMiddleware.ts`
- **Highest-risk areas**: CORS config in `app.ts`; session/purchase ownership in `account.ts`; public form endpoints without rate limiting
- **Authenticated surface**: `/api/account/*` (messages, payments, purchases) — requires `requireAuth` middleware
- **Public surface**: `/api/contact`, `/api/intake`, `/api/widget`, `/api/checkout` — no auth, no rate limiting
- **Webhook**: `/api/stripe/webhook` — uses Stripe signature verification before JSON parsing (correctly ordered)
- **Mockup sandbox** (`artifacts/mockup-sandbox/`) — dev/design only, not production-reachable

## Threat Categories

### Spoofing

Clerk handles authentication. The `requireAuth` middleware in `account.ts` extracts the userId from Clerk session claims. The Stripe webhook is verified via `stripe-signature`. Risk: the Clerk proxy path (`/api/__clerk`) reflects the `x-forwarded-host` header without allowlist validation — a header-injection path to forge the `Clerk-Proxy-Url`, though practical impact is limited given Clerk's own token validation.

### Tampering

All pricing is defined server-side in `plans.ts`; the checkout endpoint only accepts a `planKey` that must match a known plan. The `register-purchase` flow reads amounts directly from the Stripe session object, not from the client. A gap exists: any authenticated user can register any paid Stripe session to their account, not just their own.

### Information Disclosure

The CORS configuration reflects any Origin header with `credentials: true`, which is the key production risk. Client portal data (messages, payments, purchases) is scoped to the authenticated user via `clerkUserId` in DB queries. Error responses use generic messages (no stack traces in 400/500 responses).

### Denial of Service

Public form endpoints (`/contact`, `/intake`, `/widget`) have no rate limiting. The honeypot anti-bot check is bypassable from scripts that omit the `_hp` field. SMTP errors on these paths are unhandled in `contact.ts` (no try/catch), which may cause 500s under load.

### Elevation of Privilege

No admin-only server routes exist in the current codebase. The `requireAuth` middleware blocks unauthenticated callers but does not enforce per-resource ownership beyond database-level `clerkUserId` scoping on reads. Writes (`/account/messages`) correctly bind to the authenticated user's ID. The purchase registration endpoint does not verify the Stripe session belongs to the authenticated user.
