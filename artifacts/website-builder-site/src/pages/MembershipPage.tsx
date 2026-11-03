import { useSEO } from "@/hooks/useSEO";
import { fireEvent } from "@/lib/analytics";
import { Header } from "@/sections/Header";
import { Membership } from "@/sections/Membership";
import { Footer } from "@/sections/Footer";
import { SupportWidget } from "@/components/SupportWidget";
import { PageHero } from "@/components/PageHero";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function MembershipPage() {
  useSEO({
    title: "Monthly Plans From $150, No Contract | GulfCDD",
    description: "Essential $150/mo covers hosting and upkeep. Growth and Full Service add more help. Every plan includes an analytics report. No contract.",
    canonical: "https://www.gulfcdd.com/membership",
  });
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <PageHero
          title="What's Included in Every Plan"
          subtitle="Essential is $150 a month for hosting and upkeep. Growth is $500 a month, or $250 for founding clients, and adds local SEO and blog posts. Full Service is $1,000 a month, or $500 for founding clients. Every plan includes an analytics report. No contract."
          imageSrc="/images/ocean-springs-downtown.webp"
          imageAlt="Downtown Ocean Springs, Mississippi"
          location="Biloxi, Mississippi"
        />
        <Membership />
        <section className="py-20 bg-white border-t border-slate-200">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <div className="max-w-3xl mb-12">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-accent mb-4">Website care after launch</span>
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-primary leading-tight mb-5">
                What does website maintenance include?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Every plan includes hosting and upkeep on Essential, and a monthly analytics report. Growth adds local SEO and blog posts. Plans are month to month with no contract. Founding clients get the website build free through January 31, 2027.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                ["Routine changes", "Update hours, services, staff details, photos, announcements, and other content without making you edit code."],
                ["Technical care", "Keep hosting, SSL, domain settings, backups, and deployed updates organized so small technical tasks do not become business interruptions."],
                ["Support when plans change", "Ask about a new page, form change, or promotion. We will confirm whether it fits your plan or needs a separate project quote."],
                ["A clear exit", "You keep your domain and content. If you ever move hosting, we explain what needs to move and help make the handoff orderly."],
              ].map(([title, description]) => (
                <div key={title} className="flex gap-4 rounded-xl border border-slate-200 bg-slate-50 p-6">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-heading font-bold text-primary mb-1">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 rounded-xl bg-[#0E1826] text-white p-8 md:p-10">
              <h2 className="text-2xl font-heading font-extrabold mb-3">Is a hosting plan right for your business?</h2>
              <p className="text-white/75 leading-relaxed mb-6 max-w-2xl">
                Essential is the plan if you mainly need the site kept up. Growth is the plan if you also want local SEO and blog posts. Full Service is $1,000 a month, or $500 for founding clients. See the pricing page for the three plans.
              </p>
              <a href="/pricing/" className="inline-flex items-center gap-2 text-accent font-bold hover:text-white transition-colors">
                Compare website packages <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
        <div className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <p className="text-muted-foreground mb-4 text-lg font-medium">Not sure what you're paying for now? Tell us about your current setup and the help you'd like. We'll explain the options and costs.</p>
            <a
              href="/intake/?mode=quick"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold rounded-md px-8 h-12 transition-colors shadow-md"
              onClick={() => fireEvent("cta_click", { cta_label: "membership_get_quote" })}
            >
              Get a Free Quote &rarr;
            </a>
          </div>
        </div>
      </main>
      <Footer />
      <SupportWidget />
    </div>
  );
}
