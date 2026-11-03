import { ArrowRight } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { Header } from "@/sections/Header";
import { Packages } from "@/sections/Packages";
import { Process } from "@/sections/Process";
import { Footer } from "@/sections/Footer";
import { SupportWidget } from "@/components/SupportWidget";
import { PageHero } from "@/components/PageHero";
import { fireEvent } from "@/lib/analytics";
import { WebsiteCostGuide } from "@/components/WebsiteCostGuide";

export default function PricingPage() {
  useSEO({
    title: "Website & SEO Plans From $150/mo, No Contract | GulfCDD",
    description:
      "Essential $150/mo, Growth $500/mo, Full Service $1,000/mo. Founding clients: half off and a free build through Jan 31, 2027. No contract.",
    canonical: "https://www.gulfcdd.com/pricing",
    breadcrumbs: [{ name: "Website Plans", url: "https://www.gulfcdd.com/pricing" }],
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main>
        <PageHero
          title="Simple Monthly Plans. No Contract."
          subtitle="Essential $150/mo for hosting and upkeep. Growth $500/mo ($250 founding) adds local SEO and blog posts. Full Service $1,000/mo ($500 founding). Every plan includes an analytics report. Founding clients get the build free through January 31, 2027."
          imageSrc="/images/gulf-coast-beach-walkers.webp"
          imageAlt="Gulf Islands National Seashore beach"
          location="Gulf Coast"
        />
        <Packages />
        <WebsiteCostGuide />
        <Process />
        <section className="bg-[#0E1826] py-16 text-white">
          <div className="container mx-auto max-w-3xl px-4 text-center md:px-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">
              Find your fit
            </p>
            <h2 className="mb-4 text-2xl font-heading font-extrabold md:text-3xl">
              Which plan fits?
            </h2>
            <p className="mb-7 leading-relaxed text-white/75">
              Essential if you mainly need a solid site kept up. Growth if you want to show up more on Google around town. Full Service is the higher monthly plan. Every plan includes an analytics report, and you can cancel anytime.
            </p>
            <a
              href="/contact/"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-accent px-7 text-sm font-bold text-white transition-colors hover:bg-accent/90"
              onClick={() =>
                fireEvent("cta_click", { cta_label: "plans_get_quote" })
              }
            >
              Talk to us <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <SupportWidget />
    </div>
  );
}
