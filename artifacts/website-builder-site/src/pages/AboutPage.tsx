import { Shield, Star, Handshake, Flag, TrendingUp, ArrowRight } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { fireEvent } from "@/lib/analytics";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { SupportWidget } from "@/components/SupportWidget";
import { PageHero } from "@/components/PageHero";

const values = [
  {
    icon: Shield,
    title: "Veteran Founded",
    description: "One of our founders served in the military. We take preparation, clear expectations, and following through seriously.",
  },
  {
    icon: Flag,
    title: "Built by Our Team",
    description: "We do the design and development ourselves, without overseas outsourcing.",
  },
  {
    icon: Handshake,
    title: "No Contracts. Cancel Anytime.",
    description: "Monthly care has no minimum commitment. Cancel anytime, with no advance notice required.",
  },
  {
    icon: Star,
    title: "You Get a Real Person",
    description: "You can text or email the people working on your website.",
  },
  {
    icon: TrendingUp,
    title: "Support Beyond Launch",
    description: "We offer ongoing hosting, maintenance, and updates for businesses that want continued support.",
  },
];

export default function AboutPage() {
  useSEO({
    title: "About Us | Veteran-Owned Web Design in Biloxi | GulfCDD",
    description: "Gulf Coast Digital Designs is a veteran-owned web design and SEO team started by two brothers raised on the Mississippi Gulf Coast.",
    canonical: "https://www.gulfcdd.com/about",
    breadcrumbs: [{ name: "About Us", url: "https://www.gulfcdd.com/about" }],
  });
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main>
        <PageHero
          title="Two Brothers From the Coast, Building Websites That Work"
          subtitle="Gulf Coast Digital Designs is a veteran-owned web design and SEO team started by two brothers raised on the Mississippi Gulf Coast."
          imageSrc="/images/biloxi-pier-sunset.webp"
          imageAlt="Biloxi pier at sunset, Mississippi"
          location="Biloxi, Mississippi"
          videoSrc="/videos/beach-hero.mp4"
        />

        {/* Who We Are */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-accent mb-4">
              Who We Are
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-primary leading-tight mb-6">
              Who is behind GulfCDD?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We're two brothers who grew up on the Mississippi Gulf Coast. We started Gulf Coast Digital Designs—GulfCDD for short—to offer small-business web design and the help that comes after launch. Our business is veteran-owned, and we do the design and development ourselves.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mt-4">
              A website doesn't have to be complicated to do its job. Customers need to know what you offer, whether you serve their area, and how to reach you. Those details come before adding features you may never use.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mt-4">
              You know your business better than we do. We'll ask about your services, the questions you get, and the work you want more of. That's how we learn what belongs on the site.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mt-4">
              If you already have a website, send us the link. A new service page or a better contact form may be enough. If a redesign makes more sense, we'll explain why and agree on what stays.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mt-4">
              You work directly with us. If a service changes or you have a question about the site, you can call, text, or email the people working on it.
            </p>
            <p className="text-lg font-semibold text-primary leading-relaxed mt-6">
              A useful website should make your business easier to understand and contact.
            </p>
          </div>
        </section>

        {/* Core Values — dark navy */}
        <section className="py-16 bg-[#0E1826]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-accent mb-3">
                What We Stand For
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white leading-tight">
              What you can expect from us
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="bg-white/[0.06] rounded-xl p-6 border border-white/10 flex flex-col gap-4 hover:bg-white/[0.09] transition-colors"
                >
                  <div className="w-11 h-11 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <v.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-white text-base mb-1">
                      {v.title}
                    </h3>
                    <p className="text-sm text-white/70 leading-relaxed">
                      {v.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white border-t border-slate-200">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-10 items-start">
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-accent mb-4">How we work</span>
                <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-primary leading-tight mb-5">
                  What can a local web design partner actually help with?
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  You know your business better than we do, so we start by asking about the jobs you want more of and the questions customers keep asking. If your current site just needs a better service page or contact form, we'll tell you. We do the design and development ourselves. Month to month. No contract.
                </p>
                <h3 className="mt-6 text-xl font-heading font-extrabold text-primary">What we won't do</h3>
                <p className="mt-2 text-lg text-muted-foreground leading-relaxed">
                  We won't promise you the #1 spot on Google. Nobody honest can. We'll show you what we changed and what moved in your monthly report.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-7">
                <h3 className="font-heading font-bold text-primary mb-4">Our work can include:</h3>
                <ul className="space-y-3 text-sm text-slate-700 leading-relaxed">
                  <li>• A clear website for a new or established business</li>
                  <li>• A redesign when the current site is dated, slow, or difficult to use</li>
                  <li>• Local SEO structure for customers searching in Biloxi, Ocean Springs, Gulfport, Pascagoula, and nearby communities</li>
                  <li>• Ongoing hosting, maintenance, content updates, and technical support</li>
                  <li>• Custom applications that support the work behind the website</li>
                </ul>
                <a href="/what-we-build/" className="inline-flex items-center gap-2 mt-6 text-sm font-bold text-accent hover:text-primary transition-colors">
                  See what we build <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA — coastal photo overlay */}
        <section className="relative py-16 bg-primary text-white overflow-hidden">
          <div className="absolute inset-0 opacity-[0.12]" aria-hidden="true">
            <img src="/images/gulf-coast-beach-walkers.webp" alt="People walking along a Gulf Coast beach" width={1920} height={1080} loading="lazy" decoding="async" className="w-full h-full object-cover object-center" />
          </div>
          <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-4">
              What do you need help with?
            </h2>
            <p className="text-white/75 text-lg mb-8 max-w-lg mx-auto">
              Tell us what your business does and what you need from your website. We'll discuss the project and put together a free quote.
            </p>
            <a
              href="/intake/?mode=quick"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold rounded-md px-8 h-12 transition-colors shadow-md text-sm"
              onClick={() => fireEvent("cta_click", { cta_label: "about_get_free_quote" })}
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
