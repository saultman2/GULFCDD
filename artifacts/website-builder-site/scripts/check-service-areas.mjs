import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const site = fileURLToPath(new URL("../", import.meta.url));
const dist = `${site}dist/public/`;
const sitemap = readFileSync(`${dist}sitemap.xml`, "utf8");
const citySlugs = [
  "ocean-springs", "biloxi", "gulfport", "pascagoula", "gautier",
  "diberville", "long-beach", "bay-st-louis", "new-orleans", "mobile",
];
const legacyStates = [
  "mississippi", "texas", "louisiana", "alabama", "florida", "georgia",
  "tennessee", "oklahoma", "kansas", "missouri", "kentucky", "virginia",
  "north-carolina", "south-carolina",
];
const sitemapHas = (slug) =>
  sitemap.includes(`<loc>https://www.gulfcdd.com/service-areas/${slug}/</loc>`);

for (const slug of [...citySlugs, "remote"]) {
  const route = `/service-areas/${slug}/`;
  const file = `${dist}service-areas/${slug}/index.html`;
  assert.ok(existsSync(file), `${route}: prerendered page missing`);
  const html = readFileSync(file, "utf8");
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${route}: expected one H1`);
  assert.ok(html.includes(`href="https://www.gulfcdd.com${route}"`), `${route}: trailing-slash canonical missing`);
  assert.match(html, /<title>[^<]+<\/title>/, `${route}: title missing`);
  assert.doesNotMatch(html, /<meta name="robots" content="noindex/i, `${route}: public page unexpectedly noindex`);
  assert.ok(sitemapHas(slug), `${route}: missing from generated sitemap`);
}

const hub = readFileSync(`${dist}service-areas/index.html`, "utf8");
assert.equal([...hub.matchAll(/<h1\b/g)].length, 1, "Service area hub: expected one H1");
for (const slug of citySlugs) {
  assert.ok(hub.includes(`href="/service-areas/${slug}/"`), `${slug}: missing from service-area directory`);
}
assert.ok(hub.includes('href="/service-areas/remote/"'), "Nationwide remote page missing from directory");
assert.ok(sitemap.includes("<loc>https://www.gulfcdd.com/service-areas/</loc>"), "Service-area hub missing from sitemap");

const home = readFileSync(`${dist}index.html`, "utf8");
assert.ok(home.includes("Remote projects nationwide"), "Homepage does not state nationwide remote service");
const flatten = (value) => !value || typeof value !== "object" ? [] : [value, ...Object.values(value).flatMap(flatten)];
const homeSchemas = [...home.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
  .map((match) => JSON.parse(match[1]))
  .flatMap(flatten);
const organization = homeSchemas.find((schema) => schema["@id"] === "https://www.gulfcdd.com/#organization");
assert.ok(organization, "Canonical business schema is missing");
assert.deepEqual(organization["@type"], ["ProfessionalService", "LocalBusiness"]);
assert.ok(organization.areaServed.some((area) => area["@type"] === "Country" && area.name === "United States"),
  "Company schema must describe nationwide remote service");
assert.deepEqual(organization.address, {
  "@type": "PostalAddress",
  addressLocality: "Biloxi",
  addressRegion: "MS",
  addressCountry: "US",
}, "Business location must stay Biloxi-only, with no invented street or ZIP");
for (const slug of legacyStates) {
  assert.ok(!sitemapHas(slug), `${slug}: legacy state URL must be absent from sitemap`);
  assert.ok(!existsSync(`${dist}service-areas/${slug}/index.html`), `${slug}: legacy state page must not be prerendered`);
}

const remote = readFileSync(`${dist}service-areas/remote/index.html`, "utf8");
const serviceSchemas = [...remote.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
  .map((match) => JSON.parse(match[1]))
  .flatMap((schema) => Array.isArray(schema) ? schema : [schema]);
assert.ok(
  serviceSchemas.some((schema) =>
    schema["@type"] === "Service" &&
    schema.areaServed?.["@type"] === "Country" &&
    schema.areaServed?.name === "United States"),
  "Remote service schema must identify nationwide coverage",
);

console.log("✓ Eight Gulf Coast city pages remain, New Orleans and Mobile are added, remote nationwide coverage is live, and legacy state pages are removed from the sitemap.");
