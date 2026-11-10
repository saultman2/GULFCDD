import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { brotliCompress, gzip } from "node:zlib";
import { enrichHtml, getSoro, articleUrl, escapeHtml } from "./soro-content.mjs";
import { publicHeaders } from "./public-headers.mjs";

const brotli = promisify(brotliCompress);
const gz = promisify(gzip);
const ROOT = fileURLToPath(new URL("../dist/public/", import.meta.url));
const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8", ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".ico": "image/x-icon",
  ".woff": "font/woff", ".woff2": "font/woff2", ".mp4": "video/mp4", ".webm": "video/webm",
};
const utility = /^\/(?:sign-in|sign-up|account|checkout|thank-you|admin)(?:\/|$)|^\/free-website\/onboarding(?:\/|$)/;
const legacyStateRedirects = new Map([
  ["/service-areas/mississippi", "/service-areas/"],
  ...[
    "texas", "louisiana", "alabama", "florida", "georgia", "tennessee",
    "oklahoma", "kansas", "missouri", "kentucky", "virginia",
    "north-carolina", "south-carolina",
  ].map((state) => [`/service-areas/${state}`, "/service-areas/remote/"]),
]);

export function chooseEncoding(header = "") {
  const entries = String(header).split(",").map((part) => {
    const [name, ...parameters] = part.trim().toLowerCase().split(";");
    const raw = parameters.find((p) => p.trim().startsWith("q="));
    const quality = raw ? Number(raw.trim().slice(2)) : 1;
    return [name, Number.isFinite(quality) && quality >= 0 && quality <= 1 ? quality : 0];
  });
  const values = new Map(entries);
  const q = (name) => values.has(name) ? values.get(name) : values.get("*") ?? 0;
  const choices = ["br", "gzip"].filter((name) => q(name) > 0).sort((a, b) => q(b) - q(a));
  return choices[0] ?? null;
}

async function send(req, res, value, type, status = 200, cache = "no-cache") {
  let body = Buffer.isBuffer(value) ? value : Buffer.from(value);
  res.statusCode = status;
  res.setHeader("Content-Type", type);
  res.setHeader("Cache-Control", cache);
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (/text\/|application\/(?:json|xml)|image\/svg/.test(type)) {
    res.setHeader("Vary", "Accept-Encoding");
    const encoding = chooseEncoding(req.headers["accept-encoding"]);
    if (encoding) {
      body = encoding === "br" ? await brotli(body) : await gz(body);
      res.setHeader("Content-Encoding", encoding);
    }
  }
  res.setHeader("Content-Length", body.byteLength);
  res.end(req.method === "HEAD" ? undefined : body);
}

/** Host header without a port, so `gulfcdd.com:443` still canonicalizes to www. */
export function canonicalHostname(headerValue) {
  return String(headerValue ?? "").split(",")[0].trim().toLowerCase().replace(/:\d+$/, "");
}

export function wwwRedirectTarget(hostHeader, pathname, search) {
  if (canonicalHostname(hostHeader) !== "gulfcdd.com") return null;
  return `https://www.gulfcdd.com${pathname}${search}`;
}

/** Append blog URLs when the feed is available. A feed failure returns the static sitemap unchanged. */
export async function enrichSitemap(staticXml, loadArticles = getSoro) {
  try {
    const { articles } = await loadArticles();
    return sitemapWithArticles(staticXml, articles);
  } catch {
    return staticXml;
  }
}

export function sitemapWithArticles(staticXml, articles) {
  if (!articles?.length) return staticXml;
  const entries = articles.map((article) => {
    const date = /^\d{4}-\d{2}-\d{2}T/.test(article.isoDate) ? article.isoDate.slice(0, 10) : null;
    return `<url><loc>${escapeHtml(articleUrl(article.slug))}</loc>${date ? `<lastmod>${date}</lastmod>` : ""}</url>`;
  }).join("");
  return staticXml.replace("</urlset>", `${entries}</urlset>`);
}

export async function requestHandler(req, res) {
  for (const [name, value] of Object.entries(publicHeaders)) res.setHeader(name, value);
  try {
    if (!["GET", "HEAD"].includes(req.method)) {
      res.setHeader("Allow", "GET, HEAD");
      return await send(req, res, "Method not allowed", MIME[".txt"], 405);
    }
    const url = new URL(req.url ?? "/", "http://localhost");
    if (/^\/(?:admin|free-website\/onboarding)(?:\/|$)/.test(url.pathname)) {
      res.setHeader("X-Robots-Tag", "noindex, nofollow");
      res.setHeader("Referrer-Policy", "no-referrer");
    }
    const hostHeader = req.headers["x-forwarded-host"] ?? req.headers.host;
    const wwwTarget = wwwRedirectTarget(hostHeader, url.pathname, url.search);
    if (wwwTarget) {
      res.writeHead(301, { Location: wwwTarget });
      return res.end();
    }
    const legacyStateDestination = legacyStateRedirects.get(url.pathname.replace(/\/+$/, ""));
    if (legacyStateDestination) {
      res.writeHead(301, { Location: `${legacyStateDestination}${url.search}` });
      return res.end();
    }
    if (url.pathname === "/soro/embed.js" || url.pathname === "/soro/articles") {
      try {
        const { articles, code } = await getSoro();
        return await send(req, res, url.pathname.endsWith(".js") ? code : JSON.stringify(articles),
          url.pathname.endsWith(".js") ? MIME[".js"] : MIME[".json"], 200, "public, max-age=60");
      } catch {
        return await send(req, res, "Soro content is temporarily unavailable", MIME[".txt"], 503, "no-store");
      }
    }
    let path;
    try { path = decodeURIComponent(url.pathname); }
    catch { return await send(req, res, "Bad URL", MIME[".txt"], 400); }
    if (path.includes("\0") || path.includes("\\")) return await send(req, res, "Bad URL", MIME[".txt"], 400);
    let file = resolve(ROOT, `.${path}`);
    if (!(file === resolve(ROOT) || file.startsWith(resolve(ROOT) + sep))) {
      return await send(req, res, "Forbidden", MIME[".txt"], 403);
    }
    let info = await stat(file).catch(() => null);
    if (info?.isDirectory()) {
      if (!url.pathname.endsWith("/")) {
        res.writeHead(301, { Location: `${url.pathname}/${url.search}` });
        return res.end();
      }
      file = resolve(file, "index.html");
      info = await stat(file).catch(() => null);
    }
    if (!info?.isFile() && utility.test(url.pathname)) {
      file = resolve(ROOT, "index.html");
      info = await stat(file).catch(() => null);
    }
    if (!info?.isFile()) return await send(req, res, "Page not found", MIME[".txt"], 404);
    const type = MIME[extname(file).toLowerCase()] ?? "application/octet-stream";
    let body = await readFile(file);
    if (url.pathname === "/sitemap.xml") {
      const xml = await enrichSitemap(body.toString());
      return await send(req, res, xml, type, 200, "public, max-age=60");
    }
    if (type.startsWith("text/html")) {
      const result = await enrichHtml(body.toString(), url);
      return await send(req, res, result.html, type, result.status, /^\/(?:admin|free-website\/onboarding)(?:\/|$)/.test(url.pathname) ? "no-store" : "no-cache");
    }
    const cache = url.pathname.startsWith("/assets/") || /^\/images\/.+-v\d+-\d+\.(?:avif|webp)$/.test(url.pathname) ? "public, max-age=31536000, immutable" :
      "public, max-age=86400";
    // Preserve media seeking without compressing binary representations.
    if (req.headers.range && /^(video|audio)\//.test(type)) {
      const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      const start = range?.[1] ? Number(range[1]) : Math.max(0, body.length - Number(range?.[2]));
      const end = range?.[1] && range[2] ? Number(range[2]) : body.length - 1;
      if (!range || start < 0 || end < start || end >= body.length) {
        res.setHeader("Content-Range", `bytes */${body.length}`);
        return await send(req, res, "", type, 416);
      }
      res.setHeader("Content-Range", `bytes ${start}-${end}/${body.length}`);
      res.setHeader("Accept-Ranges", "bytes");
      return await send(req, res, body.subarray(start, end + 1), type, 206, cache);
    }
    return await send(req, res, body, type, 200, cache);
  } catch (error) {
    console.error("Website response failed:", error.message);
    if (!res.headersSent) await send(req, res, "Website temporarily unavailable", MIME[".txt"], 503, "no-store");
    else res.end();
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT);
  if (!port || !process.env.BASE_PATH) throw new Error("PORT and BASE_PATH must be configured");
  createServer(requestHandler).listen(port, "0.0.0.0", () => console.log(`Website serving on port ${port}`));
}
