import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { capabilityPreviewById, type CapabilityPreview, type CapabilityPreviewId } from "@/data/capability-previews";
import { CapabilityPreviewDialog } from "@/components/CapabilityPreviewDialog";
import {
  Monitor, LayoutTemplate, Search, ShoppingCart, Smartphone, RefreshCw, Globe, Wrench,
  Mail, Calendar, Image, Map, Star, BarChart2, Lock, PhoneCall, ArrowUpRight,
} from "lucide-react";

const ourServices = [
  {
    icon: Monitor,
    name: "One page sites",
    previewId: "service-one-page" as CapabilityPreviewId,
    desc: "Put your main service, business details, and contact options on one page. A good fit when you don't need a larger site.",
  },
  {
    icon: LayoutTemplate,
    name: "Full business sites",
    previewId: "service-multipage" as CapabilityPreviewId,
    desc: "Explain your services, introduce your business, and show customers how to get in touch. Plans start at $150 a month with no contract.",
  },
  {
    icon: Search,
    name: "Search-ready structure",
    previewId: "service-search-structure" as CapabilityPreviewId,
    desc: "Page titles, descriptions, headings, and links that explain each page to visitors and search engines. Visibility is not guaranteed.",
  },
  {
    icon: ShoppingCart,
    name: "Online stores",
    previewId: "service-online-store" as CapabilityPreviewId,
    desc: "Sell your products or services with a checkout that is simple for you to manage and easy for your customers to use.",
  },
  {
    icon: Smartphone,
    name: "Landing pages",
    previewId: "service-landing-page" as CapabilityPreviewId,
    desc: "Send people to a page about the specific offer they clicked, with the details they need before they call or fill in a form.",
  },
  {
    icon: RefreshCw,
    name: "Website redesigns",
    previewId: "service-redesign" as CapabilityPreviewId,
    desc: "Replace an outdated layout, reorganize your pages, or improve the mobile experience. We agree on what to keep and what to rebuild.",
  },
  {
    icon: Globe,
    name: "Domain and hosting",
    previewId: "service-domain-hosting" as CapabilityPreviewId,
    desc: "We handle the technical side. Your domain, the hosting, the SSL certificate, and the launch.",
  },
  {
    icon: Wrench,
    name: "Ongoing maintenance",
    previewId: "service-maintenance" as CapabilityPreviewId,
    desc: "Content updates and technical care after launch. Design changes and local SEO maintenance depend on your hosting and support coverage.",
  },
];

const features = [
  { icon: Mail, label: "Contact forms with email delivery", previewId: "feature-contact-form" as CapabilityPreviewId },
  { icon: Calendar, label: "Appointment and booking request forms", previewId: "feature-booking" as CapabilityPreviewId },
  { icon: Image, label: "Photo and video galleries", previewId: "feature-gallery" as CapabilityPreviewId },
  { icon: Map, label: "Map and location section", previewId: "feature-map" as CapabilityPreviewId },
  { icon: Star, label: "Customer reviews section", previewId: "feature-reviews" as CapabilityPreviewId },
  { icon: Search, label: "Search Engine Optimization (SEO)", previewId: "feature-seo" as CapabilityPreviewId },
  { icon: Map, label: "Local SEO and business information", previewId: "feature-local-seo" as CapabilityPreviewId },
  { icon: BarChart2, label: "Social Media Integration", previewId: "feature-social" as CapabilityPreviewId },
  { icon: Smartphone, label: "Responsive phone and tablet layouts", previewId: "feature-responsive" as CapabilityPreviewId },
  { icon: Globe, label: "Custom domain support", previewId: "feature-custom-domain" as CapabilityPreviewId },
  { icon: Lock, label: "SSL security certificate included", previewId: "feature-ssl" as CapabilityPreviewId },
  { icon: PhoneCall, label: "Click to call and click to text", previewId: "feature-click-to-call" as CapabilityPreviewId },
];

export function Capabilities() {
  const [active, setActive] = useState<CapabilityPreview | null>(null);
  const returnFocusRef = useRef<HTMLButtonElement | null>(null);
  const open = (id: CapabilityPreviewId, trigger: HTMLButtonElement) => {
    returnFocusRef.current = trigger;
    setActive(capabilityPreviewById[id]);
  };
  return (
    <section id="capabilities" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-20">
        <img
          src="/images/ocean-springs-beach-sunset-optimized.webp"
          alt="Ocean Springs beach at sunset on the Mississippi Gulf Coast"
          width={1920}
          height={1080}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-black/75" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-accent mb-4">
            Our Capabilities
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-5 leading-tight">
            What can your website include?
          </h2>
          <p className="text-lg text-white/85 leading-relaxed font-medium">
            Not every business needs an online store or booking system. We can build those, but we'll first ask what your customers need to do. Your quote sets out the features, content, and support you've chosen.
          </p>
          <p className="mt-3 text-sm text-white/65 font-medium">
            Tap any item to see a full sample screen. Every example uses a fictional business and sample content.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70 mb-6">
              Services we provide
            </p>
            <div className="space-y-5">
              {ourServices.map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  style={{ willChange: "transform" }}
                >
                  <button
                    type="button"
                    onClick={(event) => open(s.previewId, event.currentTarget)}
                    aria-haspopup="dialog"
                    data-testid={`button-preview-${s.previewId}`}
                    className="group flex w-full gap-4 text-left rounded-lg -m-2 p-2 hover:bg-white/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
                  >
                  <div className="relative w-24 sm:w-28 shrink-0 mt-0.5 overflow-hidden rounded-md border border-white/15 bg-white/5 shadow-sm aspect-[1200/788]">
                    <img
                      src={capabilityPreviewById[s.previewId].image}
                      alt=""
                      width={1200}
                      height={788}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute bottom-1 left-1 w-6 h-6 rounded bg-black/70 flex items-center justify-center">
                      <s.icon className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-primary text-sm mb-0.5">{s.name}</div>
                    <div className="text-sm text-white/80 leading-relaxed font-medium">{s.desc}</div>
                    <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-accent group-hover:underline">
                      See example<span className="sr-only"> of {s.name}</span> <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
                  </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70 mb-6">
              Features to discuss for your build
            </p>
            <div className="grid grid-cols-1 gap-3">
              {features.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                  style={{ willChange: "transform" }}
                >
                  <button
                    type="button"
                    onClick={(event) => open(f.previewId, event.currentTarget)}
                    aria-haspopup="dialog"
                    data-testid={`button-preview-${f.previewId}`}
                    className="group flex w-full items-center gap-3 text-left text-sm font-medium text-white/90 rounded-md -mx-2 px-2 py-1 hover:bg-white/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
                  >
                  <div className="relative w-16 shrink-0 overflow-hidden rounded border border-white/15 bg-white/5 shadow-sm aspect-[1200/788]">
                    <img
                      src={capabilityPreviewById[f.previewId].image}
                      alt=""
                      width={1200}
                      height={788}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute bottom-0.5 left-0.5 w-5 h-5 rounded-sm bg-black/70 flex items-center justify-center">
                      <f.icon className="w-3 h-3 text-accent" aria-hidden="true" />
                    </span>
                  </div>
                  <span className="flex-1">{f.label}</span>
                  <span className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-accent group-hover:underline">
                    See example<span className="sr-only"> of {f.label}</span> <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="border border-white/15 rounded-xl overflow-hidden shadow-sm bg-[#0c0d10]">
          <div className="bg-white/[0.05] px-6 py-4 border-b border-white/10">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
              Website Support &amp; Technology
            </span>
          </div>
           <div className="grid sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {[
              { value: "Veteran Owned", detail: "Founded and operated by a U.S. military veteran." },
              { value: "American Made", detail: "100% American owned, American based, and American built. Every time." },
              { value: "Website Updates", detail: "Send requested changes by text or email. Timing depends on the scope of the work and your support plan." },
              { value: "Flexible Hosting", detail: "Host your website with us, or we can build it ready for deployment with the hosting provider of your choice." },
            ].map((f) => (
              <div key={f.value} className="px-6 py-6">
                <div className="font-heading font-bold text-white text-lg mb-1">{f.value}</div>
                <div className="text-sm text-white/75 font-medium">{f.detail}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
      <CapabilityPreviewDialog preview={active} returnFocusRef={returnFocusRef} onOpenChange={(o) => { if (!o) setActive(null); }} />
    </section>
  );
}

export function Templates() {
  return <Capabilities />;
}
