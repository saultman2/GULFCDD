import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { fireEvent } from "@/lib/analytics";

const EXPIRES_AT = Date.parse("2027-02-01T06:00:00Z");
const isPrerender = () =>
  typeof window !== "undefined" &&
  (window as unknown as { __GULFCDD_PRERENDER__?: boolean }).__GULFCDD_PRERENDER__ === true;
const isActive = () => !isPrerender() && Date.now() < EXPIRES_AT;

export function HomePromotion() {
  const [active, setActive] = useState(isActive);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const detailsButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!active) return;
    fireEvent("promotion_shown", { promotion: "founding_free_build_2027", location: "home" });
  }, [active]);

  useEffect(() => {
    if (!active) return;
    if (EXPIRES_AT - Date.now() <= 0) { setActive(false); return; }
    // Re-check periodically; avoids setTimeout overflow limits in long-lived tabs.
    const id = window.setInterval(() => { if (!isActive()) { setActive(false); setDetailsOpen(false); } }, 30000);
    return () => window.clearInterval(id);
  }, [active]);

  if (!active) return null;

  const ctaClick = () =>
    fireEvent("promotion_cta_click", { promotion: "founding_free_build_2027", destination: "/intake/?mode=quick&source=homepage-special" });

  return (
    <section
      aria-labelledby="home-promo-title"
      data-testid="section-home-promotion"
      data-promotion-showing="true"
      className="bg-neutral-900 text-white border-y-4 border-accent"
    >
      <div className="container mx-auto grid gap-5 px-4 py-6 md:px-6 md:py-7 lg:grid-cols-2 lg:gap-x-8">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/80">Limited-time offer</p>
          <h2 id="home-promo-title" className="text-3xl md:text-4xl font-black uppercase leading-none mt-1">
            <span className="text-accent">Free build</span> for founding clients
          </h2>
        </div>
        <div className="flex-1 text-sm md:text-base text-neutral-200 leading-relaxed">
          <p>
            Essential is <strong className="text-white">$150 per month</strong> for hosting and upkeep.
            Growth is <strong className="text-white">$500</strong> a month
            (<strong className="text-white">$250</strong> founding).
            Full Service is <strong className="text-white">$1,000</strong> a month
            (<strong className="text-white">$500</strong> founding).
            Every plan includes an analytics report. No contract.
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            Founding clients get the website build free. The offer ends January 31, 2027.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:col-span-2">
          <Link
            href="/intake/?mode=quick&source=homepage-special"
            data-testid="link-promotion-cta"
            onClick={ctaClick}
            className="inline-flex h-12 items-center justify-center rounded bg-accent px-6 font-black uppercase tracking-wide text-white hover:bg-accent/90 focus:outline-none focus-visible:ring-4 focus-visible:ring-white"
          >
            Get started today
          </Link>
          <button
            ref={detailsButton}
            type="button"
            data-testid="button-promotion-details"
            onClick={() => setDetailsOpen(true)}
            className="inline-flex h-12 items-center justify-center rounded border border-white/40 px-5 font-bold text-white hover:bg-white/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-accent"
          >
            Offer details
          </button>
        </div>
      </div>

      <DialogPrimitive.Root open={detailsOpen} onOpenChange={(open) => {
        if (!open && detailsOpen) {
          fireEvent("promotion_dismissed", { promotion: "founding_free_build_2027", method: "details_closed" });
        }
        setDetailsOpen(open);
      }}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-black/80" />
          <DialogPrimitive.Content
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              detailsButton.current?.focus();
            }}
            data-testid="dialog-home-promotion"
            className="fixed left-1/2 top-1/2 z-[61] flex max-h-[92dvh] w-[calc(100vw-1.5rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-md border-4 border-neutral-600 bg-neutral-900 text-center text-white shadow-2xl"
          >
            <DialogPrimitive.Close
              data-testid="button-dismiss-promotion"
              className="absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-neutral-200 text-neutral-950 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-accent"
            >
              <X className="h-5 w-5 text-neutral-950" aria-hidden />
              <span className="sr-only">Close offer details</span>
            </DialogPrimitive.Close>

            <div className="shrink-0 bg-accent px-12 pb-3 pt-5">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/90">Limited-time offer</p>
              <DialogPrimitive.Title className="mt-1 text-5xl font-black uppercase leading-none sm:text-6xl">
                Free build
              </DialogPrimitive.Title>
              <p className="mt-1 text-lg font-extrabold uppercase">For founding clients</p>
            </div>

            <div className="min-h-0 overflow-y-auto px-5 py-5">
              <DialogPrimitive.Description className="text-sm text-neutral-300">
                Veteran-owned on the Mississippi Gulf Coast. The founding offer ends January 31, 2027.
              </DialogPrimitive.Description>

              <div className="mt-4 rounded bg-[#ffffff] px-4 py-3 text-neutral-950">
                <p className="text-xs font-extrabold uppercase tracking-widest">Plans from</p>
                <p className="text-5xl font-black leading-tight text-accent">
                  $150<span className="text-base font-bold text-neutral-500">/mo</span>
                </p>
                <p className="text-xs font-bold uppercase">Essential hosting and upkeep</p>
              </div>

              <p className="mt-3 text-base font-extrabold uppercase">
                Growth <span className="rounded-sm bg-accent px-1.5 py-0.5 text-white">$500</span> · Full Service <span className="rounded-sm bg-accent px-1.5 py-0.5 text-white">$1,000</span>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                Founding rates are $250 a month for Growth and $500 a month for Full Service. Every plan includes an analytics report. No contract.
              </p>

              <div className="mt-6 space-y-5 text-left text-sm leading-relaxed text-neutral-300">
                <section>
                  <h3 className="mb-1 font-bold text-white">Essential</h3>
                  <p>$150 a month for hosting and upkeep, plus a monthly analytics report. Month to month, no contract.</p>
                </section>
                <section>
                  <h3 className="mb-1 font-bold text-white">Growth</h3>
                  <p>$500 a month, or $250 a month for founding clients. Adds local SEO and blog posts. Includes an analytics report. No contract.</p>
                </section>
                <section>
                  <h3 className="mb-1 font-bold text-white">Full Service</h3>
                  <p>$1,000 a month, or $500 a month for founding clients. Includes an analytics report. No contract.</p>
                </section>
                <section>
                  <h3 className="mb-1 font-bold text-white">Founding offer</h3>
                  <p>Founding clients get the website build free. The offer ends January 31, 2027.</p>
                </section>
                <section>
                  <h3 className="mb-1 font-bold text-white">No contract</h3>
                  <p>You pay month to month and can cancel anytime.</p>
                </section>
                <section className="rounded border border-white/20 bg-white/5 p-4">
                  <h3 className="mb-1 font-bold text-white">Every plan includes an analytics report</h3>
                  <p>Each plan includes a monthly analytics report so you can see what is working. No one can promise a particular Google ranking.</p>
                </section>
              </div>
            </div>

            <div className="shrink-0 border-t border-white/15 px-5 pb-4 pt-3">
              <Link
                href="/intake/?mode=quick&source=homepage-special"
                data-testid="link-promotion-dialog-cta"
                onClick={() => { ctaClick(); setDetailsOpen(false); }}
                className="block rounded bg-accent px-6 py-4 text-lg font-black uppercase tracking-wide text-white hover:bg-accent/90 focus:outline-none focus-visible:ring-4 focus-visible:ring-white"
              >
                Get started today
              </Link>

              <p className="mt-3 text-[11px] leading-snug text-neutral-400">
                Founding clients get the website build free through January 31, 2027. Plans stay month to month.
              </p>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </section>
  );
}
