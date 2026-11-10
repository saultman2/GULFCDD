import assert from "node:assert/strict";
import { createServer, get } from "node:http";
import { readFile } from "node:fs/promises";
import { gunzipSync, brotliDecompressSync } from "node:zlib";
import { requestHandler, chooseEncoding } from "./serve.mjs";
import { getSoro } from "./soro-content.mjs";

function rawRequest(port, path, headers = {}) {
  return new Promise((resolve, reject) => {
    get({ hostname: "127.0.0.1", port, path, headers }, (res) => {
      const parts = [];
      res.on("data", (data) => parts.push(data));
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(parts) }));
      res.on("error", reject);
    }).on("error", reject);
  });
}
function decoded(response) {
  const encoding = response.headers["content-encoding"];
  return (encoding === "gzip" ? gunzipSync(response.body) :
    encoding === "br" ? brotliDecompressSync(response.body) : response.body).toString();
}

assert.equal(chooseEncoding("gzip;q=0, br;q=0"), null);
assert.equal(chooseEncoding("gzip;q=1, br;q=0.5"), "gzip");
assert.equal(chooseEncoding("br, gzip"), "br");
const server = createServer(requestHandler);
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
try {
  const port = server.address().port;
  const { articles, code } = await getSoro();
  assert.ok(articles.length > 0, "Published Soro articles are required for this live-provider check");
  assert.ok(code.length > 0);
  // Keep service destinations discoverable in the page content and main
  // navigation without requiring the removed sitewide footer directory.
  for (const encoding of ["gzip", "br"]) {
    const home = await rawRequest(port, "/", { "Accept-Encoding": encoding });
    assert.equal(home.status, 200);
    assert.equal(home.headers["content-encoding"], encoding);
    assert.equal(home.headers.vary, "Accept-Encoding");
    const html = decoded(home);
    assert.ok(html.includes('href="/services/"'));
    assert.ok(html.includes('href="/services/seo/"'));
    assert.ok(html.includes('href="/blog/"'));
    assert.ok(!html.includes('id="soro-reading-links"'));
    assert.match(html, /"@type"\s*:\s*\["ProfessionalService","LocalBusiness"\]/);
    const asset = html.match(/src="([^"]*\/assets\/[^"]+\.js)"/)?.[1];
    assert.ok(asset);
    const js = await rawRequest(port, asset, { "Accept-Encoding": encoding });
    assert.equal(js.headers["content-encoding"], encoding);
    assert.match(js.headers["cache-control"], /immutable/);
    const cssAsset = html.match(/href="([^"]*\/assets\/[^"]+\.css)"/)?.[1];
    const css = await rawRequest(port, cssAsset, { "Accept-Encoding": encoding });
    assert.equal(css.headers["content-encoding"], encoding);
  }
  const identity = await rawRequest(port, "/", { "Accept-Encoding": "br;q=0,gzip;q=0" });
  assert.equal(identity.headers["content-encoding"], undefined);
  const redirect = await rawRequest(port, "/blog/?post=test", { Host: "gulfcdd.com" });
  assert.equal(redirect.status, 301);
  assert.equal(redirect.headers.location, "https://www.gulfcdd.com/blog/?post=test");
  const slash = await rawRequest(port, "/services/seo?source=test");
  assert.equal(slash.headers.location, "/services/seo/?source=test");
  const article = articles.find((a) => a.slug === "business-process-automation-saves-time") ?? articles[0];
  const post = await rawRequest(port, `/blog/?post=${article.slug}`, { "Accept-Encoding": "gzip" });
  assert.equal(post.status, 200);
  const html = decoded(post);
  assert.ok(html.includes("<article>"));
  assert.ok(html.includes(article.title.replace(/&/g, "&amp;")));
  assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1);
  assert.ok(html.includes(`https://www.gulfcdd.com/blog/?post=${article.slug}`));
  assert.ok(html.includes('"@type":"BlogPosting"'));
  const embed = await rawRequest(port, "/soro/embed.js", { "Accept-Encoding": "br" });
  assert.equal(embed.status, 200);
  assert.equal(embed.headers["content-encoding"], "br");
  assert.ok(decoded(embed).length < 50000);
  assert.equal((await rawRequest(port, "/blog/?post=not-published")).status, 404);
  assert.equal((await rawRequest(port, "/assets/missing.js")).status, 404);
  const sitemap = decoded(await rawRequest(port, "/sitemap.xml"));
  for (const article of articles) assert.ok(sitemap.includes(`/blog/?post=${article.slug}`));
  const blogIndex = await rawRequest(port, "/blog/");
  assert.equal(blogIndex.status, 200);
  for (const article of articles) {
    assert.ok(decoded(blogIndex).includes(`href="/blog/?post=${article.slug}"`), `Missing blog index link to ${article.slug}`);
  }
  const routes = [...sitemap.matchAll(/<loc>https:\/\/www\.gulfcdd\.com([^<]+)<\/loc>/g)]
    .map((match) => match[1]).filter((path) => !path.includes("?"));
  for (const route of routes) {
    const page = decoded(await rawRequest(port, route));
    assert.ok(!page.includes('id="soro-reading-links"'), `Removed footer article list reappeared on ${route}`);
    assert.ok(!page.includes('aria-label="Website and marketing guides"'), `Removed guides section reappeared on ${route}`);
    const schemas = [...page.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
    const businesses = schemas.filter((schema) => schema["@id"] === "https://www.gulfcdd.com/#organization");
    assert.equal(businesses.length, 1);
    assert.deepEqual(businesses[0]["@type"], ["ProfessionalService", "LocalBusiness"]);
    assert.equal(businesses[0].telephone, "+1-228-278-7782");
    assert.deepEqual(businesses[0].address, {
      "@type": "PostalAddress",
      addressLocality: "Biloxi",
      addressRegion: "MS",
      addressCountry: "US",
    });
  }
  const snapshot = await readFile(new URL("../dist/public/index.html", import.meta.url), "utf8");
  assert.ok(!snapshot.includes('data-testid="dialog-home-promotion"'));
  console.log(`✓ gzip/Brotli HTML, JS, CSS and embed; canonical redirects; ${articles.length} live Soro articles linked from the blog index and included in sitemap; footer guide list absent on ${routes.length} public pages; valid JSON-LD and shared company identity; readable article HTML; correct 404s`);
} finally {
  await new Promise((resolve) => server.close(resolve));
}
