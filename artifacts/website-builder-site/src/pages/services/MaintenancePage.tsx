import { ArrowRight, CheckCircle2, Wrench, FileEdit, ShieldCheck, TrendingUp, MessageSquare } from "lucide-react";
import { fireEvent } from "@/lib/analytics";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { SupportWidget } from "@/components/SupportWidget";
import { PageHero } from "@/components/PageHero";
import { nationwideServiceArea } from "@/data/service-regions";
import { useEffect } from "react";
import { useSEO } from "@/hooks/useSEO";
import { ServiceAnswerBlock } from "@/components/ServiceAnswerBlock";

const includes = [
  "Content updates, with design changes under VIP coverage.",
  "Security patches and software management.",
  "Local SEO maintenance under VIP coverage.",
  "Direct support by email or text.",
  "No contracts. Cancel anytime.",
  "Small updates included within your plan's agreed coverage.",
];

const features = [
  { icon: FileEdit, title: "Content Updates", desc: "New menu? Holiday hours? Just text us. Essential covers hosting and upkeep. Work outside that plan is quoted separately." },
  { icon: ShieldCheck, title: "Security & Software", desc: "Routine software updates and technical checks help address known issues. Maintenance cannot eliminate every security risk." },
  { icon: TrendingUp, title: "Local SEO", desc: "Growth adds local SEO and blog posts. Essential stays with hosting and upkeep. Every plan includes a monthly analytics report." },
  { icon: MessageSquare, title: "Direct Support", desc: "Tell us which page needs a change, what it should say, and whether you have a deadline. We'll check your plan and confirm what's involved before doing the work." },
];

export default function MaintenancePage() {
  useEffect(() => {
    const id = "ld-service-maintenance";
    document.getElementById(id)?.remove();
    const s = document.createElement("script");
    s.id = id; s.type = "application/ld+json";
    s.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "Service",
      "name": "Website Maintenance",
      "description": "Help keeping a small-business website up to date, with content changes, technical checks, and design or local SEO work as agreed in the care plan.",
      "provider": { "@id": "https://www.gulfcdd.com/#organization" },
      "areaServed": [nationwideServiceArea],
      "url": "https://www.gulfcdd.com/services/maintenance",
      "serviceType": "Website Maintenance"
    });
    document.head.appendChild(s);
    return () => { document.getElementById(id)?.remove(); };
  }, []);
  useSEO({
    title: "Website Maintenance & Updates | Gulf Coast Digital Designs",
    description: "Content changes, updates, security and a monthly analytics report. Text or call us when something needs changing.",
    canonical: "https://www.gulfcdd.com/services/maintenance",
    breadcrumbs: [
      { name: "Services", url: "https://www.gulfcdd.com/services" },
      { name: "Website Maintenance", url: "https://www.gulfcdd.com/services/maintenance" },
    ],
  });
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <PageHero
          title="Website Maintenance and Ongoing Support"
          subtitle="New menu? Holiday hours? Just text us. Call (228) 278-7782. Every plan includes an analytics report."
          imageSrc="/images/ocean-springs-beach-sunset-optimized.webp"
          imageAlt="Ocean Springs beach at sunset, Mississippi Gulf Coast"
          location="Remote website care • No contracts"
        />

        {/* Overview */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-accent mb-4">Website Maintenance</span>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-primary leading-tight mb-6">
              What needs attention after your website launches?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Changed your hours or added a service? Send the new details by text or email. GulfCDD offers content updates and routine technical care after launch, so you don't need to edit code to keep basic information current.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Essential is $150 a month for hosting and upkeep. Growth adds local SEO and blog posts. Tell us what you'd like changed. Work outside the plan is quoted separately. See <a href="/services/hosting/" className="text-accent font-semibold hover:underline">hosting</a>, <a href="/pricing/" className="text-accent font-semibold hover:underline">pricing</a>, or <a href="/contact/" className="text-accent font-semibold hover:underline">contact us</a>.
            </p>
          </div>
        </section>

        {/* What's included */}
        <section className="py-16 bg-[#0E1826]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-accent mb-4">Monthly Coverage</span>
              <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white mb-10">Maintenance options and coverage</h2>
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

        {/* Feature breakdown */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-primary mb-10 max-w-4xl mx-auto">What we handle so you don't have to</h2>
            <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {features.map((f) => (
                <div key={f.title} className="flex gap-4 p-6 border border-slate-200 rounded-xl bg-slate-50">
                  <div className="w-11 h-11 rounded-lg bg-primary flex items-center justify-center shrink-0">
                    <f.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-primary mb-1">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* No contracts callout */}
        <section className="py-12 bg-[#0E1826] border-t border-white/10">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-5 py-2 text-sm font-bold text-accent mb-4">
              <Wrench className="w-4 h-4" /> No contracts. Cancel anytime.
            </div>
            <p className="text-muted-foreground text-lg">
              Get monthly support without a contract or minimum commitment. Cancel anytime, with no advance notice required.
            </p>
          </div>
        </section>

        <ServiceAnswerBlock
          eyebrow="Ongoing website care"
          title="What does monthly website maintenance look like?"
          answer="Monthly maintenance covers the updates and technical tasks agreed in your plan. Send the page address, the requested change, and any new text or images by email or text. GulfCDD confirms whether the work fits your coverage or needs a separate quote. Timing depends on the size and complexity of the request."
          points={["Change hours, services, photos, or announcements", "Discuss routine security and software needs", "Choose VIP for ongoing local SEO maintenance", "Confirm coverage before adding pages or new functionality"]}
          relatedHref="/membership/"
          relatedLabel="See ongoing care options"
        />

        {/* CTA */}
        <section className="relative py-16 bg-primary text-white overflow-hidden">
          <div className="absolute inset-0 opacity-[0.12]" aria-hidden="true">
            <img src="/images/ocean-springs-beach-sunset-optimized.webp" alt="Ocean Springs beach at sunset on the Mississippi Gulf Coast" width={1920} height={1080} loading="lazy" decoding="async" className="w-full h-full object-cover object-center" />
          </div>
          <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-heading font-extrabold mb-4">What needs changing on your site?</h2>
            <p className="text-white/75 text-lg mb-8 max-w-lg mx-auto">Send the page link and the change you have in mind. We'll explain whether it fits an ongoing plan or needs a separate quote.</p>
            <a href="/intake/?mode=quick" className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold rounded-md px-8 h-12 transition-colors shadow-md text-sm" onClick={() => fireEvent("cta_click", { cta_label: "service_maintenance_get_quote" })}>
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
