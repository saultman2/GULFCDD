# Capability preview generator

Source for the 20 "See example" pictures at
`public/images/capability-previews/<id>.webp` (1200x788). These pictures are
used on the What We Build section and its popup dialog.

## Files

- `generate.mjs`: renders each screen with headless Chromium through the
  frontend's existing `@playwright/test` dependency, then saves a WebP using the
  Chrome DevTools protocol. Temporary HTML is written to `/tmp/capability-previews`.
- `screens.mjs`: shared building blocks (browser frame, sample badge, icons,
  font faces) and the 20 screen layouts. The keys must match the
  `CapabilityPreviewId` values in `src/data/capability-previews.ts`.
- `photos/`: AI-generated sample photographs used only in these illustrations.
  They do not show real clients, staff, or projects.
- `fonts/`: unmodified Google Fonts Latin woff2 subsets (Fraunces, DM Sans,
  Playfair Display, Space Grotesk, Archivo Black, Libre Baskerville), all under
  the SIL Open Font License 1.1. See `fonts/OFL.txt`. Poppins is loaded from
  `public/fonts`.

## Regenerate

From `artifacts/website-builder-site`:

```sh
node scripts/capability-previews/generate.mjs              # all 20
node scripts/capability-previews/generate.mjs feature-map  # selected ids
```

Chromium is taken from `CHROMIUM_PATH`, or the first `chromium-*` entry found
in `/nix/store`.

## Content rules

All businesses, people, reviews, figures, and addresses are fictional. Use
`.example` domains and 555 phone numbers. Every image carries a sample badge,
and every form, checkout, or payment button is marked as picture only. Never
present these screens as client work or as genuine endorsements.
