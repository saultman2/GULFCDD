import { useState } from "react";
import { fireEvent } from "@/lib/analytics";
import {
  ChevronDown,
  Megaphone,
  Building2,
  Code2,
  Bot,
  ArrowRight,
} from "lucide-react";

const plans = [
  {
    icon: Megaphone,
    title: "Digital Marketing, SEO & GEO",
    description:
      "If your website is hard to find or doesn't explain your services well, we can review the pages and local listings. We'll agree on which changes to make and how to check their effect.",
    bullets: [
      "Local, on-page, and technical SEO improvements",
      "Google Business Profile, maps, and local citation support",
      "Content and social media support for consistent visibility",
      "Generative engine optimization (GEO) for AI search and answers",
    ],
    href: "/contact/",
    linkLabel: "Get a free quote",
  },
  {
    icon: Building2,
    title: "Local & Growing Businesses",
    description:
      "Give customers somewhere to check your services, see who they're hiring, and ask for a quote. We can build your first website or improve the one you have.",
    bullets: [
      "Custom design using your branding and business details",
      "Service, about, and contact pages with clear next steps",
      "Mobile-first layouts for customers browsing on phones",
      "No contracts for monthly care. Cancel anytime.",
    ],
    href: "/contact/",
    linkLabel: "Get a free quote",
  },
  {
    icon: Code2,
    title: "Website Design & Development",
    description:
      "We design and develop one-page and multi-page websites, with forms, hosting, and launch support based on your project.",
    bullets: [
      "One-page and multi-page business websites",
      "Contact forms, booking requests, and lead capture",
      "Online stores with product and checkout pages",
      "Domain, hosting, and SSL setup for your selected plan",
    ],
    href: "/services/",
    linkLabel: "See all services",
  },
  {
    icon: Bot,
    title: "Custom Applications",
    description:
      "We build custom software for booking, customer access, and internal tasks, with integrations that connect to your existing tools.",
    bullets: [
      "Calendars, booking systems, and client portals",
      "API integrations for your existing software",
      "Internal business tools and custom software",
      "AI features and automation where they fit your workflow",
    ],
    href: "/contact/",
    linkLabel: "Talk to us about your application",
  },
];

export function ServicePlans() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="service-plans" className="py-16 md:py-20 bg-white border-b border-slate-200">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-accent mb-4">
            Website and marketing services
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-5 leading-tight">
            What can GulfCDD help you build?
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed font-medium">
             We build business websites and custom applications, and provide local SEO and digital marketing support. Choose a service below to see what it covers, then tell us about your project for a free quote.
          </p>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
        <div className="space-y-3">
          {plans.map((plan, idx) => {
            const isOpen = open === idx;
            return (
              <div
                key={idx}
                className={`border rounded-xl overflow-hidden ${
                  isOpen
                    ? "border-primary/30 shadow-md"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : idx)}
                  className={`w-full flex items-center gap-5 p-6 text-left transition-colors ${
                    isOpen ? "bg-primary text-white" : "bg-white hover:bg-slate-50"
                  }`}
                  aria-expanded={isOpen}
                >
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                      isOpen ? "bg-white/15" : "bg-primary"
                    }`}
                  >
                    <plan.icon className={`w-6 h-6 ${isOpen ? "text-white" : "text-accent"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-lg font-heading font-bold leading-tight ${isOpen ? "text-white" : "text-primary"}`}>
                      {plan.title}
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-white" : "text-slate-400"
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-200 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                  aria-hidden={!isOpen}
                  inert={!isOpen}
                >
                  <div className="min-h-0 overflow-hidden bg-white p-6 pt-5 border-t border-slate-100">
                    <p className="text-slate-600 leading-relaxed mb-5 font-medium text-[15px]">
                      {plan.description}
                    </p>
                    <ul className="space-y-2.5 mb-6">
                      {plan.bullets.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-sm font-medium text-slate-700"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={plan.href}
                      className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:text-accent/80 transition-colors"
                    >
                      {plan.linkLabel} <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <aside
          data-testid="card-plan-summary"
          className="rounded-xl border border-slate-200 bg-slate-50 p-6 lg:sticky lg:top-32"
        >
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Plans</span>
          <h3 className="mt-2 text-xl font-heading font-bold text-primary">Compare plan tiers</h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Essential is $150 a month for hosting and upkeep. Growth is $500 a month ($250 founding) and adds local SEO and blog posts. Full Service is $1,000 a month ($500 founding). Every plan includes an analytics report. No contract.
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm font-bold text-primary">
            {["Essential $150", "Growth $500", "Full Service $1,000", "No contract"].map((t) => (
              <li key={t} className="rounded-md border border-slate-200 bg-white px-3 py-2">{t}</li>
            ))}
          </ul>
          <div className="mt-5 flex flex-col gap-2">
            <a
              href="/pricing/"
              data-testid="link-compare-plans"
              onClick={() => fireEvent("cta_click", { cta_label: "home_compare_plans" })}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-bold text-white hover:bg-primary/90 transition-colors"
            >
              Compare plans <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/intake/?mode=quick"
              onClick={() => fireEvent("cta_click", { cta_label: "home_plans_get_quote" })}
              className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 px-5 text-sm font-bold text-primary hover:border-accent hover:text-accent transition-colors"
            >
              Get a free quote
            </a>
          </div>
        </aside>
        </div>
      </div>
    </section>
  );
}
