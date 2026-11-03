import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { fireEvent } from "@/lib/analytics";
import { useSEO } from "@/hooks/useSEO";
import { Header } from "@/sections/Header";
import { Capabilities } from "@/sections/Templates";
import { Footer } from "@/sections/Footer";
import { SupportWidget } from "@/components/SupportWidget";
import { PageHero } from "@/components/PageHero";

export default function WhatWeBuildPage() {
  useSEO({
    title: "Websites & Custom Apps We Build | Gulf Coast Digital Designs",
    description: "Service business sites, restaurant sites, online stores, booking tools and custom apps for Gulf Coast businesses.",
    canonical: "https://www.gulfcdd.com/what-we-build",
    breadcrumbs: [{ name: "Our Capabilities", url: "https://www.gulfcdd.com/what-we-build" }],
  });
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main>
        <PageHero
          title="What We Build"
          subtitle="From a first business website to a booking tool or client portal, tell us what you need customers and staff to be able to do."
          imageSrc="/images/biloxi-pier-sunset.webp"
          imageAlt="Biloxi pier at sunset, Mississippi"
          location="Mississippi Gulf Coast"
        />

        {/* Capabilities section */}
        <Capabilities />
        <section className="py-20 bg-white border-t border-slate-200">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <div className="max-w-3xl mb-12">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-accent mb-4">From first click to follow-up</span>
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-primary leading-tight mb-5">
                What can GulfCDD build for a local business?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                GulfCDD builds business websites, online stores, quote forms, booking requests, and custom tools. We can also connect a website to software you already use, where that system allows it. Tell us how you handle inquiries or orders now, and we'll discuss what the website could make easier.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                ["Explain your services", "Give customers the details they need before hiring you: what you do, where you work, and how to request an estimate. Local SEO helps search engines understand those pages too."],
                ["Collect the right inquiries", "Use quote forms, phone links, and booking requests to help people contact you. Show your work through galleries and genuine reviews when you have permission to use them."],
                ["Help your team get work done", "Discuss calendars, client portals, reporting, and connections between tools. We'll check the data, access, and third-party requirements before quoting a custom feature."],
              ].map(([title, description]) => (
                <div key={title} className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                  <h3 className="font-heading font-bold text-primary mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold">
              <a href="/services/design/" className="text-accent hover:text-primary transition-colors">Explore website design <ArrowRight className="inline w-4 h-4" /></a>
              <a href="/services/development/" className="text-accent hover:text-primary transition-colors">Explore development <ArrowRight className="inline w-4 h-4" /></a>
              <a href="/services/seo/" className="text-accent hover:text-primary transition-colors">Explore local SEO <ArrowRight className="inline w-4 h-4" /></a>
              <a href="/services/hosting/" className="text-accent hover:text-primary transition-colors">Explore hosting <ArrowRight className="inline w-4 h-4" /></a>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative bg-primary rounded-2xl p-10 md:p-14 text-center text-white overflow-hidden"
            >
              <div className="absolute inset-0 opacity-[0.10] rounded-2xl" aria-hidden="true">
                <img src="/images/biloxi-pier-sunset.webp" alt="Biloxi pier at sunset on the Mississippi Gulf Coast" width={1920} height={1080} loading="lazy" decoding="async" className="w-full h-full object-cover object-center rounded-2xl" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-heading font-extrabold mb-4">
                  Ready to get started?
                </h3>
                <p className="text-white/75 text-lg mb-8 max-w-xl mx-auto">
                  Tell us what customers need to do on your website and which tools you already use. We will prepare a free quote and discuss timing based on the scope.
                </p>
                <a
                  href="/intake/?mode=quick"
                  className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold rounded-md px-8 h-12 transition-colors shadow-md text-sm"
                  onClick={() => fireEvent("cta_click", { cta_label: "what_we_build_get_quote" })}
                >
                  Get a Free Quote <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      <SupportWidget />
    </div>
  );
}
