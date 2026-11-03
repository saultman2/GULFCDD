import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, PhoneCall, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { fireEvent } from "@/lib/analytics";

const SESSION_KEY = "gulfcdd_exit_seen";
const MIN_TIME_ON_PAGE_MS = 5000; // don't fire within the first 5 seconds

export function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();
  const [location] = useLocation();

  const arrivedAt = useRef(Date.now());
  const triggered = useRef(false);

  function shouldSkip() {
    // Don't show on the contact page — they're already converting
    if (location === "/contact") return true;
    // Only show once per session
    if (sessionStorage.getItem(SESSION_KEY)) return true;
    // Must have been on the page long enough
    if (Date.now() - arrivedAt.current < MIN_TIME_ON_PAGE_MS) return true;
    return false;
  }

  function trigger() {
    if (triggered.current || shouldSkip()) return;
    triggered.current = true;
    sessionStorage.setItem(SESSION_KEY, "1");
    setVisible(true);
  }

  useEffect(() => {
    arrivedAt.current = Date.now();
    triggered.current = false;

    // Desktop: mouse heading toward the browser chrome (close/tab bar)
    function onMouseLeave(e: MouseEvent) {
      if (e.clientY < 10) trigger();
    }

    // Mobile fallback: show after 45 seconds of inactivity
    const mobileTimer = setTimeout(() => {
      trigger();
    }, 45000);

    document.addEventListener("mouseleave", onMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      clearTimeout(mobileTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const dialogRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  function close() {
    setVisible(false);
  }

  // Professional modal behavior: focus first field, trap Tab, close on Escape, restore focus.
  useEffect(() => {
    if (!visible) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => nameRef.current?.focus(), 60);
    function onKey(ev: KeyboardEvent) {
      if (ev.key === "Escape") { ev.preventDefault(); setVisible(false); return; }
      if (ev.key !== "Tab" || !dialogRef.current) return;
      const els = dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), a[href]');
      if (!els.length) return;
      const first = els[0], last = els[els.length - 1];
      if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
      else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      returnFocus.current?.focus?.();
    };
  }, [visible]);

  async function submit() {
    if (name.trim().length < 2 || phone.replace(/\D/g, "").length < 10) {
      setError("Enter your name and a phone number with at least 10 digits.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/widget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          note: "Exit-intent popup lead",
        }),
      });
      if (!res.ok) throw new Error();
      fireEvent("generate_lead", { method: "exit_intent" });
      setDone(true);
      setTimeout(() => setVisible(false), 2500);
    } catch {
      toast({
        title: "Your request could not be sent",
        description: "Please try again, call (228) 278-7782, or email aultman@gulfcoastdigitaldesign.com.",
        variant: "destructive",
      });
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={close}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none"
          >
            <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="exit-callback-title" aria-describedby="exit-callback-desc" className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto border border-slate-200 border-t-2 border-t-accent max-h-[calc(100dvh-2rem)] overflow-y-auto">

              {/* Header */}
              <div className="relative bg-primary px-7 pt-8 pb-6">
                <button
                  type="button"
                  onClick={close}
                  className="absolute top-3 right-3 p-1.5 rounded-md text-white/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
                  aria-label="Close callback request"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                  <PhoneCall className="w-6 h-6 text-accent" />
                </div>
                <h2 id="exit-callback-title" className="text-2xl font-heading font-extrabold text-white leading-tight">
                  Have a website project in mind?
                </h2>
                <p id="exit-callback-desc" className="text-white/75 mt-2 text-sm leading-relaxed">
              Leave your name and number if you'd like us to follow up about a website or a free quote.
                </p>
              </div>

              {/* Body */}
              <div className="px-7 py-6">
                {done ? (
                  <div className="text-center py-4" role="status">
                    <CheckCircle2 className="w-10 h-10 text-accent mx-auto mb-3" aria-hidden="true" />
                    <p className="font-heading font-bold text-primary text-lg">Thanks — your request was sent.</p>
                    <p className="text-sm text-muted-foreground mt-1">
                We'll use the number you sent to follow up about your project.
                    </p>
                  </div>
                ) : (
                  <form
                    className="gcd-form space-y-4"
                    noValidate
                    onSubmit={(ev) => { ev.preventDefault(); if (!submitting) submit(); }}
                  >
                    <label htmlFor="exit-callback-name" className="block">
                      <span className="block text-sm font-semibold text-slate-700 mb-1.5">Your name</span>
                      <Input
                        id="exit-callback-name"
                        ref={nameRef}
                        autoComplete="name"
                        placeholder="First and last name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-11"
                        disabled={submitting}
                        aria-invalid={Boolean(error) && name.trim().length < 2}
                        aria-describedby={error ? "exit-callback-error" : undefined}
                      />
                    </label>
                    <label htmlFor="exit-callback-phone" className="block">
                      <span className="block text-sm font-semibold text-slate-700 mb-1.5">Phone number</span>
                      <Input
                        id="exit-callback-phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="(228) 555-1234"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-11"
                        disabled={submitting}
                        aria-invalid={Boolean(error) && phone.replace(/\D/g, "").length < 10}
                        aria-describedby={error ? "exit-callback-error" : undefined}
                      />
                    </label>
                    {error && (
                      <p id="exit-callback-error" role="alert" className="text-sm text-destructive font-medium">{error}</p>
                    )}
                    <Button
                      type="submit"
                      className="w-full bg-accent hover:bg-accent/90 text-white font-bold h-12 rounded-md text-sm focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      disabled={submitting}
                      aria-busy={submitting}
                    >
                      {submitting ? "Sending…" : <>Request a free quote <Send className="ml-2 w-4 h-4" /></>}
                    </Button>
                    <p className="text-[11px] text-center text-muted-foreground">
                      We'll use your phone number to follow up about this request.
                    </p>
                  </form>
                )}
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
