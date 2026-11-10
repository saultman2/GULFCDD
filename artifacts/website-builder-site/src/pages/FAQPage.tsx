import { fireEvent } from "@/lib/analytics";
import { EmailLink } from "@/components/EmailLink";
import { isValidElement } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { SupportWidget } from "@/components/SupportWidget";
import { PageHero } from "@/components/PageHero";

interface FAQ {
  q: string;
  a: React.ReactNode;
}

interface FAQGroup {
  label: string;
  faqs: FAQ[];
}

const groups: FAQGroup[] = [
  {
    label: "Getting started",
    faqs: [
      {
        q: "How do I get started with GulfCDD?",
        a: (
          <>
            <p>Send us a message or email with a little about your business. If you have a website, include the link and tell us what you'd like to change. You don't have to choose a plan first.</p>
            <p className="mt-3">We'll ask a few questions and put the proposed work, estimated timing, and cost in writing before you decide.</p>
          </>
        ),
      },
      {
        q: "Do you offer web design outside Biloxi and the Mississippi Gulf Coast?",
        a: (
          <>
            <p>Yes. GulfCDD is based in Biloxi and works with businesses across the Mississippi Gulf Coast, including Gulfport and Ocean Springs. We also handle remote website projects for businesses in New Orleans, Mobile, and anywhere in the United States.</p>
            <p className="mt-3">Planning and review happen by phone, email, or video. Our service areas outside Biloxi are not branch offices. <a href="/service-areas/" className="text-accent hover:underline">See our web design service-area guide</a> for local coverage and details about working remotely.</p>
          </>
        ),
      },
      {
        q: "How long does it take to build my site?",
        a: (
          <>
            <p>It depends on what we're building, how much content is ready, and the feedback needed along the way. We'll include an estimated timeline in your project agreement rather than give every project the same deadline.</p>
            <p className="mt-3">If you have an opening date or event coming up, tell us at the start. We'll discuss what's realistic; an estimate isn't a guaranteed launch date.</p>
          </>
        ),
      },
      {
        q: "What do you need from me?",
        a: (
          <>
            <p>Start with what you do, where you work, and how customers should reach you. A link to your current site, your logo, and photos of your work are helpful if you have them.</p>
            <p className="mt-3">Don't wait until everything is ready to contact us. Tell us what's missing, and we'll work out what content the project needs.</p>
          </>
        ),
      },
      {
        q: "What if I already have a website?",
        a: (
          <>
            <p>We can improve an existing site or discuss a redesign. Send the link, tell us what isn't working, and point out anything you want to keep.</p>
            <p className="mt-3">We'll also ask about your domain and hosting before planning a move. Any migration work will be listed in the quote.</p>
          </>
        ),
      },
    ],
  },
  {
    label: "The process",
    faqs: [
      {
        q: "Will I see the site before it goes live?",
        a: (
          <>
            <p>Yes. You'll get a preview link before launch. Check your services, contact details, photos, and forms, then tell us what needs changing.</p>
            <p className="mt-3">The review and approval steps are part of your project scope.</p>
          </>
        ),
      },
      {
        q: "How do revisions work?",
        a: (
          <>
            <p>Use the preview to make a list of changes and send it by email or text. We'll check the requests against the revision allowance in your project agreement and discuss anything outside it before doing extra work.</p>
            <p className="mt-3">After launch, updates depend on your plan. Essential covers hosting and upkeep. Growth adds local SEO and blog posts. Larger changes may need a separate quote.</p>
          </>
        ),
      },
      {
        q: "What if the design is not what I had in mind?",
        a: (
          <>
            <p>Tell us what feels off and share examples of the direction you prefer. Specific feedback on layout, colors, images, or wording helps us understand what needs to change.</p>
            <p className="mt-3">We discuss the next steps within your agreed scope. If you decide to cancel, the cancellation and refund terms in your project agreement and our Terms of Service apply.</p>
          </>
        ),
      },
      {
        q: "Do I have to do anything to maintain the site after it is live?",
        a: (
          <p>We can handle hosting and maintenance when those services are included in your agreement. You still need to tell us when business details change and review requested updates. Ongoing support and content updates depend on the plan you choose.</p>
        ),
      },
    ],
  },
  {
    label: "Content and copy",
    faqs: [
      {
        q: "Do you write the content for my site?",
        a: (
          <>
            <p>Yes, when copywriting is included in your project. You provide the business details; we help turn them into website text that customers can follow.</p>
            <p className="mt-3">Tell us how you explain your work in conversation and what people usually ask. You'll review the wording and business facts before the site goes live.</p>
          </>
        ),
      },
      {
        q: "What about photos? Do I need professional photos?",
        a: (
          <>
            <p>No. Clear phone photos of your team, workplace, or completed projects can be useful. Send the original files when possible.</p>
            <p className="mt-3">If you need other images, we can discuss licensed stock photography. Only share photos you have permission to use.</p>
          </>
        ),
      },
      {
        q: "Will the content reflect my business and industry?",
        a: (
          <>
            <p>That's the point. We'll ask about your services and customers instead of dropping your business name into generic agency copy. A contractor needs to explain different things from a restaurant or a professional practice.</p>
            <p className="mt-3">You review the business facts and any specialist language before launch. Let us know about qualifications, claims, or disclosures that need particular care.</p>
          </>
        ),
      },
    ],
  },
  {
    label: "Ownership and control",
    faqs: [
      {
        q: "Do I own my website?",
        a: (
          <>
            <p>You retain ownership of the content you supply. After full payment, you own the custom design elements and content created specifically for your project.</p>
            <p className="mt-3">Third-party materials remain subject to their licenses, and GulfCDD retains its pre-existing tools, frameworks, templates, and code libraries. Hosting and any handoff details are set out in your project agreement. See Section 7 of our Terms of Service for the ownership terms.</p>
          </>
        ),
      },
      {
        q: "What happens if I want to cancel?",
        a: (
          <>
            <p>No contracts. Cancel anytime. Our monthly care plans have no minimum commitment or advance-notice requirement. Contact aultman@gulfcoastdigitaldesign.com to stop future renewals.</p>
            <p className="mt-3">Build projects have separate cancellation and refund terms, depending on whether work has begun. Review Section 5 of our Terms of Service and your project agreement before cancelling.</p>
          </>
        ),
      },
      {
        q: "Can I use my existing domain name?",
        a: (
          <p>Yes. Tell us your domain name and where it is registered. We discuss the DNS changes needed to connect it to the new website as part of the launch plan.</p>
        ),
      },
      {
        q: "Can I log in and edit the site myself?",
        a: (
          <>
            <p>Our React websites do not include a drag-and-drop page editor by default. If you need to manage content yourself, mention that before we scope the project.</p>
            <p className="mt-3">For managed updates, send us the changes you need. Essential covers hosting and upkeep. Growth adds local SEO and blog posts.</p>
          </>
        ),
      },
    ],
  },
  {
    label: "After launch",
    faqs: [
      {
        q: "How do I request a change or update?",
        a: (
          <>
            <p>Send the page link and the new text or photo through your client portal, by email, or through the contact form. Include a deadline if there is one.</p>
            <p className="mt-3">We'll check your plan and discuss timing. Essential is hosting and upkeep. Growth adds local SEO and blog posts. Work outside that plan is quoted separately.</p>
          </>
        ),
      },
      {
        q: "What if my site goes down or something breaks?",
        a: (
          <p>Contact us with the page address, what happened, and any error message you see. We investigate issues covered by your hosting or support agreement. Service availability also depends on third-party providers; uninterrupted operation is not guaranteed.</p>
        ),
      },
      {
        q: "Can I add more pages later?",
        a: (
          <p>Yes. Tell us what you'd like to add and we'll agree on the work and cost first. Adding pages is not automatically included in every plan.</p>
        ),
      },
      {
        q: "Can you help if I change my business name or rebrand?",
        a: (
          <p>Yes. We can scope updates to your business name, copy, logo, and colors. If your domain is changing too, include that in the request so we can discuss the transition.</p>
        ),
      },
    ],
  },
  {
    label: "Pricing and billing",
    faqs: [
      {
        q: "What exactly is included in the monthly fee?",
        a: (
          <>
            <p>Plans are monthly with no contract. Essential is $150 a month for hosting and upkeep. Growth is $500 a month, or $250 for founding clients, and adds local SEO and blog posts. Full Service is $1,000 a month, or $500 for founding clients. Every plan includes an analytics report.</p>
          </>
        ),
      },
      {
        q: "Are there any hidden fees I should know about?",
        a: (
          <p>Fees are quoted in your project agreement and are subject to applicable taxes. Ask us about domain registration, third-party software, and any work outside your scope so you understand the costs before proceeding.</p>
        ),
      },
      {
        q: "How do build fees and ongoing support fees differ?",
        a: (
          <>
            <p>Founding clients get the website build free. The offer ends January 31, 2027. The monthly plan is what you pay to keep the site and the included help going.</p>
          </>
        ),
      },
      {
        q: "Can I switch from one plan to another?",
        a: (
          <p>Yes. You can move between Essential, Growth, and Full Service. We'll confirm the change in writing. Essential is hosting and upkeep. Growth adds local SEO and blog posts. Plans stay month to month.</p>
        ),
      },
      {
        q: "How much does a website cost with Gulf Coast Digital Designs?",
        a: (
          <p>Plans are monthly with no contract. Essential is $150 a month. Growth is $500 a month, or $250 for founding clients. Full Service is $1,000 a month, or $500 for founding clients. Through January 31, 2027, founding clients get the website build free. Every plan includes an analytics report.</p>
        ),
      },
      {
        q: "Do I have to sign a contract?",
        a: (
          <p>No. You pay month to month and can cancel anytime. We'd rather keep you because the site is working.</p>
        ),
      },
      {
        q: "Can you guarantee I'll be #1 on Google?",
        a: (
          <p>No, and you should be wary of anyone who does. We fix what's in our control: the site, your Google Business Profile, your listings, and your content. Then we show you what changed in your monthly analytics report.</p>
        ),
      },
      {
        q: "What is AEO and GEO?",
        a: (
          <p>AEO (answer engine optimization) writes your pages so Google and voice assistants can lift a clear answer from them. GEO (generative engine optimization) makes your business facts consistent so AI tools like ChatGPT, Gemini, and Perplexity describe you correctly. Both build on regular SEO.</p>
        ),
      },
      {
        q: "Do you only work with businesses in Biloxi?",
        a: (
          <p>We're based in Biloxi and work all over the Coast, from Bay St. Louis to Pascagoula, plus New Orleans and Mobile. Most of the work happens by phone and screen share, so we can help businesses farther away too.</p>
        ),
      },
      {
        q: "How fast can you answer?",
        a: (
          <p>Call (228) 278-7782 any time. The line is answered 24/7.</p>
        ),
      },
      {
        q: "Is there a contract or minimum commitment?",
        a: (
          <p>No. You pay month to month and can cancel anytime. We'd rather keep you because the site is working.</p>
        ),
      },
    ],
  },
  {
    label: "Technical and security",
    faqs: [
      {
        q: "Will my site look good on a phone?",
        a: (
          <p>Yes. We build sites to work on a phone first, so visitors can read your services and find your contact options.</p>
        ),
      },
      {
        q: "What about Google and search rankings?",
        a: (
          <>
            <p>Local SEO is part of Growth, which also includes blog posts. Essential covers hosting and upkeep. No one can guarantee a ranking. Every plan includes a monthly analytics report.</p>
            <p className="mt-3">Clear service pages, titles, headings, and accurate local business details help search engines understand a site. Rankings, traffic, map placement, and inquiries are not guaranteed.</p>
          </>
        ),
      },
      {
        q: "Can visitors send sensitive information through a contact form?",
        a: (
          <>
            <p>A general contact form is for basic inquiries, not passwords, payment card details, health records, or other sensitive information.</p>
            <p className="mt-3">If your business needs a regulated intake or communication workflow, tell us before the project is scoped. Do not assume a standard website form meets HIPAA or other industry-specific requirements.</p>
          </>
        ),
      },
      {
        q: "How fast will my site load?",
        a: (
          <>
            <p>That depends on the images, features, hosting, and the device and connection someone uses. We pay attention to image sizes and how the code loads, but there's no single speed we can promise every visitor.</p>
            <p className="mt-3">If your current site feels slow, send the link and tell us where you notice the problem. That gives us something specific to investigate.</p>
          </>
        ),
      },
      {
        q: "Can you make my business appear in AI search answers?",
        a: (
          <p>We can make your service information and answers easier to find and understand, which is the goal of AEO and GEO work. We can't make an AI tool recommend you or guarantee a citation. Accurate business facts, useful pages, and normal SEO foundations matter more than adding special AI wording.</p>
        ),
      },
      {
        q: "What technology do you build on and why does it matter?",
        a: (
          <>
            <p>We build websites with React and cloud hosting infrastructure. This lets us create custom layouts and features rather than relying on a drag-and-drop page builder.</p>
            <p className="mt-3">The practical questions are how the site will be hosted, maintained, and updated. We discuss those details with you; a custom-coded site still needs ongoing technical care.</p>
          </>
        ),
      },
    ],
  },
];

function faqAnswerToText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(faqAnswerToText).join(" ");
  if (isValidElement(node)) {
    const children = (node.props as { children?: React.ReactNode }).children;
    return faqAnswerToText(children);
  }
  return "";
}

function AccordionItem({ faq }: { faq: FAQ }) {
  return (
    <details className="group border-b border-slate-200 last:border-b-0">
      <summary className="w-full cursor-pointer list-none text-left flex items-start justify-between gap-6 py-6 font-bold leading-snug text-foreground hover:text-primary transition-colors [&::-webkit-details-marker]:hidden">
        <span>{faq.q}</span>
        <ChevronDown className="w-5 h-5 shrink-0 mt-0.5 text-accent transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div className="text-muted-foreground leading-relaxed text-[15px] pb-6 pr-8">
        {faq.a}
      </div>
    </details>
  );
}

export default function FAQPage() {
  useSEO({
    title: "Web Design & SEO Questions Answered | Gulf Coast Digital Designs",
    description: "Straight answers on cost, contracts, AI search, and how we work with Biloxi and Gulf Coast businesses.",
    canonical: "https://www.gulfcdd.com/faq",
    breadcrumbs: [{ name: "FAQ", url: "https://www.gulfcdd.com/faq" }],
  });
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": groups.flatMap((group) =>
      group.faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faqAnswerToText(faq.a).replace(/\s+/g, " ").trim(),
        },
      })),
    ),
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <script
          id="ld-faq"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <PageHero
          title="Questions We Get a Lot"
          subtitle="Straight answers on cost, contracts, AI search, and how we work with Biloxi and Gulf Coast businesses."
          imageSrc="/images/biloxi-pier-sunset.webp"
          imageAlt="Biloxi pier at sunset"
          location="Biloxi, Mississippi"
        />

        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">

            {/* Intro */}
            <div className="max-w-2xl mb-16">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Gulf Coast Digital Designs builds websites for small businesses on the Mississippi Gulf Coast, in New Orleans, and in Mobile. These answers cover cost, contracts, and how the work actually goes.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                For project-specific details, your written agreement and our Terms of Service apply. If your question is not covered here, email us or use the contact form.
              </p>
            </div>

            <div className="grid lg:grid-cols-4 gap-10">

              {/* Sidebar nav */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-24 space-y-1">
                  {groups.map((g) => (
                    <a
                      key={g.label}
                      href={`#faq-${g.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        "block text-muted-foreground hover:text-foreground hover:bg-card"
                      }`}
                    >
                      {g.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* FAQ content */}
              <div className="lg:col-span-3">
                <div className="space-y-12">
                  {groups.map((group) => {
                    const groupId = `faq-${group.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
                    return (
                      <section key={group.label} id={groupId} className="scroll-mt-24">
                    <h2 className="text-2xl font-heading font-bold text-primary mb-2">
                      {group.label}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-8 font-medium">
                      {group.faqs.length} questions
                    </p>
                    <div className="bg-white border border-slate-200 shadow-sm rounded-xl px-6 md:px-8 divide-y-0">
                      {group.faqs.map((faq) => <AccordionItem key={faq.q} faq={faq} />)}
                    </div>
                      </section>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Still have questions */}
        <div className="py-16 bg-[#0E1826]">
          <div className="container mx-auto px-4 md:px-6 max-w-2xl text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-3">
              Still have a question?
            </h2>
            <p className="text-white/70 leading-relaxed font-medium mb-7">
              Ask about your website, an existing site you want to replace, or the support you need. You do not need to choose a tier before contacting us.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <EmailLink
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold rounded-md px-7 h-11 transition-colors text-sm shadow-md"
              >
                Email us directly
              </EmailLink>
              <a
                href="/contact/"
                className="inline-flex items-center justify-center gap-2 border border-white/20 bg-white/10 text-white hover:bg-white/15 rounded-md px-7 h-11 transition-colors text-sm font-bold"
                onClick={() => fireEvent("cta_click", { cta_label: "faq_contact_form" })}
              >
                Use the contact form <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Ready to start */}
        <div className="py-14 bg-white border-t border-slate-200">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent mb-3">Ready to move forward?</p>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-4">
              See our services and packages
            </h2>
            <p className="text-muted-foreground mb-7 leading-relaxed">
              Compare Essential, Growth, and Full Service. Every plan includes an analytics report, and you can cancel anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/services/"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold rounded-md px-7 h-11 transition-colors text-sm shadow-md"
              >
                View our services <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/pricing/"
                className="inline-flex items-center justify-center gap-2 border border-slate-300 bg-white text-primary hover:bg-slate-50 rounded-md px-7 h-11 transition-colors text-sm font-bold shadow-sm"
              >
                See our packages <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

      </main>
      <Footer />
      <SupportWidget />
    </div>
  );
}
