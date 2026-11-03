import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowRight, X } from "lucide-react";
import { fireEvent } from "@/lib/analytics";
import type { CapabilityPreview } from "@/data/capability-previews";
import type { RefObject } from "react";

interface Props {
  preview: CapabilityPreview | null;
  onOpenChange: (open: boolean) => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
}

export function CapabilityPreviewDialog({ preview, onOpenChange, returnFocusRef }: Props) {
  return (
    <DialogPrimitive.Root open={preview !== null} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay data-testid="overlay-capability-preview" className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          data-testid="dialog-capability-preview"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            returnFocusRef.current?.focus({ preventScroll: true });
          }}
          className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-1.5rem)] max-w-5xl max-h-[calc(100dvh-1.5rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-xl border border-white/15 bg-[#0c0d10] text-white shadow-2xl focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          {preview && (
            <>
              <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4 md:px-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">Example preview</span>
                  <DialogPrimitive.Title className="mt-1 font-heading text-xl md:text-2xl font-bold leading-tight">
                    {preview.label}
                  </DialogPrimitive.Title>
                </div>
                <DialogPrimitive.Close
                  data-testid="button-close-preview"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-white/70 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">Close example</span>
                </DialogPrimitive.Close>
              </div>
              <div className="px-5 pt-5 md:px-6">
                <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]">
                  <img
                    key={preview.id}
                    src={preview.image}
                    alt={preview.alt}
                    width={1200}
                    height={788}
                    decoding="async"
                    className="block h-auto w-full aspect-[1200/788]"
                    data-testid={`img-preview-${preview.id}`}
                  />
                </div>
                <p className="mt-2 text-xs text-white/55">Sample screen with a fictional business, sample content, and .example details. Your site is designed around your own content.</p>
                <a
                  href={preview.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  Open full-size picture <span className="sr-only">(opens in a new tab)</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
              <div className="flex flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-6">
                <DialogPrimitive.Description className="text-sm md:text-base text-white/85 leading-relaxed max-w-lg">
                  {preview.summary}
                </DialogPrimitive.Description>
                <a
                  href={`/intake/?mode=quick&example=${preview.id}`}
                  data-testid="link-preview-quote"
                  onClick={() => fireEvent("cta_click", { cta_label: "capability_preview_quote", preview_id: preview.id })}
                  className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-accent px-6 text-sm font-bold text-white hover:bg-accent/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
                >
                  Get a Free Quote <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
