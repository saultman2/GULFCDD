import { Search, MapPin, BarChart2, CheckCircle2, ArrowRight, Star, Globe, FileText, Link2, MessageSquare } from "lucide-react";
import { fireEvent } from "@/lib/analytics";
import { ResponsiveCoastImage } from "@/components/ResponsiveCoastImage";
import { useSEO } from "@/hooks/useSEO";
import { ServiceAnswerBlock } from "@/components/ServiceAnswerBlock";
import { ServiceBuyingGuide } from "@/components/ServiceBuyingGuide";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { SupportWidget } from "@/components/SupportWidget";
import { PageHero } from "@/components/PageHero";

const included = [
  {
    icon: MapPin,
    title: "Google Business Profile Optimization",
    desc: "We help set up or update your categories, services, hours, and contact details. Google handles profile eligibility and verification; we work with your real business information.",
  },
  {
    icon: FileText,
    title: "On-Page SEO Structure",
    desc: "Give each page a useful title and explain the service it covers. Someone looking for a roof repair should not have to read your whole site to find out whether you do that work.",
  },
  {
    icon: Globe,
    title: "Local Keyword Targeting",
    desc: "Local SEO starts with where your customers are. For Gulf Coast businesses, we focus on accurate local information and useful service pages. For remote projects, we describe your real business location and coverage—not an office we don't have.",
  },
  {
    icon: Link2,
    title: "Internal Linking & Site Structure",
    desc: "Connect the pages that belong together. A visitor reading about a service should be able to check your coverage or request a quote without hunting through the menu.",
  },
  {
    icon: BarChart2,
    title: "Local Citation Building",
    desc: "An old phone number or conflicting business name can confuse customers. We review relevant listings and help keep your verified business details consistent.",
  },
  {
    icon: MessageSquare,
    title: "Schema Markup",
    desc: "Add business and service details in a format search engines can read. The information comes from what's true and visible on your site, not extra claims hidden in the code.",
  },
];

const regionalTargets = [
  { label: "New Orleans, LA", href: "/service-areas/new-orleans/" },
  { label: "Mobile, AL", href: "/service-areas/mobile/" },
  { label: "Remote projects nationwide", href: "/service-areas/remote/" },
];

const reasons = [
  "Pages organized around the work you do.",
  "Local SEO and blog posts are part of Growth. Every plan includes an analytics report.",
  "A look at your service area and the businesses customers compare you with.",
  "Transparent reporting — you know exactly what we did and why.",
  "Veteran-owned and based on the Mississippi Gulf Coast.",
  "Clear deliverables. No hidden fees, no long-term lock-in.",
];

export default function SEOPage() {
  useSEO({
    title: "Local SEO, AEO & AI Search for Gulf Coast Businesses | GulfCDD",
    description: "Get found on Google Maps, search, and AI answers. Local SEO, Google Business Profile and GEO for Biloxi, Gulfport, NOLA and Mobile.",
    canonical: "https://www.gulfcdd.com/services/seo",
    breadcrumbs: [
      { name: "Services", url: "https://www.gulfcdd.com/services" },
      { name: "Local SEO", url: "https://www.gulfcdd.com/services/seo" },
    ],
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <PageHero
          title="Local SEO That Helps Customers Find You"
          subtitle="When someone in Gulfport searches for a local business, Google picks from businesses it trusts and understands. Our job is making yours one of them."
          imageSrc="/images/ocean-springs-harbor.jpg"
          imageAlt="Mississippi Gulf Coast small business"
        />

        {/* Intro */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-accent mb-4">
              What local SEO covers
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-primary leading-tight mb-6">
              How can local SEO help your business?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              When someone searches for the work you do, can they tell whether you can help them? We review your service pages, Google Business Profile, and other local listings to make your services, hours, and contact details easier to find and understand.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mt-4">
              AEO, or answer engine optimization, makes common questions easier to answer on your site. GEO, or generative engine optimization, applies that clarity to AI-powered search. For example, a page can explain which jobs you take, where you travel, and how to request an estimate. Neither approach guarantees a Google position or an AI recommendation.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mt-4">
              A Gulf Coast contractor may need to clarify which jobs it takes and where. A shop may need accurate directions and opening hours. Tell us what customers ask before they call, and we'll help answer it on your site. <a href="/service-areas/" className="text-accent font-semibold hover:underline">See the areas we serve remotely</a>. Your business location and Google's eligibility rules still determine whether it can appear on Maps.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href="/intake/?mode=quick"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold px-7 py-3.5 rounded-md transition-colors text-sm"
                onClick={() => fireEvent("cta_click", { cta_label: "service_seo_get_quote" })}
              >
                Get a Free SEO Quote <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/intake/"
                className="inline-flex items-center gap-2 border border-primary/20 text-primary hover:bg-slate-50 font-bold px-7 py-3.5 rounded-md transition-colors text-sm"
                onClick={() => fireEvent("cta_click", { cta_label: "service_seo_start_project" })}
              >
                Start Your Project <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* What's included */}
        <section className="py-20 bg-[#0E1826]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mb-12">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-accent mb-4">
                What's Included
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white leading-tight">
                The details we check and the pages we work on.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl">
              {included.map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 p-6 border border-white/10 rounded-xl bg-white/[0.06] hover:bg-white/[0.09] transition-all"
                >
                  <div className="w-11 h-11 rounded-lg bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-white mb-1 text-sm">{item.title}</h3>
                    <p className="text-sm text-white/70 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why GulfCDD for SEO */}
        <section className="relative py-20 bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 opacity-20" aria-hidden="true">
            <ResponsiveCoastImage src="/images/ocean-springs-harbor.jpg" alt="Ocean Springs harbor on the Mississippi Gulf Coast" width={900} height={506} loading="lazy" decoding="async" className="w-full h-full object-cover object-center" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/75 to-slate-900/55" />
          <div className="relative z-10 container mx-auto px-4 md:px-6 max-w-4xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-accent mb-4">
                  Why GulfCDD
                </span>
                <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white leading-tight mb-6">
                  What search work is included?
                </h2>
                <p className="text-white/75 leading-relaxed">
                  Local SEO is part of Growth, which is $500 a month, or $250 a month for founding clients, and also includes blog posts. Essential is $150 a month for hosting and upkeep. Every plan includes an analytics report. No one can promise a ranking.
                </p>
              </div>
              <ul className="space-y-3">
                {reasons.map((r) => (
                  <li key={r} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-white/75 text-sm leading-relaxed">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Cities we serve */}
        <section className="py-14 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent mb-2">Where We Work</p>
            <h2 className="text-2xl font-heading font-extrabold text-primary mb-6">
              Local SEO for the Gulf Coast and remote clients
            </h2>
            <div className="flex flex-wrap gap-3">
              {regionalTargets.map((c) => (
                <a
                  key={c.href}
                  href={c.href}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-full text-sm text-primary bg-white hover:border-accent/40 hover:shadow-sm transition-all font-medium"
                >
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  {c.label}
                </a>
              ))}
            </div>
            <a href="/service-areas/" className="inline-block mt-4 text-accent font-semibold hover:underline">See the Gulf Coast cities and how nationwide projects work</a>
          </div>
        </section>

        <ServiceAnswerBlock
          eyebrow="Search visibility"
          title="What should local SEO improve for a small business?"
          answer="Local SEO explains what your business offers and where it works through service pages, business listings, and accurate local details. AEO answers common customer questions directly. GEO makes those answers and business facts easier for AI search tools to interpret. GulfCDD can work on these foundations, but search engines and AI platforms decide what to display."
          points={["Explain the work you do and answer common questions", "Tell customers where you can take jobs", "Make it easy to call or ask for a quote", "Get straightforward advice, not ranking guarantees"]}
          relatedHref="/blog/"
          relatedLabel="Explore the Gulf Coast business blog"
        />

        <ServiceBuyingGuide service="seo" />

        {/* CTA */}
        <section className="relative py-20 bg-primary text-white overflow-hidden">
          <div className="absolute inset-0 opacity-[0.12]" aria-hidden="true">
            <img src="/images/gulf-coast-beach-walkers.webp" alt="People walking along a Mississippi Gulf Coast beach" width={1920} height={1080} loading="lazy" decoding="async" className="w-full h-full object-cover object-center" />
          </div>
          <div className="relative z-10 container mx-auto px-4 md:px-6 max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-4 leading-tight">
              What should your local search project cover?
            </h2>
            <p className="text-white/80 mb-8 text-lg leading-relaxed">
              Send your website address and tell us which services and areas matter to your business. We'll look at the current setup and discuss what to work on first. We won't promise first-page placement.
            </p>
            <a
              href="/intake/?mode=quick"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold px-9 py-4 rounded-md transition-colors text-base"
              onClick={() => fireEvent("cta_click", { cta_label: "service_seo_cta_bottom" })}
            >
              Get Your Free Quote <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <SupportWidget />
    </div>
  );
}
