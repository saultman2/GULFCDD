import { ArrowRight, CheckCircle2, Code2, ShoppingCart, FileText, Calendar, Search } from "lucide-react";
import { fireEvent } from "@/lib/analytics";
import { ResponsiveCoastImage } from "@/components/ResponsiveCoastImage";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { SupportWidget } from "@/components/SupportWidget";
import { PageHero } from "@/components/PageHero";
import { nationwideServiceArea } from "@/data/service-regions";
import { useEffect } from "react";
import { useSEO } from "@/hooks/useSEO";
import { ServiceAnswerBlock } from "@/components/ServiceAnswerBlock";
import { ServiceBuyingGuide } from "@/components/ServiceBuyingGuide";

const includes = [
  "Online stores with simple, easy-to-manage checkouts.",
  "Contact and quote request forms with direct email delivery.",
  "Appointment and booking request forms.",
  "Page titles, descriptions, headings, and crawlable links.",
  "Responsive layouts for mobile, tablet, and desktop screens.",
  "Performance-conscious development and pre-launch checks.",
];

const features = [
  { icon: ShoppingCart, title: "Online Stores", desc: "Sell your products or services with a checkout that's simple for you to manage and easy for your customers to use." },
  { icon: FileText, title: "Quote & Contact Forms", desc: "Collect the details you need to respond to an inquiry and send them by email. We confirm the fields, delivery address, and handling with you." },
  { icon: Calendar, title: "Booking & Appointments", desc: "Let customers request an appointment from your site. Requests are not confirmed bookings unless a live calendar or scheduling system is included in the scope." },
  { icon: Search, title: "SEO-Ready from Day One", desc: "Titles, descriptions, headings, and links help explain each page to search engines. These foundations do not guarantee indexing or rankings." },
];

export default function DevelopmentPage() {
  useEffect(() => {
    const id = "ld-service-dev";
    document.getElementById(id)?.remove();
    const s = document.createElement("script");
    s.id = id; s.type = "application/ld+json";
    s.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "Service",
      "name": "Website Development",
      "description": "Websites, online stores, and booking or quote forms for small businesses, with development handled remotely.",
      "provider": { "@id": "https://www.gulfcdd.com/#organization" },
      "areaServed": [nationwideServiceArea],
      "url": "https://www.gulfcdd.com/services/development",
      "serviceType": "Web Development"
    });
    document.head.appendChild(s);
    return () => { document.getElementById(id)?.remove(); };
  }, []);
  useSEO({
    title: "Website Development: Forms, Booking & Online Stores | GulfCDD",
    description: "Quote forms, booking requests, online stores and custom features built by our own team for Gulf Coast businesses.",
    canonical: "https://www.gulfcdd.com/services/development",
    breadcrumbs: [
      { name: "Services", url: "https://www.gulfcdd.com/services" },
      { name: "Website Development", url: "https://www.gulfcdd.com/services/development" },
    ],
  });
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <PageHero
          title="Website Development and Custom Features"
          subtitle="Quote forms, booking requests, online stores, and custom features, built by our own team. See what we build and compare monthly plans."
          imageSrc="/images/ocean-springs-harbor.jpg"
          imageAlt="Ocean Springs harbor, Mississippi Gulf Coast"
          location="Gulf Coast based • Remote development"
        />

        {/* Overview */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-accent mb-4">Website Development</span>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-primary leading-tight mb-6">
              What do you need your website to do?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              GulfCDD builds the working parts of your website: forms, online stores, appointment requests, and connections to other software. Business automation can reduce repetitive steps, but the right setup depends on how your team handles requests and orders today. We'll plan the workflow and test it before launch.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              If you already use a calendar, payment service, or customer management system, let us know. We'll check whether it can connect to the site and what access is needed. See <a href="/what-we-build/" className="text-accent font-semibold hover:underline">what we build</a> and <a href="/pricing/" className="text-accent font-semibold hover:underline">monthly plans</a>.
            </p>
          </div>
        </section>

        {/* What's included */}
        <section className="py-16 bg-[#0E1826]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-accent mb-4">What You Get</span>
              <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white mb-10">Development options for your project</h2>
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
            <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-primary mb-10 max-w-4xl mx-auto">Which tools does your website need?</h2>
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

        <ServiceAnswerBlock
          eyebrow="Practical development"
          title="When does a business need custom website development?"
          answer="Custom development is useful when a standard brochure site is not enough. GulfCDD can connect the customer-facing website to the workflow behind it, whether that means a quote request, appointment intake, online checkout, client portal, or an integration with the tools your business already uses."
          points={["Collect the right details through a quote or intake form", "Accept booking requests without making customers call first", "Sell products or services through a focused checkout", "Connect a website to an internal tool or third-party service"]}
          relatedHref="/services/design/"
          relatedLabel="Pair development with website design"
        />

        <ServiceBuyingGuide service="development" />

        {/* CTA */}
        <section className="relative py-16 bg-primary text-white overflow-hidden">
          <div className="absolute inset-0 opacity-[0.12]" aria-hidden="true">
            <ResponsiveCoastImage src="/images/biloxi-coast-optimized.webp" alt="Biloxi coastline on the Mississippi Gulf Coast" width={640} height={475} loading="lazy" decoding="async" className="w-full h-full object-cover object-center" />
          </div>
          <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-heading font-extrabold mb-4">Let's build something great.</h2>
            <p className="text-white/75 text-lg mb-8 max-w-lg mx-auto">Tell us which features you need and how they should work. We will discuss the scope and prepare a free quote.</p>
            <a href="/intake/?mode=quick" className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold rounded-md px-8 h-12 transition-colors shadow-md text-sm" onClick={() => fireEvent("cta_click", { cta_label: "service_development_get_quote" })}>
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
