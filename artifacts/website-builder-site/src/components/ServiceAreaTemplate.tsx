import { ResponsiveCoastImage } from "@/components/ResponsiveCoastImage";
import { MapPin, CheckCircle2, ArrowRight, Palette, Code2, Server, Wrench, Search, Bot } from "lucide-react";
import { fireEvent } from "@/lib/analytics";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { SupportWidget } from "@/components/SupportWidget";
import { PageHero } from "@/components/PageHero";
import { LocalProjectQuestions } from "@/components/LocalProjectQuestions";
import { useSEO } from "@/hooks/useSEO";
import { serviceCities } from "@/data/service-regions";

/** Geographic metadata identifies service areas, not business locations. */
const CITY_GEO: Record<string, { lat: number; lng: number; wikiUrl: string }> = {
  biloxi: {
    lat: 30.3960, lng: -88.8853,
    wikiUrl: "https://en.wikipedia.org/wiki/Biloxi,_Mississippi",
  },
  gulfport: {
    lat: 30.3674, lng: -89.0928,
    wikiUrl: "https://en.wikipedia.org/wiki/Gulfport,_Mississippi",
  },
  "ocean-springs": {
    lat: 30.4068, lng: -88.8270,
    wikiUrl: "https://en.wikipedia.org/wiki/Ocean_Springs,_Mississippi",
  },
  pascagoula: {
    lat: 30.3657, lng: -88.5561,
    wikiUrl: "https://en.wikipedia.org/wiki/Pascagoula,_Mississippi",
  },
  gautier: {
    lat: 30.3771, lng: -88.6878,
    wikiUrl: "https://en.wikipedia.org/wiki/Gautier,_Mississippi",
  },
  diberville: {
    lat: 30.4543, lng: -88.8975,
    wikiUrl: "https://en.wikipedia.org/wiki/D%27Iberville,_Mississippi",
  },
  "long-beach": {
    lat: 30.3499, lng: -89.1531,
    wikiUrl: "https://en.wikipedia.org/wiki/Long_Beach,_Mississippi",
  },
  "bay-st-louis": {
    lat: 30.3085, lng: -89.3298,
    wikiUrl: "https://en.wikipedia.org/wiki/Bay_St._Louis,_Mississippi",
  },
  "new-orleans": {
    lat: 29.9511, lng: -90.0715,
    wikiUrl: "https://en.wikipedia.org/wiki/New_Orleans",
  },
  mobile: {
    lat: 30.6954, lng: -88.0399,
    wikiUrl: "https://en.wikipedia.org/wiki/Mobile,_Alabama",
  },
};

const STATE_NAMES: Record<string, string> = {
  MS: "Mississippi",
  LA: "Louisiana",
  AL: "Alabama",
};

export interface ServiceAreaFaq {
  question: string;
  answer: string;
}

export interface ServiceAreaSection {
  heading: string;
  body: string;
}

export interface ServiceAreaConfig {
  city: string;
  state: string;
  slug: string;
  headline: string;
  subtitle: string;
  intro: string;
  bodyP2: string;
  imageSrc: string;
  imageAlt: string;
  metaTitle: string;
  metaDescription: string;
  canonical: string;
  websiteExamples?: { src: string; alt: string }[];
  relatedLinks?: { label: string; href: string }[];
  /** City-only sections so pages are not copies of each other. */
  sections?: ServiceAreaSection[];
  faqs?: ServiceAreaFaq[];
}

const services = [
  { icon: Palette, title: "Website Design", desc: "Custom layouts that explain your services and make contact details easy to find on phones, tablets, and desktops." },
  { icon: Code2, title: "Website Development", desc: "Contact forms, booking requests, online stores, and custom features planned around how your business works." },
  { icon: Server, title: "Website Hosting", desc: "Managed hosting with SSL, domain support, renewals, and backups. We explain what's included in your plan." },
  { icon: Wrench, title: "Website Maintenance", desc: "Security patches, site updates, and content changes, with ongoing support and update time based on your plan." },
  { icon: Search, title: "Local SEO", desc: "On-page SEO that describes your services and service area clearly for customers and search engines." },
  { icon: Bot, title: "AI Chat & Tools", desc: "Chat widgets and AI-powered features for answering common questions or collecting inquiries, where they fit your project." },
];

const reasons = [
  "We work directly with businesses in this area from our Biloxi base.",
  "A written scope explains the work before a project begins.",
  "You can review the site online before it is published.",
  "Monthly care has no contract; cancel anytime.",
  "You can contact the people doing the work by phone or email.",
  "The page plan is based on your services and actual coverage area.",
];

export function ServiceAreaTemplate({
  city, state, slug, headline, subtitle, intro, bodyP2,
  imageSrc, imageAlt, metaTitle, metaDescription, canonical, websiteExamples, relatedLinks,
  sections, faqs,
}: ServiceAreaConfig) {
  useSEO({
    title: metaTitle,
    description: metaDescription,
    canonical,
    breadcrumbs: [
      { name: "Service Areas", url: "https://www.gulfcdd.com/service-areas" },
      { name: city, url: canonical },
    ],
  });

  // Render the service schema with the page itself so it is present in
  // prerendered HTML. This describes a service area, not a local branch.
  const geo = CITY_GEO[slug];
  const areaServed: Record<string, unknown> = {
      "@type": "City",
      "name": city,
      "containedInPlace": { "@type": "State", "name": STATE_NAMES[state] ?? state },
  };
  if (geo) areaServed["sameAs"] = geo.wikiUrl;
  const serviceSchema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": `Web Design and Local SEO for ${city}, ${STATE_NAMES[state] ?? state} Businesses`,
      "url": canonical,
      "description": metaDescription,
      "areaServed": areaServed,
      "serviceType": ["Web Design", "Web Development", "Website Hosting", "Local SEO", "Website Maintenance", "AI Chat & Tools"],
      "provider": { "@id": "https://www.gulfcdd.com/#organization" },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema).replace(/</g, "\\u003c") }} />
      {faqs && faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqs.map((faq) => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
              })),
            }).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <Header />
      <main>
        {/* Hero */}
        <PageHero
          title={headline}
          subtitle={subtitle}
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          location={`${city}, ${state}`}
        />

        {/* Intro */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-accent mb-4">
              Serving {city}, {state}
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-primary leading-tight mb-6">
              Website services for {city} businesses.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{intro}</p>
            <p className="text-lg text-muted-foreground leading-relaxed mt-4">{bodyP2}</p>
            {sections?.map((section) => (
              <div key={section.heading} className="mt-8">
                <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-primary leading-tight mb-3">
                  {section.heading}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">{section.body}</p>
              </div>
            ))}
            <p className="text-base text-muted-foreground leading-relaxed mt-6">
              <a href="/services/seo/" className="font-semibold text-primary underline underline-offset-4">Local SEO</a>
              {" · "}
              <a href="/services/design/" className="font-semibold text-primary underline underline-offset-4">Website design</a>
              {" · "}
              <a href="/pricing/" className="font-semibold text-primary underline underline-offset-4">Pricing</a>
            </p>
            <LocalProjectQuestions slug={slug} />
            {faqs && faqs.length > 0 && (
              <div className="mt-10">
                <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-primary leading-tight mb-4">
                  Questions about {city}
                </h2>
                <div className="divide-y divide-slate-200">
                  {faqs.map((faq) => (
                    <div key={faq.question} className="py-4">
                      <h3 className="font-heading font-bold text-primary">{faq.question}</h3>
                      <p className="mt-2 text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href="/intake/?mode=quick"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold px-7 py-3.5 rounded-md transition-colors text-sm"
                onClick={() => fireEvent("cta_click", { cta_label: "city_get_free_quote" })}
              >
                Get a Free Quote <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/intake/"
                className="inline-flex items-center gap-2 border border-primary/20 text-primary hover:bg-slate-50 font-bold px-7 py-3.5 rounded-md transition-colors text-sm"
                onClick={() => fireEvent("cta_click", { cta_label: "city_start_project" })}
              >
                Start Your Project <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Services grid */}
        <section className="py-20 bg-[#0E1826]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mb-12">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-accent mb-4">
                What We Offer in {city}
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white leading-tight">
                Need a new site, a better form, or help with updates?
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

        {(websiteExamples?.length || relatedLinks?.length) ? (
          <section className="py-16 bg-slate-50 border-y border-slate-200">
            <div className="container mx-auto px-4 md:px-6 max-w-5xl">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-accent mb-4">
                Website examples &amp; services
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-primary leading-tight mb-4">
                Explore website options for {city} businesses.
              </h2>
              <p className="max-w-3xl text-muted-foreground leading-relaxed mb-8">
                These example screens show ways a service business can explain its work and guide an inquiry. For your project, we plan the pages and features around your own customers and workflow.
              </p>
              {websiteExamples?.length ? (
                <div className="grid md:grid-cols-2 gap-5 mb-8">
                  {websiteExamples.map((example) => (
                    <figure key={example.src} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                      <img
                        src={example.src}
                        alt={example.alt}
                        width={1200}
                        height={676}
                        loading="lazy"
                        decoding="async"
                        className="aspect-[1200/676] w-full object-cover"
                      />
                      <figcaption className="px-4 py-3 text-sm text-slate-600">Website example</figcaption>
                    </figure>
                  ))}
                </div>
              ) : null}
              <div className="flex flex-wrap gap-3">
                {relatedLinks?.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="inline-flex min-h-11 items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-primary hover:border-accent/50 hover:text-accent"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="/what-we-build/"
                  className="inline-flex min-h-11 items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
                >
                  See feature previews
                </a>
              </div>
            </div>
          </section>
        ) : null}

        {/* Why local */}
        <section className="relative py-20 bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 opacity-20" aria-hidden="true">
            <ResponsiveCoastImage src="/images/ocean-springs-harbor.jpg" alt="Ocean Springs harbor and waterfront on the Mississippi Gulf Coast" width={900} height={506} loading="lazy" decoding="async" className="w-full h-full object-cover object-center" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/50" />
          <div className="relative z-10 container mx-auto px-4 md:px-6 max-w-4xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-accent mb-4">
                  Why GulfCDD
                </span>
                <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white leading-tight mb-6">
                  How we work with {city} businesses.
                </h2>
                <p className="text-white/75 leading-relaxed">
                  Gulf Coast Digital Designs is based in Biloxi. We work with businesses in this service area remotely: you discuss the project directly with our team, review a shared preview, and approve the site before it is published.
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

        {/* Service areas nav */}
        <section className="py-14 bg-white border-t border-slate-100">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent mb-4">Also serving</p>
            <div className="flex flex-wrap gap-3">
              {serviceCities
                .filter((area) => area.slug !== slug)
                .map((area) => (
                  <a
                    key={area.slug}
                    href={`/service-areas/${area.slug}/`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-full text-sm text-primary hover:border-accent/40 hover:bg-white transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                    {area.name}, {area.state}
                  </a>
                ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-20 bg-primary text-white overflow-hidden">
          <div className="absolute inset-0 opacity-[0.12]" aria-hidden="true">
            <img src="/images/gulf-coast-beach-walkers.webp" alt="People walking along a Gulf Coast beach at sunset" width={1920} height={1080} loading="lazy" decoding="async" className="w-full h-full object-cover object-center" />
          </div>
          <div className="relative z-10 container mx-auto px-4 md:px-6 max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-4 leading-tight">
              Need a website for your {city} business?
            </h2>
            <p className="text-white/80 mb-8 text-lg leading-relaxed">
              Tell us about your business and where you work. Plans start at $150 a month, with no contract, and founding clients get the build free through January 31, 2027.
            </p>
            <a
              href="/intake/?mode=quick"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold px-9 py-4 rounded-md transition-colors text-base"
              onClick={() => fireEvent("cta_click", { cta_label: "city_cta_bottom" })}
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
