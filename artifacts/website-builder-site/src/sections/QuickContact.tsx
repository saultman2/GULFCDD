import { Mail, MessageSquare, Phone } from "lucide-react";
import { EmailLink } from "@/components/EmailLink";
import { fireEvent } from "@/lib/analytics";

const tile =
  "group flex min-h-[44px] min-w-0 flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-4 text-center transition-all hover:border-accent hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 sm:flex-row sm:justify-start sm:gap-4 sm:px-5 sm:text-left";
const iconWrap =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors group-hover:bg-accent";

export function QuickContact({ className = "mb-8" }: { className?: string }) {
  return (
    <nav aria-label="Contact us directly" className={className}>
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
        Reach us directly
      </p>
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <EmailLink
          data-testid="contact-email-link"
          aria-label="Email aultman@gulfcoastdigitaldesign.com"
          className={tile}
          onClick={() => fireEvent("cta_click", { cta_label: "contact_quick_email" })}
        >
          <span className={iconWrap}><Mail className="h-5 w-5" aria-hidden="true" /></span>
          <span className="min-w-0">
            <span className="block text-sm font-bold text-primary">Email</span>
            <span className="hidden text-xs text-muted-foreground [overflow-wrap:anywhere] md:block">aultman@gulfcoastdigitaldesign.com</span>
          </span>
        </EmailLink>
        <a
          href="sms:+12282787782"
          data-testid="contact-text-link"
          aria-label="Text (228) 278-7782"
          className={tile}
          onClick={() => fireEvent("cta_click", { cta_label: "contact_quick_text" })}
        >
          <span className={iconWrap}><MessageSquare className="h-5 w-5" aria-hidden="true" /></span>
          <span className="min-w-0">
            <span className="block text-sm font-bold text-primary">Text</span>
            <span className="hidden text-xs text-muted-foreground md:block">(228) 278-7782</span>
          </span>
        </a>
        <a
          href="tel:+12282787782"
          data-testid="contact-call-link"
          aria-label="Call (228) 278-7782"
          className={tile}
          onClick={() => fireEvent("cta_click", { cta_label: "contact_quick_call" })}
        >
          <span className={iconWrap}><Phone className="h-5 w-5" aria-hidden="true" /></span>
          <span className="min-w-0">
            <span className="block text-sm font-bold text-primary">Call</span>
            <span className="hidden text-xs text-muted-foreground md:block">(228) 278-7782</span>
          </span>
        </a>
      </div>
    </nav>
  );
}
