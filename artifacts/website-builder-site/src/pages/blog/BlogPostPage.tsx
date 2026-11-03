import { useEffect } from "react";
import { useParams } from "wouter";
import { fireEvent } from "@/lib/analytics";
import { ArrowLeft, ArrowRight, Clock, Tag, Calendar } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { SupportWidget } from "@/components/SupportWidget";
import NotFound from "@/pages/not-found";
import { getPost, getRecentPosts, type Block } from "@/data/blog";

const ARTICLE_LD_ID = "ld-article";
const FAQ_LD_ID = "ld-faq";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          key={i}
          className="text-2xl font-heading font-extrabold text-primary mt-10 mb-4 leading-snug"
        >
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3
          key={i}
          className="text-lg font-heading font-bold text-primary mt-8 mb-3"
        >
          {block.text}
        </h3>
      );
    case "faq":
      return (
        <div key={i}>
          <h3 className="text-lg font-heading font-bold text-primary mt-8 mb-3">
            {block.question}
          </h3>
          <p
            className="text-base text-muted-foreground leading-relaxed mb-5"
            dangerouslySetInnerHTML={{ __html: block.answerHtml }}
          />
        </div>
      );
    case "p":
      return (
        <p
          key={i}
          className="text-base text-muted-foreground leading-relaxed mb-5"
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      );
    case "ul":
      return (
        <ul key={i} className="mb-5 space-y-2 pl-0">
          {block.items.map((item, j) => (
            <li key={j} className="flex items-start gap-2.5 text-muted-foreground text-base leading-relaxed">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-accent shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <div
          key={i}
          className="my-8 border-l-4 border-accent bg-accent/5 rounded-r-lg px-6 py-5 text-base text-primary font-medium leading-relaxed"
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      );
    default:
      return null;
  }
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = getPost(slug ?? "");
  const related = getRecentPosts(slug ?? "", 3);

  useSEO(
    post
      ? {
          title: post.metaTitle,
          description: post.metaDescription,
          canonical: `https://www.gulfcdd.com/blog/${post.slug}/`,
          breadcrumbs: [
            { name: "Blog", url: "https://www.gulfcdd.com/blog/" },
            { name: post.title, url: `https://www.gulfcdd.com/blog/${post.slug}/` },
          ],
        }
      : {
          title: "Post Not Found | GulfCDD",
          description: "This article could not be found.",
          noindex: true,
        }
  );

  useEffect(() => {
    document.getElementById(ARTICLE_LD_ID)?.remove();
    document.getElementById(FAQ_LD_ID)?.remove();
    if (!post) return;
    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "description": post.metaDescription,
      "datePublished": post.date,
      "dateModified": post.date,
      "author": {
        "@type": "Organization",
        "name": "Gulf Coast Digital Designs",
        "url": "https://www.gulfcdd.com/",
      },
      "publisher": {
        "@type": "Organization",
        "name": "Gulf Coast Digital Designs",
        "url": "https://www.gulfcdd.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.gulfcdd.com/images/gulfcdd-logo.webp",
        },
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://www.gulfcdd.com/blog/${post.slug}/`,
      },
    };
    const script = document.createElement("script");
    script.id = ARTICLE_LD_ID;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    const faqBlocks = post.blocks.filter(
      (block): block is Extract<Block, { type: "faq" }> => block.type === "faq",
    );
    if (faqBlocks.length > 0) {
      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqBlocks.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answerHtml.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(),
          },
        })),
      };
      const faqScript = document.createElement("script");
      faqScript.id = FAQ_LD_ID;
      faqScript.type = "application/ld+json";
      faqScript.textContent = JSON.stringify(faqSchema);
      document.head.appendChild(faqScript);
    }

    return () => {
      document.getElementById(ARTICLE_LD_ID)?.remove();
      document.getElementById(FAQ_LD_ID)?.remove();
    };
  }, [post]);

  if (!post) return <NotFound />;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <div className="bg-slate-50 border-b border-slate-200 py-12">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <a
              href="/blog/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-accent transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </a>
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-accent">
                <Tag className="w-3 h-3" />
                {post.category}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readTime}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(post.date)}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-primary leading-tight mb-5">
              {post.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
            <div className="mt-6 pt-6 border-t border-slate-200 flex items-center gap-3">
              <img
                src="/images/gulfcdd-logo.webp"
                alt="Gulf Coast Digital Designs"
                width={36}
                height={36}
                className="w-9 h-9 rounded object-contain bg-primary p-1"
              />
              <div>
                <p className="text-sm font-bold text-primary">Gulf Coast Digital Designs</p>
                <p className="text-xs text-muted-foreground">Gulf Coast Digital Designs · Biloxi, MS</p>
                <p className="text-xs text-muted-foreground/80 mt-1 max-w-xl">
                  Local builders who help small businesses get found and get more calls online.{" "}
                  <a href="/about/" className="text-accent hover:underline">Meet the team</a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <article className="py-14 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            {post.blocks.map((block, i) => renderBlock(block, i))}
          </div>
        </article>

        <section className="py-14 bg-primary text-white">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-extrabold mb-3 leading-tight">
              Ready to grow your business online?
            </h2>
            <p className="text-white/80 mb-7 leading-relaxed">
              Get a free quote — no commitment, no sales pitch. We'll tell you exactly what we'd build for your business and what it costs.
            </p>
            <a
              href="/contact/"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold px-8 py-3.5 rounded-md transition-colors text-sm shadow-md"
              onClick={() => fireEvent("cta_click", { cta_label: "blog_post_get_quote" })}
            >
              Get a Free Quote <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        {related.length > 0 && (
          <section className="py-16 bg-slate-50 border-t border-slate-200">
            <div className="container mx-auto px-4 md:px-6 max-w-5xl">
              <h2 className="text-xl font-heading font-bold text-primary mb-8">
                More from the blog
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {related.map((p) => (
                  <a
                    key={p.slug}
                    href={`/blog/${p.slug}/`}
                    className="group flex flex-col border border-slate-200 rounded-xl bg-white hover:border-accent/40 hover:shadow-sm transition-all p-6"
                  >
                    <span className="text-xs font-bold uppercase tracking-wide text-accent mb-2">
                      {p.category}
                    </span>
                    <h3 className="text-sm font-heading font-bold text-primary leading-snug mb-3 group-hover:text-accent transition-colors">
                      {p.title}
                    </h3>
                    <span className="mt-auto inline-flex items-center gap-1 text-xs font-bold text-accent group-hover:gap-2 transition-all">
                      Read <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <SupportWidget />
    </div>
  );
}
