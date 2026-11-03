import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getGetCampaignConfigQueryKey, useGetCampaignConfig } from "@workspace/api-client-react";
import { ArrowRight, Check, ChevronDown, Shield } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { CampaignShell, AnalyticsConsentBar } from "@/campaign/CampaignShell";
import { ApplicationForm } from "@/campaign/ApplicationForm";
import { captureAttribution, money, trackCampaign, type CampaignConfig, type CampaignPlan } from "@/campaign/lib";

const injectedConfig = (): CampaignConfig | undefined =>
  typeof window !== "undefined" ? (window as Window & { __GULFCDD_CAMPAIGN_CONFIG__?: CampaignConfig }).__GULFCDD_CAMPAIGN_CONFIG__ : undefined;
const qc = new QueryClient({ defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } } });
const fmtDate = (s: string) => { const d = new Date(s); return isNaN(+d) ? s : d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }); };

function rateLine(plan: CampaignPlan) {
  if (plan.regularPrice && plan.regularPrice !== plan.price) {
    return `Founding rate. Regular price ${money(plan.regularPrice)}/month.`;
  }
  return "Monthly. No contract. Analytics report included.";
}

function Landing() {
  useSEO({
    title: "Free Website Build for Small Businesses | GulfCDD",
    description: "Approved small businesses get a custom website with $0 upfront design fee when they join a GulfCDD monthly plan, from $150/month. Apply in about three minutes.",
    canonical: "https://www.gulfcdd.com/free-website/",
  });
  const injected = injectedConfig();
  const { data, isLoading: apiLoading } = useGetCampaignConfig({ query: { queryKey: getGetCampaignConfigQueryKey(), ...(injected ? { placeholderData: injected as never } : {}) } });
  const cfg = (data as unknown as CampaignConfig | undefined) ?? injected;
  const isLoading = !cfg && apiLoading;
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  useEffect(() => { captureAttribution(); trackCampaign("landing_view"); }, []);
  const minPrice = cfg?.plans?.length ? Math.min(...cfg.plans.map((p) => p.price)) : null;

  return (
    <CampaignShell>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="relative mx-auto max-w-6xl px-5 pt-14 pb-16 md:pt-20 md:pb-24">
          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.04] text-white" data-testid="text-headline">
            {cfg?.headline ?? "Get a Professional Website Built for FREE."}
          </h1>
          <p className="mt-5 text-lg text-white/80 max-w-xl">{cfg?.intro}</p>
          <p className="mt-4 text-white/60 max-w-xl text-[15px]">We're Gulf Coast Digital Designs, based in Biloxi. Founding clients get the website build free through January 31, 2027.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#apply" className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3.5 font-semibold text-white hover:bg-accent/90" data-testid="link-apply-hero">Apply for Your Free Website <ArrowRight className="h-4 w-4" /></a>
            <a href="#plans" className="inline-flex items-center rounded-md px-4 py-3.5 font-semibold text-white/75 hover:text-white" data-testid="link-see-plans">Compare plans</a>
          </div>
          <p className="mt-6 text-xs text-white/50 max-w-xl border-l-2 border-accent/60 pl-3" data-testid="text-disclosure">
            Free website design with an approved monthly service plan. {minPrice !== null ? `Founding plans start at ${money(minPrice)}/month. ` : ""}Essential is $150/month. Growth is $500/month, or $250 founding. Full Service is $1,000/month, or $500 founding. Every plan includes an analytics report. No contract.{cfg?.deadline ? ` Apply by ${fmtDate(cfg.deadline)}.` : ""}
          </p>
        </div>
      </section>

      <section id="plans" className="scroll-mt-20 border-y border-white/10 bg-[hsl(0_0%_7%)]">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-white">Pick the monthly plan that fits. The build is on us.</h2>
          <p className="mt-3 text-white/60 max-w-2xl">The price on the card is the founding rate through January 31, 2027. Your first monthly payment is due only after you approve the completed website and it has been published.</p>
          {isLoading ? <div className="mt-10 h-80 rounded-lg bg-white/5 animate-pulse" /> : (
            <div className="mt-10 grid lg:grid-cols-3 gap-4">
              {(cfg?.plans ?? []).map((p, i) => (
                <div key={p.id} className={`rounded-lg border p-6 flex flex-col ${i === 1 ? "border-accent/60 bg-[hsl(0_0%_9%)]" : "border-white/12 bg-[hsl(0_0%_8%)]"}`} data-testid={`card-plan-${p.id}`}>
                  <h3 className="text-lg font-bold text-white">{p.name}</h3>
                  <p className="mt-3"><span className="text-4xl font-extrabold text-white">{money(p.price)}</span><span className="text-white/55">/month founding</span></p>
                  <p className="text-xs text-white/50 mt-1">{rateLine(p)}</p>
                  <ul className="mt-5 space-y-2.5 text-sm flex-1">{p.features.map((f) => <li key={f} className="flex gap-2 text-white/80"><Check className="h-4 w-4 mt-0.5 shrink-0 text-[#ff6579]" />{f}</li>)}</ul>
                  <a href="#apply" className="mt-6 inline-flex justify-center rounded-md border border-white/20 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/5" data-testid={`link-plan-apply-${p.id}`}>Apply with {p.name}</a>
                </div>
              ))}
            </div>
          )}
          <div className="mt-8 rounded-lg border border-white/12 p-5 md:p-6 grid md:grid-cols-[auto_1fr] gap-4">
            <Shield className="h-6 w-6 text-[#ff6579]" />
            <div className="text-sm text-white/75 space-y-2">
              <p className="font-semibold text-white">Website ownership, in plain words</p>
              {cfg?.ownershipTerms ? <p data-testid="text-ownership">{cfg.ownershipTerms}</p> : null}
            </div>
          </div>
        </div>
      </section>

      <section id="apply" className="scroll-mt-20 mx-auto max-w-6xl px-5 py-20 grid lg:grid-cols-[0.75fr_1.25fr] gap-10 items-start">
        <div>
          <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-white">Tell us about your business.</h2>
          <p className="mt-4 text-white/65">Three short steps, no payment to apply.</p>
          {cfg?.deadline && <p className="mt-4 text-sm text-white/80">Applications close {fmtDate(cfg.deadline)}.</p>}
          <div className="mt-6"><AnalyticsConsentBar /></div>
        </div>
        {isLoading ? <div className="h-[520px] rounded-xl bg-white/5 animate-pulse" /> : <ApplicationForm plans={cfg?.plans ?? []} />}
      </section>

      <section className="border-t border-white/10 bg-[hsl(0_0%_7%)]">
        <div className="mx-auto max-w-3xl px-5 py-20">
          <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-white">Straight answers.</h2>
          <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
            {(cfg?.faqs ?? []).map((f, i) => (
              <div key={f.question}>
                <button className="w-full flex items-center justify-between gap-4 py-5 text-left font-semibold text-white" aria-expanded={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)} data-testid={`button-faq-${i}`}>
                  {f.question}<ChevronDown className={`h-5 w-5 shrink-0 text-white/50 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && <p className="pb-5 -mt-1 text-white/70">{f.answer}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </CampaignShell>
  );
}

export default function FreeWebsiteLanding() {
  return <QueryClientProvider client={qc}><Landing /></QueryClientProvider>;
}
