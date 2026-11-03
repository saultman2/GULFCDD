import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tiers } from "@/data/plans";
import { fireEvent } from "@/lib/analytics";
import { ExistingWebsiteMarketing } from "@/sections/ExistingWebsiteMarketing";

export function Packages() {
  return (
    <section id="packages" className="py-24 border-y border-slate-200 relative bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-4 leading-tight">
            Which website plan fits your business?
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed font-medium">
             Essential is $150 a month for hosting and upkeep. Growth is $500 a month, or $250 for founding clients, and adds local SEO and blog posts. Full Service is $1,000 a month, or $500 for founding clients. Every plan includes an analytics report. Founding clients get the build free through January 31, 2027. No contract.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {tiers.map((tier) => (
            <div
              key={tier.key}
              data-testid={`tier-card-${tier.key}`}
              className={`relative flex flex-col rounded-xl border overflow-hidden transition-shadow hover:shadow-md ${
                tier.highlight
                  ? "bg-primary border-primary text-white shadow-lg"
                  : "bg-white border-slate-200"
              }`}
            >
              {/* Badge */}
              {tier.badge && (
                <div className={`text-[10px] font-bold uppercase tracking-wider text-center py-1.5 ${
                  tier.highlight ? "bg-accent text-white" : "bg-accent/10 text-accent"
                }`}>
                  {tier.badge}
                </div>
              )}

              <div className="flex flex-col flex-1 p-6">
                {/* Name + tagline */}
                <div className="mb-5">
                  <div className={`text-xl font-heading font-extrabold ${tier.highlight ? "text-white" : "text-primary"}`}>
                    {tier.name}
                  </div>
                  <div className={`text-xs mt-1 font-semibold italic ${tier.highlight ? "text-white/65" : "text-accent"}`}>
                    {tier.tagline}
                  </div>
                </div>

                {/* Tier overview */}
                <div className="mb-5 pb-5 border-b border-current/10">
                  {tier.startingPrice && (
                    <div data-testid={`tier-price-${tier.key}`} className="mb-2">
                      <p className="text-2xl font-heading font-extrabold">{tier.startingPrice}</p>
                      {tier.foundingPrice ? <p className={`mt-1 text-xs ${tier.highlight ? "text-white/75" : "text-muted-foreground"}`}>{tier.foundingPrice}</p> : null}
                      <p className={`mt-1 text-xs ${tier.highlight ? "text-white/75" : "text-muted-foreground"}`}>Monthly. No contract. Analytics report included.</p>
                    </div>
                  )}
                  <div className={`text-sm font-semibold ${tier.highlight ? "text-white/75" : "text-muted-foreground"}`}>
                    Included capabilities
                  </div>
                </div>

                {/* Description */}
                <p className={`text-sm leading-relaxed mb-5 ${tier.highlight ? "text-white/80" : "text-muted-foreground"}`}>
                  {tier.description}
                </p>

                {/* Features */}
                <ul className="flex flex-col gap-2 mb-6 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${tier.highlight ? "text-white/85" : "text-slate-700"}`}>
                      <Check className="w-4 h-4 shrink-0 mt-0.5 text-accent" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  asChild
                  data-testid={`tier-cta-${tier.key}`}
                  className={`w-full gap-2 font-bold rounded-md ${
                    tier.highlight
                      ? "bg-accent hover:bg-accent/90 text-white"
                      : "bg-primary hover:bg-primary/90 text-white"
                  }`}
                >
                  <a href={`/intake/?mode=quick&tier=${tier.key}`} onClick={() => fireEvent("cta_click", { cta_label: `package_${tier.key ?? "cta"}` })}>
                    {tier.cta} <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <ExistingWebsiteMarketing />
      </div>
    </section>
  );
}
