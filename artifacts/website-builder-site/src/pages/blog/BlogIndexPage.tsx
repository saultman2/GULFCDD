import { ArrowRight, Clock, Tag } from "lucide-react";
import { fireEvent } from "@/lib/analytics";
import { useSEO } from "@/hooks/useSEO";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { SupportWidget } from "@/components/SupportWidget";
import { PageHero } from "@/components/PageHero";
import { posts } from "@/data/blog";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndexPage() {
  useSEO({
    title: "Web Design & Local SEO Guides | GulfCDD Blog",
    description:
      "Practical guides on web design, local SEO, Google Business Profile, and online marketing for small businesses on the Mississippi Gulf Coast. From the team at Gulf Coast Digital Designs.",
     canonical: "https://www.gulfcdd.com/blog/",
     breadcrumbs: [{ name: "Blog", url: "https://www.gulfcdd.com/blog/" }],
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <PageHero
          title="Tips & Guides for Gulf Coast Small Businesses"
          subtitle="Practical advice on web design, local SEO, and getting found online — written by a veteran-owned agency that actually works in your market."
          imageSrc="/images/ocean-springs-harbor.jpg"
          imageAlt="Ocean Springs Harbor — Mississippi Gulf Coast"
          location="Mississippi Gulf Coast"
          videoSrc="/videos/beach-hero.mp4"
        />

        {/* Post grid */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <a
                  key={post.slug}
                   href={`/blog/${post.slug}/`}
                  className="group flex flex-col border border-slate-200 rounded-xl bg-white hover:border-accent/40 hover:shadow-md transition-all overflow-hidden"
                >
                  <div className="p-7 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-accent">
                        <Tag className="w-3 h-3" />
                        {post.category}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>

                    <h2 className="text-lg font-heading font-bold text-primary leading-snug mb-3 group-hover:text-accent transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(post.date)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-accent group-hover:gap-2 transition-all">
                        Read article <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-primary mb-4">
              Ready to put your Gulf Coast business on Google?
            </h2>
            <p className="text-muted-foreground mb-7 leading-relaxed">
              We build fast, custom websites for small businesses across the Mississippi Gulf Coast. Veteran-owned. No contracts. Free quote.
            </p>
            <a
              href="/contact/"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold px-8 py-3.5 rounded-md transition-colors text-sm shadow-md"
              onClick={() => fireEvent("cta_click", { cta_label: "blog_index_get_quote" })}
            >
              Get a Free Quote <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <SupportWidget />
    </div>
  );
}
