import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { getGetCampaignAdminQueryKey, updateCampaignAdmin, useGetCampaignAdmin, type CampaignAdminInput } from "@workspace/api-client-react";
import { Copy, ExternalLink, Loader2, Lock, Plus, RefreshCw, RotateCw, Search, Trash2 } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { useToast } from "@/hooks/use-toast";
import { OwnerGoogleSignIn } from "@/campaign/CampaignAdminAccess";
import {
  STATUSES, errMessage, errStatus, money, statusLabel,
  type AdminApplication, type AdminDoc, type CampaignConfig, type CampaignFaq, type CampaignProject,
} from "@/campaign/lib";

const input = "w-full rounded-md border border-white/15 bg-[hsl(0_0%_6%)] px-3 py-2 text-sm text-white focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25";
const btn = "inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold transition disabled:opacity-50";
const TAB_LABELS = { leads: "Applications", analytics: "Results", settings: "Offer settings" } as const;
const fmt = (s?: string | null) => (s ? new Date(s).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "—");
const statusTone = (s: string) =>
  s === "declined" || s === "closed_lost" ? "bg-white/5 text-white/50" :
  s === "active_monthly_client" || s === "website_launched" ? "bg-emerald-500/15 text-emerald-300" :
  s === "new_application" ? "bg-accent/20 text-[#ff8595]" : "bg-white/10 text-white/80";

function useAdminMutation() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [pending, setPending] = useState<string>("");
  async function run(key: string, body: CampaignAdminInput, ok: string) {
    setPending(key);
    try {
      const r = (await updateCampaignAdmin(body)) as Record<string, unknown>;
      await qc.invalidateQueries({ queryKey: getGetCampaignAdminQueryKey() });
      toast({ title: ok });
      return r;
    } catch (e) {
      toast({ title: "Action failed", description: errMessage(e), variant: "destructive" });
      return null;
    } finally { setPending(""); }
  }
  return { run, pending };
}

export default function FreeWebsiteAdmin() {
  useSEO({ title: "Free Website Campaign Admin | GulfCDD", description: "Private campaign administration.", noindex: true });
  const q = useGetCampaignAdmin({ query: { queryKey: getGetCampaignAdminQueryKey(), retry: false } });
  const doc = q.data as unknown as AdminDoc | undefined;
  const [tab, setTab] = useState<"leads" | "analytics" | "settings">("leads");

  if (q.isLoading) return <Shell><div className="grid lg:grid-cols-[360px_1fr] gap-4">{[0, 1].map((i) => <div key={i} className="h-[60vh] rounded-lg bg-white/5 animate-pulse" />)}</div></Shell>;
  if (q.isError || !doc) {
    const s = errStatus(q.error);
    if (s === 401 || s === 403) return <Shell><div className="py-16" data-testid="status-admin-error"><OwnerGoogleSignIn /></div></Shell>;
    return (
      <Shell>
        <div className="max-w-lg mx-auto text-center py-20" data-testid="status-admin-error">
          <Lock className="h-8 w-8 mx-auto text-[#ff6579]" />
          <h1 className="mt-4 text-2xl font-extrabold text-white">{s === 403 ? "403 — Admin access required" : s === 401 ? "Please sign in" : "Couldn't load campaign data"}</h1>
          <p className="mt-2 text-white/60">{s === 403 ? "Your account is signed in but doesn't have the admin role." : s === 401 ? "Sign in with an admin account to continue." : errMessage(q.error)}</p>
          {s === 401 ? <Link href="/sign-in" className={`${btn} mt-6 bg-accent text-white`}>Sign in</Link>
            : s !== 403 && <button onClick={() => q.refetch()} className={`${btn} mt-6 border border-white/20 text-white`} data-testid="button-retry-admin"><RotateCw className="h-4 w-4" /> Retry</button>}
        </div>
      </Shell>
    );
  }
  return (
    <Shell>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff6579]">Free website campaign</p>
          <h1 className="text-3xl font-extrabold text-white">Applications</h1>
        </div>
        <div role="tablist" className="flex rounded-md border border-white/12 p-1">
          {(["leads", "analytics", "settings"] as const).map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`${btn} ${tab === t ? "bg-accent text-white" : "text-white/70 hover:text-white"}`} data-testid={`tab-${t}`}>{TAB_LABELS[t]}</button>
          ))}
          <button onClick={() => q.refetch()} className={`${btn} text-white/60 hover:text-white`} aria-label="Refresh data" data-testid="button-refetch"><RefreshCw className={`h-4 w-4 ${q.isFetching ? "animate-spin" : ""}`} /></button>
        </div>
      </div>
      {tab === "leads" && <Leads apps={doc.applications} />}
      {tab === "analytics" && <Analytics doc={doc} />}
      {tab === "settings" && <Settings config={doc.config} />}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-background">
      <header className="border-b border-white/10"><div className="mx-auto max-w-7xl px-5 h-14 flex items-center justify-between">
        <Link href="/"><img src={`${import.meta.env.BASE_URL}images/gulfcdd-logo.png`} alt="GulfCDD" width={1254} height={1254} className="h-8 w-8 object-contain" /></Link>
        <nav aria-label="Admin" className="flex items-center gap-4 text-sm">
          <a href="/free-website/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md border border-white/20 px-3 py-1.5 text-white/85 hover:bg-white/5" data-testid="link-view-offer">View offer <ExternalLink className="h-3.5 w-3.5" /></a>
          <Link href="/account" className="text-white/60 hover:text-white" data-testid="link-account">Account</Link>
        </nav>
      </div></header>
      <main className="mx-auto max-w-7xl px-5 py-8">{children}</main>
    </div>
  );
}

/* ───────── Leads ───────── */
function Leads({ apps }: { apps: AdminApplication[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<number | null>(() => Number(new URLSearchParams(window.location.search).get("lead")) || null);
  const list = useMemo(() => apps
    .filter((a) => status === "all" || a.status === status)
    .filter((a) => !query || `${a.businessName} ${a.fullName} ${a.email} ${a.cityState}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)), [apps, query, status]);
  const current = apps.find((a) => a.id === selected) ?? null;

  if (!apps.length) return <div className="rounded-lg border-2 border-dashed border-white/12 p-16 text-center text-white/55" data-testid="status-empty-leads">No applications yet. Share /free-website/ to start collecting them.</div>;
  return (
    <div className="grid lg:grid-cols-[360px_1fr] gap-5 items-start">
      <div className="rounded-lg border border-white/10 bg-[hsl(0_0%_7%)]">
        <div className="p-3 space-y-2 border-b border-white/10">
          <div className="relative"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/40" /><input className={`${input} pl-8`} placeholder="Search name, business, email" value={query} onChange={(e) => setQuery(e.target.value)} data-testid="input-search-leads" /></div>
          <select className={input} value={status} onChange={(e) => setStatus(e.target.value)} data-testid="select-filter-status">
            <option value="all">All statuses ({apps.length})</option>
            {STATUSES.map((s) => <option key={s} value={s}>{statusLabel(s)} ({apps.filter((a) => a.status === s).length})</option>)}
          </select>
        </div>
        <ul className="max-h-[70vh] overflow-auto divide-y divide-white/5">
          {list.map((a) => (
            <li key={a.id}>
              <button onClick={() => setSelected(a.id)} className={`w-full text-left px-4 py-3 transition-colors ${selected === a.id ? "bg-accent/10" : "hover:bg-white/[0.03]"}`} data-testid={`row-lead-${a.id}`}>
                <div className="flex justify-between gap-2"><span className="font-semibold text-white truncate">{a.businessName}</span><span className="text-[11px] text-white/40 shrink-0">{fmt(a.createdAt)}</span></div>
                 <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                   <span className={`rounded px-1.5 py-0.5 ${statusTone(a.status)}`}>{statusLabel(a.status)}</span>
                   <span className="rounded border border-accent/30 px-1.5 py-0.5 text-[#ff8595]">Ad offer</span>
                   <span className="text-white/50 truncate">{a.cityState} · {a.offerSnapshot?.selectedPlan ? `${a.offerSnapshot.selectedPlan.name} ${money(a.offerSnapshot.selectedPlan.monthlyPrice)}/mo` : a.plan === "unsure" ? "Plan undecided" : statusLabel(a.plan)}</span>
                 </div>
              </button>
            </li>
          ))}
          {!list.length && <li className="p-6 text-sm text-white/50">No matches.</li>}
        </ul>
      </div>
      {current ? <LeadDetail key={current.id} app={current} /> : <div className="rounded-lg border border-white/10 p-16 text-center text-white/45">Select an application to review.</div>}
    </div>
  );
}

function LeadDetail({ app }: { app: AdminApplication }) {
  const { run, pending } = useAdminMutation();
  const [status, setStatus] = useState(app.status);
  const [notes, setNotes] = useState(app.notes ?? "");
  const [scope, setScope] = useState(app.scope ?? "");
  const [plan, setPlan] = useState(app.plan);
  const [link, setLink] = useState("");
  const locked = !!app.agreementAcceptedAt || !!app.tokenExpiresAt;
  useEffect(() => { setStatus(app.status); setNotes(app.notes ?? ""); setScope(app.scope ?? ""); setPlan(app.plan); }, [app]);

  const changes: Record<string, unknown> = {};
  if (status !== app.status) changes.status = status;
  if (notes !== (app.notes ?? "")) changes.notes = notes;
  if (!locked && scope !== (app.scope ?? "")) changes.scope = scope;
  if (!locked && plan !== app.plan) changes.plan = plan;
  const dirty = Object.keys(changes).length > 0;
  const canApprove = !locked && !!app.scope?.trim() && app.plan !== "unsure" && !dirty;

  return (
    <div className="rounded-lg border border-white/10 bg-[hsl(0_0%_7%)] p-5 md:p-6 space-y-6" data-testid={`panel-lead-${app.id}`}>
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-white">{app.businessName}</h2>
          <p className="text-white/60 text-sm">{app.businessType} · {app.cityState} · applied {fmt(app.createdAt)}</p>
        </div>
        <span className={`self-start rounded px-2 py-1 text-xs ${statusTone(app.status)}`}>{statusLabel(app.status)}</span>
      </div>

      <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {[
          ["Contact", app.fullName], ["Prefers", app.contactMethod],
          ["Email", <a key="e" href={`mailto:${app.email}`} className="text-[#ff6579] hover:underline [overflow-wrap:anywhere]">{app.email}</a>],
          ["Phone", <a key="p" href={`tel:${app.phone}`} className="text-[#ff6579] hover:underline">{app.phone}</a>],
          ["Website", app.websiteStatus === "redesign" ? app.websiteUrl : statusLabel(app.websiteStatus)],
          ["Goals", app.goals?.join(", ")],
          ["Consent", `Marketing ${app.marketingConsent ? "yes" : "no"} · SMS ${app.smsConsent ? "yes" : "no"}`],
          ["Lead source", app.leadSource ?? "Free Website Campaign"],
          ["Offer shown", app.offerSnapshot ? `$0 upfront design fee · ${app.offerSnapshot.plansShown.map((p) => `${p.name} ${money(p.monthlyPrice)}/mo`).join(" · ")}` : "Offer details not recorded for this application"],
          ["Plan interest when applied", app.offerSnapshot?.selectedPlan ? `${app.offerSnapshot.selectedPlan.name} — ${money(app.offerSnapshot.selectedPlan.monthlyPrice)}/month` : app.plan === "unsure" ? "Not sure yet" : statusLabel(app.plan)],
          ["Source", app.attribution && Object.keys(app.attribution).length ? Object.entries(app.attribution).map(([k, v]) => `${k}=${v}`).join(", ") : "Not shared"],
          ["Price note", app.offerSnapshot?.priceContext ?? "Final price is the one in the signed proposal, not necessarily this original application."],
          ["Agreement", app.agreementAcceptedAt ? `Signed ${fmt(app.agreementAcceptedAt)}` : app.tokenExpiresAt ? `Sent · link expires ${fmt(app.tokenExpiresAt)}` : "Not sent"],
          ["Payment", `${app.paymentStatus ?? "not started"} · ${app.paidMonths ?? 0} paid months${app.agreedPrice ? ` · ${money(app.agreedPrice)}/mo` : ""}`],
          ["Ownership", app.ownershipEligible ? "Eligible (six full paid months)" : "Not yet eligible"],
        ].map(([k, v]) => <div key={k as string}><dt className="text-white/45 text-xs">{k}</dt><dd className="text-white/90">{v || "—"}</dd></div>)}
      </dl>

       <div className="grid md:grid-cols-2 gap-4">
         <label className="space-y-1 text-sm"><span className="text-white/70">Status</span>
          <select className={input} value={status} onChange={(e) => setStatus(e.target.value as typeof status)} data-testid="select-status">{STATUSES.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}</select>
          <span className="block text-xs text-white/50">Mark the site as launched only after the customer approves the finished website and it is published. This unlocks the monthly-plan payment.</span>
        </label>
         <label className="space-y-1 text-sm"><span className="text-white/70 inline-flex items-center gap-1">Plan for proposal {locked && <Lock className="h-3 w-3" />}</span>
           <select className={input} value={plan} disabled={locked} onChange={(e) => setPlan(e.target.value)} data-testid="select-plan">{["essential", "growth", "full", "unsure"].map((p) => {
             const shown = app.offerSnapshot?.plansShown.find((offerPlan) => offerPlan.id === p);
             return <option key={p} value={p}>{statusLabel(p)}{shown ? ` — ${money(shown.monthlyPrice)}/mo` : ""}</option>;
           })}</select>
           <span className="block text-xs text-white/50">This working plan is for the proposal; it does not overwrite the original offer price snapshot above.</span>
        </label>
      </div>
      <label className="block space-y-1 text-sm"><span className="text-white/70 inline-flex items-center gap-1">Scope (pages, revisions, content limits, handoff) {locked && <><Lock className="h-3 w-3" /> locked after proposal sent</>}</span>
        <textarea className={`${input} min-h-28`} value={scope} disabled={locked} onChange={(e) => setScope(e.target.value)} data-testid="input-scope" />
      </label>
      <label className="block space-y-1 text-sm"><span className="text-white/70">Internal notes</span>
        <textarea className={`${input} min-h-20`} value={notes} onChange={(e) => setNotes(e.target.value)} data-testid="input-notes" />
      </label>

      <div className="flex flex-wrap gap-2">
        <button disabled={!dirty || !!pending} onClick={() => run("save", { action: "update", id: app.id, values: changes }, "Changes saved")} className={`${btn} bg-accent text-white hover:bg-accent/90`} data-testid="button-save-lead">{pending === "save" && <Loader2 className="h-4 w-4 animate-spin" />}Save changes</button>
        <button disabled={!canApprove || !!pending} title={canApprove ? "" : "Save a scope and pick a specific plan first"} onClick={async () => { const r = await run("approve", { action: "approve", id: app.id }, "Approved; agreement link created"); if (r && typeof r.onboardingUrl === "string") setLink(r.onboardingUrl); }} className={`${btn} border border-accent/60 text-white hover:bg-accent/10`} data-testid="button-approve">{pending === "approve" && <Loader2 className="h-4 w-4 animate-spin" />}Approve and send agreement</button>
        <button disabled={!!pending} onClick={() => run("pay", { action: "refresh_payment", id: app.id }, "Payment status reconciled with Stripe")} className={`${btn} border border-white/20 text-white/85 hover:bg-white/5`} data-testid="button-refresh-payment">{pending === "pay" ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}Refresh payment</button>
      </div>
      {link && (
        <div className="rounded-md border border-accent/40 bg-accent/10 p-3 text-sm flex gap-2 items-center">
          <code className="flex-1 text-white/90 [overflow-wrap:anywhere]" data-testid="text-onboarding-url">{link}</code>
          <button className={`${btn} text-white`} onClick={() => navigator.clipboard?.writeText(link)} aria-label="Copy link"><Copy className="h-4 w-4" /></button>
        </div>
      )}

      <div className="rounded-md border border-white/10 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-semibold text-white text-sm">Follow-ups {app.followupStopped && <span className="ml-2 text-xs text-white/50">stopped</span>}</p>
          <div className="flex flex-wrap gap-2">
            <button disabled={!!pending || app.followupStopped} onClick={() => run("fu", { action: "followup", id: app.id }, "Follow-up queued for consented channels")} className={`${btn} border border-white/20 text-white/85`} data-testid="button-queue-followup">Queue follow-up</button>
            <button disabled={!!pending} onClick={() => run("resp", { action: "update", id: app.id, values: { responded: true } }, "Marked as responded")} className={`${btn} border border-white/20 text-white/85`} data-testid="button-mark-responded">Customer responded</button>
            <button disabled={!!pending} onClick={() => run("stop", { action: "update", id: app.id, values: { followupStopped: !app.followupStopped } }, app.followupStopped ? "Follow-ups resumed" : "Follow-ups stopped")} className={`${btn} border border-white/20 text-white/85`} data-testid="button-toggle-followups">{app.followupStopped ? "Resume" : "Stop"} follow-ups</button>
          </div>
        </div>
        {app.mail?.length ? (
          <ul className="text-xs text-white/65 space-y-1">{app.mail.map((m, i) => <li key={i} className="flex justify-between gap-3"><span>{statusLabel(m.kind)}</span><span>{m.state} · {m.attempts} attempt{m.attempts === 1 ? "" : "s"} · {fmt(m.sentAt)}</span></li>)}</ul>
        ) : <p className="text-xs text-white/45">No notifications queued yet.</p>}
      </div>

      <div>
        <p className="font-semibold text-white text-sm mb-2">History</p>
        {app.history?.length ? (
          <ol className="border-l border-white/10 ml-1 space-y-3">{[...app.history].reverse().map((h, i) => (
            <li key={i} className="pl-4 relative text-sm"><span className="absolute -left-[4px] top-1.5 h-2 w-2 rounded-full bg-accent" /><p className="text-white/85">{h.text}</p><p className="text-xs text-white/45">{fmt(h.at)} · {h.actor}</p></li>
          ))}</ol>
        ) : <p className="text-xs text-white/45">No history yet.</p>}
      </div>
    </div>
  );
}

/* ───────── Analytics ───────── */
function Analytics({ doc }: { doc: AdminDoc }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [source, setSource] = useState("all");
  const [campaign, setCampaign] = useState("all");
  const [plan, setPlan] = useState("all");
  const src = (a?: Record<string, string> | null) => a?.utm_source || a?.source || "(none)";
  const camp = (a?: Record<string, string> | null) => a?.utm_campaign || "(none)";
  const inRange = (d: string) => (!from || d.slice(0, 10) >= from) && (!to || d.slice(0, 10) <= to);
  const sources = [...new Set([...doc.applications.map((a) => src(a.attribution)), ...doc.events.map((e) => src(e.attribution))])];
  const camps = [...new Set([...doc.applications.map((a) => camp(a.attribution)), ...doc.events.map((e) => camp(e.attribution))])];
  const apps = doc.applications.filter((a) => inRange(a.createdAt) && (source === "all" || src(a.attribution) === source) && (campaign === "all" || camp(a.attribution) === campaign) && (plan === "all" || a.plan === plan));
  const appSessions = new Set(apps.map(a => `application:${a.id}`));
  const events = doc.events.filter((e) => inRange(e.createdAt) && (source === "all" || src(e.attribution) === source) && (campaign === "all" || camp(e.attribution) === campaign) && (plan === "all" || appSessions.has(e.sessionId)));
  const uniq = (n: string) => new Set(events.filter((e) => e.name === n).map((e) => e.sessionId)).size;
  const visitors = uniq("landing_view"), starts = uniq("application_started");
  const paying = apps.filter((a) => a.paymentStatus === "active");
  const mrr = paying.reduce((s, a) => s + (a.agreedPrice ?? 0), 0);
  const pct = (a: number, b: number) => (b ? `${((a / b) * 100).toFixed(1)}%` : "—");
  const STEP_NAMES = ["1. Business + website", "2. Goals + plan", "3. Contact + submit"];
  const steps = [1, 2, 3].map((s) => new Set(events.filter((e) => e.name === "step_completed" && e.step === s).map((e) => e.sessionId)).size);
  const maxStep = Math.max(1, starts, ...steps);
  const INTERNAL = ["application_submitted", "qualified_lead", "approved_application", "agreement_accepted", "payment_completed", "website_launched", "new_monthly_subscription"];
  const internalCounts = INTERNAL.map((n) => [n, events.filter((e) => e.name === n).length] as const);
  const days = [...new Set(events.map((e) => e.createdAt.slice(0, 10)))].sort().reverse().slice(0, 60);
  const daily = days.map((d) => {
    const on = events.filter((e) => e.createdAt.slice(0, 10) === d);
    const u = (n: string, st?: number) => new Set(on.filter((e) => e.name === n && (st === undefined || e.step === st)).map((e) => e.sessionId)).size;
    return { d, views: u("landing_view"), starts: u("application_started"), done: u("step_completed", 3), submitted: on.filter((e) => e.name === "application_submitted").length };
  });
  const cards: [string, string, string?][] = [
    ["Consenting visitors", String(visitors)], ["Started application", String(starts), pct(starts, visitors)],
    ["Applications", String(apps.length)], ["Qualified leads", String(apps.filter(a => a.status === "qualified").length)], ["Application → customer rate", pct(paying.length, apps.length)], ["Visitor → application rate", "Not comparable"], ["Approved", String(apps.filter((a) => a.tokenExpiresAt || a.agreementAcceptedAt).length)],
    ["Paying clients", String(paying.length)], ["Monthly recurring", paying.length ? money(mrr) : "$0"],
    ["Ad spend", "Unavailable"], ["Cost per application", "Unavailable"],
  ];
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 rounded-lg border border-white/10 p-4">
        <label className="text-xs text-white/60 space-y-1">From<input type="date" className={input} value={from} onChange={(e) => setFrom(e.target.value)} data-testid="input-from" /></label>
        <label className="text-xs text-white/60 space-y-1">To<input type="date" className={input} value={to} onChange={(e) => setTo(e.target.value)} data-testid="input-to" /></label>
        <label className="text-xs text-white/60 space-y-1">Source<select className={input} value={source} onChange={(e) => setSource(e.target.value)} data-testid="select-source"><option value="all">All</option>{sources.map((s) => <option key={s}>{s}</option>)}</select></label>
        <label className="text-xs text-white/60 space-y-1">Campaign<select className={input} value={campaign} onChange={(e) => setCampaign(e.target.value)} data-testid="select-campaign"><option value="all">All</option>{camps.map((s) => <option key={s}>{s}</option>)}</select></label>
        <label className="text-xs text-white/60 space-y-1">Plan<select className={input} value={plan} onChange={(e) => setPlan(e.target.value)} data-testid="select-plan-filter"><option value="all">All</option>{["essential", "growth", "full", "unsure"].map((p) => <option key={p}>{p}</option>)}</select></label>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map(([k, v, sub]) => (
          <div key={k} className="rounded-lg border border-white/10 bg-[hsl(0_0%_7%)] p-4" data-testid={`stat-${k.toLowerCase().replace(/\s+/g, "-")}`}>
            <p className="text-xs text-white/50">{k}</p><p className={`mt-1 text-2xl font-extrabold ${v === "Unavailable" || v === "Not comparable" ? "text-white/35 text-lg" : "text-white"}`}>{v}</p>{sub && <p className="text-xs text-white/45">{sub.includes("%") ? `${sub} of consenting visitors` : sub}</p>}
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-white/10 p-5">
        <p className="font-semibold text-white text-sm mb-4">Step completion (consenting sessions)</p>
        <div className="space-y-2">
          {[["Started", starts], ...steps.map((n, i) => [STEP_NAMES[i], n] as [string, number])].map(([l, n]) => (
            <div key={l as string} className="grid grid-cols-[150px_1fr_40px] items-center gap-3 text-xs">
              <span className="text-white/60">{l}</span>
              <div className="h-2 rounded bg-white/5 overflow-hidden"><div className="h-full bg-accent origin-left" style={{ transform: `scaleX(${(n as number) / maxStep})` }} /></div>
              <span className="text-white/80 text-right">{n}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-lg border border-white/10 p-5 overflow-auto">
          <p className="font-semibold text-white text-sm mb-3">Daily (consenting sessions; submissions from server events)</p>
          {daily.length ? (
            <table className="w-full text-xs" data-testid="table-daily">
              <thead className="text-white/50 text-left"><tr><th className="py-1">Date</th><th>Views</th><th>Starts</th><th>Step 3</th><th>Submitted</th></tr></thead>
              <tbody className="text-white/85">{daily.map((r) => <tr key={r.d} className="border-t border-white/5"><td className="py-1.5">{r.d}</td><td>{r.views}</td><td>{r.starts}</td><td>{r.done}</td><td>{r.submitted}</td></tr>)}</tbody>
            </table>
          ) : <p className="text-sm text-white/45">No events in this range.</p>}
        </div>
        <div className="rounded-lg border border-white/10 p-5">
          <p className="font-semibold text-white text-sm mb-3">Pipeline events (server-recorded)</p>
          <ul className="space-y-1.5 text-sm">{internalCounts.map(([n, c]) => <li key={n} className="flex justify-between"><span className="text-white/65">{statusLabel(n)}</span><span className="text-white font-semibold" data-testid={`count-${n}`}>{c}</span></li>)}</ul>
        </div>
      </div>
      <p className="text-xs text-white/45">Step counts use the current three-step application; sessions recorded under the earlier six-step form may show in steps 1 to 3 with older meanings. Visitor and start counts include only people who opted in; application and customer counts include submitted leads, so visitor-to-application rates aren't comparable. A plan filter applies to leads and their milestones, not unidentified visitors. Revenue reflects Stripe-verified active subscriptions at agreed prices. Advertising costs are unavailable.</p>
    </div>
  );
}

/* ───────── Settings ───────── */
function Settings({ config }: { config: CampaignConfig }) {
  const { run, pending } = useAdminMutation();
  const [headline, setHeadline] = useState(config.headline);
  const [intro, setIntro] = useState(config.intro);
  const [deadline, setDeadline] = useState(config.deadline?.slice(0, 10) ?? "");
  const [faqs, setFaqs] = useState<CampaignFaq[]>(config.faqs ?? []);
  const [projects, setProjects] = useState<CampaignProject[]>(config.projects ?? []);
  const save = () => run("settings", { action: "settings", values: { headline, intro, deadline, faqs, projects } }, "Campaign content saved");
  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      <section className="rounded-lg border border-white/10 p-5 space-y-4">
        <h2 className="font-bold text-white">Header</h2>
        <label className="block text-sm space-y-1"><span className="text-white/70">Headline</span><input className={input} value={headline} onChange={(e) => setHeadline(e.target.value)} data-testid="input-headline" /></label>
        <label className="block text-sm space-y-1"><span className="text-white/70">Intro</span><textarea className={`${input} min-h-24`} value={intro} onChange={(e) => setIntro(e.target.value)} data-testid="input-intro" /></label>
        <label className="block text-sm space-y-1"><span className="text-white/70">Application deadline</span><input type="date" className={input} value={deadline} max="2027-01-31" onChange={(e) => setDeadline(e.target.value)} data-testid="input-deadline" /></label>
        <label className="flex items-center justify-between gap-3 rounded-md border border-white/10 p-3 text-sm">
          <span><span className="text-white font-semibold block">Automated follow-ups</span><span className="text-white/50 text-xs">Only sent to applicants who opted in.</span></span>
          <button role="switch" aria-checked={config.followupsEnabled} disabled={!!pending} onClick={() => run("auto", { action: "settings", values: { followupsEnabled: !config.followupsEnabled } }, `Follow-ups ${config.followupsEnabled ? "disabled" : "enabled"}`)} className={`relative h-6 w-11 rounded-full transition-colors ${config.followupsEnabled ? "bg-accent" : "bg-white/15"}`} data-testid="switch-followups">
            <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${config.followupsEnabled ? "translate-x-5" : ""}`} />
          </button>
        </label>
        <p className="text-xs text-white/45">Plan prices and ownership terms are fixed and not editable here.</p>
      </section>
      <section className="rounded-lg border border-white/10 p-5 space-y-3">
        <div className="flex justify-between items-center"><h2 className="font-bold text-white">FAQs</h2><button onClick={() => setFaqs([...faqs, { question: "", answer: "" }])} className={`${btn} text-white/80`} data-testid="button-add-faq"><Plus className="h-4 w-4" /> Add</button></div>
        {faqs.map((f, i) => (
          <div key={i} className="rounded-md border border-white/10 p-3 space-y-2">
            <div className="flex gap-2"><input className={input} placeholder="Question" value={f.question} onChange={(e) => setFaqs(faqs.map((x, j) => j === i ? { ...x, question: e.target.value } : x))} data-testid={`input-faq-q-${i}`} /><button onClick={() => setFaqs(faqs.filter((_, j) => j !== i))} className={`${btn} text-white/50 hover:text-[#ff6579]`} aria-label="Remove FAQ"><Trash2 className="h-4 w-4" /></button></div>
            <textarea className={`${input} min-h-16`} placeholder="Answer" value={f.answer} onChange={(e) => setFaqs(faqs.map((x, j) => j === i ? { ...x, answer: e.target.value } : x))} data-testid={`input-faq-a-${i}`} />
          </div>
        ))}
        {!faqs.length && <p className="text-sm text-white/45">No FAQs yet.</p>}
      </section>
      <section className="rounded-lg border border-white/10 p-5 space-y-3 lg:col-span-2">
        <div className="flex justify-between items-center"><h2 className="font-bold text-white">Showcase projects</h2><button onClick={() => setProjects([...projects, { title: "", image: "", url: "", label: "" }])} className={`${btn} text-white/80`} data-testid="button-add-project"><Plus className="h-4 w-4" /> Add</button></div>
        <p className="text-xs text-white/45">Items are shown publicly under "Website examples" with their label. Only add real sites you have permission to show; avoid unverified results claims.</p>
        {projects.map((p, i) => (
          <div key={i} className="grid md:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2">
            {(["title", "image", "url", "label"] as const).map((k) => <input key={k} className={input} placeholder={k === "image" ? "/images/portfolio/…" : k} value={p[k]} onChange={(e) => setProjects(projects.map((x, j) => j === i ? { ...x, [k]: e.target.value } : x))} data-testid={`input-project-${k}-${i}`} />)}
            <button onClick={() => setProjects(projects.filter((_, j) => j !== i))} className={`${btn} text-white/50 hover:text-[#ff6579]`} aria-label="Remove project"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </section>
      <div className="lg:col-span-2"><button onClick={save} disabled={!!pending} className={`${btn} bg-accent text-white px-5 py-2.5`} data-testid="button-save-settings">{pending === "settings" && <Loader2 className="h-4 w-4 animate-spin" />}Save content</button></div>
    </div>
  );
}
