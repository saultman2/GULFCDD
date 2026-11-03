import { useEffect, useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { SupportWidget } from "@/components/SupportWidget";

const SORO_EMBED_SRC = `${import.meta.env.BASE_URL}soro/embed.js`;

export default function SoroBlogPage() {
  const [embedFailed, setEmbedFailed] = useState(false);
  const [articleOpen, setArticleOpen] = useState(() => new URLSearchParams(window.location.search).has("post"));
  const HeroHeading = articleOpen ? "h2" : "h1";
  useSEO({
    title: "Gulf Coast Business Blog | GulfCDD",
    description:
      "Practical web design, local SEO, and digital marketing insights for small businesses across the Mississippi Gulf Coast.",
    canonical: "https://www.gulfcdd.com/blog/",
    breadcrumbs: [{ name: "Blog", url: "https://www.gulfcdd.com/blog/" }],
  });

  useEffect(() => {
    if ((window as unknown as { __GULFCDD_PRERENDER__?: boolean }).__GULFCDD_PRERENDER__) return;
    const container = document.getElementById("soro-blog");
    if (!container) return;

    const existingScript = document.querySelector(
      `script[src="${SORO_EMBED_SRC}"]`,
    );
    existingScript?.remove();

    const script = document.createElement("script");
    script.src = SORO_EMBED_SRC;
    script.defer = true;
    script.setAttribute("crossorigin", "anonymous");
    script.onerror = () => setEmbedFailed(true);
    document.body.appendChild(script);

    // Soro supplies article metadata. Keep a single canonical rather than
    // a second vendor canonical competing with the site's own tag.
    const syncMetadata = () => {
      const params = new URLSearchParams(window.location.search);
      const post = params.get("post");
      setArticleOpen(Boolean(post));
      const canonical = `https://www.gulfcdd.com/blog/${post ? `?post=${encodeURIComponent(post)}` : ""}`;
      const links = [...document.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]')];
      let primary = links.find((link) => !link.hasAttribute("data-soro"));
      if (!primary) {
        primary = document.createElement("link");
        primary.rel = "canonical";
        document.head.appendChild(primary);
      }
      if (primary.href !== canonical) primary.href = canonical;
      links.forEach((link) => { if (link !== primary) link.remove(); });
      const title = document.title;
      const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')?.content;
      for (const [selector, value] of [
        ['meta[property="og:title"]', title], ['meta[name="twitter:title"]', title],
        ['meta[property="og:url"]', canonical], ['meta[property="og:description"]', description],
        ['meta[name="twitter:description"]', description],
      ] as const) {
        const meta = document.querySelector<HTMLMetaElement>(selector);
        if (meta && value && meta.content !== value) meta.content = value;
      }
      // The live embed generates its current schema after mounting.
      if (document.getElementById("soro-blog-jsonld")) document.getElementById("soro-server-schema")?.remove();
    };
    const observer = new MutationObserver(syncMetadata);
    observer.observe(document.head, { childList: true, subtree: true, attributes: true, characterData: true });
    syncMetadata();

    return () => {
      observer.disconnect();
      script.onerror = null;
      script.remove();
      container.replaceChildren();
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative isolate overflow-hidden border-b border-white/10 bg-neutral-950 py-16 md:py-24">
          <img
            src={`${import.meta.env.BASE_URL}images/gulf-coast-beach-walkers.webp`}
            alt=""
            aria-hidden="true"
            width={1920}
            height={1080}
            loading="eager"
            decoding="async"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-transparent to-black/30" />
          <div className="container mx-auto max-w-5xl px-4 md:px-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
              Gulf Coast Digital Designs
            </p>
            <HeroHeading className="font-heading text-4xl font-extrabold leading-tight text-white md:text-5xl">
              Gulf Coast Business Blog
            </HeroHeading>
            <div aria-hidden="true" className="mt-5 h-[3px] w-14 rounded-full bg-accent" />
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/90">
              Practical guidance on websites, local SEO, and digital marketing
              for small businesses across the Gulf Coast.
            </p>
          </div>
        </section>

        <section className="min-h-[32rem] bg-white py-10 md:py-16">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            {embedFailed && (
              <p role="alert" className="py-12 text-center text-muted-foreground">
                The blog is temporarily unavailable. Please try again later.
              </p>
            )}
            <div id="soro-blog" className={embedFailed ? "hidden" : "min-h-[24rem]"} />
            <noscript>
              <p className="py-12 text-center text-muted-foreground">
                You are viewing the published articles without interactive navigation.
              </p>
            </noscript>
          </div>
        </section>
      </main>
      <Footer />
      <SupportWidget />
    </div>
  );
}
