import assert from "node:assert/strict";
import { createServer, get } from "node:http";
import { readFile } from "node:fs/promises";
import { canonicalHostname, enrichSitemap, requestHandler, sitemapWithArticles, wwwRedirectTarget } from "./serve.mjs";

assert.equal(canonicalHostname("gulfcdd.com:443"), "gulfcdd.com");
assert.equal(canonicalHostname("WWW.GULFCDD.COM:443"), "www.gulfcdd.com");
assert.equal(wwwRedirectTarget("gulfcdd.com:443", "/", ""), "https://www.gulfcdd.com/");
assert.equal(wwwRedirectTarget("gulfcdd.com", "/pricing/", "?plan=growth"), "https://www.gulfcdd.com/pricing/?plan=growth");
assert.equal(wwwRedirectTarget("www.gulfcdd.com:443", "/", ""), null);

const staticXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset>\n<url><loc>https://www.gulfcdd.com/</loc></url>\n</urlset>\n`;
assert.equal(sitemapWithArticles(staticXml, []), staticXml);
const merged = sitemapWithArticles(staticXml, [{ slug: "example-post", isoDate: "2026-11-01T12:00:00Z" }]);
assert.match(merged, /<loc>https:\/\/www\.gulfcdd\.com\/blog\/\?post=example-post<\/loc><lastmod>2026-11-01<\/lastmod>/);
assert.ok(merged.includes("https://www.gulfcdd.com/</loc>"));
assert.equal(await enrichSitemap(staticXml, async () => { throw new Error("feed down"); }), staticXml);

const home = await readFile(new URL("../dist/public/index.html", import.meta.url), "utf8");
const business = [...home.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
  .map((match) => JSON.parse(match[1]))
  .find((schema) => schema["@id"] === "https://www.gulfcdd.com/#organization");
assert.ok(business, "homepage organization schema");
assert.equal(business.telephone, "+1-228-278-7782");
assert.equal(business.url, "https://www.gulfcdd.com/");
assert.equal(business.address.addressLocality, "Biloxi");
assert.equal(business.address.streetAddress, undefined);
assert.equal(business.geo, undefined);
assert.equal(business.openingHoursSpecification, undefined);
assert.equal(business.aggregateRating, undefined);

const robots = await readFile(new URL("../public/robots.txt", import.meta.url), "utf8");
assert.match(robots, /User-agent: Google-Extended\nAllow: \//);
assert.doesNotMatch(robots, /^User-agent: Googlebot-Extended/m);
assert.match(robots, /Sitemap: https:\/\/www\.gulfcdd\.com\/sitemap\.xml/);

function rawRequest(port, path, headers = {}) {
  return new Promise((resolve, reject) => {
    get({ hostname: "127.0.0.1", port, path, headers }, (res) => {
      const parts = [];
      res.on("data", (data) => parts.push(data));
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(parts).toString() }));
      res.on("error", reject);
    }).on("error", reject);
  });
}

const server = createServer(requestHandler);
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
try {
  const redirect = await rawRequest(port, "/services/seo/", { Host: "gulfcdd.com:443" });
  assert.equal(redirect.status, 301);
  assert.equal(redirect.headers.location, "https://www.gulfcdd.com/services/seo/");
  const www = await rawRequest(port, "/services/seo/", { Host: "www.gulfcdd.com:443" });
  assert.notEqual(www.status, 301);
} finally {
  await new Promise((resolve) => server.close(resolve));
}

console.log("✓ apex host with :443 redirects to https://www.gulfcdd.com; sitemap stays 200; robots uses Google-Extended");
