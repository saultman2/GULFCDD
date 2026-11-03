import { useEffect, useState } from "react";
import { useSearch, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@clerk/react";
import {
  CheckCircle2, Code2, Globe, Zap, ShieldCheck, RefreshCw, BarChart2,
  Mail, Calendar, Image, MapPin, Star, Rss, ShoppingCart, Search,
  ArrowRight, Clock, Users, Crown, Sparkles, UserPlus, LogIn, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fireEvent } from "@/lib/analytics";
import { EmailLink } from "@/components/EmailLink";

interface TierFeature { icon: React.ElementType; label: string; detail: string; }
interface TierInfo {
  name: string; tagline: string;
  accent: string; pages: string; updateHours: string;
  techStack: TierFeature[]; included: TierFeature[];
  exclusive: TierFeature[];
}

const TECH_STACK: TierFeature[] = [
  { icon: Code2, label: "Modern React stack", detail: "Fast, component-based pages that load in milliseconds." },
  { icon: Globe, label: "Global CDN delivery", detail: "Your site is cached at edge locations worldwide. Loads fast no matter where your visitor is." },
  { icon: ShieldCheck, label: "HTTPS + SSL certificate", detail: "Every site ships secured by default. No setup. No renewal fees." },
  { icon: Zap, label: "Live deployments", detail: "Changes go live in seconds once pushed. No waiting on builds or FTP uploads." },
  { icon: RefreshCw, label: "Custom domain support", detail: "Point your own domain at the site. We handle the DNS setup." },
  { icon: BarChart2, label: "Google Analytics", detail: "Visitor counts, traffic sources, and top pages tracked from day one." },
];

const approvedIncluded = {
  hosting: { icon: ShieldCheck, label: "Hosting and upkeep", detail: "Essential is $150 a month for hosting and upkeep." },
  report: { icon: BarChart2, label: "Monthly analytics report", detail: "Every plan includes an analytics report." },
  contract: { icon: Clock, label: "No contract", detail: "Month to month. Cancel anytime." },
  seo: { icon: Search, label: "Local SEO", detail: "Growth adds local SEO." },
  posts: { icon: Rss, label: "Blog posts", detail: "Growth adds blog posts." },
};

const tierData: Record<string, TierInfo> = {
  essential: {
    name: "Essential",
    tagline: "Hosting and upkeep.",
    accent: "text-primary", pages: "$150/mo", updateHours: "Analytics report. No contract.",
    techStack: TECH_STACK,
    included: [approvedIncluded.hosting, approvedIncluded.report, approvedIncluded.contract],
    exclusive: [],
  },
  growth: {
    name: "Growth",
    tagline: "Adds local SEO and blog posts.",
    accent: "text-secondary", pages: "$500/mo", updateHours: "$250/mo founding",
    techStack: TECH_STACK,
    included: [approvedIncluded.hosting, approvedIncluded.seo, approvedIncluded.posts, approvedIncluded.report, approvedIncluded.contract],
    exclusive: [],
  },
  "full-service": {
    name: "Full Service",
    tagline: "Monthly plan.",
    accent: "text-primary", pages: "$1,000/mo", updateHours: "$500/mo founding",
    techStack: TECH_STACK,
    included: [approvedIncluded.report, approvedIncluded.contract],
    exclusive: [],
  },
};

const BUILD_PLAN_NAMES: Record<string, { name: string }> = {
  "build-basic": { name: "Website build" },
  "build-standard": { name: "Website build" },
  "build-professional": { name: "Website build" },
  "build-premier": { name: "Website build" },
};

async function registerPurchase(sessionId: string): Promise<{ ok: boolean; alreadyRegistered?: boolean; error?: string }> {
  const res = await fetch("/api/account/register-purchase", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId }),
    credentials: "include",
  });
  return res.json();
}

export default function CheckoutSuccess() {
  const search = useSearch();
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(search);

  // Block search engines — this page contains Stripe session IDs and private order data
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);
  const planKey = params.get("plan") ?? "essential";
  const sessionId = params.get("session_id") ?? "";

  const { isSignedIn, isLoaded } = useAuth();

  const [regState, setRegState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [regError, setRegError] = useState("");

  const isBuildPlan = planKey.startsWith("build-");
  const buildInfo = BUILD_PLAN_NAMES[planKey];
  const tier = !isBuildPlan ? (tierData[planKey] ?? tierData.essential) : null;

  const displayName = isBuildPlan ? (buildInfo?.name ?? planKey) : (tier?.name ?? planKey);

  useEffect(() => {
    if (!sessionId) return;

    const storageKey = `ga4_purchase_recorded:${sessionId}`;
    if (window.sessionStorage.getItem(storageKey)) return;

    fireEvent("purchase", {
      transaction_id: sessionId,
      value: 0,
      currency: "USD",
      item_name: displayName,
      item_id: planKey,
    });
    window.sessionStorage.setItem(storageKey, "1");
  }, [displayName, planKey, sessionId]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !sessionId || regState !== "idle") return;
    setRegState("loading");
    registerPurchase(sessionId).then((result) => {
      if (result.ok) {
        setRegState("done");
      } else {
        setRegState("error");
        setRegError(result.error ?? "Something went wrong. Contact us and we will sort it out.");
      }
    }).catch(() => {
      setRegState("error");
      setRegError("Could not connect. Contact us and we will sort it out.");
    });
  }, [isLoaded, isSignedIn, sessionId, regState]);

  const signUpUrl = `/sign-up?redirect_url=${encodeURIComponent(`/checkout/success?plan=${planKey}&session_id=${sessionId}`)}`;
  const signInUrl = `/sign-in?redirect_url=${encodeURIComponent(`/checkout/success?plan=${planKey}&session_id=${sessionId}`)}`;

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-7 h-7 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-6 py-16 max-w-4xl">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/15 mb-5">
            <CheckCircle2 className="w-9 h-9 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-semibold text-foreground mb-3">
            Payment confirmed.
          </h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Your <span className="font-semibold text-foreground">{displayName}</span> purchase went through.
          </p>
          <div className="inline-flex items-center gap-3 mt-5 bg-card border border-card-border rounded-lg px-5 py-3">
            <span className="text-sm text-muted-foreground">Plan:</span>
            <span className="font-heading font-bold text-foreground">{displayName}</span>
          </div>
        </motion.div>

        {/* Account creation prompt — shown when signed out */}
        {!isSignedIn && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-10 rounded-xl border-2 border-primary/40 bg-primary/6 p-8 text-center"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/15 mb-4">
              <UserPlus className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-heading font-semibold text-foreground mb-2">
              Create your account
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
              Your purchase needs an account to be saved. Create one now so you can view your project status, payment history, and send us messages directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => setLocation(signUpUrl)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md h-11 px-8 font-semibold"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Create account
              </Button>
              <Button
                variant="outline"
                onClick={() => setLocation(signInUrl)}
                className="border-border bg-transparent text-foreground rounded-md h-11 px-8"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Already have an account
              </Button>
            </div>
          </motion.div>
        )}

        {/* Registration status — shown when signed in */}
        {isSignedIn && sessionId && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-10 rounded-xl border border-card-border bg-card p-6 flex items-center gap-4"
          >
            {regState === "loading" && (
              <>
                <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
                <p className="text-sm text-muted-foreground">Linking purchase to your account...</p>
              </>
            )}
            {regState === "done" && (
              <>
                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Purchase saved to your account.</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    View it anytime under{" "}
                    <a href="/account/payments" className="text-primary underline underline-offset-2">Payment history</a>.
                  </p>
                </div>
              </>
            )}
            {regState === "error" && (
              <>
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <p className="text-sm text-muted-foreground">{regError}</p>
              </>
            )}
          </motion.div>
        )}

        {/* Plan details — only for subscription plans */}
        {tier && (
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="bg-card border border-card-border rounded-xl p-7"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-5">
                Your website stack
              </p>
              <div className="space-y-4">
                {tier.techStack.map((f) => (
                  <div key={f.label} className="flex gap-3">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <f.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{f.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{f.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="bg-card border border-card-border rounded-xl p-7"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-1">
                What is in your {tier.name} plan
              </p>
              <p className="text-xs text-muted-foreground mb-5">{tier.pages} · {tier.updateHours}</p>
              <div className="space-y-4">
                {tier.included.map((f) => (
                  <div key={f.label} className="flex gap-3">
                    <div className="w-8 h-8 rounded bg-card border border-card-border flex items-center justify-center shrink-0 mt-0.5">
                      <f.icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{f.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{f.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {tier && tier.exclusive.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="bg-primary/8 border border-primary/20 rounded-xl p-7 mb-12"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-5">
              {tier.name} exclusive capabilities
            </p>
            <div className="grid sm:grid-cols-2 gap-5">
              {tier.exclusive.map((f) => (
                <div key={f.label} className="flex gap-3">
                  <div className="w-8 h-8 rounded bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                    <f.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{f.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{f.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mb-12"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-6">
            What happens next
          </p>
          <div className="space-y-3">
            {[
              { num: "01", title: "Check your email", desc: "Look for your Stripe payment receipt and keep it for your records." },
              { num: "02", title: "We'll contact you about the project", desc: "We'll review the order and email you about the next steps and the timing in your project agreement." },
              { num: "03", title: "Tell us about your business", desc: "We'll ask about your services, customers, and the photos or content you already have. Send what you can; we'll discuss anything missing." },
              { num: "04", title: "Review the website before launch", desc: "You'll get a preview link to check the wording, details, and agreed features. Revisions and approval follow your project agreement." },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.06, duration: 0.3 }}
                className="flex gap-5 items-start bg-card border border-border rounded-xl px-6 py-5"
              >
                <div className="font-heading font-bold text-2xl text-primary/30 shrink-0 w-10">{step.num}</div>
                <div>
                  <div className="font-semibold text-foreground mb-1">{step.title}</div>
                  <div className="text-sm text-muted-foreground leading-relaxed">{step.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="text-center border-t border-border pt-10"
        >
          <p className="text-muted-foreground mb-5">
            Have a question about your order? Email us with the details so we can help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md h-11 px-7">
              <EmailLink>
                <Mail className="mr-2 h-4 w-4" /> Email us
              </EmailLink>
            </Button>
            <Button asChild variant="outline" className="border-border bg-transparent text-foreground rounded-md h-11 px-7">
              <a href="/">
                Back to site <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
