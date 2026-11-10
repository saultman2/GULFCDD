export const OWNERSHIP_TERMS = "The initial website build has no upfront design fee for approved applicants. Payment for the monthly service plan is collected only after you approve the completed website and it has been published. Ownership of the custom website transfers after six consecutive paid subscription months. If you cancel before completing those six months, you forfeit ownership of the custom website. Your domain and the content you supply remain yours. Hosting and ongoing services continue under your monthly plan. No additional cancellation fee is specified by this promotion.";
export const PLANS = [
  { id: "essential", name: "Essential", price: 150, regularPrice: 150, features: [
    "Hosting and upkeep", "Monthly analytics report", "Month to month, no contract",
  ] },
  { id: "growth", name: "Growth", price: 250, regularPrice: 500, features: [
    "Hosting and upkeep", "Local SEO", "Blog posts", "Monthly analytics report", "Month to month, no contract",
  ] },
  { id: "full", name: "Full Service", price: 500, regularPrice: 1000, features: [
    "Monthly analytics report", "Month to month, no contract",
  ] },
];
export const DEFAULT_CONFIG = {
  headline: "Get a Professional Website Built for FREE.",
  intro: "Starting a business or tired of your outdated website? We're helping small-business owners get professional websites without paying the usual upfront design fees.",
  deadline: "2027-01-31",
  ownershipTerms: OWNERSHIP_TERMS,
  plans: PLANS,
  followupsEnabled: false,
  projects: [
    { title: "Electrical services website", image: "/images/portfolio/knppower.webp", url: "https://knppower.com/", label: "Website example" },
    { title: "Home improvement website", image: "/images/portfolio/kennedygutters.webp", url: "https://kennedygutters.com/", label: "Website example" },
  ],
  faqs: [
    { question: "Is the website really free?", answer: "Approved applicants pay no upfront website design fee. A monthly service plan is required, starting at $150/month. We collect the first payment only after you approve the completed website and it has been published. Ownership transfers after six consecutive paid subscription months." },
    { question: "Why offer a free build?", answer: "We want to build lasting working relationships with small businesses. We cover the initial design work and earn our income through the monthly services you choose." },
    { question: "Do I need a monthly plan?", answer: "Yes. This offer is for approved businesses joining Essential, Growth, or Full Service. Selecting a plan in the application isn't a purchase or an agreement." },
    { question: "What happens if I cancel?", answer: "Cancelling before six consecutive paid subscription months means you forfeit ownership of the custom website. This is a separate promotion, not a change to the ordinary monthly care packages. The agreement explains your scope and service arrangements before you pay." },
    { question: "Will I own my website?", answer: "Ownership of the custom website transfers after six consecutive paid subscription months. Your domain and the content you supply remain yours. Hosting and ongoing services continue under your monthly plan." },
    { question: "Can I use my existing domain?", answer: "Yes. Tell us where it's registered. We'll work out the connection without asking you to give up ownership of your domain." },
    { question: "Can I request changes?", answer: "Yes, within the scope agreed for your build and monthly plan. We'll define the included pages, revisions, and update limits in your proposal; unlimited work isn't promised." },
    { question: "What if I already have a website?", answer: "Share its address and what isn't working for you. We'll review whether a replacement is a good fit for this offer." },
    { question: "Do you work outside Mississippi?", answer: "Yes. We're based in Biloxi, Mississippi, and work remotely with businesses elsewhere by phone, email, and a shared website preview." },
    { question: "Will I show up on Google?", answer: "We build a search-friendly structure and set up titles and descriptions. Google decides what it indexes and ranks; neither search rankings nor AI recommendations are guaranteed." },
    { question: "What's included in the monthly plans?", answer: "Essential is $150 a month for hosting and upkeep. Growth is $500 a month, or $250 a month for founding clients, and adds local SEO and blog posts. Full Service is $1,000 a month, or $500 a month for founding clients. Every plan includes an analytics report. No contract. Founding clients get the website build free through January 31, 2027." },
    { question: "How long does the application take?", answer: "The application takes about three short steps. Have your business details and contact information handy; you can review your answers before sending." },
    { question: "What happens after approval?", answer: "We'll send a proposal with your website scope, monthly plan, and promotional ownership terms. You review and sign it, then we build the site. After you approve the finished website and it is published, you can activate your monthly plan and make the first payment." },
  ],
};
export const STATUSES = ["new_application", "under_review", "contacted", "qualified", "approved", "awaiting_agreement", "awaiting_payment", "website_in_progress", "website_launched", "active_monthly_client", "declined", "closed_lost"];
export const TERMINAL_STATUSES = ["declined", "closed_lost", "active_monthly_client"];
export const CAMPAIGN_ORIGIN = "https://www.gulfcdd.com";

export function normalizeCampaignFaqs(faqs: unknown) {
  if (!Array.isArray(faqs)) return DEFAULT_CONFIG.faqs;
  const defaults = new Map(DEFAULT_CONFIG.faqs.map((faq) => [faq.question, faq]));
  return faqs
    .filter((faq): faq is { question: string; answer: string } =>
      !!faq && typeof faq.question === "string" && typeof faq.answer === "string"
      && !/third[- ]party.*cost|cost.*third[- ]party/i.test(`${faq.question} ${faq.answer}`))
    .map((faq) => defaults.get(faq.question) ?? faq);
}
