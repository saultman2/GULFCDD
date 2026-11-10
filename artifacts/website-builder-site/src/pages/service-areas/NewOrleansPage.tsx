import { ServiceAreaTemplate } from "@/components/ServiceAreaTemplate";

export default function NewOrleansPage() {
  return (
    <ServiceAreaTemplate
      city="New Orleans"
      state="LA"
      slug="new-orleans"
      headline="Web Design and SEO for New Orleans Small Businesses"
      subtitle="Web design, local SEO, and AI search help from a veteran-owned Gulf Coast team. Plans from $150 a month."
      intro="We're straight about it: we're based in Biloxi, about an hour and a half up I-10. Most of our New Orleans work happens by phone and screen share, and we can drive over when it's worth sitting down. What you get is a small Gulf Coast team that picks up the phone, at prices built for small businesses instead of big-agency retainers."
      bodyP2="Call (228) 278-7782. Plans start at $150 a month with no contract."
      sections={[
        {
          heading: "New Orleans search is crowded",
          body: "You're up against established agencies, national franchises, and a flood of tourism listings. Neighborhood matters: people search \"Uptown,\" \"Mid-City,\" \"Metairie,\" and \"Northshore,\" not just \"New Orleans.\" We build pages around the areas you really serve.",
        },
        {
          heading: "AI answers are already here",
          body: "A lot of New Orleans visitors plan trips by asking AI tools where to eat or who to call. Consistent business facts and clear, quotable pages give you a better shot at being mentioned. No one can guarantee it.",
        },
        {
          heading: "Hurricane-season ready",
          body: "Cloud hosting with off-site backups, so your site stays up when the power doesn't.",
        },
      ]}
      faqs={[
        {
          question: "How much does a website cost in New Orleans?",
          answer: "Our plans start at $150 a month with no contract. Founding clients get the build free through January 31, 2027.",
        },
        {
          question: "Do you have an office in New Orleans?",
          answer: "No. We're in Biloxi and serve New Orleans remotely and with visits when needed.",
        },
        {
          question: "Can you help me show up in Metairie or the Northshore?",
          answer: "Yes, with honest service-area settings in your Google profile and pages for the areas you really cover.",
        },
      ]}
      imageSrc="/images/gulf-coast-beach-walkers.webp"
      imageAlt="Gulf Coast shoreline between Biloxi and New Orleans"
      metaTitle="New Orleans Web Design & SEO for Small Businesses | GulfCDD"
      metaDescription="Web design, local SEO and AI search help for New Orleans small businesses, from a veteran-owned Gulf Coast team. Plans from $150/mo, no contract."
      canonical="https://www.gulfcdd.com/service-areas/new-orleans"
      relatedLinks={[
        { label: "Local SEO", href: "/services/seo/" },
        { label: "Website design", href: "/services/design/" },
        { label: "Pricing", href: "/pricing/" },
        { label: "Bay St. Louis", href: "/service-areas/bay-st-louis/" },
        { label: "Biloxi", href: "/service-areas/biloxi/" },
      ]}
    />
  );
}
