import { useEffect } from "react";
import { ArrowRight, CheckCircle2, Globe2, MessageCircle, MonitorCheck } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { nationwideServiceArea } from "@/data/service-regions";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { SupportWidget } from "@/components/SupportWidget";
import { PageHero } from "@/components/PageHero";

const steps = [
  {
    number: "01",
    title: "Tell us what you need",
    text: "Share your current website, the work you do, and what you want customers to do next.",
  },
  {
    number: "02",
    title: "Review a clear project plan",
    text: "We discuss the pages, features, content, and support that fit your goals before work begins.",
  },
  {
    number: "03",
    title: "Review the site online",
    text: "We send a working preview, gather your feedback, and make the agreed revisions remotely.",
  },
  {
    number: "04",
    title: "Approve before launch",
    text: "You review the finished site before it goes live. Ongoing hosting or care is explained separately in your quote.",
  },
];

const projectTypes = [
  "A new website for a small business",
  "A redesign that keeps useful pages and improves the rest",
  "Local SEO and clearer service-area information",
  "Website maintenance, hosting, or custom integrations",
];

export default function RemoteServiceAreaPage() {
  useSEO({
    title: "Nationwide Remote Web Design for U.S. Businesses | GulfCDD",
    description: "GulfCDD builds and improves small-business websites remotely anywhere in the United States. Plan, review, and launch online with our Biloxi-based team.",
    canonical: "https://www.gulfcdd.com/service-areas/remote",
    breadcrumbs: [
      { name: "Service Areas", url: "https://www.gulfcdd.com/service-areas" },
      { name: "Remote Nationwide", url: "https://www.gulfcdd.com/service-areas/remote" },
    ],
  });

  useEffect(() => {
    const id = "ld-service-remote";
    document.getElementById(id)?.remove();
    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Remote Website Design and Development",
      description: "Remote website planning, design, development, and support for businesses anywhere in the United States.",
      provider: { "@id": "https://www.gulfcdd.com/#organization" },
      areaServed: nationwideServiceArea,
      url: "https://www.gulfcdd.com/service-areas/remote/",
      serviceType: ["Web Design", "Website Development", "Website Redesign", "Local SEO"],
    });
    document.head.appendChild(script);
    return () => document.getElementById(id)?.remove();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <PageHero
          title="Remote web design for businesses anywhere in the United States"
          subtitle="Based in Biloxi, Mississippi, GulfCDD plans, builds, and improves small-business websites remotely. You can work with us without traveling to our office."
          imageSrc="/images/gulf-coast-beach-walkers.webp"
          imageAlt="Gulf Coast shoreline at sunset"
          location="Biloxi based • Nationwide remote projects"
        />

        <section className="bg-white py-16 md:py-20">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.18em] text-accent">A straightforward remote process</span>
              <h2 className="mb-5 font-heading text-3xl font-extrabold leading-tight text-primary md:text-4xl">
                Plan, review, and launch from wherever you are
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Most of the work happens through calls, email, and online previews. We get to know your business, agree on what the site needs to do, then share progress for your review.
              </p>
            </div>
            <ol className="grid gap-5 md:grid-cols-2">
              {steps.map((step) => (
                <li key={step.number} className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                  <span className="mb-4 block text-sm font-extrabold tracking-widest text-accent">{step.number}</span>
                  <h3 className="mb-2 font-heading text-xl font-bold text-primary">{step.title}</h3>
                  <p className="leading-relaxed text-muted-foreground">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-[#0E1826] py-16 md:py-20">
          <div className="container mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-2 md:px-6">
            <div>
              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.18em] text-accent">What we can work on</span>
              <h2 className="mb-5 font-heading text-3xl font-extrabold leading-tight text-white">
                Start with the work your business needs
              </h2>
              <ul className="space-y-4">
                {projectTypes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/80">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-7 md:p-8">
              <Globe2 className="mb-5 h-8 w-8 text-accent" aria-hidden="true" />
              <h3 className="mb-3 font-heading text-2xl font-bold text-white">Local SEO should reflect your real footprint</h3>
              <p className="leading-relaxed text-white/70">
                Remote service doesn't make every city a local office. We use the business location and service coverage you can verify, and organize the site around the customers you actually serve. No search ranking or AI recommendation is guaranteed.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="/service-areas/new-orleans/" className="text-sm font-semibold text-white underline decoration-accent underline-offset-4 hover:text-accent">New Orleans projects</a>
                <a href="/service-areas/mobile/" className="text-sm font-semibold text-white underline decoration-accent underline-offset-4 hover:text-accent">Mobile projects</a>
                <a href="/service-areas/" className="text-sm font-semibold text-white underline decoration-accent underline-offset-4 hover:text-accent">Gulf Coast cities</a>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-7 md:p-8">
                <MonitorCheck className="mb-4 h-8 w-8 text-accent" aria-hidden="true" />
                <h2 className="mb-3 font-heading text-2xl font-extrabold text-primary">Can I review the website before it launches?</h2>
                <p className="leading-relaxed text-muted-foreground">
                  Yes. We share a preview so you can review the pages and agreed features online. Your quote and project terms explain the scope, revisions, and launch steps.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-7 md:p-8">
                <MessageCircle className="mb-4 h-8 w-8 text-accent" aria-hidden="true" />
                <h2 className="mb-3 font-heading text-2xl font-extrabold text-primary">How do we get started?</h2>
                <p className="leading-relaxed text-muted-foreground">
                  Send us your website, if you have one, and a short description of what you want to improve. We can follow up by phone, text, email, or a video call.
                </p>
                <a href="/intake/" className="mt-5 inline-flex items-center gap-2 font-bold text-accent hover:underline">
                  Request a project quote <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <SupportWidget />
    </div>
  );
}
