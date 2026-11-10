import { ArrowRight, BarChart3, MapPin, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fireEvent } from "@/lib/analytics";

export function ExistingWebsiteMarketing() {
  return (
    <section
      aria-labelledby="existing-website-marketing-title"
      className="mt-16 overflow-hidden rounded-2xl border border-accent/20 bg-primary text-white shadow-sm"
    >
      <div className="border-b border-white/10 bg-accent/15 px-6 py-3 md:px-8">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
          Already have a website?
        </span>
      </div>

      <div className="grid gap-10 px-6 py-8 md:px-8 md:py-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <h2
            id="existing-website-marketing-title"
            className="max-w-2xl text-2xl font-heading font-extrabold leading-tight md:text-3xl"
          >
            Improve your existing website without starting over.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75">
            Send us the link and tell us what's bothering you. Maybe your
            services have changed, the site is awkward on a phone, or inquiries
            aren't reaching the right person. We'll look at what can be fixed
            before recommending a rebuild.
          </p>
          <p className="mt-4 max-w-2xl text-base font-semibold leading-relaxed text-white/90">
            We'll agree on the changes and cost before starting. Local SEO and
            clearer answers can help people understand your business, but they
            don't guarantee Google rankings, AI recommendations, or new customers.
          </p>
          <Button
            asChild
            className="mt-7 gap-2 bg-accent font-bold text-white hover:bg-accent/90"
          >
            <a
              href="/contact/?service=digital-marketing"
              onClick={() =>
                fireEvent("cta_click", {
                  cta_label: "existing_website_marketing",
                })
              }
            >
              Improve my existing website <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {[
            {
              icon: MapPin,
              title: "Local SEO",
              text: "Review service pages, Google Business Profile details, and local listings.",
            },
            {
              icon: Search,
              title: "GEO & AEO",
              text: "Structure useful answers and consistent business facts for search and AI tools.",
            },
            {
              icon: BarChart3,
              title: "Clear contact paths",
              text: "Review calls to action, forms, and navigation so visitors know how to reach you.",
            },
            {
              icon: Sparkles,
              title: "Current content",
              text: "Update services, hours, and customer information as your business changes.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-4"
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <div>
                <h3 className="text-sm font-heading font-bold">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-white/65">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
