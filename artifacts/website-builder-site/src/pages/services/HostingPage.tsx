import { ArrowRight, CheckCircle2, Server, Shield, Globe, RefreshCw } from "lucide-react";
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
  "Domain registration and full management.",
  "Managed cloud hosting.",
  "Free SSL security certificate included.",
  "Uptime monitoring and regular automated backups.",
  "Domain renewal management.",
  "Or we build it ready for your own hosting provider of choice.",
];

const features = [
  { icon: Globe, title: "Domain Management", desc: "We handle domain registration, DNS settings, and renewals, or connect an existing domain. You keep your domain; we confirm the access needed to manage it." },
  { icon: Server, title: "Cloud Hosting", desc: "We deploy your site on cloud infrastructure and monitor availability. Monitoring helps identify issues; it is not a promise of uninterrupted uptime." },
  { icon: Shield, title: "SSL Certificate", desc: "Hosted sites include a free SSL certificate for HTTPS. It encrypts the connection between a visitor's browser and your website; it does not prevent every security risk." },
  { icon: RefreshCw, title: "Flexible Options", desc: "Want to host it yourself? We build the site ready to deploy wherever you choose — we don't lock you in." },
];

export default function HostingPage() {
  useEffect(() => {
    const id = "ld-service-hosting";
    document.getElementById(id)?.remove();
    const s = document.createElement("script");
    s.id = id; s.type = "application/ld+json";
    s.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "Service",
      "name": "Website Hosting",
      "description": "Website hosting, SSL, domain management, monitoring, and backups for small businesses that want help looking after their site.",
      "provider": { "@id": "https://www.gulfcdd.com/#organization" },
      "areaServed": [nationwideServiceArea],
      "url": "https://www.gulfcdd.com/services/hosting",
      "serviceType": "Web Hosting"
    });
    document.head.appendChild(s);
    return () => { document.getElementById(id)?.remove(); };
  }, []);
  useSEO({
    title: "Managed Website Hosting in Biloxi, MS | Gulf Coast Digital Designs",
    description: "Fast, secure hosting with SSL, backups and monitoring, included in every GulfCDD plan. One local number to call when something's off.",
    canonical: "https://www.gulfcdd.com/services/hosting",
    breadcrumbs: [
      { name: "Services", url: "https://www.gulfcdd.com/services" },
      { name: "Website Hosting", url: "https://www.gulfcdd.com/services/hosting" },
    ],
  });
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <PageHero
          title="Website Hosting You Don't Have to Think About"
          subtitle="Hosting and upkeep are part of Essential at $150 a month. Every plan includes an analytics report. Call (228) 278-7782 when something's off."
          imageSrc="/images/gulf-coast-beach-walkers.webp"
          imageAlt="Gulf Coast beach, Mississippi"
          location="Remote hosting and support"
        />

        {/* Overview */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-accent mb-4">Website Hosting</span>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-primary leading-tight mb-6">
              What does managed website hosting cover?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Hosting is what keeps your website available online. Essential is $150 a month for hosting and upkeep, and every plan includes an analytics report. No contract.
            </p>
            <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-primary leading-tight mt-8 mb-3">Hurricane season and your site</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Backups are stored off-site, and the site stays up if your office loses power because it is cloud hosted.
            </p>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [{
                "@type": "Question",
                "name": "Is hosting included?",
                "acceptedAnswer": { "@type": "Answer", "text": "Yes. Essential is $150 a month for hosting and upkeep. Growth and Full Service include that too." },
              }],
            }) }} />
            <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-primary leading-tight mt-8 mb-3">Common questions</h2>
            <h3 className="font-heading font-bold text-primary">Is hosting included?</h3>
            <p className="text-lg text-muted-foreground leading-relaxed mt-2">
              Yes. Essential is $150 a month for hosting and upkeep. Growth and Full Service include that too. See <a href="/pricing/" className="text-accent font-semibold hover:underline">pricing</a> and <a href="/services/maintenance/" className="text-accent font-semibold hover:underline">maintenance</a>.
            </p>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Already have a provider you'd like to keep? Tell us before we build. We can prepare the website for that setup and explain what you'll need to manage yourself.
            </p>
          </div>
        </section>

        {/* What's included */}
        <section className="py-16 bg-[#0E1826]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-accent mb-4">What You Get</span>
              <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white mb-10">What's included</h2>
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
            <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-primary mb-10 max-w-4xl mx-auto">Everything we take off your plate</h2>
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
          eyebrow="Hosting without the hassle"
          title="What should local businesses expect from website hosting?"
          answer="Website hosting makes your site available online. Maintenance covers changes and technical care after launch, so the two are not the same. GulfCDD's hosting options include SSL, uptime monitoring, and backups; design changes and local SEO maintenance require broader coverage. You can also choose your own hosting provider."
          points={["Keep the domain and DNS settings organized", "Serve the site securely over HTTPS", "Have a clear person to contact when something changes", "Move providers later without losing your domain or content"]}
          relatedHref="/membership/"
          relatedLabel="Compare hosting and maintenance plans"
        />

        {/* CTA */}
        <section className="relative py-16 bg-primary text-white overflow-hidden">
          <div className="absolute inset-0 opacity-[0.12]" aria-hidden="true">
            <img src="/images/gulf-coast-beach-walkers.webp" alt="People walking along a Gulf Coast beach" width={1920} height={1080} loading="lazy" decoding="async" className="w-full h-full object-cover object-center" />
          </div>
          <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-heading font-extrabold mb-4">Not sure who handles your hosting?</h2>
            <p className="text-white/75 text-lg mb-8 max-w-lg mx-auto">Send your website address and tell us what you know about the current setup. We can discuss keeping it, moving it, or managing it for you.</p>
            <a href="/intake/?mode=quick" className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold rounded-md px-8 h-12 transition-colors shadow-md text-sm" onClick={() => fireEvent("cta_click", { cta_label: "service_hosting_get_quote" })}>
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
