// Generates the 20 "See example" screenshots for the What We Build section.
// Usage (from artifacts/website-builder-site):
//   node scripts/capability-previews/generate.mjs [id ...]
// Renders self-contained HTML compositions (in /tmp) with system Chromium and
// captures WebP via the Chrome DevTools protocol. No extra dependencies.
// All businesses, domains, phone numbers, reviews and figures are fictional samples.
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { screens } from "./screens.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const outDir = path.join(root, "public/images/capability-previews");
const tmpDir = "/tmp/capability-previews";
const require = createRequire(path.join(root, "package.json"));
const { chromium } = require("@playwright/test");

function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const dir = fs.readdirSync("/nix/store").find((d) => /-chromium-\d[\d.]*$/.test(d));
  if (!dir) throw new Error("Set CHROMIUM_PATH");
  return `/nix/store/${dir}/bin/chromium`;
}

const W = 1200, H = 788;
fs.mkdirSync(tmpDir, { recursive: true });
const only = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: findChromium(), args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const cdp = await page.context().newCDPSession(page);
for (const [id, html] of Object.entries(screens)) {
  if (only.length && !only.includes(id)) continue;
  const file = path.join(tmpDir, `${id}.html`);
  fs.writeFileSync(file, html);
  await page.goto(`file://${file}`, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const { data } = await cdp.send("Page.captureScreenshot", { format: "webp", quality: 78, clip: { x: 0, y: 0, width: W, height: H, scale: 1 } });
  const out = path.join(outDir, `${id}.webp`);
  fs.writeFileSync(out, Buffer.from(data, "base64"));
  console.log(id, (fs.statSync(out).size / 1024).toFixed(1) + "KB");
}
await browser.close();
