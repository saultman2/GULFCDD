import { motion } from "framer-motion";
import { Check, X, AlertTriangle, ArrowRight, Shield, DollarSign } from "lucide-react";
import { fireEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";

const features = [
  "Hosting and upkeep",
  "Monthly analytics report",
  "Local SEO",
  "Blog posts",
  "Month to month, no contract",
];

const tiers = [
  {
    name: "Full Service",
    tag: "$1,000 a month, $500 founding",
    desc: "Full Service is $1,000 a month, or $500 a month for founding clients. It includes a monthly analytics report. Month to month, no contract.",
    type: "standard" as const,
    ownCosts: [],
    covered: [false, true, false, false, true],
    warning: null,
    highlight: false,
    recommended: false,
    cta: null,
  },
  {
    name: "Essential",
    tag: "$150 a month",
    desc: "Hosting and upkeep, plus a monthly analytics report. Month to month, no contract.",
    type: "standard" as const,
    ownCosts: [],
    covered: [true, true, false, false, true],
    warning: "Local SEO and blog posts are on Growth, not Essential.",
    highlight: false,
    recommended: false,
    cta: "/pricing/",
  },
  {
    name: "Growth",
    tag: "$500 a month, $250 founding",
    desc: "Everything in Essential, plus local SEO and blog posts. Founding clients get the website build free through January 31, 2027.",
    type: "vip" as const,
    ownCosts: [],
    covered: [true, true, true, true, true],
    warning: null,
    highlight: true,
    recommended: true,
    cta: "/pricing/",
  },
];

export function Membership() {
  return (
    <section id="membership" className="py-24 relative overflow-hidden bg-slate-50/50">
      <div className="absolute top-1/3 right-[-10%] w-[480px] h-[480px] rounded-full bg-accent/5 blur-[150px] -z-10" />
      <div className="container mx-auto px-4 md:px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.35 }}
          style={{ willChange: 'transform' }}
          className="max-w-3xl mb-14"
        >
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-5 leading-tight">
            Hosting only, or ongoing website care?
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed font-medium">
            Hosting makes your website available online. Maintenance covers
            changes and technical care after launch. Compare self-managed
            hosting with Essential, or add local SEO and blog posts on Growth. Full Service is $1,000 a month, or $500 for founding clients.
          </p>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Every plan includes a monthly analytics report. Founding clients get the website build free through January 31, 2027. No contract. Cancel anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              style={{ willChange: 'transform' }}
              className={`relative rounded-xl border flex flex-col shadow-sm ${
                tier.highlight
                  ? "bg-primary border-primary shadow-xl shadow-primary/10"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              {tier.recommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 bg-accent text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap shadow-md">
                    <Shield className="w-3 h-3" /> Recommended
                  </span>
                </div>
              )}

              {/* Header */}
              <div className={`p-6 pb-4 border-b ${tier.highlight ? "border-white/10" : "border-slate-100"}`}>
                <div className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${tier.highlight ? "text-white/60" : "text-primary/60"}`}>
                  {tier.tag}
                </div>
                <h3 className={`text-xl font-heading font-bold mb-3 ${tier.highlight ? "text-white" : "text-primary"}`}>
                  {tier.name}
                </h3>
                <p className={`text-sm leading-relaxed font-medium ${tier.highlight ? "text-white/80" : "text-muted-foreground"}`}>
                  {tier.desc}
                </p>
              </div>

              {/* Feature list */}
              <div className="p-6 flex-1 flex flex-col gap-3 bg-opacity-50">
                  <>
                    <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${tier.highlight ? "text-white/60" : "text-primary/60"}`}>
                      What is covered
                    </div>
                    {features.map((feature, fi) => {
                      const included = tier.covered[fi];
                      return (
                        <div key={feature} className="flex items-start gap-2.5 text-sm font-medium">
                          {included ? (
                            <Check className={`w-4 h-4 mt-0.5 shrink-0 ${tier.highlight ? "text-accent" : "text-accent"}`} />
                          ) : (
                            <X className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground/30" />
                          )}
                          <span className={
                            included
                              ? tier.highlight ? "text-white/90" : "text-foreground"
                              : "text-muted-foreground/50 line-through decoration-muted-foreground/25"
                          }>
                            {feature}
                          </span>
                        </div>
                      );
                    })}
                  </>

                {tier.warning && (
                  <div className={`mt-3 flex items-start gap-2.5 rounded-lg p-3 text-xs leading-relaxed font-medium ${
                    "bg-amber-50 border border-amber-100 text-amber-700"
                  }`}>
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                    {tier.warning}
                  </div>
                )}

                {tier.cta && (
                  <div className="mt-auto pt-6">
                    <Button
                      asChild
                      className={`w-full rounded-md h-12 font-bold text-[15px] ${
                        tier.highlight
                          ? "bg-accent text-white hover:bg-accent/90"
                          : "bg-accent text-white hover:bg-accent/90 shadow-sm"
                      }`}
                    >
                      <a href="/intake/?mode=quick" data-testid="membership-cta" onClick={() => fireEvent("cta_click", { cta_label: "membership_tier_get_quote" })}>
                        Get a Free Quote <ArrowRight className="ml-2 w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
