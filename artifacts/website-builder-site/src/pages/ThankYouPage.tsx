import { CheckCircle2, ArrowRight } from "lucide-react";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { useSEO } from "@/hooks/useSEO";
import { fireEvent } from "@/lib/analytics";

// Presentation-only — generate_lead is fired once at the successful API
// response in each form's submit handler, so refreshes or direct visits
// do not recount as conversions.
export default function ThankYouPage() {
  useSEO({
    title: "Thanks for Contacting GulfCDD | Project Next Steps",
    description: "Thank you for sharing your project details with GulfCDD. We will review your request and follow up about your website needs.",
    noindex: true,
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-xl text-center">
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-primary mb-4">
            Thank you for getting in touch.
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Thanks for telling us about your project. We'll read through the
            details and get back to you using the contact information you sent.
            If we need anything else for the quote, we'll ask.
          </p>
          <p className="text-sm text-muted-foreground mb-8 bg-accent/5 border border-accent/20 rounded-lg px-5 py-4 text-left">
            <strong className="text-accent">Have something to add?</strong> Email
            us at{" "}
            <a
              href="mailto:aultman@gulfcoastdigitaldesign.com"
              className="underline text-accent"
            >
              aultman@gulfcoastdigitaldesign.com
            </a>{" "}
            or{" "}
            <a href="tel:2282787782" className="underline text-accent" onClick={() => fireEvent("phone_call", { location: "thank_you_page" })}>
              (228) 278-7782
            </a>
            .
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold rounded-md px-8 h-12 transition-colors text-sm"
          >
            Back to home <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
