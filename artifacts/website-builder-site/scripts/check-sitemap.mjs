#!/usr/bin/env node
/**
 * SEO guard for gulfcdd.com.
 *
 * public/sitemap.xml is the source-controlled sitemap input and
 * dist/public/sitemap.xml is the generated sitemap that is published.
 * Prerendered pages in dist/public/ are the HTML Googlebot receives, so every
 * generated sitemap URL must point at the exact canonical emitted by its
 * corresponding page. Pass --live (or set PUBLISHED_SITE_URL) after
 * publishing to validate the signals served by the live site.
 */

import {
  existsSync,
  readFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const siteDir = join(__dirname, '..');
const distDir = join(siteDir, 'dist', 'public');
const sourceSitemapPath = join(siteDir, 'public', 'sitemap.xml');
const generatedSitemapPath = join(distDir, 'sitemap.xml');
const faqSourcePath = join(siteDir, 'src', 'pages', 'FAQPage.tsx');
const siteOrigin = 'https://www.gulfcdd.com';
const utilityPaths = new Set([
  '/privacy/',
  '/terms/',
  '/contact/thanks/',
  '/free-website/thank-you/',
]);
const liveFlag = process.argv.indexOf('--live');
const sitemapFlag = process.argv.indexOf('--sitemap');
const sitemapOverride = sitemapFlag === -1 ? null : process.argv[sitemapFlag + 1];
const liveOrigin = liveFlag === -1
  ? null
  : (process.argv[liveFlag + 1]?.startsWith('http')
      ? process.argv[liveFlag + 1]
      : process.env.PUBLISHED_SITE_URL || siteOrigin).replace(/\/+$/, '');

function fail(errors, mode = 'pre-publish') {
  console.error(`\n  ✗  Sitemap/canonical ${mode} check failed:`);
  errors.forEach((error) => console.error(`       ${error}`));
  console.error('');
  process.exit(1);
}

function parseSitemap(xml, mode = 'pre-publish') {
  const errors = [];

  if (!/^<\?xml\b[^>]*\?>\s*<urlset\b[^>]*>/s.test(xml)) {
    errors.push('sitemap.xml must start with an XML declaration and <urlset>.');
  }
  if (!/<\/urlset>\s*$/s.test(xml)) {
    errors.push('sitemap.xml must end with </urlset>.');
  }

  const urlTags = [...xml.matchAll(/<\/?url>/g)].map((match) => match[0]);
  const urlBlocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => match[1]);
  if (urlTags.length !== urlBlocks.length * 2) {
    errors.push('sitemap.xml contains an unbalanced or nested <url> element.');
  }

  const urls = [];
  for (const [index, block] of urlBlocks.entries()) {
    const locs = [...block.matchAll(/<loc>([^<]*)<\/loc>/g)].map((match) => match[1].trim());
    if (locs.length !== 1) {
      errors.push(`sitemap entry ${index + 1} must contain exactly one <loc>.`);
      continue;
    }

    const loc = locs[0];
    const lastmods = [...block.matchAll(/<lastmod>([^<]*)<\/lastmod>/g)]
      .map((match) => match[1].trim());
    if (lastmods.length !== 1 || !/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)?$/.test(lastmods[0] || '')) {
      errors.push(`sitemap entry ${index + 1} must contain exactly one ISO 8601 <lastmod> date.`);
    }

    let parsed;
    try {
      parsed = new URL(loc);
    } catch {
      errors.push(`sitemap entry ${index + 1} has an invalid URL: ${loc}`);
      continue;
    }

    if (parsed.origin !== siteOrigin) {
      errors.push(`sitemap URL must use ${siteOrigin}: ${loc}`);
    }
    if (!parsed.pathname.endsWith('/')) {
      errors.push(`sitemap URL must be a final trailing-slash URL: ${loc}`);
    }
    if (parsed.search || parsed.hash) {
      errors.push(`sitemap URL must not contain a query or hash: ${loc}`);
    }
    if (utilityPaths.has(parsed.pathname)) {
      errors.push(`${parsed.pathname} is a noindex utility page and must remain absent from the sitemap.`);
    }
    urls.push(parsed);
  }

  if (errors.length > 0) fail(errors, mode);
  return urls;
}

function prerenderedFile(pathname) {
  if (pathname === '/') return join(distDir, 'index.html');
  return join(distDir, ...pathname.replace(/^\/|\/$/g, '').split('/'), 'index.html');
}

function canonicalLinks(html) {
  return [...html.matchAll(/<link\b[^>]*>/gi)]
    .map((match) => {
      const tag = match[0];
      const rel = tag.match(/\brel=["']([^"']+)["']/i)?.[1];
      return /\bcanonical\b/i.test(rel || '')
        ? tag.match(/\bhref=["']([^"']+)["']/i)?.[1]
        : null;
    })
    .filter(Boolean);
}

function checkCanonicalHtml(url, html, errors) {
  const canonicals = canonicalLinks(html);
  if (canonicals.length !== 1) {
    errors.push(`${url.pathname} must emit exactly one canonical link (found ${canonicals.length}).`);
  } else if (canonicals[0] !== url.href) {
    errors.push(`${url.pathname} canonical mismatch: sitemap has ${url.href}, HTML has ${canonicals[0]}.`);
  }
}

function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, 'i'))?.[1]?.trim() || '';
}

function metaTags(html) {
  return [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => match[0]);
}

function metaContent(tags, attributeName, value) {
  return tags
    .filter((tag) => attribute(tag, attributeName).toLowerCase() === value)
    .map((tag) => attribute(tag, 'content'));
}

function checkMetadataHtml(url, html, errors) {
  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1].trim() || '';
  if (!title) {
    errors.push(`${url.href} title: required <title> is missing or empty.`);
  }

  const tags = metaTags(html);
  const descriptions = metaContent(tags, 'name', 'description');
  if (descriptions.length !== 1 || !descriptions[0]) {
    errors.push(`${url.href} description: expected exactly one non-empty meta description.`);
  }

  const twitterSites = metaContent(tags, 'name', 'twitter:site');
  if (twitterSites.length !== 1 || twitterSites[0] !== '@GulfCDD') {
    errors.push(`${url.href} twitter:site: expected exactly one @GulfCDD attribution.`);
  }

  const openGraph = tags
    .map((tag) => ({ property: attribute(tag, 'property').toLowerCase(), content: attribute(tag, 'content') }))
    .filter(({ property }) => property.startsWith('og:'));

  if (openGraph.length > 0) {
    const requiredOpenGraph = ['og:title', 'og:description', 'og:url', 'og:image'];
    for (const property of requiredOpenGraph) {
      const matches = openGraph.filter((tag) => tag.property === property);
      if (matches.length !== 1 || !matches[0].content) {
        errors.push(`${url.href} Open Graph ${property}: expected exactly one non-empty declaration.`);
      }
    }

    for (const { property, content } of openGraph) {
      if (!content) {
        errors.push(`${url.href} Open Graph ${property}: declaration is empty.`);
      }
    }

    const ogUrl = openGraph.find((tag) => tag.property === 'og:url')?.content;
    if (ogUrl) {
      try {
        if (new URL(ogUrl).href !== url.href) {
          errors.push(`${url.href} Open Graph og:url: expected ${url.href}, found ${ogUrl}.`);
        }
      } catch {
        errors.push(`${url.href} Open Graph og:url: invalid URL ${ogUrl}.`);
      }
    }
  }

  const jsonLdBlocks = [...html.matchAll(
    /<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )];
  jsonLdBlocks.forEach((match, index) => {
    const signal = `JSON-LD block ${index + 1}`;
    const source = match[1].trim();
    if (!source) {
      errors.push(`${url.href} ${signal}: declaration is empty.`);
      return;
    }
    try {
      const parsed = JSON.parse(source);
      if (parsed === null || typeof parsed !== 'object') {
        errors.push(`${url.href} ${signal}: must contain a JSON object or array.`);
      }
    } catch (error) {
      errors.push(`${url.href} ${signal}: invalid JSON (${error instanceof Error ? error.message : String(error)}).`);
    }
  });
}

function faqExpectations() {
  const source = readFileSync(faqSourcePath, 'utf8');
  const questions = [...source.matchAll(/\bq:\s*"([^"]+)"/g)].map((match) => match[1]);
  const categories = [...source.matchAll(/\blabel:\s*"([^"]+)"/g)].map((match) => match[1]);
  const sensitiveDataQuestion = questions.find((question) => /HIPAA|sensitive information/i.test(question));

  if (questions.length === 0 || categories.length === 0 || !sensitiveDataQuestion) {
    throw new Error('FAQPage.tsx is missing questions, categories, or the sensitive-information question.');
  }

  return { questions, categories, sensitiveDataQuestion };
}

function visibleHtmlText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function checkFaqHtml(url, html, errors) {
  if (url.pathname !== '/faq/') return;

  let expectations;
  try {
    expectations = faqExpectations();
  } catch (error) {
    errors.push(`${url.href} FAQ source could not be checked: ${error instanceof Error ? error.message : String(error)}.`);
    return;
  }

  const text = visibleHtmlText(html);
  for (const question of expectations.questions) {
    if (!text.includes(question)) {
      errors.push(`${url.href} FAQ question is missing from visible prerendered HTML: ${question}`);
    }
  }
  for (const category of expectations.categories) {
    if (!text.includes(category)) {
      errors.push(`${url.href} FAQ category heading is missing from prerendered HTML: ${category}`);
    }
  }
  if (!text.includes(expectations.sensitiveDataQuestion)) {
    errors.push(`${url.href} sensitive-information FAQ question is missing from prerendered HTML: ${expectations.sensitiveDataQuestion}`);
  }

  const faqSchemaBlocks = [...html.matchAll(
    /<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )]
    .map((match) => {
      try {
        return JSON.parse(match[1].trim());
      } catch {
        return null;
      }
    })
    .filter((schema) => schema?.['@type'] === 'FAQPage');

  if (faqSchemaBlocks.length === 0) {
    errors.push(`${url.href} FAQPage JSON-LD block is missing.`);
    return;
  }

  const faqSchemaBlock = faqSchemaBlocks.find((schema) => {
    const entities = Array.isArray(schema.mainEntity) ? schema.mainEntity : [];
    return entities.filter((entity) => entity?.['@type'] === 'Question').length === expectations.questions.length;
  }) ?? faqSchemaBlocks[0];
  const entities = Array.isArray(faqSchemaBlock.mainEntity) ? faqSchemaBlock.mainEntity : [];
  const questionsInSchema = entities.filter((entity) => entity?.['@type'] === 'Question');
  const answersInSchema = questionsInSchema.filter((entity) => entity.acceptedAnswer?.['@type'] === 'Answer');
  if (questionsInSchema.length !== expectations.questions.length) {
    errors.push(`${url.href} FAQPage JSON-LD has ${questionsInSchema.length} Questions; expected ${expectations.questions.length}.`);
  }
  if (answersInSchema.length !== questionsInSchema.length) {
    errors.push(`${url.href} FAQPage JSON-LD has ${answersInSchema.length} Answers for ${questionsInSchema.length} Questions.`);
  }
  if (faqSchemaBlocks.length !== 1) {
    errors.push(`${url.href} has ${faqSchemaBlocks.length} FAQPage blocks; expected one source of visible answers.`);
  }
  for (const question of questionsInSchema) {
    if (!expectations.questions.includes(question.name)) {
      errors.push(`${url.href} schema contains an unknown FAQ question: ${question.name}`);
    }
    const answer = question.acceptedAnswer?.text;
    if (!answer || !text.includes(visibleHtmlText(answer))) {
      errors.push(`${url.href} schema answer does not match visible FAQ content: ${question.name}`);
    }
  }
}

function checkCanonicals(urls) {
  const errors = [];

  for (const url of urls) {
    const file = prerenderedFile(url.pathname);
    if (!existsSync(file)) {
      errors.push(`${url.pathname} has no prerendered HTML at ${file.replace(`${siteDir}/`, '')}.`);
      continue;
    }

    const html = readFileSync(file, 'utf8');
    checkCanonicalHtml(url, html, errors);
    checkMetadataHtml(url, html, errors);
    checkFaqHtml(url, html, errors);
  }

  for (const utilityPath of utilityPaths) {
    if (urls.some((url) => url.pathname === utilityPath)) {
      errors.push(`${utilityPath} must remain absent because it is a noindex utility page.`);
    }
  }

  if (errors.length > 0) fail(errors);
}

async function fetchHtml(url, errors) {
  let response;
  try {
    response = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(15_000) });
  } catch (error) {
    errors.push(`${url} could not be fetched: ${error instanceof Error ? error.message : String(error)}.`);
    return null;
  }
  if (!response.ok) {
    errors.push(`${url} returned HTTP ${response.status} ${response.statusText}.`);
    return null;
  }
  return response.text();
}

function noindexRobots(html) {
  return [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map((match) => {
      const tag = match[0];
      const name = tag.match(/\bname=["']([^"']+)["']/i)?.[1];
      const content = tag.match(/\bcontent=["']([^"']+)["']/i)?.[1] || '';
      return /^(robots|googlebot)$/i.test(name || '') ? content : '';
    })
    .some((content) => /(?:^|[,\s])noindex(?:$|[,\s])/i.test(content));
}

async function checkLive() {
  const errors = [];
  const sitemapUrl = `${liveOrigin}/sitemap.xml`;
  const sitemap = await fetchHtml(sitemapUrl, errors);
  if (!sitemap) fail(errors, 'live');

  // The live sitemap is the source of truth for the pages that were actually
  // published; parseSitemap still enforces the same URL and utility-page rules.
  const urls = parseSitemap(sitemap, 'live');
  for (const url of urls) {
    const html = await fetchHtml(url.href, errors);
    if (html) {
      checkCanonicalHtml(url, html, errors);
      checkMetadataHtml(url, html, errors);
    }
  }

  for (const utilityPath of utilityPaths) {
    const utilityUrl = `${liveOrigin}${utilityPath}`;
    const html = await fetchHtml(utilityUrl, errors);
    if (html && !noindexRobots(html)) {
      errors.push(`${utilityUrl} must include a robots meta tag containing noindex.`);
    }
  }

  if (errors.length > 0) fail(errors, 'live');
  console.log(`  ✓  Published sitemap fetched from ${sitemapUrl}`);
  console.log(`  ✓  ${urls.length} published URLs serve matching trailing-slash canonicals`);
  console.log(`  ✓  ${urls.length} published URLs serve titles, descriptions, and valid declared metadata`);
  console.log('  ✓  Privacy and Terms are absent from the sitemap and remain noindex');
}

if (liveOrigin) {
  await checkLive();
} else {
  const sitemapPath = sitemapOverride
    ? sitemapOverride
    : generatedSitemapPath;
  if (!existsSync(sitemapPath)) {
    fail([
      `Generated sitemap is missing at ${sitemapPath.replace(`${siteDir}/`, '')}; run the production build first.`,
    ]);
  }

  const sitemap = readFileSync(sitemapPath, 'utf8');
  const urls = parseSitemap(sitemap);
  if (!sitemapOverride) {
    // Keep the checked-in input honest as well as validating the artifact that
    // will actually be published.
    parseSitemap(readFileSync(sourceSitemapPath, 'utf8'), 'source');
  }
  checkCanonicals(urls);
  console.log(`  ✓  ${urls.length} generated sitemap URLs use final URLs with matching canonicals`);
  if (!sitemapOverride) {
    console.log('  ✓  Source sitemap and generated sitemap contain valid lastmod dates');
  }
  console.log('  ✓  Privacy and Terms remain absent as noindex utility pages');
}

