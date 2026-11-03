import { ClipboardList, ArrowRight } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { Header } from "@/sections/Header";
import { Contact } from "@/sections/Contact";
import { Footer } from "@/sections/Footer";
import { SupportWidget } from "@/components/SupportWidget";
import { PageHero } from "@/components/PageHero";
import { fireEvent } from "@/lib/analytics";
import { QuickContact } from "@/sections/QuickContact";

export default function ContactPage() {
  useSEO({
    title: "Contact Gulf Coast Digital Designs | (228) 278-7782",
    description: "Call (228) 278-7782 any time or send a quick note for a free website or SEO quote. Serving Biloxi, the Coast, New Orleans and Mobile.",
    canonical: "https://www.gulfcdd.com/contact",
    breadcrumbs: [{ name: "Contact", url: "https://www.gulfcdd.com/contact" }],
  });


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <PageHero
          title="Let's Talk About Your Website"
          subtitle="The phone's answered 24/7: (228) 278-7782. Or fill out the form and tell us your business name, where you work, and what's not working. We're based in Biloxi and there's no walk-in office."
          imageSrc="/images/ocean-springs-beach-sunset-optimized.webp"
          imageAlt="Ocean Springs beach at sunset, Mississippi Gulf Coast"
          location="Biloxi, MS"
          compact
        >
          <QuickContact className="mt-6" />
        </PageHero>

        <Contact showQuickLinks={false} />

        <section className="bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-heading font-extrabold text-primary mb-3">What happens next</h2>
              <ol className="list-decimal pl-5 space-y-2 text-muted-foreground leading-relaxed">
                <li>We look at your site and Google listing.</li>
                <li>We call you with what we'd change.</li>
                <li>You pick a plan, or don't. No pressure.</li>
              </ol>
            </div>
            <div>
              <h2 className="text-2xl font-heading font-extrabold text-primary mb-3">Where we're based</h2>
              <p className="text-muted-foreground leading-relaxed">
                Biloxi, Mississippi. We come to you or meet by phone and screen share; there's no walk-in office. The line is answered 24/7 at (228) 278-7782.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white border-t border-slate-200">
          <div className="container mx-auto px-4 md:px-6 py-10 max-w-4xl">
            <a
              href="/intake/?mode=full"
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-5 rounded-2xl border-2 border-slate-200 bg-slate-50 p-6 md:p-7 hover:border-primary hover:shadow-md transition-all"
              onClick={() => fireEvent("cta_click", { cta_label: "contact_full_details" })}
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                  <ClipboardList className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-heading font-extrabold text-primary mb-1">
                    Want to share more detail?
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    If you already know what you want, send your services, feature ideas, logo, and photos through the detailed form.
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-2 text-primary font-bold text-sm whitespace-nowrap group-hover:gap-3 transition-all">
                Share project details <ArrowRight className="w-4 h-4" />
              </span>
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <SupportWidget />
    </div>
  );
}
