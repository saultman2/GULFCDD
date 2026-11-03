import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const site = path.join(root, "artifacts/website-builder-site");
const baseline = JSON.parse(fs.readFileSync(path.join(root, "docs/site-preservation-baseline.json"), "utf8"));
const routes = new Set(baseline.pages.map((p) => p.route));
const generatedSitemap = fs.readFileSync(path.join(site, "dist/public/sitemap.xml"), "utf8");
for (const [, rawUrl] of generatedSitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  routes.add(new URL(rawUrl).pathname);
}
for (const slug of [
  "ocean-springs", "biloxi", "gulfport", "pascagoula", "gautier", "diberville",
  "long-beach", "bay-st-louis", "new-orleans", "mobile", "remote",
]) routes.add(`/service-areas/${slug}/`);
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const types = (value) => !value || typeof value !== "object" ? [] : [
  ...(typeof value["@type"] === "string" ? [value["@type"]] : []),
  ...Object.values(value).flatMap(types),
];
let checkedLinks = 0;
for (const original of baseline.pages) {
  const file = path.join(site, "dist/public", original.route, "index.html");
  assert.ok(fs.existsSync(file), `Preserve direct access to ${original.route}`);
  const html = fs.readFileSync(file, "utf8");
  assert.equal(html.match(/<title>(.*?)<\/title>/s)?.[1], original.approvedTitle ?? original.title, `Title changed: ${original.route}`);
  if (original.description) assert.equal(html.match(/<meta name="description" content="([^"]*)"/)?.[1], original.approvedDescription ?? original.description, `Description changed: ${original.route}`);
  if (original.canonical) assert.equal(html.match(/<link rel="canonical" href="([^"]*)"/)?.[1], original.canonical, `Canonical changed: ${original.route}`);
  assert.equal([...html.matchAll(/<form\b/g)].length, original.formCount, `Form removed: ${original.route}`);
  const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map((m) => JSON.parse(m[1]));
  const sharedLocationTypes = new Set([
    "Organization", "ProfessionalService", "LocalBusiness", "State", "Country",
    "GeoCoordinates", "ImageObject", "PostalAddress",
  ]);
  const stableTypes = (values) => [...new Set(values)].filter((type) => !sharedLocationTypes.has(type)).sort();
  assert.deepEqual(stableTypes(schemas.flatMap(types)), stableTypes(original.schemaTypes),
    `Page-specific structured data types changed: ${original.route}`);
  for (const [, raw] of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    const href = raw.replaceAll("&amp;", "&");
    if (href.startsWith("tel:") || href.startsWith("sms:")) {
      assert.ok(href.replace(/\D/g, "").endsWith("2282787782"), `Incorrect phone link: ${href}`);
    }
    if (href.startsWith("mailto:")) assert.equal(href, "mailto:aultman@gulfcoastdigitaldesign.com");
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const url = new URL(href, "https://www.gulfcdd.com");
    const canonicalPath = url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
    if (!routes.has(canonicalPath)) {
      // Private account routes and real static assets are outside the public inventory.
      assert.ok(url.pathname.startsWith("/account") || fs.existsSync(path.join(site, "public", url.pathname)), `Unknown public link ${href} on ${original.route}`);
      continue;
    }
    assert.equal(url.pathname, canonicalPath, `Redirecting public link ${href} on ${original.route}`);
    if (url.hash) {
      const target = fs.readFileSync(path.join(site, "dist/public", canonicalPath, "index.html"), "utf8");
      assert.ok(target.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `Missing anchor ${href}`);
    }
    checkedLinks++;
  }
}

let protectedFiles = 0;
for (const original of baseline.files) {
  const file = path.join(root, original.path);
  assert.ok(fs.existsSync(file), `Original file was removed: ${original.path}`);
  if (/\/pages\/blog\/|\/data\/blog|\/scripts\/soro-content|\/public\/sitemap\.xml$/.test(original.path)) {
    assert.equal(hash(file), original.sha256, `Protected blog/sitemap source changed: ${original.path}`);
    protectedFiles++;
  }
}
const home = fs.readFileSync(path.join(site, "dist/public/index.html"), "utf8");
for (const city of ["bay-st-louis", "diberville", "gautier"]) {
  assert.ok(home.includes(`href="/service-areas/${city}/"`), `Missing city destination: ${city}`);
}
const work = fs.readFileSync(path.join(site, "dist/public/what-we-build/index.html"), "utf8");
assert.ok(!work.includes("knppower-screenshot.webp"), "Removed project preview returned to What We Build");
assert.ok(!home.includes("knppower-screenshot.webp"), "Removed project preview returned to the homepage");
assert.ok(home.includes('href="/pricing/"'));
assert.ok(home.includes('href="mailto:aultman@gulfcoastdigitaldesign.com"'));
console.log(`✓ Preserved ${baseline.pages.length} public/utility routes, titles, descriptions, canonicals, form counts and schema types; checked ${checkedLinks} final internal links; ${protectedFiles} blog/sitemap source files unchanged; project preview removed; email, pricing and city destinations present.`);
