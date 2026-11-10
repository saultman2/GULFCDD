import {
  Palette, Code2, Server, Wrench, Bot, Megaphone,
  Check, ArrowRight, Mail, Calendar, Image,
  Map, Star, Search, Smartphone, Globe, Lock, PhoneCall, BarChart2,
} from "lucide-react";
import { fireEvent } from "@/lib/analytics";
import { useSEO } from "@/hooks/useSEO";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { SupportWidget } from "@/components/SupportWidget";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { tiers } from "@/data/plans";
import { ExistingWebsiteMarketing } from "@/sections/ExistingWebsiteMarketing";

/* ─── What we offer ───────────────────────────────────────────── */

const services = [
  {
    icon: Palette,
    title: "Website Design",
    desc: "A new website or a redesign, using your services, photos, and business details. We'll plan the layout and content with you before building.",
  },
  {
    icon: Code2,
    title: "Website Development",
    desc: "The working parts of the site: quote forms, appointment requests, online stores, and software connections. Tell us what should happen when a customer uses them.",
  },
  {
    icon: Server,
    title: "Website Hosting",
    desc: "Choose us to manage hosting, SSL, your domain settings, and backups—or keep your own provider. We'll explain the handoff and who handles future changes.",
  },
  {
    icon: Wrench,
    title: "Website Maintenance",
    desc: "Send us changes to your hours, services, or photos by text or email. Essential covers hosting and upkeep. Growth adds local SEO and blog posts.",
  },
  {
    icon: Megaphone,
    title: "Digital Marketing, SEO, AEO & GEO",
    desc: "Help customers find accurate service information through search, business listings, and AI answers. We work on the pages and details; no one can guarantee a ranking or recommendation.",
  },
  {
    icon: Bot,
    title: "Business Automation & Integrations",
    desc: "Reduce repetitive steps with quote intake, booking requests, client portals, or connections between tools. We'll review the workflow before quoting.",
  },
];

/* ─── Included in every build ─────────────────────────────────── */

const alwaysIncluded = [
  { icon: Smartphone, label: "Mobile-responsive design" },
  { icon: Mail, label: "Contact & quote request forms" },
  { icon: Calendar, label: "Appointment & booking request forms" },
  { icon: Search, label: "SEO structure built from day one" },
  { icon: Map, label: "Local SEO and business information" },
  { icon: Lock, label: "SSL security certificate" },
  { icon: Globe, label: "Custom domain support" },
  { icon: PhoneCall, label: "Click to call & click to text" },
  { icon: Image, label: "Photo & video galleries" },
  { icon: Star, label: "Customer reviews section" },
  { icon: Map, label: "Map & location section" },
  { icon: BarChart2, label: "Social media integration" },
];

/* ─── Component ───────────────────────────────────────────────── */

export default function ServicesPage() {
  useSEO({
    title: "Web Design, SEO & Hosting Services | Gulf Coast Digital Designs",
    description: "Websites, local SEO, AI search optimization, hosting and maintenance for Gulf Coast small businesses. Monthly plans, no contract.",
    canonical: "https://www.gulfcdd.com/services",
    breadcrumbs: [{ name: "Services", url: "https://www.gulfcdd.com/services" }],
  });
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
        <main className="flex flex-col">
        <PageHero
          title="What We Can Do for Your Business"
          subtitle="Websites, local SEO, AI search optimization, hosting and upkeep. Not sure what you need? Call (228) 278-7782 and we'll tell you. Remote projects nationwide."
          imageSrc="/images/ocean-springs-harbor.jpg"
          imageAlt="Ocean Springs harbor, Mississippi Gulf Coast"
          location="Mississippi Gulf Coast based • Remote nationwide"
        />

        {/* ── What we offer ── */}
        <section className="order-2 py-20 bg-[#0E1826]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mb-12">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-accent mb-4">
                What We Offer
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white leading-tight">
                Web design, development, and support—all handled in-house.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl">
              {services.map((s) => (
                <div key={s.title} className="flex gap-4 p-6 border border-white/10 rounded-xl bg-white/[0.06] hover:bg-white/[0.09] transition-all">
                  <div className="w-11 h-11 rounded-lg bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                    <s.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-white mb-1 text-sm">{s.title}</h3>
                    <p className="text-sm text-white/70 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Website Tiers ── */}
        <section id="packages" className="order-1 py-20 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mb-12">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-accent mb-4">
                Website tiers
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-primary leading-tight mb-4">
                Choose the right starting point.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed font-medium">
              Essential is $150 a month for hosting and upkeep. Growth is $500 a month, or $250 for founding clients, and adds local SEO and blog posts. Full Service is $1,000 a month, or $500 for founding clients. Every plan includes an analytics report. Founding clients get the build free through January 31, 2027. No contract.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                You don't have to be near our Mississippi Gulf Coast base to work with us. We can plan and review your website by phone, email, and video. <a href="/service-areas/" className="text-accent font-semibold hover:underline">Find your state</a> and see how we can help.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {tiers.map((tier) => (
                <div
                  key={tier.key}
                  data-testid={`tier-card-${tier.key}`}
                  className={`relative flex flex-col rounded-xl border overflow-hidden transition-shadow hover:shadow-md ${
                    tier.highlight
                      ? "bg-primary border-primary text-white shadow-lg"
                      : "bg-white border-slate-200"
                  }`}
                >
                  {/* Badge */}
                  {tier.badge && (
                    <div className={`text-[10px] font-bold uppercase tracking-wider text-center py-1.5 ${
                      tier.highlight ? "bg-accent text-white" : "bg-accent/10 text-accent"
                    }`}>
                      {tier.badge}
                    </div>
                  )}

                  <div className="flex flex-col flex-1 p-6">
                    {/* Name + tagline */}
                    <div className="mb-5">
                      <div className={`text-xl font-heading font-extrabold ${tier.highlight ? "text-white" : "text-primary"}`}>
                        {tier.name}
                      </div>
                      <div className={`text-xs mt-1 font-semibold italic ${tier.highlight ? "text-white/65" : "text-accent"}`}>
                        {tier.tagline}
                      </div>
                    </div>

                    {/* Tier overview */}
                    <div className="mb-5 pb-5 border-b border-slate-200/30">
                      {tier.startingPrice && <p className="mb-2 text-xl font-bold" data-testid={`tier-price-${tier.key}`}>{tier.startingPrice}{tier.foundingPrice ? <span className="block text-xs font-normal">{tier.foundingPrice}</span> : null}<span className="block text-xs font-normal">Monthly. No contract. Analytics report included.</span></p>}
                      <div className={`text-sm font-semibold ${tier.highlight ? "text-white/75" : "text-muted-foreground"}`}>
                        Included capabilities
                      </div>
                    </div>

                    {/* Description */}
                    <p className={`text-sm leading-relaxed mb-5 ${tier.highlight ? "text-white/80" : "text-muted-foreground"}`}>
                      {tier.description}
                    </p>

                    {/* Features */}
                    <ul className="flex flex-col gap-2 mb-6 flex-1">
                      {tier.features.map((f) => (
                        <li key={f} className={`flex items-start gap-2 text-sm ${tier.highlight ? "text-white/85" : "text-slate-700"}`}>
                          <Check className="w-4 h-4 shrink-0 mt-0.5 text-accent" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Button
                      asChild
                      data-testid={`tier-cta-${tier.key}`}
                      className={`w-full gap-2 font-bold rounded-md ${
                        tier.highlight
                          ? "bg-accent hover:bg-accent/90 text-white"
                          : "bg-primary hover:bg-primary/90 text-white"
                      }`}
                    >
                      <a href={`/intake/?mode=quick&tier=${tier.key}`} onClick={() => fireEvent("cta_click", { cta_label: `services_tier_${tier.key ?? "cta"}` })}>
                        {tier.cta} <ArrowRight className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <ExistingWebsiteMarketing />
          </div>
        </section>

        {/* ── What's included in every build ── */}
        <section className="order-3 py-20 bg-[#0E1826]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mb-12">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-accent mb-4">
                Website features
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white leading-tight">
                Which features does your website need?
              </h2>
              <p className="text-lg text-white/70 leading-relaxed mt-4">
                These are features we can build. Essential covers hosting and upkeep. Growth adds local SEO and blog posts. Anything else is confirmed in your quote.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl">
              {alwaysIncluded.map((f) => (
                <div key={f.label} className="flex items-center gap-3 bg-white/[0.06] border border-white/10 rounded-xl p-4 hover:bg-white/[0.09] transition-colors">
                  <div className="w-8 h-8 rounded-md bg-accent/20 flex items-center justify-center shrink-0">
                    <f.icon className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-sm font-medium text-white/85">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Service areas ── */}
        <section className="order-5 py-14 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent mb-2">Where We Work</p>
            <h2 className="text-2xl font-heading font-extrabold text-primary mb-6">
              Web design on the Gulf Coast and nationwide
            </h2>
            <p className="mb-6 max-w-3xl leading-relaxed text-muted-foreground">
              GulfCDD is based in Biloxi and works with businesses across the Mississippi Gulf Coast. New Orleans, Mobile, and other U.S. projects are planned and reviewed remotely.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "New Orleans web design", href: "/service-areas/new-orleans/" },
                { label: "Mobile web design", href: "/service-areas/mobile/" },
                { label: "Remote web design anywhere in the U.S.", href: "/service-areas/remote/" },
                { label: "All service areas", href: "/service-areas/" },
              ].map((a) => (
                <a
                  key={a.href}
                  href={a.href}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-full text-sm text-primary bg-white hover:border-accent/40 hover:shadow-sm transition-all font-medium"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-accent" />
                  {a.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="order-6 relative py-16 bg-primary text-white overflow-hidden">
          <div className="absolute inset-0 opacity-[0.12]" aria-hidden="true">
            <img src="/images/ocean-springs-beach-sunset-optimized.webp" alt="Ocean Springs beach at sunset on the Mississippi Gulf Coast" width={1920} height={1080} loading="lazy" decoding="async" className="w-full h-full object-cover object-center" />
          </div>
          <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-4">
              Not sure which tier is right for you?
            </h2>
            <p className="text-white/75 text-lg mb-8 max-w-lg mx-auto">
              Just tell us about your business. We'll ask a few questions and point you in the right direction. No pressure, no commitment.
            </p>
            <a
              href="/contact/"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold rounded-md px-8 h-12 transition-colors shadow-md text-sm"
              onClick={() => fireEvent("cta_click", { cta_label: "services_start_conversation" })}
            >
              Start the conversation <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <SupportWidget />
    </div>
  );
}
