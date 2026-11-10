import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { createServer } from "node:http";
import { gzipSync } from "node:zlib";
import { requestHandler } from "./serve.mjs";

const root = new URL("../dist/public/", import.meta.url);
const home = await readFile(new URL("index.html", root), "utf8");
const llms = await readFile(new URL("llms.txt", root), "utf8");
assert.match(llms, /^#\s+\S/m, "llms.txt needs a Markdown title");
assert.ok([...llms.matchAll(/\[[^\]]+\]\(https:\/\/www\.gulfcdd\.com\/[^)]*\)/g)].length >= 10,
  "llms.txt needs real Markdown links to the site's main pages");

async function checkPages(directory) {
  let count = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      count += await checkPages(new URL(`${entry.name}/`, directory));
    } else if (entry.name === "index.html") {
      const html = await readFile(new URL(entry.name, directory), "utf8");
      const charset = html.indexOf('<meta charset="UTF-8"');
      assert.ok(charset >= 0 && charset < 1024, "Declare character encoding before critical CSS");
      assert.match(html, /<style id="critical-shell">/, "Missing generated critical shell");
      assert.ok(!html.includes('id="critical-shell" data-fallback'), "Development fallback leaked into release");
      assert.match(html, /<link\b[^>]*rel="preload"[^>]*data-deferred="true"/,
        "The full stylesheet must remain deferred");
      assert.match(html, /<noscript><link rel="stylesheet"/, "No-JavaScript CSS fallback missing");
      assert.ok(!html.includes("127.0.0.1:4174"), "Prerender origin leaked into asset URLs");
      count++;
    }
  }
  return count;
}
const pages = await checkPages(root);
const assets = await readdir(new URL("assets/", root));
const media = assets.filter((name) => /^(?:poppins-|hero-bg-|beach-hero-|gulfcdd-logo-)/.test(name));
assert.ok(media.some((name) => /beach-hero-.*\.mp4$/.test(name)), "Video must have a content-hashed URL");
assert.ok(media.filter((name) => name.endsWith(".woff2")).length >= 5, "Fonts must have content-hashed URLs");
const images = [...home.matchAll(/(?:src|srcset)="([^"]*hero-bg[^"]*)"/g)].map((match) => match[1]);
assert.ok(images.length >= 3 && images.every((value) => !value.includes("/images/")),
  "Hero images must use cache-safe fingerprinted asset URLs");
assert.ok(!/<video\b/.test(home), "Do not bake an active background video into the static snapshot");

const entry = home.match(/<script\b[^>]*type="module"[^>]*src="([^"]+)"/)?.[1];
assert.ok(entry, "JavaScript entry missing");
const entryBytes = gzipSync(await readFile(new URL(entry.replace(/^\//, ""), root))).length;
assert.ok(entryBytes < 110_000, "Initial JavaScript has exceeded its compressed size budget");

const server = createServer(requestHandler);
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
try {
  const origin = `http://127.0.0.1:${server.address().port}`;
  for (const name of media) {
    const response = await fetch(`${origin}/assets/${name}`, { method: "HEAD" });
    assert.equal(response.status, 200, `${name}: asset missing`);
    assert.equal(response.headers.get("cache-control"), "public, max-age=31536000, immutable",
      `${name}: content-hashed media should be cached for a year`);
    if (name.endsWith(".avif")) assert.equal(response.headers.get("content-type"), "image/avif");
  }
  console.log(`✓ ${pages} first-paint shells; deferred CSS and noscript fallback; ${media.length} fingerprinted images/fonts/video with immutable caching; valid llms.txt links.`);
  console.log(`✓ Initial JavaScript: ${(entryBytes / 1024).toFixed(1)} KiB gzip; decorative video absent from initial HTML.`);
} finally {
  await new Promise((resolve) => server.close(resolve));
}
