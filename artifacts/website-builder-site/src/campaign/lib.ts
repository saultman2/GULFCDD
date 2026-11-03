import { recordCampaignEvent } from "@workspace/api-client-react";
import { fireEvent, trackEvent } from "@/lib/analytics";

export type PlanId = "essential" | "growth" | "full";
export interface CampaignPlan { id: PlanId; name: string; price: number; regularPrice?: number; features: string[] }
// price is the founding monthly rate through January 31, 2027. regularPrice is the ongoing rate.
export interface CampaignOfferSnapshot {
  source: string;
  page: string;
  designFeeUpfront: number;
  plansShown: { id: string; name: string; monthlyPrice: number }[];
  selectedPlan: { id: string; name: string; monthlyPrice: number } | null;
  priceContext: string;
}
export interface CampaignFaq { question: string; answer: string }
export interface CampaignProject { title: string; image: string; url: string; label: string }
export interface CampaignConfig {
  headline: string; intro: string; deadline: string; ownershipTerms: string;
  plans: CampaignPlan[]; faqs: CampaignFaq[]; projects: CampaignProject[]; followupsEnabled: boolean;
}
export const STATUSES = [
  "new_application", "under_review", "contacted", "qualified", "approved", "awaiting_agreement",
  "awaiting_payment", "website_in_progress", "website_launched", "active_monthly_client", "declined", "closed_lost",
] as const;
export type AppStatus = (typeof STATUSES)[number];
export interface HistoryItem { at: string; text: string; actor: string }
export interface AdminApplication {
  id: number; businessName: string; businessType: string; cityState: string; websiteStatus: string;
  websiteUrl?: string | null; goals: string[]; plan: string; fullName: string; email: string; phone: string;
  contactMethod: string; attribution?: Record<string, string> | null; status: AppStatus; notes?: string | null;
  leadSource?: string; offerSnapshot?: CampaignOfferSnapshot;
  scope?: string | null; agreedPrice?: number | null; agreementAcceptedAt?: string | null; paymentStatus?: string | null;
  paidMonths?: number | null; ownershipEligible?: boolean; createdAt: string; history?: HistoryItem[];
  marketingConsent?: boolean; smsConsent?: boolean; followupStopped?: boolean; tokenExpiresAt?: string | null;
  mail?: { kind: string; state: string; attempts: number; sentAt?: string | null }[];
}
export interface AdminEvent { name: string; sessionId: string; step?: number | null; attribution?: Record<string, string> | null; createdAt: string }
export interface AdminDoc { applications: AdminApplication[]; config: CampaignConfig; events: AdminEvent[]; analytics?: Record<string, unknown> }
export interface OnboardingDoc {
  businessName: string; plan: string; price: number; scope: string; ownershipTerms: string; agreement?: string | null;
  agreementAcceptedAt?: string | null; paymentStatus?: string | null; paidMonths?: number | null;
  ownershipEligible?: boolean; checkoutAvailable?: boolean; status?: string;
}

export const statusLabel = (s: string) => s.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
export const money = (n: number | null | undefined) =>
  typeof n === "number" ? `$${n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0 })}` : "Unavailable";
export const errStatus = (e: unknown) => (e && typeof e === "object" && "status" in e ? Number((e as { status: number }).status) : 0);
export const errMessage = (e: unknown) => {
  const d = e && typeof e === "object" && "data" in e ? (e as { data: unknown }).data : null;
  if (d && typeof d === "object" && "error" in d && typeof (d as { error: unknown }).error === "string") return (d as { error: string }).error;
  return e instanceof Error ? e.message : "Something went wrong.";
};
export const uuid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;

/* ── Campaign analytics consent (explicit opt-in, nothing sent before) ── */
const CONSENT_KEY = "gcdd_fw_analytics";
const SESSION_KEY = "gcdd_fw_session";
const ATTR_KEY = "gcdd_fw_attr";
const SENT_KEY = "gcdd_fw_sent";
export type Consent = "granted" | "denied" | null;
export function readConsent(): Consent {
  try { const v = sessionStorage.getItem(CONSENT_KEY); return v === "granted" || v === "denied" ? v : null; } catch { return null; }
}
export function writeConsent(v: "granted" | "denied") {
  try {
    sessionStorage.setItem(CONSENT_KEY, v);
    if (v === "denied") { sessionStorage.removeItem(ATTR_KEY); sessionStorage.removeItem(SESSION_KEY); }
    else { captureAttribution(); loadOptInAnalytics(); }
  } catch { /* storage blocked */ }
}
function sessionId() {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) { id = uuid(); sessionStorage.setItem(SESSION_KEY, id); }
  return id;
}
const ATTR_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "source"];
export function captureAttribution() {
  if (readConsent() !== "granted") return;
  if (sessionStorage.getItem(ATTR_KEY)) return; // Preserve the first consented touch.
  const q = new URLSearchParams(window.location.search);
  const found: Record<string, string> = {};
  for (const k of ATTR_PARAMS) { const v = q.get(k); if (v) found[k] = v.slice(0, 120); }
  sessionStorage.setItem(ATTR_KEY, JSON.stringify(found));
}
export function getAttribution(): Record<string, string> | undefined {
  if (readConsent() !== "granted") return undefined;
  try { const a = sessionStorage.getItem(ATTR_KEY); return a ? JSON.parse(a) : undefined; } catch { return undefined; }
}
export function trackCampaign(name: "landing_view" | "application_started" | "step_completed", step?: number) {
  if (readConsent() !== "granted") return;
  try {
    const sid = sessionId();
    const eventKey = `${sid}:${name}:${step ?? 0}`;
    const sent: string[] = JSON.parse(sessionStorage.getItem(SENT_KEY) || "[]");
    if (sent.includes(eventKey)) return;
    sessionStorage.setItem(SENT_KEY, JSON.stringify([...sent, eventKey]));
    sendThirdParty(`campaign_${name}`, step ? { step } : {});
    void recordCampaignEvent({ name, sessionId: sid, eventKey, consent: true, step, attribution: getAttribution() }).catch(() => {});
  } catch { /* ignore */ }
}

/* ── Optional third-party analytics, consent-gated, never PII ── */
type W = Window & {
  __GULFCDD_LOAD_ANALYTICS__?: () => void;
  dataLayer?: unknown[];
  fbq?: (cmd: string, name: string, params?: Record<string, unknown>) => void;
};
export function loadOptInAnalytics() {
  if (readConsent() !== "granted") return;
  try { (window as W).__GULFCDD_LOAD_ANALYTICS__?.(); } catch { /* */ }
}
export function sendThirdParty(name: string, params: Record<string, string | number | boolean> = {}) {
  if (readConsent() !== "granted") return;
  const w = window as W;
  try {
    if (typeof w.gtag === "function") fireEvent(name, params);
    else {
      if (Array.isArray(w.dataLayer)) w.dataLayer.push({ event: name, ...params });
      trackEvent(name, params);
    }
    if (typeof w.fbq === "function") w.fbq("trackCustom", name, params);
  } catch { /* analytics must never break the app */ }
}
