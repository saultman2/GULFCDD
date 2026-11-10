import { transform } from "esbuild";
import sanitizeHtml from "sanitize-html";

const ORIGIN = "https://www.gulfcdd.com";
const EMBED = "https://app.trysoro.com/api/embed/9b9afb9b-9ddb-4ee7-b73a-8a6399e8285b";
const TTL = 5 * 60 * 1000;
let cached;
let pending;
let failureUntil = 0;
const bodies = new Map();

export const escapeHtml = (text) => String(text ?? "").replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
export const articleUrl = (slug) => `${ORIGIN}/blog/?post=${encodeURIComponent(slug)}`;
const safeJson = (value) => JSON.stringify(value).replace(/</g, "\\u003c");

async function remote(url, asJson = false) {
  const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`Soro returned HTTP ${response.status}`);
  return asJson ? response.json() : response.text();
}

export async function getSoro() {
  if (cached && cached.until > Date.now()) return cached;
  if (failureUntil > Date.now()) throw new Error("Soro is temporarily unavailable");
  if (pending) return pending;
  pending = (async () => {
    const source = await remote(`${EMBED}?theme=dark`);
    // Parse the public provider's JSON literal, never execute it on the server.
    const literal = source.match(/var SORO_ARTICLES\s*=\s*(\[[^\n]*\]);/);
    if (!literal) throw new Error("Soro published article list was not found");
    const list = JSON.parse(literal[1]);
    if (!Array.isArray(list)) throw new Error("Soro article list is invalid");
    const articles = list.filter((p) =>
      typeof p.id === "string" && /^[\w-]+$/.test(p.id) &&
      typeof p.slug === "string" && /^[a-z0-9-]+$/.test(p.slug) &&
      typeof p.title === "string",
    ).map(({ id, slug, title, excerpt, isoDate, image }) => ({
      id, slug, title, excerpt: typeof excerpt === "string" ? excerpt : "",
      isoDate: typeof isoDate === "string" ? isoDate : "",
      image: typeof image === "string" && image.startsWith("https://") ? image : undefined,
    }));
    const { code } = await transform(source, { minify: true, target: "es2020", legalComments: "none" });
    cached = { articles, code, until: Date.now() + TTL };
    return cached;
  })();
  try { return await pending; }
  catch (error) { failureUntil = Date.now() + 15000; throw error; }
  finally { pending = undefined; }
}

export async function getArticleBody(article) {
  const existing = bodies.get(article.id);
  if (existing?.until > Date.now()) return existing.html;
  const data = await remote(`${EMBED}/article/${encodeURIComponent(article.id)}`, true);
  if (typeof data.content !== "string") throw new Error("Soro article content is invalid");
  const html = sanitizeHtml(data.content, {
    allowedTags: ["p", "h2", "h3", "h4", "ul", "ol", "li", "strong", "em", "a",
      "blockquote", "br", "hr", "table", "thead", "tbody", "tr", "th", "td", "img", "figure", "figcaption"],
    allowedAttributes: { a: ["href", "title"], img: ["src", "alt", "width", "height"], th: ["scope"] },
    allowedSchemes: ["https", "http", "mailto", "tel"],
    allowProtocolRelative: false,
    transformTags: { img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: "lazy" } }) },
  });
  if (bodies.size > 128) bodies.clear();
  bodies.set(article.id, { html, until: Date.now() + TTL });
  return html;
}

function articleList(articles) {
  if (!articles.length) return "<p>Soro has no published articles yet. Please check back later.</p>";
  return `<div>${articles.map((a) => `<article><h2><a href="/blog/?post=${encodeURIComponent(a.slug)}">${escapeHtml(a.title)}</a></h2><p>${escapeHtml(a.excerpt)}</p></article>`).join("")}</div>`;
}

export async function enrichHtml(html, url) {
  // Only the blog needs live article enrichment; the shared footer has no article list.
  if (url.pathname !== "/blog/") return { status: 200, html };
  let articles;
  try { ({ articles } = await getSoro()); }
  catch {
    return { status: 503, html: html.replace(/<div id="soro-blog"[^>]*><\/div>/,
      '<div id="soro-blog"><p>The blog is temporarily unavailable. Please try again later.</p></div>') };
  }
  const slug = url.searchParams.get("post");
  const article = slug ? articles.find((a) => a.slug === slug) : undefined;
  if (slug && !article) {
    return { status: 404, html: html.replace(/<div id="soro-blog"[^>]*><\/div>/,
      '<div id="soro-blog"><p>This article is no longer available. <a href="/blog/">Browse published articles</a></p></div>') };
  }
  const canonical = article ? articleUrl(article.slug) : `${ORIGIN}/blog/`;
  const title = article ? `${article.title} | GulfCDD` : "Gulf Coast Business Blog | GulfCDD";
  const description = article?.excerpt ?? "Website, local SEO, and digital marketing guides for Mississippi Gulf Coast small businesses.";
  let content;
  if (article) {
    try { content = `<article><h2>${escapeHtml(article.title)}</h2>${await getArticleBody(article)}<p><a href="/blog/">Browse all articles</a></p></article>`; }
    catch { return { status: 503, html: html.replace(/<div id="soro-blog"[^>]*><\/div>/,
      '<div id="soro-blog"><p>This article is temporarily unavailable. Please try again later.</p></div>') }; }
  } else content = articleList(articles);
  html = html.replace(/<div id="soro-blog"[^>]*><\/div>/, `<div id="soro-blog" class="prose max-w-none">${content}</div>`)
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/<link\b(?=[^>]*rel=["']canonical["'])[^>]*>/g, "")
    .replace("</head>", `<link rel="canonical" href="${escapeHtml(canonical)}"></head>`);
  if (article) html = html.replace(/(<h1\b[^>]*>)[\s\S]*?<\/h1>/, `$1${escapeHtml(article.title)}</h1>`);
  for (const [attribute, name, value] of [
    ["name", "description", description], ["property", "og:title", title],
    ["property", "og:description", description], ["property", "og:url", canonical],
    ["name", "twitter:title", title], ["name", "twitter:description", description],
  ]) {
    html = html.replace(new RegExp(`<meta\\b(?=[^>]*${attribute}=["']${name}["'])[^>]*>`, "g"),
      `<meta ${attribute}="${name}" content="${escapeHtml(value)}">`);
  }
  const schema = article ? {
    "@context": "https://schema.org", "@type": "BlogPosting", headline: article.title,
    description, url: canonical, datePublished: article.isoDate || undefined,
    image: article.image, publisher: { "@id": `${ORIGIN}/#organization` },
  } : {
    "@context": "https://schema.org", "@type": "Blog", name: title, url: canonical,
    blogPost: articles.map((a) => ({ "@type": "BlogPosting", headline: a.title, url: articleUrl(a.slug) })),
  };
  html = html.replace("</head>", `<script id="soro-server-schema" type="application/ld+json">${safeJson(schema)}</script></head>`);
  return { status: 200, html };
}

export async function handleSoroRequest(req, res) {
  const pathname = new URL(req.url ?? "/", "http://localhost").pathname;
  if (!["/soro/articles", "/soro/embed.js"].includes(pathname)) return false;
  try {
    const data = await getSoro();
    res.setHeader("Cache-Control", "public, max-age=60");
    if (pathname === "/soro/articles") {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(safeJson(data.articles));
    } else {
      res.setHeader("Content-Type", "text/javascript; charset=utf-8");
      res.end(data.code);
    }
  } catch {
    res.statusCode = 503;
    res.setHeader("Cache-Control", "no-store");
    res.end("Soro content is temporarily unavailable");
  }
  return true;
}
