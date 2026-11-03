import { ArrowRight, CheckCircle2, Palette, Monitor, LayoutTemplate, RefreshCw, Smartphone } from "lucide-react";
import { fireEvent } from "@/lib/analytics";
import { useEffect } from "react";
import { useSEO } from "@/hooks/useSEO";
import { ServiceAnswerBlock } from "@/components/ServiceAnswerBlock";
import { ServiceBuyingGuide } from "@/components/ServiceBuyingGuide";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { SupportWidget } from "@/components/SupportWidget";
import { PageHero } from "@/components/PageHero";
import { nationwideServiceArea } from "@/data/service-regions";

const includes = [
  "One-page sites with services, business details, and a contact action.",
  "Full multi-page business sites. Home, services, about, and contact.",
  "Landing pages built for a specific campaign, promotion, or launch.",
  "Redesigns that keep useful pages and improve what isn't working.",
  "Custom design using your branding, services, and business information.",
  "Mobile-friendly layouts reviewed before launch.",
];

const examples = [
  { icon: Monitor, title: "One-Page Sites", desc: "A clean, simple site for businesses that need to look professional online fast. One page, written and built properly." },
  { icon: LayoutTemplate, title: "Full Business Sites", desc: "Home, services, about, and contact. Everything a customer needs to understand what you do and how to reach you." },
  { icon: Smartphone, title: "Landing Pages", desc: "A focused page for an ad, a promotion, or a launch. One clear message and one clear next step." },
  { icon: RefreshCw, title: "Website Redesigns", desc: "Reorganize content, replace an outdated layout, and improve the mobile experience. We agree on what to keep and what to rebuild." },
];

export default function DesignPage() {
  useSEO({
    title: "Small Business Website Design & Redesigns | Biloxi, MS | GulfCDD",
    description: "Mobile-friendly websites that explain what you do, where you work, and how to reach you. Free build for founding clients through Jan 31, 2027.",
    canonical: "https://www.gulfcdd.com/services/design",
    breadcrumbs: [
      { name: "Services", url: "https://www.gulfcdd.com/services" },
      { name: "Website Design", url: "https://www.gulfcdd.com/services/design" },
    ],
  });
  useEffect(() => {
    const id = "ld-service-design";
    document.getElementById(id)?.remove();
    const s = document.createElement("script");
    s.id = id; s.type = "application/ld+json";
    s.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "Service",
      "name": "Website Design",
      "description": "New websites, landing pages, and redesigns for small businesses, with planning and review handled remotely.",
      "provider": { "@id": "https://www.gulfcdd.com/#organization" },
      "areaServed": [nationwideServiceArea],
      "url": "https://www.gulfcdd.com/services/design",
      "serviceType": "Web Design"
    });
    document.head.appendChild(s);
    return () => { document.getElementById(id)?.remove(); };
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <PageHero
          title="Website Design for Small Businesses"
          subtitle="Most visitors decide in a few seconds whether to call or hit back. We build sites that answer what you do, whether you serve their area, and how to reach you."
          imageSrc="/images/ocean-springs-harbor.jpg"
          imageAlt="Ocean Springs harbor, Mississippi Gulf Coast"
          location="Mississippi based • Remote website design"
        />

        {/* Overview */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-accent mb-4">Website Design</span>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-primary leading-tight mb-6">
              What does custom website design cover?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              GulfCDD offers custom web design for small businesses, from our home on the Mississippi Gulf Coast to remote projects across the region. We plan the layout, organize the content, and make it easy to find your services and contact details. You can come to us for a first website, a landing page, or a redesign of the site you already have.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Already have a site? We'll tell you honestly if it needs a redesign or just a better page or two. Founding clients get the build free through January 31, 2027. Plans start at $150 a month with no contract.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mt-4">
              You don't need to travel from New Orleans, Mobile, or anywhere else in the country to plan a website with us. We'll send a preview you can click through, then talk about what you'd like changed. <a href="/service-areas/remote/" className="text-accent font-semibold hover:underline">See how remote projects work</a>.
            </p>
          </div>
        </section>

        {/* What's included */}
        <section className="py-16 bg-[#0E1826]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-accent mb-4">What You Get</span>
              <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white mb-10">Design options for your project</h2>
              <ul className="grid sm:grid-cols-2 gap-4">
                {includes.map((item) => (
                  <li key={item} className="flex items-start gap-3 bg-white/[0.06] border border-white/10 rounded-xl p-5 hover:bg-white/[0.09] transition-colors">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0 text-accent" />
                    <span className="text-sm font-medium text-white/85">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Types of sites */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-primary mb-10 max-w-4xl mx-auto">Types of sites we design</h2>
            <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {examples.map((e) => (
                <div key={e.title} className="flex gap-4 p-6 border border-slate-200 rounded-xl bg-slate-50">
                  <div className="w-11 h-11 rounded-lg bg-primary flex items-center justify-center shrink-0">
                    <e.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-primary mb-1">{e.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{e.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ServiceAnswerBlock
          eyebrow="How design works"
          title="What makes a business website feel trustworthy?"
          answer="A useful business website explains what you do, who you serve, where you work, and how customers can contact you. GulfCDD pairs that information with a custom visual direction and clear navigation. Use real project images, accurate service details, and verified customer feedback rather than unsupported claims."
          points={["Explain your services in plain language", "Make phone, quote, and booking actions easy to find", "Show local context for Biloxi, Ocean Springs, Gulfport, Pascagoula, or your service area", "Give visitors a clear next step on mobile and desktop"]}
          relatedHref="/what-we-build/"
          relatedLabel="See what we build"
        />

        <div className="container mx-auto px-4 md:px-6">
          <p className="mx-auto mt-8 max-w-4xl text-sm leading-relaxed text-muted-foreground">
            Planning a site for an Ocean Springs business? See our{" "}
            <a href="/service-areas/ocean-springs/" className="font-semibold text-accent hover:underline">
              web design and local SEO information for Ocean Springs, MS
            </a>
            , including examples of what shops, restaurants, and service companies may need.
          </p>
        </div>

        <ServiceBuyingGuide service="design" />

        {/* CTA */}
        <section className="relative py-16 bg-primary text-white overflow-hidden">
          <div className="absolute inset-0 opacity-[0.12]" aria-hidden="true">
            <img src="/images/ocean-springs-beach-sunset-optimized.webp" alt="Ocean Springs beach at sunset on the Mississippi Gulf Coast" width={1920} height={1080} loading="lazy" decoding="async" className="w-full h-full object-cover object-center" />
          </div>
          <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-heading font-extrabold mb-4">Ready to get started?</h2>
            <p className="text-white/75 text-lg mb-8 max-w-lg mx-auto">Have a current site, a few photos, or just an idea? Send what you have. We'll talk through the options and give you a free quote.</p>
            <a href="/intake/?mode=quick" className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold rounded-md px-8 h-12 transition-colors shadow-md text-sm" onClick={() => fireEvent("cta_click", { cta_label: "service_design_get_quote" })}>
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
