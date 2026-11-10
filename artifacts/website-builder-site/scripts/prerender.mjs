#!/usr/bin/env node
/**
 * Post-build prerender for gulfcdd.com
 *
 * After `vite build` creates dist/public/, this script:
 *   1. Starts a lightweight static file server on a local port
 *   2. Uses Playwright (already installed for e2e) to render each public route
 *   3. Waits for React to mount and useSEO effects to fire
 *   4. Writes the fully-rendered HTML to dist/public/<route>/index.html
 *
 * The production deploy config is:
 *   serve = "static"
 *   [[rewrites]] from="/*" to="/index.html"
 *
 * Static files take priority over rewrites, so prerendered HTML at
 * dist/public/services/index.html is served directly to crawlers
 * while the React SPA still handles client-side navigation normally.
 */

import { chromium } from '@playwright/test';
import { createServer } from 'node:http';
import { createReadStream, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformWithEsbuild } from "vite";

// Use the same approved offer on the static page and runtime API. No duplicate
// marketing fallback that could silently drift from the accepted terms.
const campaignSource = readFileSync(fileURLToPath(new URL("../../api-server/src/campaign/defaults.ts", import.meta.url)), "utf8");
const campaignModule = await transformWithEsbuild(campaignSource, "campaign-defaults.ts", { loader: "ts" });
const { DEFAULT_CONFIG: campaignConfig } = await import(`data:text/javascript;base64,${Buffer.from(campaignModule.code).toString("base64")}`);
const campaignSnapshot = `<script>window.__GULFCDD_CAMPAIGN_CONFIG__=${JSON.stringify(campaignConfig).replace(/</g, "\\u003c")}</script>`;
import { minify } from 'html-minifier-terser';

/**
 * Writes sitemap.xml to dist/public/ with accurate <lastmod> dates.
 *
 * Static-page dates are hardcoded here and should be updated whenever
 * a page's content is meaningfully changed (same discipline as updating
 * a git blame comment). Do NOT substitute the build date: it would make
 * every deployment look like a content change to Googlebot.
 */
function writeSitemap(distDir) {
  // ── Static page dates — update when content changes ───────────────
  // Format: ISO 8601 date (YYYY-MM-DD). Do NOT use today's date as a proxy.
  const PAGE_DATES = {
    '/':                                   '2026-11-03',
    '/free-website':                        '2026-10-28',
    '/services':                           '2026-11-03',
    '/services/design':                    '2026-11-03',
    '/services/development':               '2026-11-03',
    '/services/hosting':                   '2026-11-03',
    '/services/maintenance':               '2026-11-03',
    '/what-we-build':                      '2026-11-03',
    '/service-areas':                       '2026-11-03',
    '/services/seo':                       '2026-11-03',
    '/about':                              '2026-11-03',
    '/contact':                            '2026-11-03',
    '/faq':                                '2026-11-03',
    '/intake':                             '2026-11-03',
    '/pricing':                            '2026-11-03',
    '/membership':                         '2026-11-03',
    '/blog':                               '2026-10-08',
    '/service-areas/ocean-springs':        '2026-11-03',
    '/service-areas/biloxi':               '2026-11-03',
    '/service-areas/gulfport':             '2026-11-03',
    '/service-areas/pascagoula':           '2026-11-03',
    '/service-areas/gautier':              '2026-11-03',
    '/service-areas/diberville':           '2026-11-03',
    '/service-areas/long-beach':           '2026-11-03',
    '/service-areas/bay-st-louis':         '2026-11-03',
    '/service-areas/new-orleans':          '2026-11-03',
    '/service-areas/mobile':               '2026-11-03',
    '/service-areas/remote':                '2026-11-01',
  };

  // Public routes are served in trailing-slash form. Keep the sitemap on
  // those final URLs so Google does not have to process redirecting entries.
  const finalUrl = (loc) => loc.endsWith('/') ? loc : `${loc}/`;
  const url = (loc, lastmod, changefreq, priority) =>
    `  <url>\n    <loc>${finalUrl(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;

  const base = 'https://www.gulfcdd.com';
  const p = (path) => PAGE_DATES[path] ?? '2026-08-14';

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '',
    '  <!-- ── Core pages ─────────────────────────────────────────── -->',
    url(`${base}/`,                           p('/'),             'weekly',  '1.0'),
    url(`${base}/services`,                   p('/services'),     'monthly', '0.9'),
    url(`${base}/services/design`,            p('/services/design'), 'monthly', '0.8'),
    url(`${base}/services/development`,       p('/services/development'), 'monthly', '0.8'),
    url(`${base}/services/hosting`,           p('/services/hosting'), 'monthly', '0.8'),
    url(`${base}/services/maintenance`,       p('/services/maintenance'), 'monthly', '0.8'),
    url(`${base}/services/seo`,               p('/services/seo'), 'monthly', '0.8'),
    url(`${base}/what-we-build`,              p('/what-we-build'), 'monthly', '0.8'),
    url(`${base}/service-areas`,              p('/service-areas'), 'monthly', '0.8'),
    url(`${base}/about`,                      p('/about'),        'monthly', '0.8'),
    url(`${base}/contact`,                    p('/contact'),      'monthly', '0.9'),
    url(`${base}/faq`,                        p('/faq'),          'monthly', '0.7'),
    url(`${base}/intake`,                     p('/intake'),       'monthly', '0.7'),
    url(`${base}/free-website`,               p('/free-website'), 'monthly', '0.8'),
    url(`${base}/pricing`,                    p('/pricing'),      'monthly', '0.7'),
    url(`${base}/membership`,                 p('/membership'),   'monthly', '0.7'),
    '',
    '  <!-- ── Service area pages ─────────────────────────────────── -->',
    url(`${base}/service-areas/ocean-springs`, p('/service-areas/ocean-springs'), 'monthly', '0.9'),
    url(`${base}/service-areas/biloxi`,        p('/service-areas/biloxi'),        'monthly', '0.9'),
    url(`${base}/service-areas/gulfport`,      p('/service-areas/gulfport'),      'monthly', '0.9'),
    url(`${base}/service-areas/pascagoula`,    p('/service-areas/pascagoula'),    'monthly', '0.8'),
    url(`${base}/service-areas/gautier`,       p('/service-areas/gautier'),       'monthly', '0.8'),
    url(`${base}/service-areas/diberville`,    p('/service-areas/diberville'),    'monthly', '0.8'),
    url(`${base}/service-areas/long-beach`,    p('/service-areas/long-beach'),    'monthly', '0.8'),
    url(`${base}/service-areas/bay-st-louis`,  p('/service-areas/bay-st-louis'),  'monthly', '0.8'),
    url(`${base}/service-areas/new-orleans`,  p('/service-areas/new-orleans'),  'monthly', '0.8'),
    url(`${base}/service-areas/mobile`,       p('/service-areas/mobile'),       'monthly', '0.8'),
    url(`${base}/service-areas/remote`,      p('/service-areas/remote'),       'monthly', '0.8'),
    '',
    '  <!-- ── Blog ───────────────────────────────────────────────── -->',
    url(`${base}/blog`, p('/blog'), 'weekly', '0.8'),
    '',
    '</urlset>',
  ].join('\n');

  writeFileSync(join(distDir, 'sitemap.xml'), xml, 'utf-8');
  console.log('  ✓  sitemap.xml written (Soro blog index)');

  // ── Consistency check: every sitemap URL must have a prerendered file ──
  const sitemapPaths = [...xml.matchAll(/<loc>https:\/\/www\.gulfcdd\.com(\/[^<]*)<\/loc>/g)]
    .map(m => m[1].replace(/\/$/, '') || '/');

  const missing = sitemapPaths.filter(path => {
    const file = path === '/'
      ? join(distDir, 'index.html')
      : join(distDir, ...path.replace(/^\//, '').split('/'), 'index.html');
    return !existsSync(file);
  });

  if (missing.length > 0) {
    console.error('\n  ✗  Sitemap/prerender mismatch — these sitemap URLs have no static file:');
    missing.forEach(p => console.error(`       ${p}`));
    console.error('     Add them to ROUTES or remove from sitemap.\n');
    process.exit(1);
  }
  console.log(`  ✓  All ${sitemapPaths.length} sitemap URLs have a prerendered file`);
}

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DIST_DIR  = join(__dirname, '..', 'dist', 'public');
const PORT      = 4174;

// All public routes to prerender — must match App.tsx + sitemap
const ROUTES = [
  '/',
  '/services',
  '/services/design',
  '/services/development',
  '/services/hosting',
  '/services/maintenance',
  '/what-we-build',
  '/design-ideas',
  '/about',
  '/contact',
  '/contact/thanks',
  '/free-website',
  '/free-website/thank-you',
  '/faq',
  '/pricing',
  '/membership',
  '/intake',
  '/service-areas',
  '/service-areas/ocean-springs',
  '/service-areas/biloxi',
  '/service-areas/gulfport',
  '/service-areas/pascagoula',
  '/services/seo',
  '/service-areas/gautier',
  '/service-areas/diberville',
  '/service-areas/long-beach',
  '/service-areas/bay-st-louis',
  '/service-areas/new-orleans',
  '/service-areas/mobile',
  '/service-areas/remote',
  '/blog',
  '/privacy',
  '/terms',
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.mjs':  'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.txt':  'text/plain',
  '.xml':  'application/xml',
};

/** Minimal SPA-aware static file server */
function createStaticServer(dir, port) {
  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      let urlPath = decodeURIComponent(req.url.split('?')[0]);
      let filePath = join(dir, urlPath);

      // Prefer <path>/index.html or <path>.html; fall back to SPA root
      if (!extname(filePath) || filePath.endsWith('/')) {
        const candidates = [
          join(dir, urlPath.replace(/\/$/, ''), 'index.html'),
          join(dir, urlPath + '.html'),
          join(dir, 'index.html'),
        ];
        filePath = candidates.find(p => existsSync(p)) ?? join(dir, 'index.html');
      }

      if (!existsSync(filePath)) filePath = join(dir, 'index.html');

      const ext = extname(filePath).toLowerCase();
      res.setHeader('Content-Type', MIME[ext] ?? 'application/octet-stream');
      res.setHeader('Cache-Control', 'no-store');
      if (ext === ".html") {
        const html = readFileSync(filePath, "utf8");
        res.end(urlPath.startsWith("/free-website") ? html.replace("</head>", `${campaignSnapshot}</head>`) : html);
        return;
      }
      createReadStream(filePath).pipe(res);
    });

    server.on('error', reject);
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

// Keep the critical inline shell paintable while the complete stylesheet is
// fetched. The load handler makes the static HTML work even if JavaScript is
// unavailable; the noscript fallback keeps non-JS visitors fully styled.
function preserveDeferredStylesheet(html) {
  return html.replace(
    /<link\b(?=[^>]*\brel="stylesheet")(?=[^>]*\bdata-deferred="true")[^>]*>/g,
    (tag) => {
      const href = tag.match(/\bhref="([^"]+)"/)?.[1];
      if (!href) throw new Error("Deferred stylesheet is missing its URL");
      return `<link rel="preload" as="style" href="${href}" data-deferred="true" onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet" href="${href}"></noscript>`;
    },
  );
}

// Derive the first-paint styles from the real compiled stylesheet, preserving
// Tailwind's cascade layers and responsive rules instead of approximating them.
async function prepareFirstPaint(page) {
  await page.waitForFunction(() =>
    Boolean(document.querySelector('link[data-deferred="true"]')?.sheet));
  await page.evaluate(() => {
    document.querySelectorAll('link[data-first-paint],link[rel="preload"][as="font"]').forEach((link) => link.remove());
    document.querySelector("#critical-shell")?.remove();
    const main = document.querySelector("main");
    const hero = main?.firstElementChild;
    const heroImage = hero?.querySelector("img");
    if (heroImage) {
      heroImage.setAttribute("loading", "eager");
      heroImage.setAttribute("fetchpriority", "high");
      heroImage.setAttribute("decoding", "async");
    }
    const nodes = [
      document.documentElement,
      document.body,
      ...Array.from(document.querySelectorAll("body *")).filter((element) =>
        element === main || element.parentElement === main || hero?.contains(element) ||
        element.getBoundingClientRect().top < window.innerHeight ||
        (main && Boolean(element.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_FOLLOWING))),
    ];
    const fonts = [];
    const keep = (rule) => {
      if (rule.selectorText) {
        const selector = rule.selectorText.replace(/::[\w-]+(?:\([^)]*\))?/g, "") || "*";
        return nodes.some((element) => {
          // Test the original selector first. Stripping pseudo-elements from
          // "*,:before,:after" can produce an invalid comma-separated list
          // and accidentally omit the universal preflight/reset.
          try { if (element.matches(rule.selectorText)) return true; } catch {}
          try { return element.matches(selector); } catch { return false; }
        }) ? rule.cssText : "";
      }
      if (rule.type === CSSRule.FONT_FACE_RULE) {
        if (["700", "800"].includes(rule.style.fontWeight)) {
          const url = rule.style.getPropertyValue("src").match(/url\(["']?([^"')]+)["']?\)/)?.[1];
          if (url) fonts.push(url);
        }
        return rule.cssText;
      }
      if (rule.cssRules) {
        const inner = Array.from(rule.cssRules).map(keep).filter(Boolean).join("\n");
        return inner ? `${rule.cssText.slice(0, rule.cssText.indexOf("{"))}{${inner}}` : "";
      }
      return rule.cssText;
    };
    const css = Array.from(document.styleSheets)
      .filter((sheet) => sheet.href && new URL(sheet.href).origin === location.origin)
      .flatMap((sheet) => Array.from(sheet.cssRules).map(keep))
      .filter(Boolean).join("\n");
    if (css.length < 500) throw new Error("Critical CSS extraction produced an incomplete shell");
    const style = document.createElement("style");
    style.id = "critical-shell";
    // Do not animate the transition from the static snapshot to the live app.
    // Once the stylesheet is ready, regular hover/interaction effects resume.
    style.textContent = css + "\nhtml:not([data-styles-ready]) body *,html:not([data-styles-ready]) body *::before,html:not([data-styles-ready]) body *::after{transition:none!important;animation:none!important}";
    const charset = document.head.querySelector("meta[charset]");
    if (charset) charset.after(style);
    else document.head.prepend(style);
    for (const href of new Set(fonts)) {
      const preload = document.createElement("link");
      Object.assign(preload, { rel: "preload", as: "font", type: "font/woff2", crossOrigin: "anonymous", href });
      preload.dataset.firstPaint = "true";
      document.head.append(preload);
    }
    const image = main?.querySelector('img[fetchpriority="high"]');
    if (image) {
      const sources = image.closest("picture")?.querySelectorAll("source") ?? [];
      // Preload only the preferred mobile format, not both AVIF and WebP.
      const mobile = Array.from(sources).find((source) => source.type === "image/avif");
      if (mobile) {
        const preload = document.createElement("link");
        Object.assign(preload, { rel: "preload", as: "image", type: mobile.type, media: mobile.media });
        if (mobile.srcset.includes(" ")) {
          preload.setAttribute("imagesrcset", mobile.srcset);
          preload.setAttribute("imagesizes", mobile.sizes || "100vw");
        } else preload.href = mobile.srcset;
        preload.setAttribute("fetchpriority", "high");
        preload.dataset.firstPaint = "true";
        document.head.append(preload);
      }
      if (mobile && !mobile.media) {
        document.documentElement.removeAttribute("data-styles-ready");
        return;
      }
      const preload = document.createElement("link");
      Object.assign(preload, { rel: "preload", as: "image", href: image.getAttribute("src") });
      if (mobile) preload.media = "(min-width: 768px)";
      if (image.srcset) {
        preload.setAttribute("imagesrcset", image.srcset);
        preload.setAttribute("imagesizes", image.sizes || "100vw");
      }
      preload.setAttribute("fetchpriority", "high");
      preload.dataset.firstPaint = "true";
      document.head.append(preload);
    }
    document.documentElement.removeAttribute("data-styles-ready");
  });
}

async function prerender() {
  console.log('\n🔍  GulfCDD prerender — starting\n');

  const server = await createStaticServer(DIST_DIR, PORT);

  // Use the same Chromium that e2e tests use (playwright.config.ts)
  const executablePath =
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
    '/nix/store/qa9cnw4v5xkxyip6mb9kxqfq1z4x2dx1-chromium-138.0.7204.100/bin/chromium';

  const browser = await chromium.launch({
    executablePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  let ok = 0, fail = 0;

  for (const route of ROUTES) {
    const page = await browser.newPage();
    // Suppress Clerk/network noise during headless render
    page.on('console', () => {});
    page.on('pageerror', () => {});

    try {
      // Capture durable page content, not an expiring visitor-only dialog.
      await page.addInitScript(() => { window.__GULFCDD_PRERENDER__ = true; });
      await page.goto(`http://127.0.0.1:${PORT}${route}`, {
        waitUntil: 'domcontentloaded',
        timeout: 30_000,
      });

      // Wait for React to mount
      await page.waitForSelector('#root > *', { timeout: 15_000 }).catch(() => {});
      // Wait for useEffect / useSEO to fire (title, meta, JSON-LD updates)
      await page.waitForTimeout(1_800);

      await prepareFirstPaint(page);
      const html = (await minify(preserveDeferredStylesheet(await page.content()), {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        // Keep data attributes, quoted attributes, JSON-LD and deferred CSS intact.
        removeAttributeQuotes: false,
      })).replace(/(<script\b[^>]*type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/g,
        (_, open, json, close) => open + JSON.stringify(JSON.parse(json)).replace(/</g, "\\u003c") + close);
      const title = await page.title();

      if (route === '/') {
        writeFileSync(join(DIST_DIR, 'index.html'), html, 'utf-8');
      } else {
        const parts   = route.replace(/^\//, '').split('/');
        const dir     = join(DIST_DIR, ...parts);
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, 'index.html'), html, 'utf-8');
      }

      console.log(`  ✓  ${route.padEnd(42)} "${title}"`);
      ok++;
    } catch (err) {
      console.error(`  ✗  ${route}: ${err.message}`);
      fail++;
    } finally {
      await page.close();
    }
  }

  await browser.close();
  server.close();

  // Write sitemap.xml with per-page content-change dates (not build date)
  writeSitemap(DIST_DIR);

  console.log(`\n  ${ok} routes prerendered${fail ? `, ${fail} failed` : ''}.\n`);
  if (fail > 0) process.exit(1);
}

prerender().catch(err => {
  console.error('Prerender failed:', err);
  process.exit(1);
});

