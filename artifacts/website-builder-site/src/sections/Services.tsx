import { useState } from "react";
import { ResponsiveCoastImage } from "@/components/ResponsiveCoastImage";
import { AnimatePresence, motion } from "framer-motion";
import { fireEvent } from "@/lib/analytics";
import {
  ChevronDown,
  Palette,
  Code2,
  Server,
  Wrench,
  Bot,
  Megaphone,
  CheckCircle2,
} from "lucide-react";

const services = [
  {
    icon: Palette,
    title: "Website Design",
    tagline: "Custom pages that explain your business and guide the next step.",
    description:
      "Show customers what you do, where you work, and why they should contact you. We use your services, photos, and business details to plan the site. Founding clients get the build free through January 31, 2027.",
    includes: [
      "One-page sites for a focused introduction to your business.",
      "Full multi-page business sites. Home, services, about, and contact.",
      "Landing pages built for a specific campaign, promotion, or launch.",
      "Redesigns that keep useful content and replace what isn't working.",
    ],
  },
  {
    icon: Code2,
    title: "Website Development",
    tagline: "Forms, stores, and booking tools built around your workflow.",
    description:
      "Need a quote form that asks the right questions, a shop customers can buy from, or a way to request appointments? We build and test those features. A booking request isn't a confirmed appointment unless your project includes a connected scheduling system.",
    includes: [
      "Online stores with simple, easy-to-manage checkouts.",
      "Contact and quote request forms with direct email delivery.",
      "Appointment and booking request forms.",
      "Page titles, descriptions, headings, and crawlable links.",
      "Responsive layouts for phones, tablets, and desktop screens.",
    ],
  },
  {
    icon: Server,
    title: "Website Hosting",
    tagline: "Your domain, hosting, and SSL. All handled by us.",
    description:
      "Essential is $150 a month for hosting and upkeep. Every plan includes an analytics report. Call (228) 278-7782 when something is off.",
    includes: [
      "Domain registration and full management.",
      "Fast, reliable cloud hosting.",
      "Free SSL security certificate included.",
      "Uptime monitoring and regular automated backups.",
    ],
  },
  {
    icon: Wrench,
    title: "Website Maintenance",
    tagline: "Content changes and technical care after launch.",
    description:
      "New menu? Holiday hours? Just text us. Essential covers hosting and upkeep. Growth adds local SEO and blog posts. We'll confirm anything outside your plan before starting.",
    includes: [
      "Content updates you can text us.",
      "Security patches and software management.",
      "Local SEO is part of Growth.",
      "Direct support by email or text.",
    ],
  },
  {
    icon: Megaphone,
    title: "Digital Marketing, SEO, AEO & GEO",
    tagline: "Clear business information for local search and AI answers.",
    description:
      "We help people find accurate information about your business through service pages, local listings, and your Google Business Profile. SEO covers search visibility; AEO and GEO focus on answers in search and AI tools. The work starts with real information, not promises of a particular ranking.",
    includes: [
      "Local SEO, on-page optimization, and technical SEO.",
      "Google Business Profile, maps, citations, and review strategy.",
      "Content and social media support that keeps your brand visible.",
      "AEO question-and-answer content and GEO for AI-search clarity.",
    ],
  },
  {
    icon: Bot,
    title: "Custom Applications",
    tagline: "Useful software, calendars, APIs, and integrations built for your business.",
    description:
      "If your team is copying information between tools or chasing the same details every day, tell us how the job works. We can scope calendars, client portals, internal tools, and software connections. What's possible depends on the systems you use and the access they provide.",
    includes: [
      "Custom calendars, booking systems, and client portals.",
      "API integrations that connect your existing software.",
      "Internal tools and business software built around your workflow.",
      "AI features and automations when they make sense for your business.",
    ],
  },
];

export function Services() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-20">
        <ResponsiveCoastImage
          src="/images/ocean-springs-harbor.jpg"
          alt="Ocean Springs harbor and coastal waterfront"
          width={1920}
          height={1080}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-white/75" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-accent mb-4">
            What We Offer
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-5 leading-tight">
            Website and digital support from one Gulf Coast team.
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed font-medium">
            GulfCDD builds websites for Mississippi Gulf Coast businesses and offers hosting, updates, and local SEO after launch. You can hire us for a new site or ask for help with one you already have.
          </p>
        </div>

        <div className="max-w-4xl space-y-3">
          {services.map((service, idx) => {
            const isOpen = open === idx;
            return (
              <div
                key={idx}
                className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                  isOpen
                    ? "border-primary/30 shadow-md"
                    : "border-slate-200 hover:border-slate-300 bg-white/80 backdrop-blur-sm"
                }`}
                data-testid={`service-card-${idx}`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : idx)}
                  className={`w-full flex items-center gap-5 p-6 text-left transition-colors ${
                    isOpen ? "bg-primary text-white" : "bg-white/90 hover:bg-white"
                  }`}
                  aria-expanded={isOpen}
                >
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                      isOpen ? "bg-white/15" : "bg-primary"
                    }`}
                  >
                    <service.icon
                      className={`w-6 h-6 ${isOpen ? "text-white" : "text-accent"}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-lg font-heading font-bold leading-tight ${
                        isOpen ? "text-white" : "text-primary"
                      }`}
                    >
                      {service.title}
                    </div>
                    <div
                      className={`text-sm font-medium mt-0.5 ${
                        isOpen ? "text-white/70" : "text-slate-500"
                      }`}
                    >
                      {service.tagline}
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-white" : "text-slate-400"
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="bg-white p-6 pt-5 border-t border-slate-100">
                        <p className="text-slate-600 leading-relaxed mb-5 font-medium text-[15px]">
                          {service.description}
                        </p>
                        <ul className="space-y-2.5">
                          {service.includes.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-3 text-sm font-medium text-slate-700"
                            >
                              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-accent" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-6">
                          <a
                            href="/intake/?mode=quick"
                            className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:text-accent/80 transition-colors"
                            onClick={() => fireEvent("cta_click", { cta_label: "services_section_get_quote" })}
                          >
                            Get a free quote for this service &rarr;
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
