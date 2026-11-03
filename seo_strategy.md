# SEO Strategy — GulfCDD (Gulf Coast Digital Designs)

## Business context
Veteran-owned web design and digital marketing agency serving small businesses on the Mississippi Gulf Coast, headquartered in Biloxi, MS. Primary service areas: Ocean Springs, Biloxi, Gulfport, Pascagoula.

## Site architecture
React SPA (Wouter router) pre-rendered to static HTML using Playwright (`scripts/prerender.mjs`). All public routes have prerendered `index.html` files in `dist/public/`. Crawlers receive full HTML. Authenticated routes (`/account`, `/sign-in`, `/sign-up`) are SPA-only and blocked in `robots.txt`.

## In scope
- All public marketing pages: home, services (design/development/hosting/maintenance), what-we-build, about, contact, FAQ, pricing, membership, intake
- Service area landing pages: Ocean Springs, Biloxi, Gulfport, Pascagoula
- Privacy and Terms pages

## Out of scope
- Authenticated dashboard pages (`/account/**`)
- Sign-in / sign-up flows
- Checkout success page (has `noindex`)

## Target audience
Small businesses on the Mississippi Gulf Coast seeking affordable, professional web design and digital marketing.

## Primary keywords
- web design [city] MS (Ocean Springs, Biloxi, Gulfport, Pascagoula)
- small business website Mississippi Gulf Coast
- veteran owned web design Mississippi
- local SEO Gulf Coast

## Dismissed categories
- (None yet)
