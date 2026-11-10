import { useState } from "react";
import { Link } from "wouter";
import { CheckCircle2 } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { CampaignShell } from "@/campaign/CampaignShell";

export default function FreeWebsiteThankYou() {
  useSEO({
    title: "Application Received | GulfCDD",
    description: "Thanks for applying for a free website build with Gulf Coast Digital Designs.",
    canonical: "https://www.gulfcdd.com/free-website/thank-you/",
    noindex: true,
  });
  const [receipt] = useState(() => { try { return sessionStorage.getItem("gcdd_fw_receipt") || ""; } catch { return ""; } });
  return (
    <CampaignShell cta={false}>
      <section className="mx-auto max-w-2xl px-5 py-24 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <CheckCircle2 className="h-10 w-10 text-[#ff6579]" />
        <h1 className="mt-5 text-4xl font-extrabold text-white">Application received.</h1>
        <p className="mt-4 text-lg text-white/75">Thank you. We'll review your details and reach out by your preferred contact method about the next steps.</p>
        {receipt && <p className="mt-6 rounded-md border border-white/12 bg-[hsl(0_0%_8%)] px-4 py-3 text-sm text-white/80">Your receipt: <span className="font-mono text-white" data-testid="text-receipt">{receipt}</span></p>}
        <ol className="mt-10 space-y-4 text-white/75">
          <li><span className="font-bold text-[#ff6579] mr-2">01</span>We review your application for fit.</li>
          <li><span className="font-bold text-[#ff6579] mr-2">02</span>If it's a match, we talk through scope and send a private agreement link.</li>
          <li><span className="font-bold text-[#ff6579] mr-2">03</span>After you approve the completed website and it is published, you activate the monthly plan and make the first payment.</li>
        </ol>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="rounded-md bg-accent px-5 py-3 font-semibold text-white hover:bg-accent/90" data-testid="link-home-thanks">Back to GulfCDD</Link>
          <a href="tel:2282787782" className="rounded-md border border-white/20 px-5 py-3 font-semibold text-white/90 hover:bg-white/5">Call (228) 278-7782</a>
        </div>
      </section>
    </CampaignShell>
  );
}
