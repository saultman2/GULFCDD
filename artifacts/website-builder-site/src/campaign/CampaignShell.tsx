import { useEffect, useState, type ReactNode } from "react";
import { Link } from "wouter";
import { Phone, Mail, Menu, X } from "lucide-react";
import { loadOptInAnalytics, readConsent, writeConsent, trackCampaign, type Consent } from "./lib";

const NAV: [string, string][] = [["/free-website/#examples", "Examples"], ["/free-website/#plans", "Plans"], ["/free-website/#apply", "Application"]];

export function CampaignShell({ children, cta = true }: { children: ReactNode; cta?: boolean }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { loadOptInAnalytics(); }, []);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[hsl(0_0%_5%/0.92)] backdrop-blur">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3" data-testid="link-home" aria-label="Gulf Coast Digital Designs home">
            <img src={`${import.meta.env.BASE_URL}images/gulfcdd-logo.png`} alt="Gulf Coast Digital Designs" width={1254} height={1254} className="h-9 w-9 object-contain" />
            <span className="hidden lg:inline text-sm font-semibold text-white/85">Gulf Coast Digital Designs</span>
          </Link>
          <nav aria-label="Free website offer" className="hidden md:flex items-center gap-1 text-sm">
            {NAV.map(([href, label]) => <a key={href} href={href} className="rounded-md px-3 py-2 text-white/75 hover:text-white hover:bg-white/5" data-testid={`link-nav-${label.toLowerCase().replace(/\s+/g, "-")}`}>{label}</a>)}
            <Link href="/" className="rounded-md px-3 py-2 text-white/75 hover:text-white hover:bg-white/5" data-testid="link-nav-main-site">Main website</Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-4 text-sm">
            <a href="tel:2282787782" className="hidden sm:inline-flex items-center gap-1.5 text-white/75 hover:text-white" data-testid="link-phone">
              <Phone className="h-4 w-4" /> (228) 278-7782
            </a>
            {cta && (
              <a href="#apply" className="rounded-md bg-accent px-4 py-2 font-semibold text-white hover:bg-accent/90 transition-colors" data-testid="link-header-apply">
                Apply now
              </a>
            )}
            <button type="button" className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/15 text-white" aria-expanded={open} aria-controls="campaign-mobile-nav" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((o) => !o)} data-testid="button-mobile-menu">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open && (
          <nav id="campaign-mobile-nav" aria-label="Free website offer" className="md:hidden border-t border-white/10 px-5 py-3 grid gap-1 text-base animate-in fade-in slide-in-from-top-1">
            {NAV.map(([href, label]) => <a key={href} href={href} onClick={() => setOpen(false)} className="rounded-md px-3 py-3 text-white/85 hover:bg-white/5">{label}</a>)}
            <Link href="/" className="rounded-md px-3 py-3 text-white/85 hover:bg-white/5">Main website</Link>
            <a href="tel:2282787782" className="rounded-md px-3 py-3 text-white/85 hover:bg-white/5 inline-flex items-center gap-2"><Phone className="h-4 w-4" /> (228) 278-7782</a>
          </nav>
        )}
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-white/10 bg-[hsl(0_0%_4%)]">
        <div className="mx-auto max-w-6xl px-5 py-10 grid gap-6 md:grid-cols-[1fr_auto] text-sm text-white/65">
          <div className="space-y-2">
            <p className="font-semibold text-white">Gulf Coast Digital Designs</p>
            <p>Veteran-owned web design · Biloxi, Mississippi</p>
            <p className="flex flex-wrap gap-x-5 gap-y-1">
              <a href="tel:2282787782" className="hover:text-white inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> (228) 278-7782</a>
              <a href="mailto:aultman@gulfcoastdigitaldesign.com" className="hover:text-white inline-flex items-center gap-1.5 [overflow-wrap:anywhere]"><Mail className="h-3.5 w-3.5" /> aultman@gulfcoastdigitaldesign.com</a>
            </p>
          </div>
          <nav className="flex flex-wrap gap-5 items-start" aria-label="Company">
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export function AnalyticsConsentBar() {
  const [c, setC] = useState<Consent>(readConsent);
  if (c) {
    return (
      <p className="text-xs text-white/50">
        Campaign analytics {c === "granted" ? "on" : "off"}.{" "}
        <button type="button" className="underline hover:text-white" onClick={() => { const n = c === "granted" ? "denied" : "granted"; writeConsent(n); setC(n); if (n === "granted") trackCampaign("landing_view"); }} data-testid="button-toggle-analytics">
          {c === "granted" ? "Turn off" : "Turn on"}
        </button>
      </p>
    );
  }
  return (
    <div role="region" aria-label="Analytics choice" className="rounded-lg border border-white/15 bg-[hsl(0_0%_9%)] p-4 animate-in fade-in">
      <p className="text-sm text-white/85">May we count anonymous page and step visits (plus ad source tags) to improve this offer? No names or contact details are included.</p>
      <div className="mt-3 flex gap-2">
        <button type="button" className="rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-white" onClick={() => { writeConsent("granted"); setC("granted"); trackCampaign("landing_view"); }} data-testid="button-analytics-accept">Allow</button>
        <button type="button" className="rounded-md border border-white/20 px-3 py-1.5 text-sm text-white/85 hover:bg-white/5" onClick={() => { writeConsent("denied"); setC("denied"); }} data-testid="button-analytics-reject">No thanks</button>
      </div>
    </div>
  );
}
