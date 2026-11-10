import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { fireEvent } from "@/lib/analytics";

/** Reusable promo strip pointing to the free-website campaign. */
export function FreeWebsiteCTA({ location = "home" }: { location?: string }) {
  return (
    <section className="border-y border-white/10 bg-[hsl(0_0%_7%)]">
      <div className="mx-auto max-w-6xl px-5 py-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff6579]">Limited promotion</p>
          <h2 className="mt-2 text-2xl md:text-3xl font-extrabold text-white">$0 upfront website design for approved small businesses.</h2>
          <p className="mt-2 text-sm text-white/60">With a monthly plan from $150/month. No payment until you approve the completed website and it is published. Approval required. Own the custom website after six consecutive paid subscription months; cancel earlier and forfeit ownership.</p>
        </div>
        <Link href="/free-website/" onClick={() => fireEvent("campaign_promo_click", { location })} className="group shrink-0 inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 font-semibold text-white hover:bg-accent/90" data-testid={`link-free-website-${location}`}>
          See if you qualify <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
