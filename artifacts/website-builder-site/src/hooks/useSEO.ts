import { useEffect } from "react";

interface Breadcrumb {
  name: string;
  url: string;
}

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  breadcrumbs?: Breadcrumb[];
  /** Set true for private/utility pages that must not appear in search results */
  noindex?: boolean;
  follow?: boolean;
}

const SCRIPT_ID_BREADCRUMB = "ld-breadcrumb";

/**
 * The production static host resolves public routes with a trailing slash.
 * Keeping canonical URLs in that final form avoids putting redirecting URLs
 * in canonical tags and in the sitemap.
 */
function toFinalUrl(url: string) {
  const parsed = new URL(url);
  if (!parsed.pathname.endsWith("/")) parsed.pathname += "/";
  return parsed.href;
}

/**
 * Sets the page <title>, meta description, canonical, OG tags,
 * and injects breadcrumb JSON-LD structured data per route.
 *
 * Call at the top of every page component.
 */
export function useSEO({ title, description, canonical, breadcrumbs, noindex, follow }: SEOProps) {
  useEffect(() => {
    /* ── Robots (noindex for private/utility pages) ─────────────── */
    let robotsMeta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (noindex) {
      if (!robotsMeta) {
        robotsMeta = document.createElement("meta");
        robotsMeta.setAttribute("name", "robots");
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.setAttribute("content", follow ? "noindex,follow" : "noindex, nofollow");
    } else if (robotsMeta) {
      robotsMeta.setAttribute("content", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
    }

    /* ── Title ──────────────────────────────────────────────────── */
    document.title = title;

    /* ── Meta description ───────────────────────────────────────── */
    let desc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!desc) {
      desc = document.createElement("meta");
      desc.setAttribute("name", "description");
      document.head.appendChild(desc);
    }
    desc.setAttribute("content", description);

    /* ── OG title ───────────────────────────────────────────────── */
    const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", title);

    /* ── OG description ─────────────────────────────────────────── */
    const ogDesc = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", description);

    /* ── Twitter title ──────────────────────────────────────────── */
    const twTitle = document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute("content", title);

    /* ── Twitter description ────────────────────────────────────── */
    const twDesc = document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute("content", description);

    /* ── Canonical & OG url ─────────────────────────────────────── */
    if (canonical) {
      const finalCanonical = toFinalUrl(canonical);
      const ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute("content", finalCanonical);

      let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", finalCanonical);

       /*
        * This is a single-language, single-region site. Do not emit
        * duplicate en/en-US/x-default annotations that all point to the
        * same URL; they create conflicting signals and also leak onto
        * noindex utility pages during crawls.
        */
       document
         .querySelectorAll('link[rel="alternate"][hreflang]')
         .forEach((alternate) => alternate.remove());
    }

    /* ── Breadcrumb JSON-LD ─────────────────────────────────────── */
    // Remove any previous breadcrumb script first
    document.getElementById(SCRIPT_ID_BREADCRUMB)?.remove();

    if (breadcrumbs && breadcrumbs.length > 0) {
      // Always prepend Home as the first item
      const allCrumbs = [
        { name: "Home", url: "https://www.gulfcdd.com/" },
        ...breadcrumbs.map((crumb) => ({ ...crumb, url: toFinalUrl(crumb.url) })),
      ];

      const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": allCrumbs.map((crumb, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "name": crumb.name,
          "item": crumb.url,
        })),
      };

      const script = document.createElement("script");
      script.id = SCRIPT_ID_BREADCRUMB;
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [title, description, canonical, breadcrumbs, noindex, follow]);
}
