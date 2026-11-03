/**
 * Client Intake Form — Gulf Coast Digital Designs
 *
 * Full-detail submissions use multipart/form-data so uploaded files are
 * delivered with the intake notification instead of requiring a second step.
 */

import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { fireEvent } from "@/lib/analytics";
import { Zap, ClipboardList, CheckCircle2, ArrowRight, ArrowLeft, Upload, X, Image, ChevronDown } from "lucide-react";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { EmailLink } from "@/components/EmailLink";
import { SupportWidget } from "@/components/SupportWidget";
import { useSEO } from "@/hooks/useSEO";
import { SubmissionError } from "@/components/SubmissionError";
import { isMathChallengeCorrect, MathChallenge } from "@/components/MathChallenge";
import { QuickQuoteForm, parseQuoteContext } from "@/components/QuickQuoteForm";
import { FormHoneypot } from "@/components/FormHoneypot";

/* ─── Tiny shared primitives ─────────────────────────────────────── */

function LabelText({ text, hint }: { text: string; hint?: string }) {
  const req = text.endsWith(" *");
  const clean = req ? text.slice(0, -2) : text;
  return (
    <span className="block mb-1.5">
      <span className="block text-sm font-semibold text-slate-700">
        {clean}{req && <span className="gcd-required" aria-hidden="true">*</span>}
        {req && <span className="sr-only"> (required)</span>}
      </span>
      {hint && <span className="block text-xs text-muted-foreground mt-0.5 leading-relaxed">{hint}</span>}
    </span>
  );
}

/** Text-style controls get a wrapping <label>; option groups use fieldset + legend. */
function Field({
  label, hint, children, group,
}: {
  label: string; hint?: string; children: React.ReactNode; group?: boolean;
}) {
  if (group) {
    return (
      <fieldset className="min-w-0">
        <legend className="w-full"><LabelText text={label} hint={hint} /></legend>
        {children}
      </fieldset>
    );
  }
  return (
    <label className="block">
      <LabelText text={label} hint={hint} />
      {children}
    </label>
  );
}

const inputCls =
  "w-full h-11 rounded-lg border px-4 text-sm";

function TextInput({ name, value, onChange, placeholder, required, type = "text" }: {
  name: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; type?: string;
}) {
  return (
    <input
      type={type}
      name={name}
      required={required}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={inputCls}
    />
  );
}

function TextArea({ name, value, onChange, placeholder, rows = 4 }: {
  name: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full rounded-lg border px-4 py-3 text-sm leading-relaxed resize-y"
    />
  );
}

function Chips({ name, options, selected, onChange }: {
  name: string; options: string[]; selected: string[]; onChange: (v: string[]) => void;
}) {
  const toggle = (o: string) =>
    onChange(selected.includes(o) ? selected.filter((s) => s !== o) : [...selected, o]);
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = selected.includes(o);
        return (
          <label key={o} className="gcd-chip">
            <input type="checkbox" name={name} value={o} checked={on} onChange={() => toggle(o)} className="mr-2 accent-[hsl(var(--accent))]" />
            {on && <CheckCircle2 className="w-3.5 h-3.5 text-accent" aria-hidden="true" />}
            {o}
          </label>
        );
      })}
      {selected.length > 0 && (
        <span className="self-center text-xs text-muted-foreground ml-1" aria-live="polite">{selected.length} selected</span>
      )}
    </div>
  );
}

function SelectInput({ name, options, value, onChange, placeholder }: {
  name: string; options: string[]; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <span className="relative block">
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls + " pr-10 appearance-none"}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" aria-hidden="true" />
    </span>
  );
}

interface UploadedFile { name: string; size: number; file: File; }

function UploadZone({ name, label, hint, accept, files, onAdd, onRemove }: {
  name: string; label: string; hint?: string; accept: string;
  files: UploadedFile[]; onAdd: (f: UploadedFile[]) => void; onRemove: (n: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const handle = (list: FileList | null) => {
    if (!list) return;
    onAdd(Array.from(list).map((f) => ({ name: f.name, size: f.size, file: f })));
    if (ref.current) ref.current.value = "";
  };
  const fmt = (b: number) => b < 1024 * 1024 ? `${(b / 1024).toFixed(0)} KB` : `${(b / (1024 * 1024)).toFixed(1)} MB`;
  return (
    <Field label={label} hint={hint} group>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handle(e.dataTransfer.files); }}
        aria-label={`Choose ${label.toLowerCase()} files to upload`}
        className="gcd-drop w-full p-5 text-center cursor-pointer group"
      >
        <Upload className="w-6 h-6 text-slate-500 group-hover:text-accent mx-auto mb-1.5 transition" aria-hidden="true" />
        <span className="block text-sm font-semibold text-slate-700">Choose files or drag them here</span>
        <span className="block text-xs text-muted-foreground mt-0.5">Accepted: {accept.replace(/\./g, "").toUpperCase().split(",").join(", ")}</span>
      </button>
      <input name={name} aria-label={`${label} files`} ref={ref} type="file" accept={accept} multiple className="hidden native-upload" onChange={(e) => handle(e.target.files)} />
      {files.length > 0 && (
        <ul className="mt-2 space-y-1.5" aria-label={`${label} files attached`}>
          {files.map((f) => (
            <li key={f.name} className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2 min-w-0">
                <Image className="w-4 h-4 shrink-0 text-accent" aria-hidden="true" />
                <span className="text-sm font-medium text-slate-700 truncate">{f.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">({fmt(f.size)})</span>
              </div>
              <button type="button" onClick={() => onRemove(f.name)} aria-label={`Remove ${f.name}`} className="p-1 rounded text-muted-foreground hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition">
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Field>
  );
}

/* ─── Quick-start form ───────────────────────────────────────────── */

const GOALS = [
  "Get more phone calls",
  "Get quote requests",
  "Show up on Google",
  "Build credibility",
  "Replace an old/broken site",
  "Launch a new business",
  "Book appointments online",
  "Show off my work / portfolio",
];

/* ─── Full details form ──────────────────────────────────────────── */

const PAGES = [
  "Home", "About", "Services", "Individual service pages",
  "Contact", "Gallery / Portfolio", "Testimonials", "FAQ",
  "Blog", "Team / Staff", "Booking / Scheduling",
];

const FEATURES = [
  "Contact / quote form", "Click-to-call button", "Click-to-text button",
  "Appointment booking", "Google Maps embed", "Photo gallery",
  "Google reviews section", "Live chat", "Newsletter signup",
  "Social media links", "Before & after gallery",
];

function FullForm({ onDone }: { onDone: () => void }) {
  // Contact
  const [bizName, setBizName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [industry, setIndustry] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [bizDesc, setBizDesc] = useState("");

  // Presence
  const [currentSite, setCurrentSite] = useState("");
  const [domainName, setDomainName] = useState("");
  const [domainRegistrar, setDomainRegistrar] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [googleBiz, setGoogleBiz] = useState("");
  const [otherLinks, setOtherLinks] = useState("");

  // Goals & pages
  const [goals, setGoals] = useState<string[]>([]);
  const [pagesNeeded, setPagesNeeded] = useState<string[]>([]);
  const [featuresNeeded, setFeaturesNeeded] = useState<string[]>([]);
  const [refSites, setRefSites] = useState("");

  // Content
  const [servicesList, setServicesList] = useState("");
  const [sellingPoints, setSellingPoints] = useState("");
  const [testimonials, setTestimonials] = useState("");

  // Files
  const [logoFiles, setLogoFiles] = useState<UploadedFile[]>([]);
  const [photoFiles, setPhotoFiles] = useState<UploadedFile[]>([]);

  // Timeline
  const [urgency, setUrgency] = useState("");
  const [tierPreference, setTierPreference] = useState("");
  const [notes, setNotes] = useState("");

  const rmFile = (setter: React.Dispatch<React.SetStateAction<UploadedFile[]>>) =>
    (name: string) => setter((p) => p.filter((f) => f.name !== name));

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [mathAnswer, setMathAnswer] = useState("");
  const [mathError, setMathError] = useState("");
  const started = useRef(false);

  const markStarted = (event: React.FocusEvent<HTMLFormElement>) => {
    const target = event.target;
    if (started.current || !(target instanceof HTMLElement) ||
        !target.matches("input:not([type=hidden]), select, textarea")) return;
    started.current = true;
    fireEvent("quote_form_started", { form: "full" });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMathChallengeCorrect(mathAnswer)) {
      setMathError("Please answer 2 to continue.");
      return;
    }
    setMathError("");
    setBusy(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify({
        mode: "full", bizName, contactName, phone, email, industry, serviceArea, bizDesc,
        currentSite, domainName, domainRegistrar, facebook, instagram, googleBiz, otherLinks,
        goals, pagesNeeded, featuresNeeded, refSites,
        servicesList, sellingPoints, testimonials,
        logoFiles: logoFiles.map(f => f.name), photoFiles: photoFiles.map(f => f.name),
        urgency, tierPreference, notes,
        company_website: new FormData(e.currentTarget as HTMLFormElement).get("company_website") ?? "",
      }));
      logoFiles.forEach(({ file }) => formData.append("logoFiles", file));
      photoFiles.forEach(({ file }) => formData.append("photoFiles", file));

      const res = await fetch("/api/intake", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Server error");
      fireEvent("generate_lead", { method: "intake_full" });
      onDone();
    } catch {
      setError("Something went wrong. Please try again or call/text us at (228) 278-7782.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form action="/api/intake" method="post" encType="multipart/form-data" onSubmit={submit} onFocusCapture={markStarted}
      onInvalidCapture={(event) => {
        const input = event.target as HTMLInputElement;
        input.setAttribute("aria-invalid", "true");
        input.setAttribute("aria-describedby", "full-form-error");
        setError("Please check the highlighted fields and add the required details.");
      }}
      onInputCapture={(event) => {
        const input = event.target as HTMLInputElement;
        if (input.validity?.valid) {
          input.removeAttribute("aria-invalid");
          if (input.getAttribute("aria-describedby") === "full-form-error") input.removeAttribute("aria-describedby");
        }
      }}
      className="gcd-form space-y-10" aria-label="Full project details form">
      <FormHoneypot />
      <input type="hidden" name="mode" value="full" />
      <p className="text-xs text-muted-foreground"><span className="gcd-required" aria-hidden="true">*</span> marks a required field.</p>

      {/* Section 1 – Business basics */}
      <div>
        <h3 className="gcd-section-title">
          Your Business
        </h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Business Name *">
            <TextInput name="bizName" value={bizName} onChange={setBizName} placeholder="Gulf Coast Plumbing Co." required />
          </Field>
          <Field label="Your Name *">
            <TextInput name="contactName" value={contactName} onChange={setContactName} placeholder="John Smith" required />
          </Field>
          <Field label="Phone *">
            <TextInput name="phone" type="tel" value={phone} onChange={setPhone} placeholder="(228) 555-1234" required />
          </Field>
          <Field label="Email *">
            <TextInput name="email" type="email" value={email} onChange={setEmail} placeholder="john@yourbusiness.com" required />
          </Field>
          <Field label="Industry / Business Type *" hint="For example, 'roofing contractor' rather than 'home services'.">
            <TextInput name="industry" value={industry} onChange={setIndustry} placeholder="Electrical contractor, real estate agent..." required />
          </Field>
          <Field label="Service Area">
            <TextInput name="serviceArea" value={serviceArea} onChange={setServiceArea} placeholder="Ocean Springs, Biloxi, Gulfport area" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Describe Your Business" hint="What do you do, who do you serve, and what makes you different?">
              <TextArea name="bizDesc" value={bizDesc} onChange={setBizDesc} placeholder="Describe your services, customers, and business background." rows={4} />
            </Field>
          </div>
        </div>
      </div>

      {/* Section 2 – Online presence */}
      <div>
        <h3 className="gcd-section-title">
          Your Current Online Presence
        </h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Current Website" hint="Leave blank if you don't have one.">
            <TextInput name="currentSite" value={currentSite} onChange={setCurrentSite} placeholder="https://www.yourbusiness.com" />
          </Field>
          <Field label="Domain Name (if you own one)">
            <TextInput name="domainName" value={domainName} onChange={setDomainName} placeholder="yourbusiness.com" />
          </Field>
          <Field label="Domain Registrar" hint="Where is your domain registered? Do not include passwords.">
            <SelectInput
              name="domainRegistrar"
              options={["GoDaddy", "Namecheap", "Google Domains", "Squarespace", "Cloudflare", "I don't know", "I don't have one yet"]}
              value={domainRegistrar}
              onChange={setDomainRegistrar}
              placeholder="Select..."
            />
          </Field>
          <Field label="Google Business Profile">
            <TextInput name="googleBiz" value={googleBiz} onChange={setGoogleBiz} placeholder="https://g.co/..." />
          </Field>
          <Field label="Facebook">
            <TextInput name="facebook" value={facebook} onChange={setFacebook} placeholder="https://facebook.com/yourbusiness" />
          </Field>
          <Field label="Instagram">
            <TextInput name="instagram" value={instagram} onChange={setInstagram} placeholder="https://instagram.com/yourbusiness" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Other Links" hint="Yelp, LinkedIn, YouTube, Angi, Houzz, etc.">
              <TextInput name="otherLinks" value={otherLinks} onChange={setOtherLinks} placeholder="https://yelp.com/biz/..." />
            </Field>
          </div>
        </div>
      </div>

      {/* Section 3 – Goals, pages, features */}
      <div>
        <h3 className="gcd-section-title">
          Goals, Pages & Features
        </h3>
        <div className="space-y-6">
          <Field label="What should the site do for you?" group hint="Pick all that apply.">
            <div className="mt-1"><Chips name="goals" options={GOALS} selected={goals} onChange={setGoals} /></div>
          </Field>
          <Field label="Pages you want" group>
            <div className="mt-1"><Chips name="pagesNeeded" options={PAGES} selected={pagesNeeded} onChange={setPagesNeeded} /></div>
          </Field>
          <Field label="Features you need" group>
            <div className="mt-1"><Chips name="featuresNeeded" options={FEATURES} selected={featuresNeeded} onChange={setFeaturesNeeded} /></div>
          </Field>
          <Field label="Reference websites you like" hint="Links to 1–3 sites whose look or feel you want us to draw from. Tell us what you like about them.">
            <TextArea name="refSites" value={refSites} onChange={setRefSites} placeholder={"https://example.com — I like how clean and simple it is\nhttps://another.com — love the bold headline and the colors"} rows={3} />
          </Field>
        </div>
      </div>

      {/* Section 4 – Content */}
      <div>
        <h3 className="gcd-section-title">
          Your Content
        </h3>
        <div className="space-y-5">
          <Field label="Services You Offer *" hint="List the services you actually provide, one per line.">
            <TextArea name="servicesList" value={servicesList} onChange={setServicesList} placeholder="Include each service and any details customers need to know." rows={5} />
          </Field>
          <Field label="What makes you stand out?" hint="Share specific experience, qualifications, or ways you work that you can verify.">
            <TextArea name="sellingPoints" value={sellingPoints} onChange={setSellingPoints} placeholder="Tell us what customers value about your business. Include only accurate claims." rows={4} />
          </Field>
          <Field label="Customer Testimonials" hint="Share real reviews you have permission to publish, with the source and customer attribution.">
            <TextArea name="testimonials" value={testimonials} onChange={setTestimonials} placeholder="Paste the original review wording and a source link, if available." rows={5} />
          </Field>
        </div>
      </div>

      {/* Section 5 – Files */}
      <div>
        <h3 className="gcd-section-title">
          Files & Images
        </h3>

        <div className="bg-accent/5 border border-accent/20 rounded-lg px-4 py-3 mb-5 text-sm text-slate-700">
          <strong className="text-primary">Automatic delivery:</strong> Your uploaded files will be delivered with your form submission, so there is no separate file-sending step.
        </div>

        <div className="space-y-5">
          <UploadZone
            name="logoFiles"
            label="Logo"
            hint="PNG, SVG, AI, EPS, or JPG. If you only have a business card with your logo on it, a photo of that works."
            accept=".png,.jpg,.jpeg,.svg,.ai,.eps,.pdf"
            files={logoFiles}
            onAdd={(f) => setLogoFiles((p) => [...p, ...f])}
            onRemove={rmFile(setLogoFiles)}
          />
          <UploadZone
            name="photoFiles"
            label="Photos of Your Business / Work"
            hint="Share photos of your team, workplace, or completed projects that you have permission to use. Original files are helpful."
            accept=".jpg,.jpeg,.png,.webp,.heic"
            files={photoFiles}
            onAdd={(f) => setPhotoFiles((p) => [...p, ...f])}
            onRemove={rmFile(setPhotoFiles)}
          />
        </div>
      </div>

      {/* Section 6 – Timeline */}
      <div>
        <h3 className="gcd-section-title">
          Timeline & Notes
        </h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="How urgent is this?">
            <SelectInput
              name="urgency"
              options={[
                "As soon as possible",
                "Within 2 weeks",
                "Within a month",
                "No hard deadline, do it right",
              ]}
              value={urgency}
              onChange={setUrgency}
              placeholder="Select..."
            />
          </Field>
          <Field label="Plan preference">
            <SelectInput
              name="tierPreference"
              options={[
                "Essential — $150/mo hosting and upkeep",
                "Growth — $500/mo ($250 founding), local SEO and blog posts",
                "Full Service — $1,000/mo ($500 founding)",
                "Not sure yet",
              ]}
              value={tierPreference}
              onChange={setTierPreference}
              placeholder="Select..."
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Anything else we should know">
              <TextArea name="notes" value={notes} onChange={setNotes} placeholder="Share any concerns, requirements, or people who need to review the website." rows={4} />
            </Field>
          </div>
        </div>
      </div>

      <MathChallenge
        id="full-intake-math-challenge"
        value={mathAnswer}
        error={mathError}
        onChange={(value) => {
          setMathAnswer(value);
          if (isMathChallengeCorrect(value)) setMathError("");
        }}
      />

      <button
        type="submit"
        disabled={busy}
        aria-busy={busy} className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background text-white font-bold rounded-lg py-4 transition-colors shadow-md text-base"
      >
        {busy ? "Sending..." : (<>Submit Details <ArrowRight className="w-5 h-5" /></>)}
      </button>
      {error && <div id="full-form-error"><SubmissionError message={error} /></div>}
      <p className="text-center text-xs text-muted-foreground">
        We use your details to respond to your request. See our{" "}
        <a href="/privacy/" className="underline hover:text-accent">Privacy Policy</a>{" "}
        for how information is handled.
      </p>
    </form>
  );
}

/* ─── Main page ──────────────────────────────────────────────────── */

export default function IntakePage() {
  useSEO({
    title: "Start Your Website Project | Free Quote | GulfCDD",
    description: "A few quick questions about your business and goals. We'll reply with honest next steps and a plan recommendation.",
    canonical: "https://www.gulfcdd.com/intake",
    breadcrumbs: [{ name: "Get Started", url: "https://www.gulfcdd.com/intake" }],
  });
  const params = new URLSearchParams(window.location.search);
  const initial = params.get("mode") === "quick" ? "quick" : params.get("mode") === "full" ? "full" : "pick";
  const [mode, setMode] = useState<"pick" | "quick" | "full">(initial);
  // Deep-link context is parsed once; both forms stay mounted so switching modes keeps entered values.
  const [quoteContext] = useState(() => parseQuoteContext(window.location.search));
  const [, setLocation] = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>

        {/* Hero */}
        <div className="bg-primary text-white py-16 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-3">
              Gulf Coast Digital Designs
            </p>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4 leading-tight">
              Start Your Website Project
            </h1>
            <p className="text-white/75 text-lg max-w-xl mx-auto">
            Takes about five minutes. The more you tell us about your customers and where you work, the better our recommendation.
            </p>
          </div>
        </div>

        {/* Mode picker */}
        {mode === "pick" && (
          <div className="intake-mode-picker container mx-auto px-4 md:px-6 max-w-3xl py-16">
            <div className="grid md:grid-cols-2 gap-6">

              {/* Quick start */}
              <button
                type="button"
                onClick={() => setMode("quick")}
                className="group text-left bg-white border-2 border-slate-200 hover:border-accent rounded-2xl p-8 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <h2 className="text-xl font-heading font-extrabold text-primary mb-2">
                  Quick Start
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Your business name, contact details, and a little about the project are enough to start. We'll ask about anything else we need.
                </p>
                <ul className="space-y-1.5 mb-6">
                  {["Business name & contact info", "A tier, or Not sure yet", "Services and optional features", "A short note, if you'd like"].map((t) => (
                    <li key={t} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="inline-flex items-center gap-2 text-accent font-bold text-sm group-hover:gap-3 transition-all">
                  Use the quick form <ArrowRight className="w-4 h-4" />
                </div>
              </button>

              {/* Full details */}
              <button
                type="button"
                onClick={() => setMode("full")}
                className="group text-left bg-white border-2 border-slate-200 hover:border-primary rounded-2xl p-8 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition">
                  <ClipboardList className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-heading font-extrabold text-primary mb-2">
                  Full Details
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Already know the services, features, and style you want? Share them here, along with your logo and photos if you have them.
                </p>
                <ul className="space-y-1.5 mb-6">
                  {["Business info & service area", "Pages & features wanted", "Your services & selling points", "Logo & photo uploads"].map((t) => (
                    <li key={t} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="inline-flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-3 transition-all">
                  Use the detailed form <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-8">
              Questions? Call or text us at{" "}
              <a href="tel:2282787782" className="text-accent font-semibold" onClick={() => fireEvent("phone_call", { location: "intake_page" })}>(228) 278-7782</a>
              {" "}or email{" "}
              <EmailLink className="text-accent font-semibold">aultman@gulfcoastdigitaldesign.com</EmailLink>.
            </p>
          </div>
        )}

        {/* Quick form */}
        {
          <div style={{ display: mode !== "quick" ? "none" : undefined }} className="intake-form-panel container mx-auto px-4 md:px-6 max-w-2xl py-14">
            <div className="mb-8">
              <button
                type="button"
                onClick={() => setMode("pick")}
                className="text-xs font-semibold text-muted-foreground hover:text-accent transition mb-4 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" /> Back to form options
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-accent" />
                </div>
                <h2 className="text-2xl font-heading font-extrabold text-primary">Get a free quote</h2>
              </div>
              <p className="text-muted-foreground text-sm">
                Three short steps. Tell us how to reach you, pick a tier, and tick anything you already know you want. We'll explain the rest in plain language.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 shadow-xl shadow-black/30 border-t-2 border-t-accent">
              <QuickQuoteForm context={quoteContext} onDone={() => setLocation("/contact/thanks/")} onWantFull={() => setMode("full")} />
            </div>
          </div>
        }

        {/* Full form */}
        {
          <div style={{ display: mode !== "full" ? "none" : undefined }} className="intake-form-panel container mx-auto px-4 md:px-6 max-w-3xl py-14">
            <div className="mb-8">
              <button
                type="button"
                onClick={() => setMode("pick")}
                className="text-xs font-semibold text-muted-foreground hover:text-accent transition mb-4 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" /> Back to form options
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-heading font-extrabold text-primary">Full Details</h2>
              </div>
              <p className="text-muted-foreground text-sm">
                Complete the required contact and business fields. For optional details, share what you know and leave anything you are unsure about blank.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 shadow-xl shadow-black/30 border-t-2 border-t-accent">
              <FullForm onDone={() => setLocation("/contact/thanks/")} />
            </div>
          </div>
        }

      </main>
      <Footer />
      <SupportWidget />
    </div>
  );
}
