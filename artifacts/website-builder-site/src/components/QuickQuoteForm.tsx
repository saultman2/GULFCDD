/**
 * Quick quote request — the simple destination for "Get a Free Quote" CTAs.
 * Choices come from the existing tier list (data/plans.ts) and the capability
 * registry (data/capability-previews.ts). Nothing here invents offerings or prices.
 */
import { useRef, useState } from "react";
import { CheckCircle2, ArrowRight, ChevronDown, Tag } from "lucide-react";
import { fireEvent } from "@/lib/analytics";
import { tiers } from "@/data/plans";
import { capabilityPreviews, capabilityPreviewById, type CapabilityPreviewId } from "@/data/capability-previews";
import { SubmissionError } from "@/components/SubmissionError";
import { isMathChallengeCorrect, MathChallenge } from "@/components/MathChallenge";
import { FormHoneypot } from "@/components/FormHoneypot";

export type QuoteTier = "essential" | "growth" | "full-service" | "unsure";
const TIER_KEYS: QuoteTier[] = ["essential", "growth", "full-service", "unsure"];

export interface QuickQuoteContext {
  tier: QuoteTier | "";
  example: CapabilityPreviewId | null;
  source: "homepage-special" | "quote";
}

/** Allowlisted parsing of deep-link params. Unknown values are ignored. */
export function parseQuoteContext(search: string): QuickQuoteContext {
  const p = new URLSearchParams(search);
  const t = p.get("tier") ?? "";
  const e = p.get("example") ?? "";
  return {
    tier: (TIER_KEYS as string[]).includes(t) ? (t as QuoteTier) : "",
    example: Object.prototype.hasOwnProperty.call(capabilityPreviewById, e) ? (e as CapabilityPreviewId) : null,
    source: p.get("source") === "homepage-special" ? "homepage-special" : "quote",
  };
}

const SERVICES = capabilityPreviews.filter((c) => c.kind === "service");
const FEATURES = capabilityPreviews.filter((c) => c.kind === "feature");

/** Short, plain-language summary per tier using only published facts. */
const TIER_NOTE: Record<string, string> = {
  essential: "$150/mo. Hosting and upkeep. Analytics report. No contract.",
  growth: "$500/mo, or $250/mo founding. Adds local SEO and blog posts.",
  "full-service": "$1,000/mo, or $500/mo founding. Analytics report. No contract.",
  unsure: "We'll help you pick after we talk.",
};

const labelCls = "block text-sm font-semibold text-slate-700";
const optCls = "ml-1.5 text-xs font-normal text-muted-foreground";
const inputCls = "w-full h-11 rounded-lg border px-4 text-sm";

function Req() {
  return (<><span className="gcd-required" aria-hidden="true">*</span><span className="sr-only"> (required)</span></>);
}

function ChoiceChips({ items, selected, onToggle, testPrefix }: {
  items: { id: string; label: string }[]; selected: string[]; onToggle: (id: string) => void; testPrefix: string;
}) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {items.map((i) => {
        const on = selected.includes(i.id);
        return (
          <label key={i.id} className="gcd-chip" data-testid={`${testPrefix}-${i.id}`}>
            <input type="checkbox" name={testPrefix === "chip-service" ? "services" : "features"} value={i.label} checked={on} onChange={() => onToggle(i.id)} className="mr-2 accent-[hsl(var(--accent))]" />
            {on && <CheckCircle2 className="w-3.5 h-3.5 text-accent" aria-hidden="true" />}
            {i.label}
          </label>
        );
      })}
    </div>
  );
}

export function QuickQuoteForm({ context, onDone, onWantFull }: {
  context: QuickQuoteContext; onDone: () => void; onWantFull: () => void;
}) {
  const ex = context.example;
  const [contactName, setContactName] = useState("");
  const [bizName, setBizName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [tier, setTier] = useState<QuoteTier | "">(context.tier);
  const [services, setServices] = useState<string[]>(ex && ex.startsWith("service-") ? [ex] : []);
  const [features, setFeatures] = useState<string[]>(ex && ex.startsWith("feature-") ? [ex] : []);
  const [showFeatures, setShowFeatures] = useState(Boolean(ex && ex.startsWith("feature-")));
  const [notes, setNotes] = useState("");
  const [special, setSpecial] = useState(context.source === "homepage-special");
  const started = useRef(false);

  const markStarted = (event: React.FocusEvent<HTMLFormElement>) => {
    const target = event.target;
    if (started.current || !(target instanceof HTMLElement) ||
        !target.matches("input:not([type=hidden]), select, textarea")) return;
    started.current = true;
    fireEvent("quote_form_started", {
      form: "quick",
      source: special ? "homepage_special" : "quote",
    });
  };

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [mathAnswer, setMathAnswer] = useState("");
  const [mathError, setMathError] = useState("");

  const toggle = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (id: string) =>
    setter((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const validate = () => {
    const fe: Record<string, string> = {};
    if (!contactName.trim()) fe.contactName = "Please enter your name.";
    if (!bizName.trim()) fe.bizName = "Please enter your business name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) fe.email = "Please enter a valid email address.";
    const digits = phone.replace(/\D/g, "");
    if (phone.trim() && (digits.length < 10 || digits.length > 15)) fe.phone = "Phone numbers need 10 to 15 digits, or leave it blank.";
    if (!tier) fe.tier = "Please pick a tier, or choose Not sure yet.";
    setFieldErrors(fe);
    return Object.keys(fe).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!isMathChallengeCorrect(mathAnswer)) { setMathError("Please answer 2 to continue."); return; }
    setMathError("");
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "quick", contactName: contactName.trim(), bizName: bizName.trim(), email: email.trim(), phone: phone.trim(),
          tierPreference: tier,
          services: services.map((id) => capabilityPreviewById[id as CapabilityPreviewId].label),
          features: features.map((id) => capabilityPreviewById[id as CapabilityPreviewId].label),
          notes, source: special ? "homepage-special" : "quote", _hp: "",
          company_website: new FormData(e.currentTarget as HTMLFormElement).get("company_website") ?? "",
        }),
      });
      if (!res.ok) {
        let msg = "";
        try { const j = await res.json(); msg = typeof j?.error === "string" ? j.error : typeof j?.message === "string" ? j.message : ""; } catch { /* non-JSON */ }
        throw new Error(msg || "fallback");
      }
      fireEvent("generate_lead", { method: "intake_quick" });
      onDone();
    } catch (err) {
      const m = err instanceof Error && err.message !== "fallback" && err.message !== "Failed to fetch" ? err.message : "";
      setError(m || "Something went wrong. Please try again or call/text us at (228) 278-7782.");
    } finally {
      setBusy(false);
    }
  };

  const errText = (k: string) => fieldErrors[k] && (
    <span id={`qq-${k}-err`} role="alert" className="block text-xs text-destructive mt-1">{fieldErrors[k]}</span>
  );
  const textField = (k: string, label: string, value: string, set: (v: string) => void, opts: { type?: string; placeholder: string; required?: boolean; autoComplete?: string }) => (
    <label className="block">
      <span className={labelCls + " mb-1.5"}>{label}{opts.required ? <Req /> : <span className={optCls}>Optional</span>}</span>
      <input
        name={k} type={opts.type ?? "text"} value={value} placeholder={opts.placeholder} required={opts.required} autoComplete={opts.autoComplete}
        onChange={(e) => set(e.target.value)} className={inputCls}
        aria-invalid={Boolean(fieldErrors[k])} aria-describedby={fieldErrors[k] ? `qq-${k}-err` : undefined}
        data-testid={`input-${k}`}
      />
      {errText(k)}
    </label>
  );

  const tierOptions = [
    ...tiers.map((t) => ({ key: t.key, name: t.name, note: TIER_NOTE[t.key] ?? t.tagline })),
    { key: "unsure", name: "Not sure yet", note: "We'll recommend one after we talk." },
  ];

  return (
    <form action="/api/intake" method="post" onSubmit={submit} onFocusCapture={markStarted} noValidate className="gcd-form space-y-8" aria-label="Free quote request form">
      <FormHoneypot />
      <input type="hidden" name="mode" value="quick" />
      <input type="hidden" name="source" value={special ? "homepage-special" : "quote"} />
      {special && (
        <div className="flex items-start gap-3 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3" data-testid="status-special-offer">
          <Tag className="w-4 h-4 text-accent mt-0.5 shrink-0" aria-hidden="true" />
          <div className="text-sm text-slate-700 flex-1">
            <strong className="text-primary">Asking about the homepage special offer.</strong>{" "}
            We'll confirm the current offer details with you in our reply.
          </div>
          <button type="button" onClick={() => setSpecial(false)} className="text-xs font-semibold text-muted-foreground hover:text-accent underline" data-testid="button-remove-special">Remove</button>
        </div>
      )}

      {/* Step 1 */}
      <section aria-labelledby="qq-s1">
        <h3 id="qq-s1" className="gcd-section-title">1. How do we reach you?</h3>
        <p className="text-xs text-muted-foreground -mt-2 mb-4"><span className="gcd-required" aria-hidden="true">*</span> required. Everything else is optional.</p>
        <div className="grid sm:grid-cols-2 gap-5">
          {textField("contactName", "Your name", contactName, setContactName, { placeholder: "Jordan Ladner", required: true, autoComplete: "name" })}
          {textField("bizName", "Business name", bizName, setBizName, { placeholder: "Ladner Lawn & Garden", required: true, autoComplete: "organization" })}
          {textField("email", "Email", email, setEmail, { type: "email", placeholder: "you@yourbusiness.com", required: true, autoComplete: "email" })}
          {textField("phone", "Phone", phone, setPhone, { type: "tel", placeholder: "(228) 555-0142", autoComplete: "tel" })}
        </div>
      </section>

      {/* Step 2 */}
      <section aria-labelledby="qq-s2">
        <fieldset aria-describedby={fieldErrors.tier ? "qq-tier-err" : undefined}>
          <legend id="qq-s2" className="gcd-section-title w-full">2. Which tier sounds closest?<Req /></legend>
          <p className="text-xs text-muted-foreground -mt-2 mb-4">A starting point only. You can change your mind once we talk.</p>
          <div className="grid sm:grid-cols-2 gap-3" role="radiogroup">
            {tierOptions.map((t) => {
              const on = tier === t.key;
              return (
                <label key={t.key} data-testid={`option-tier-${t.key}`}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 px-4 py-3 transition-colors focus-within:ring-2 focus-within:ring-accent ${on ? "border-accent bg-accent/5" : "border-slate-200 hover:border-slate-400"} ${t.key === "unsure" ? "sm:col-span-2" : ""}`}>
                   <input type="radio" name="tierPreference" required value={t.key} checked={on} onChange={() => setTier(t.key as QuoteTier)} aria-invalid={Boolean(fieldErrors.tier)} aria-describedby={fieldErrors.tier ? "qq-tier-err" : undefined} className="mt-1 accent-[hsl(var(--accent))]" />
                  <span>
                    <span className="block text-sm font-bold text-primary">{t.name}</span>
                    <span className="block text-xs text-muted-foreground leading-relaxed">{t.note}</span>
                  </span>
                </label>
              );
            })}
          </div>
          {errText("tier")}
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
            Essential is $150/mo for hosting and upkeep. Growth is $500/mo ($250 founding) and adds local SEO and blog posts. Full Service is $1,000/mo ($500 founding). Founding clients get the build free through January 31, 2027. Every plan includes an analytics report. No contract.
          </p>
        </fieldset>
      </section>

      {/* Step 3 */}
      <section aria-labelledby="qq-s3">
        <h3 id="qq-s3" className="gcd-section-title">3. What are you looking for? <span className={optCls}>Optional</span></h3>
        <fieldset>
          <legend className={labelCls}>Services</legend>
          <ChoiceChips items={SERVICES} selected={services} onToggle={toggle(setServices)} testPrefix="chip-service" />
        </fieldset>
        <div className="mt-5">
          <button type="button" aria-expanded={showFeatures} aria-controls="qq-features" onClick={() => setShowFeatures((s) => !s)}
            className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition" data-testid="button-toggle-features">
            <ChevronDown className={`w-4 h-4 transition-transform ${showFeatures ? "rotate-180" : ""}`} aria-hidden="true" />
            {showFeatures ? "Hide specific features" : "Add specific features"}
            {features.length > 0 && <span className="text-xs font-normal text-muted-foreground">({features.length} selected)</span>}
          </button>
            <fieldset id="qq-features" style={{ display: !showFeatures ? "none" : undefined }} className="mt-2">
              <legend className="sr-only">Features</legend>
              <p className="text-xs text-muted-foreground">What's included depends on the tier; we'll go over it with you.</p>
              <ChoiceChips items={FEATURES} selected={features} onToggle={toggle(setFeatures)} testPrefix="chip-feature" />
            </fieldset>
        </div>
        <label className="block mt-6">
          <span className={labelCls + " mb-1.5"}>Anything else?<span className={optCls}>Optional</span></span>
          <textarea name="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} data-testid="input-notes"
            placeholder="What you do, where you work, or a site you like."
            className="w-full rounded-lg border px-4 py-3 text-sm leading-relaxed resize-y" />
        </label>
      </section>

      <MathChallenge id="quick-intake-math-challenge" value={mathAnswer} error={mathError}
        onChange={(v) => { setMathAnswer(v); if (isMathChallengeCorrect(v)) setMathError(""); }} />

      <button type="submit" disabled={busy} aria-busy={busy} data-testid="button-submit-quote"
        className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background text-white font-bold rounded-lg py-3.5 transition-colors shadow-md text-base">
        {busy ? "Sending..." : (<>Request my free quote <ArrowRight className="w-5 h-5" /></>)}
      </button>

      {error && <SubmissionError message={error} />}

      <p className="text-center text-xs text-muted-foreground">
        Have a logo or photos to send?{" "}
        <button type="button" onClick={onWantFull} className="underline hover:text-accent" data-testid="button-switch-full">Use the detailed form</button>.
        {" "}We use your details to respond to your request. See our{" "}
        <a href="/privacy/" className="underline hover:text-accent">Privacy Policy</a>.
      </p>
    </form>
  );
}
