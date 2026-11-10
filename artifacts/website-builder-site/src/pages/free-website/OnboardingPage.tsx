import { useEffect, useRef, useState } from "react";
import { useParams } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { acceptCampaignOnboarding, getGetCampaignOnboardingQueryKey, useGetCampaignOnboarding } from "@workspace/api-client-react";
import { Check, Loader2, Lock, RotateCw } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { CampaignShell } from "@/campaign/CampaignShell";
import { errMessage, errStatus, money, type OnboardingDoc } from "@/campaign/lib";

const qc = new QueryClient({ defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } } });

function Onboarding() {
  const { token = "" } = useParams<{ token: string }>();
  useSEO({ title: "Your Website Agreement | GulfCDD", description: "Private website agreement and project-status page.", noindex: true });
  const client = useQueryClient();
  const q = useGetCampaignOnboarding(token);
  const doc = q.data as unknown as OnboardingDoc | undefined;
  const [accepted, setAccepted] = useState(false);
  const [signature, setSignature] = useState("");
  const [busy, setBusy] = useState<"" | "accept" | "checkout" | "verify">("");
  const [err, setErr] = useState("");
  const [verifyMsg, setVerifyMsg] = useState("");
  const verified = useRef(false);

  useEffect(() => {
    if (verified.current || !token) return;
    const p = new URLSearchParams(window.location.search);
    const sid = p.get("session_id");
    if (p.get("paid") !== "1" || !sid) return;
    verified.current = true;
    setBusy("verify");
    acceptCampaignOnboarding(token, { action: "verify_payment", sessionId: sid })
      .then(() => { setVerifyMsg(""); return client.invalidateQueries({ queryKey: getGetCampaignOnboardingQueryKey(token) }); })
      .catch((e) => setVerifyMsg(`We couldn't confirm the payment yet: ${errMessage(e)}`))
      .finally(() => { setBusy(""); window.history.replaceState(null, "", window.location.pathname); });
  }, [token, client]);

  async function accept() {
    if (!accepted || signature.trim().length < 2) { setErr("Check the box and type your full name to sign."); return; }
    setBusy("accept"); setErr("");
    try {
      await acceptCampaignOnboarding(token, { action: "accept", accepted: true, signature: signature.trim() });
      await client.invalidateQueries({ queryKey: getGetCampaignOnboardingQueryKey(token) });
    } catch (e) { setErr(errMessage(e)); } finally { setBusy(""); }
  }
  async function checkout() {
    setBusy("checkout"); setErr("");
    try {
      const r = (await acceptCampaignOnboarding(token, { action: "checkout" })) as { url?: string };
      if (!r.url) throw new Error("Checkout is not available right now.");
      window.location.assign(r.url);
    } catch (e) { setErr(errMessage(e)); setBusy(""); }
  }

  if (q.isLoading) return <div className="mx-auto max-w-3xl px-5 py-20 space-y-4">{[0, 1, 2].map((i) => <div key={i} className="h-28 rounded-lg bg-white/5 animate-pulse" />)}</div>;
  if (q.isError || !doc) {
    const s = errStatus(q.error);
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <Lock className="h-8 w-8 mx-auto text-[#ff6579]" />
        <h1 className="mt-4 text-3xl font-extrabold text-white">{s === 404 || s === 410 ? "This link has expired or isn't valid." : "We couldn't load your agreement."}</h1>
        <p className="mt-3 text-white/65">Private links stay active for 30 days. Call (228) 278-7782 or email aultman@gulfcoastdigitaldesign.com and we'll send a fresh one.</p>
        {s !== 404 && s !== 410 && <button onClick={() => q.refetch()} className="mt-6 inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 text-white hover:bg-white/5" data-testid="button-retry-onboarding"><RotateCw className="h-4 w-4" /> Try again</button>}
      </div>
    );
  }

  const paid = doc.paymentStatus === "active";
  const billingAttention = ["past_due", "unpaid", "paused", "canceled", "incomplete", "incomplete_expired"].includes(doc.paymentStatus ?? "");
  const sitePublished = doc.status === "website_launched" || doc.status === "active_monthly_client";
  const step = !doc.agreementAcceptedAt ? 1 : paid ? 4 : sitePublished ? 3 : 2;

  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff6579]">Private · {doc.businessName}</p>
      <h1 className="mt-3 text-3xl md:text-4xl font-extrabold text-white">Your website agreement</h1>
      <ol className="mt-6 flex gap-2 text-xs">
        {["Review & sign", "We build", "Approve & publish", "Start monthly plan"].map((l, i) => (
          <li key={l} className={`flex-1 rounded-md border px-3 py-2 ${step > i + 1 ? "border-accent/50 text-white" : step === i + 1 ? "border-white/40 text-white" : "border-white/10 text-white/40"}`}>
            {step > i + 1 && <Check className="inline h-3.5 w-3.5 mr-1 text-[#ff6579]" />}{l}
          </li>
        ))}
      </ol>

      <section className="mt-8 rounded-lg border border-white/12 bg-[hsl(0_0%_8%)] divide-y divide-white/10">
        <div className="p-5 grid sm:grid-cols-2 gap-4">
          <div><p className="text-xs text-white/50">Plan</p><p className="font-semibold text-white capitalize" data-testid="text-plan">{doc.plan}</p></div>
          <div><p className="text-xs text-white/50">Monthly price</p><p className="font-semibold text-white" data-testid="text-price">{money(doc.price)}/month · $0 upfront design fee</p></div>
        </div>
        <div className="p-5"><p className="text-xs text-white/50 mb-2">Agreed scope</p><p className="text-white/85 whitespace-pre-line" data-testid="text-scope">{doc.scope}</p></div>
        <div className="p-5 text-sm text-white/75 space-y-2">
          <p className="text-xs text-white/50">Ownership terms</p>
          <p>{doc.ownershipTerms}</p>
          <p className="text-white/55">No payment is collected until you approve the completed website and it has been published.</p>
        </div>
      </section>

      {doc.agreement && (
        <section className="mt-6">
          <p className="text-xs text-white/50 mb-2">Full agreement</p>
          <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg border border-white/12 bg-[hsl(0_0%_6%)] p-5 font-sans text-sm leading-relaxed text-white/80" tabIndex={0} data-testid="text-agreement">{doc.agreement}</pre>
        </section>
      )}

      {busy === "verify" && <p className="mt-6 flex items-center gap-2 text-white/75"><Loader2 className="h-4 w-4 animate-spin" /> Confirming your payment with our processor...</p>}
      {verifyMsg && <p className="mt-6 rounded-md border border-accent/40 bg-accent/10 p-3 text-sm text-white" role="alert">{verifyMsg}</p>}

      {step === 1 && (
        <section className="mt-8 space-y-4">
          <label className="flex gap-3 items-start text-sm text-white/85">
            <input type="checkbox" className="mt-1 accent-[hsl(353_78%_48%)]" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} data-testid="checkbox-accept" />
            I have read and agree to the full agreement, scope, monthly price, and ownership terms above, and the GulfCDD <a href="/terms/" target="_blank" rel="noreferrer" className="underline">terms of service</a>.
          </label>
          <div className="space-y-1.5">
            <label htmlFor="sig" className="text-sm font-semibold text-white/90">Type your full name to sign</label>
            <input id="sig" value={signature} maxLength={160} onChange={(e) => setSignature(e.target.value)} className="w-full rounded-md border border-white/15 bg-[hsl(0_0%_6%)] px-3.5 py-2.5 text-white italic focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25" data-testid="input-signature" />
          </div>
          <button onClick={accept} disabled={!!busy} className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-semibold text-white hover:bg-accent/90 disabled:opacity-60" data-testid="button-accept">
            {busy === "accept" && <Loader2 className="h-4 w-4 animate-spin" />} Sign agreement
          </button>
        </section>
      )}
      {step === 2 && !billingAttention && (
        <section className="mt-8 space-y-3">
          <p className="text-white/75">Signed {new Date(doc.agreementAcceptedAt!).toLocaleString()}. We can now begin building your website. There is no payment due during the build.</p>
          <p className="text-sm text-white/55">Once you approve the completed website and it has been published, return to this private page to activate your monthly plan.</p>
        </section>
      )}
      {step === 3 && !billingAttention && (
        <section className="mt-8 space-y-3">
          <p className="text-white/75">Your website has been approved and published. You can now activate the monthly plan you selected.</p>
          <button onClick={checkout} disabled={!!busy || doc.checkoutAvailable === false} className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-semibold text-white hover:bg-accent/90 disabled:opacity-60" data-testid="button-checkout">
            {busy === "checkout" && <Loader2 className="h-4 w-4 animate-spin" />} Start monthly plan · {money(doc.price)}/month
          </button>
        </section>
      )}
      {billingAttention && (
        <section className="mt-6 rounded-lg border border-accent/40 p-5 text-white/80" role="status">
          <h2 className="font-semibold text-white">Your subscription needs attention</h2>
          <p className="mt-2">Current status: {doc.paymentStatus}. Contact GulfCDD before making another payment.</p>
          <p className="mt-2">{doc.ownershipEligible ? "Your website ownership condition has been met." : "Cancelling before six consecutive paid service months forfeits ownership of the custom website."}</p>
          <a className="mt-3 inline-block underline" href="mailto:aultman@gulfcoastdigitaldesign.com">Email GulfCDD</a>
        </section>
      )}
      {step === 4 && (
        <section className="mt-8 rounded-lg border border-accent/40 p-5 text-white/85" data-testid="status-paid">
          <p className="font-semibold text-white">Monthly plan active.</p>
          <p className="mt-1 text-sm">Paid service months: {doc.paidMonths ?? 0}. Ownership transfers after six fully elapsed consecutive paid months.{doc.ownershipEligible ? " You're eligible for website ownership transfer." : ""}</p>
        </section>
      )}
      {err && <p className="mt-4 text-sm text-[#ff6579]" role="alert" data-testid="text-onboarding-error">{err}</p>}
    </div>
  );
}

export default function FreeWebsiteOnboarding() {
  return <QueryClientProvider client={qc}><CampaignShell cta={false}><Onboarding /></CampaignShell></QueryClientProvider>;
}
