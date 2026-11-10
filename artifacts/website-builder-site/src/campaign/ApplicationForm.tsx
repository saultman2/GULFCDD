import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { submitCampaignApplication, type CampaignApplicationInput } from "@workspace/api-client-react";
import { errMessage, getAttribution, money, sendThirdParty, trackCampaign, uuid, type CampaignPlan } from "./lib";

const DRAFT_KEY = "gcdd_fw_draft_v2";
const LEGACY_KEY = "gcdd_fw_draft";
const GOALS = [
  "Look more professional", "Get more calls and leads", "Show up on Google", "Show my work and photos",
  "Let customers book or request quotes", "Replace an outdated site", "Sell or take payments online", "Something else",
];
const STEPS = ["Business and website", "Goals and plan", "Contact and submit"];
const LAST = STEPS.length - 1;

type Draft = {
  v: 2; step: number; maxStep: number; businessName: string; businessType: string; cityState: string;
  websiteStatus: "" | "first" | "redesign" | "starting"; websiteUrl: string; goals: string[];
  plan: "" | "essential" | "growth" | "full" | "unsure"; fullName: string; email: string; phone: string;
  contactMethod: "email" | "text" | "call"; privacyConsent: boolean; marketingConsent: boolean; smsConsent: boolean;
  mathAnswer: string; company_website: string; idempotencyKey: string;
};
const blank = (): Draft => ({
  v: 2, step: 0, maxStep: 0, businessName: "", businessType: "", cityState: "", websiteStatus: "", websiteUrl: "", goals: [],
  plan: "", fullName: "", email: "", phone: "", contactMethod: "email", privacyConsent: false,
  marketingConsent: false, smsConsent: false, mathAnswer: "", company_website: "", idempotencyKey: uuid(),
});
const clampStep = (n: unknown) => (typeof n === "number" && n >= 0 ? Math.min(LAST, Math.floor(n)) : 0);
function sanitize(raw: Record<string, unknown>): Draft {
  const b = blank();
  const out = { ...b } as Record<string, unknown>;
  for (const k of Object.keys(b) as (keyof Draft)[]) {
    if (k in raw && typeof raw[k] === typeof b[k] && (k !== "goals" || Array.isArray(raw[k]))) out[k] = raw[k];
  }
  const d = out as Draft;
  d.v = 2; d.step = clampStep(d.step); d.maxStep = Math.max(d.step, clampStep(d.maxStep));
  d.goals = d.goals.filter((g) => typeof g === "string");
  return d;
}
function loadDraft(): Draft {
  try {
    const r = sessionStorage.getItem(DRAFT_KEY);
    if (r) return sanitize(JSON.parse(r));
    const old = sessionStorage.getItem(LEGACY_KEY);
    if (old) {
      // Legacy six-step draft: 0-1 -> 0, 2-3 -> 1, 4-5 -> 2
      const p = JSON.parse(old) as Record<string, unknown>;
      const s = typeof p.step === "number" ? p.step : 0;
      const step = s <= 1 ? 0 : s <= 3 ? 1 : 2;
      const d = sanitize({ ...p, step, maxStep: step });
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(d));
      sessionStorage.removeItem(LEGACY_KEY);
      return d;
    }
  } catch { /* ignore corrupt drafts */ }
  return blank();
}

/** Adds https:// to bare domains; returns null when not a valid http(s) URL. */
export function normalizeUrl(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(t) ? t : `https://${t.replace(/^\/+/, "")}`;
  try {
    const u = new URL(withScheme);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    if (!u.hostname.includes(".") || /\s/.test(t)) return null;
    return u.toString();
  } catch { return null; }
}

const FIELD_STEP: Record<string, number> = {
  businessName: 0, businessType: 0, cityState: 0, websiteStatus: 0, websiteUrl: 0,
  goals: 1, plan: 1, fullName: 2, email: 2, phone: 2, mathAnswer: 2, privacyConsent: 2,
};
const FIELD_ID: Record<string, string> = {
  businessName: "fw-bn", businessType: "fw-bt", cityState: "fw-cs", websiteStatus: "fw-ws-first", websiteUrl: "fw-url",
  goals: "fw-goal-0", plan: "fw-plan-first", fullName: "fw-fn", email: "fw-em", phone: "fw-ph", mathAnswer: "fw-math", privacyConsent: "fw-privacy",
};

function stepErrors(d: Draft, step: number) {
  const e: Record<string, string> = {};
  if (step === 0) {
    if (!d.businessName.trim()) e.businessName = "Tell us your business name.";
    if (!d.businessType.trim()) e.businessType = "What kind of business is it?";
    if (!d.cityState.trim()) e.cityState = "Add your city and state.";
    if (!d.websiteStatus) e.websiteStatus = "Choose where you are with a website.";
    if (d.websiteStatus === "redesign") {
      if (!d.websiteUrl.trim()) e.websiteUrl = "Add your current website address.";
      else if (!normalizeUrl(d.websiteUrl)) e.websiteUrl = "Enter a web address like yourbusiness.com.";
    }
  }
  if (step === 1) {
    if (d.goals.length === 0) e.goals = "Pick at least one goal.";
    if (!d.plan) e.plan = "Pick a plan, or choose \u201cNot sure yet\u201d.";
  }
  if (step === 2) {
    if (!d.fullName.trim()) e.fullName = "Your name, please.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) e.email = "Enter a valid email.";
    if (d.phone.replace(/\D/g, "").length < 7 || !/^[+()\d .-]{7,40}$/.test(d.phone.trim())) e.phone = "Enter a phone number we can reach.";
    if (d.mathAnswer.trim() !== "2") e.mathAnswer = "Check the answer and try again.";
    if (!d.privacyConsent) e.privacyConsent = "Please agree to the privacy policy to apply.";
  }
  return e;
}

const inputCls = "w-full rounded-md border border-white/15 bg-[hsl(0_0%_6%)] px-3.5 py-2.5 text-white placeholder:text-white/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25 aria-[invalid=true]:border-[#ff6579]";
function Field({ label, id, error, children, hint }: { label: string; id: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-white/90">{label}</label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="text-xs text-white/50">{hint}</p>}
      {error && <p id={`${id}-err`} className="text-xs text-[#ff6579]">{error}</p>}
    </div>
  );
}
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-white/45 pt-1">{children}</h4>
);

export function ApplicationForm({ plans }: { plans: CampaignPlan[] }) {
  const [d, setD] = useState<Draft>(loadDraft);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusKey, setFocusKey] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [, navigate] = useLocation();
  const started = useRef(false);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => { try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(d)); } catch { /* */ } }, [d]);
  useEffect(() => {
    const onShow = () => setD(loadDraft());
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);
  useEffect(() => {
    if (!focusKey) return;
    const el = document.getElementById(FIELD_ID[focusKey] ?? "");
    if (el) { el.focus({ preventScroll: true }); el.scrollIntoView({ behavior: "smooth", block: "center" }); }
    setFocusKey(null);
  }, [focusKey, d.step]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => {
    if (!started.current) { started.current = true; trackCampaign("application_started"); }
    setD((p) => ({ ...p, [k]: v }));
    setErrors((e) => { if (!(k in e)) return e; const n = { ...e }; delete n[k as string]; return n; });
  };
  const err = (k: string) => (errors[k] ? { "aria-invalid": true, "aria-describedby": `${FIELD_ID[k]}-err` } : { "aria-invalid": false });

  const moveTo = (n: number) => {
    setD((p) => ({ ...p, step: n, maxStep: Math.max(p.maxStep, n) }));
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  /** Navigate to step n; forward moves must pass validation of every earlier step. */
  const goTo = (n: number) => {
    if (n <= d.step) { setErrors({}); moveTo(n); return; }
    for (let s = 0; s < n; s++) {
      const e = stepErrors(d, s);
      if (Object.keys(e).length) {
        setErrors(e);
        if (s !== d.step) moveTo(s);
        setFocusKey(Object.keys(e)[0]);
        return;
      }
      if (s >= d.step) trackCampaign("step_completed", s + 1);
    }
    setErrors({});
    moveTo(n);
  };

  async function submit() {
    if (submitting) return;
    for (let s = 0; s <= LAST; s++) {
      const e = stepErrors(d, s);
      if (Object.keys(e).length) {
        setErrors(e);
        if (s !== d.step) moveTo(s);
        setFocusKey(Object.keys(e)[0]);
        return;
      }
    }
    setErrors({});
    setSubmitting(true); setSubmitError("");
    const input: CampaignApplicationInput = {
      businessName: d.businessName.trim(), businessType: d.businessType.trim(), cityState: d.cityState.trim(),
      websiteStatus: d.websiteStatus as CampaignApplicationInput["websiteStatus"],
      websiteUrl: d.websiteStatus === "redesign" ? normalizeUrl(d.websiteUrl) ?? undefined : undefined,
      goals: d.goals, plan: d.plan as CampaignApplicationInput["plan"], fullName: d.fullName.trim(),
      email: d.email.trim(), phone: d.phone.trim(), contactMethod: d.contactMethod, privacyConsent: true,
      marketingConsent: d.marketingConsent, smsConsent: d.smsConsent, company_website: d.company_website,
      mathAnswer: d.mathAnswer.trim(), idempotencyKey: d.idempotencyKey, attribution: getAttribution(),
    };
    try {
      const res = (await submitCampaignApplication(input)) as { ok?: boolean; receipt?: string };
      if (!res.ok) throw new Error("We could not save your application.");
      trackCampaign("step_completed", 3);
      sendThirdParty("application_submitted", { plan: input.plan, website_status: input.websiteStatus });
      sessionStorage.removeItem(DRAFT_KEY);
      sessionStorage.removeItem(LEGACY_KEY);
      sessionStorage.setItem("gcdd_fw_receipt", res.receipt ?? "");
      navigate("/free-website/thank-you/");
    } catch (e) {
      setSubmitError(errMessage(e));
    } finally { setSubmitting(false); }
  }

  const errCount = Object.keys(errors).length;
  const pct = ((d.step + 1) / STEPS.length) * 100;
  const planOptions = [
    ...plans.map((p) => ({ id: p.id, title: p.name, sub: `${money(p.price)}/month`, inc: p.features.slice(0, 3) })),
    { id: "unsure" as const, title: "Not sure yet", sub: "We'll help you choose", inc: ["We recommend a plan after reviewing your answers"] },
  ];
  const radioCard = (on: boolean) => `flex gap-3 rounded-md border px-4 py-3 cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-accent/40 ${on ? "border-accent bg-accent/10" : "border-white/15 hover:border-white/30"}`;

  return (
    <div ref={topRef} className="scroll-mt-24 rounded-xl border border-white/12 bg-[hsl(0_0%_8%)] shadow-[0_30px_80px_-30px_hsl(353_78%_30%/0.45)]">
      <div className="border-b border-white/10 px-5 sm:px-8 pt-6 pb-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ff6579]" aria-live="polite">Step {d.step + 1} of {STEPS.length}</p>
          <p className="text-xs text-white/50">About 3 minutes · saved in this tab · no payment to apply</p>
        </div>
        <div className="mt-4 rounded-md border border-accent/35 bg-accent/10 px-3.5 py-3" data-testid="campaign-source-indicator">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#ff8595]">Free website ad application</p>
          <p className="mt-1 text-xs text-white/75">
            $0 upfront design fee for approved applicants · {plans.map((p) => `${p.name} ${money(p.price)}/mo`).join(" · ")}
          </p>
        </div>
        <div className="mt-4 h-1 rounded-full bg-white/10 overflow-hidden" aria-hidden>
          <div className="h-full bg-accent origin-left transition-transform duration-500" style={{ transform: `scaleX(${pct / 100})` }} />
        </div>
        <nav aria-label="Application steps" className="mt-3">
          <ol className="grid grid-cols-3 gap-2">
            {STEPS.map((s, i) => {
              const done = i < d.maxStep || (i < d.step);
              const reachable = i <= d.maxStep;
              return (
                <li key={s}>
                  <button type="button" onClick={() => goTo(i)} disabled={!reachable} aria-current={i === d.step ? "step" : undefined}
                    className={`w-full text-left rounded-md px-2 py-1.5 text-[11px] sm:text-xs leading-tight transition-colors ${i === d.step ? "bg-white/10 text-white font-semibold" : reachable ? "text-white/75 hover:bg-white/5" : "text-white/35 cursor-not-allowed"}`}
                    data-testid={`button-step-${i}`}>
                    <span className="flex items-center gap-1">{done && i !== d.step ? <Check className="h-3 w-3 shrink-0 text-[#ff6579]" /> : <span className="shrink-0 tabular-nums">{i + 1}.</span>}{s}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      <form className="px-5 sm:px-8 py-7 space-y-5" noValidate onSubmit={(e) => { e.preventDefault(); if (d.step < LAST) goTo(d.step + 1); else void submit(); }}>
        {errCount > 0 && (
          <p className="rounded-md border border-[#ff6579]/40 bg-accent/10 px-3 py-2 text-sm text-white" role="alert" data-testid="text-form-errors">
            {errCount === 1 ? "One answer needs attention below." : `${errCount} answers need attention below.`}
          </p>
        )}
        <h3 className="text-xl font-bold text-white">{STEPS[d.step]}</h3>
        <div key={d.step} className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-300">
          {d.step === 0 && (<>
            <Field label="Business name" id="fw-bn" error={errors.businessName}>
              <input id="fw-bn" className={inputCls} value={d.businessName} maxLength={160} onChange={(e) => set("businessName", e.target.value)} {...err("businessName")} data-testid="input-business-name" autoComplete="organization" />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="What kind of business?" id="fw-bt" error={errors.businessType} hint="e.g. pressure washing, bakery, roofing">
                <input id="fw-bt" className={inputCls} value={d.businessType} maxLength={160} onChange={(e) => set("businessType", e.target.value)} {...err("businessType")} data-testid="input-business-type" />
              </Field>
              <Field label="City and state" id="fw-cs" error={errors.cityState}>
                <input id="fw-cs" className={inputCls} value={d.cityState} maxLength={160} placeholder="Biloxi, MS" onChange={(e) => set("cityState", e.target.value)} {...err("cityState")} data-testid="input-city-state" />
              </Field>
            </div>
            <fieldset className="space-y-2" aria-describedby={errors.websiteStatus ? "fw-ws-first-err" : undefined}>
              <legend className="text-sm font-semibold text-white/90 mb-2">Where are you with a website?</legend>
              {([["first", "I need my first website"], ["redesign", "I have a website that needs a redesign"], ["starting", "I'm just starting my business"]] as const).map(([v, l], i) => (
                <label key={v} className={`${radioCard(d.websiteStatus === v)} items-center`}>
                  <input type="radio" name="ws" id={i === 0 ? "fw-ws-first" : undefined} className="accent-[hsl(353_78%_48%)]" checked={d.websiteStatus === v} onChange={() => set("websiteStatus", v)} data-testid={`radio-status-${v}`} />
                  <span className="text-white/90">{l}</span>
                </label>
              ))}
              {errors.websiteStatus && <p id="fw-ws-first-err" className="text-xs text-[#ff6579]">{errors.websiteStatus}</p>}
            </fieldset>
            {d.websiteStatus === "redesign" && (
              <Field label="Current website address" id="fw-url" error={errors.websiteUrl} hint="yourbusiness.com is fine; we add https:// for you">
                <input id="fw-url" className={inputCls} value={d.websiteUrl} maxLength={500} placeholder="yourbusiness.com" onChange={(e) => set("websiteUrl", e.target.value)} onBlur={() => { const n = normalizeUrl(d.websiteUrl); if (n && n !== d.websiteUrl) set("websiteUrl", n); }} {...err("websiteUrl")} data-testid="input-website-url" inputMode="url" autoComplete="url" />
              </Field>
            )}
          </>)}

          {d.step === 1 && (<>
            <fieldset aria-describedby={errors.goals ? "fw-goal-0-err" : undefined}>
              <legend className="text-sm font-semibold text-white/90 mb-3">What should the website do for you? Pick any that fit.</legend>
              <div className="flex flex-wrap gap-2">
                {GOALS.map((g, i) => {
                  const on = d.goals.includes(g);
                  return (
                    <button type="button" key={g} id={`fw-goal-${i}`} aria-pressed={on} className="gcd-chip" onClick={() => set("goals", on ? d.goals.filter((x) => x !== g) : d.goals.length < 8 ? [...d.goals, g] : d.goals)} data-testid={`chip-goal-${i}`}>
                      {on && <Check className="h-3.5 w-3.5" />}{g}
                    </button>
                  );
                })}
              </div>
              {errors.goals && <p id="fw-goal-0-err" className="mt-2 text-xs text-[#ff6579]">{errors.goals}</p>}
            </fieldset>
            <fieldset aria-describedby={errors.plan ? "fw-plan-first-err" : undefined}>
              <legend className="text-sm font-semibold text-white/90 mb-1">Which monthly plan interests you?</legend>
              <p className="text-xs text-white/50 mb-3">$0 upfront design fee with any plan. You can change this after we talk.</p>
              <div className="grid gap-2">
                {planOptions.map((p, i) => (
                  <label key={p.id} className={radioCard(d.plan === p.id)}>
                    <input type="radio" name="plan" id={i === 0 ? "fw-plan-first" : undefined} className="mt-1 accent-[hsl(353_78%_48%)]" checked={d.plan === p.id} onChange={() => set("plan", p.id)} data-testid={`radio-plan-${p.id}`} />
                    <span className="flex-1 min-w-0">
                      <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                        <span className="font-semibold text-white">{p.title}</span>
                        <span className="text-sm text-white/65">{p.sub}</span>
                      </span>
                      <span className="mt-1 block text-xs text-white/55">{p.inc.join(" · ")}</span>
                    </span>
                  </label>
                ))}
              </div>
              {errors.plan && <p id="fw-plan-first-err" className="mt-2 text-xs text-[#ff6579]">{errors.plan}</p>}
            </fieldset>
          </>)}

          {d.step === 2 && (<>
            <Field label="Your name" id="fw-fn" error={errors.fullName}>
              <input id="fw-fn" className={inputCls} value={d.fullName} maxLength={160} autoComplete="name" onChange={(e) => set("fullName", e.target.value)} {...err("fullName")} data-testid="input-full-name" />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Email" id="fw-em" error={errors.email}>
                <input id="fw-em" type="email" className={inputCls} value={d.email} maxLength={254} autoComplete="email" onChange={(e) => set("email", e.target.value)} {...err("email")} data-testid="input-email" />
              </Field>
              <Field label="Phone" id="fw-ph" error={errors.phone}>
                <input id="fw-ph" type="tel" className={inputCls} value={d.phone} maxLength={40} autoComplete="tel" onChange={(e) => set("phone", e.target.value)} {...err("phone")} data-testid="input-phone" />
              </Field>
            </div>
            <fieldset>
              <legend className="text-sm font-semibold text-white/90 mb-2">Best way to reach you</legend>
              <div className="flex gap-2">
                {(["email", "text", "call"] as const).map((m) => (
                  <button type="button" key={m} className="gcd-chip capitalize" aria-pressed={d.contactMethod === m} onClick={() => set("contactMethod", m)} data-testid={`chip-contact-${m}`}>{m}</button>
                ))}
              </div>
            </fieldset>

            <SectionTitle>Quick review</SectionTitle>
            <dl className="rounded-md border border-white/10 divide-y divide-white/10 text-sm">
              {([
                ["Lead source", "Free Website Ad Landing Page"],
                ["Offer shown", `$0 upfront design fee · ${plans.map((p) => `${p.name} ${money(p.price)}/month`).join(" · ")}`],
                ["Business", [d.businessName, d.businessType, d.cityState].filter(Boolean).join(" · "), 0],
                ["Website", d.websiteStatus === "redesign" ? `Redesign of ${normalizeUrl(d.websiteUrl) ?? d.websiteUrl}` : d.websiteStatus === "first" ? "First website" : d.websiteStatus === "starting" ? "Just starting" : "", 0],
                ["Goals", d.goals.join(", "), 1],
                ["Plan interest", d.plan === "unsure" ? "Not sure yet" : `${plans.find((p) => p.id === d.plan)?.name ?? d.plan} — ${money(plans.find((p) => p.id === d.plan)?.price)}/month`, 1],
              ] as [string, string, number?][]).map(([k, v, s]) => (
                <div key={k} className="flex gap-3 px-4 py-2.5">
                  <dt className="w-20 shrink-0 text-white/50">{k}</dt>
                  <dd className="flex-1 text-white/90 [overflow-wrap:anywhere]">{v || <span className="text-[#ff6579]">Missing</span>}</dd>
                  {s !== undefined && <button type="button" className="text-xs text-[#ff6579] hover:underline" onClick={() => goTo(s)} aria-label={`Edit ${k.toLowerCase()}`} data-testid={`button-edit-step-${s}-${k.toLowerCase()}`}>Edit</button>}
                </div>
              ))}
            </dl>
            <p className="text-xs text-white/50">The listed amount is the campaign plan price shown when you applied. Your selection is an expression of interest, not an agreed price or purchase; final scope and pricing are confirmed in your written proposal.</p>

            <div className="form-honeypot" aria-hidden="true">
              <label htmlFor="fw-hp">Company website</label>
              <input id="fw-hp" tabIndex={-1} autoComplete="off" value={d.company_website} onChange={(e) => setD((p) => ({ ...p, company_website: e.target.value }))} />
            </div>
            <Field label="Quick check: what is 1 + 1?" id="fw-math" error={errors.mathAnswer}>
              <input id="fw-math" inputMode="numeric" className={`${inputCls} max-w-[8rem]`} value={d.mathAnswer} onChange={(e) => set("mathAnswer", e.target.value)} {...err("mathAnswer")} data-testid="input-math" />
            </Field>
            <div className="space-y-3 text-sm">
              <label className="flex gap-3 items-start">
                <input id="fw-privacy" type="checkbox" className="mt-1 accent-[hsl(353_78%_48%)]" checked={d.privacyConsent} onChange={(e) => set("privacyConsent", e.target.checked)} {...err("privacyConsent")} data-testid="checkbox-privacy" />
                <span className="text-white/85">I agree to the <a href="/privacy/" target="_blank" rel="noreferrer" className="underline">privacy policy</a> and let GulfCDD contact me about this application. <span className="text-[#ff6579]">Required</span></span>
              </label>
              {errors.privacyConsent && <p id="fw-privacy-err" className="text-xs text-[#ff6579]">{errors.privacyConsent}</p>}
              <label className="flex gap-3 items-start">
                <input type="checkbox" className="mt-1 accent-[hsl(353_78%_48%)]" checked={d.marketingConsent} onChange={(e) => set("marketingConsent", e.target.checked)} data-testid="checkbox-marketing" />
                <span className="text-white/70">Optional: email me occasional follow-ups and tips. Unsubscribe anytime.</span>
              </label>
              <label className="flex gap-3 items-start">
                <input type="checkbox" className="mt-1 accent-[hsl(353_78%_48%)]" checked={d.smsConsent} onChange={(e) => set("smsConsent", e.target.checked)} data-testid="checkbox-sms" />
                <span className="text-white/70">Optional: text me follow-ups about my application. Msg and data rates may apply. Reply STOP to end.</span>
              </label>
            </div>
            <p className="text-xs text-white/50">Applying is free, requires no payment, and does not guarantee acceptance or commit you to anything.</p>
            {submitError && <p className="rounded-md border border-[#ff6579]/40 bg-accent/10 px-3 py-2 text-sm text-white" role="alert" data-testid="text-submit-error">{submitError} Your answers are still here, so you can try again.</p>}
          </>)}
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          {d.step > 0 ? (
            <button type="button" onClick={() => goTo(d.step - 1)} className="inline-flex items-center gap-1.5 rounded-md px-3 py-2.5 text-sm text-white/75 hover:text-white hover:bg-white/5" data-testid="button-back"><ArrowLeft className="h-4 w-4" /> Back</button>
          ) : <span />}
          <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-semibold text-white hover:bg-accent/90 active:scale-[0.98] transition disabled:opacity-60" data-testid={d.step < LAST ? "button-next" : "button-submit-application"}>
            {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending</> : d.step < LAST ? <>Continue <ArrowRight className="h-4 w-4" /></> : "Submit application"}
          </button>
        </div>
      </form>
    </div>
  );
}
