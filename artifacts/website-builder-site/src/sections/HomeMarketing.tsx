import {
  ArrowRight,
  BarChart3,
  FileText,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";
import { fireEvent } from "@/lib/analytics";

const marketingServices = [
  {
    icon: Search,
    title: "What are customers searching for?",
    description:
      "We look for searches that fit the work you actually do. Then we check whether your pages answer the questions behind them.",
  },
  {
    icon: MapPin,
    title: "Local SEO",
    href: "/services/seo/",
    description:
      "Wrong hours or an old phone number can cost you an inquiry. We review your Google Business Profile and website for details that need correcting.",
  },
  {
    icon: Sparkles,
    title: "Answers for search and AI",
    description:
      "Do you serve this area? What does the service include? We put those answers on the right pages, with consistent facts that search and AI tools can read.",
  },
  {
    icon: FileText,
    title: "Website content",
    description:
      "Tell us what you do and what customers ask before hiring you. We'll help turn that into service descriptions that sound like your business.",
  },
  {
    icon: BarChart3,
    title: "Make it easier to reach you",
    description:
      "We check that phone links work, forms ask for the right details, and people can find the next step without searching through the menu.",
  },
];

export function HomeMarketing() {
  return (
    <section
      id="digital-marketing"
      className="border-t border-slate-200 bg-slate-50 py-16 md:py-20"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mb-10">
          <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.18em] text-accent">
            Digital marketing
          </span>
          <h2 className="mb-4 text-3xl font-heading font-bold leading-tight text-primary md:text-5xl">
            Help local customers find the answers they need.
          </h2>
          <p className="text-lg font-medium leading-relaxed text-slate-600">
            You don't always need a new website to improve your local marketing.
            We can work on your existing service pages, business listings, and
            contact forms, starting with the problems you want to fix.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {marketingServices.map(({ icon: Icon, title, description, href }) => (
            <div
              key={title}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <Icon className="mb-4 h-5 w-5 text-accent" />
              <h3 className="mb-2 font-heading text-sm font-bold text-primary">
                {href ? <a href={href} className="underline underline-offset-4 hover:text-accent">{title}</a> : title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href="/contact/?service=digital-marketing"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-accent px-7 text-sm font-bold text-white transition-colors hover:bg-accent/90"
            onClick={() =>
              fireEvent("cta_click", { cta_label: "home_digital_marketing" })
            }
          >
            Discuss your marketing needs <ArrowRight className="h-4 w-4" />
          </a>
          <p className="text-sm font-medium text-slate-600">
            Already have a website? Ask about marketing support for your current site.
          </p>
        </div>
      </div>
    </section>
  );
}
