import { ServiceAreaTemplate } from "@/components/ServiceAreaTemplate";

export default function GulfportPage() {
  return (
    <ServiceAreaTemplate
      city="Gulfport"
      state="MS"
      slug="gulfport"
      headline="Gulfport Web Design and SEO"
      subtitle="Websites and local SEO for Gulfport contractors, shops, and service businesses. No contract."
      intro="Gulfport is the Coast's biggest city and its most crowded search results. If you run a crew in Orange Grove, a shop downtown near Jones Park, or a service business working off Highway 49, you're competing with a lot of names for the same few spots on Google."
      bodyP2="A page for each service you actually want more of, a Google profile with real photos and steady reviews, and a site that loads quick on a phone at a job site. That's what helps a Gulfport business stand out. Call (228) 278-7782."
      sections={[
        {
          heading: "What helps Gulfport businesses stand out",
          body: "We build the service pages you actually want more calls for, keep the Google profile current, and make the site usable on a phone at a job site. We also serve Long Beach and Pass Christian.",
        },
      ]}
      faqs={[
        {
          question: "Do you build websites for contractors in Gulfport?",
          answer: "Yes. Contractor sites built around estimates, service areas, and before-and-after photos.",
        },
        {
          question: "I already have a website. Do I need a new one?",
          answer: "Maybe not. We'll look first and tell you if a few page fixes would do.",
        },
        {
          question: "Do you serve Long Beach and Pass Christian too?",
          answer: "Yes. See our Long Beach page.",
        },
      ]}
      imageSrc="/images/gulf-coast-beach-walkers.webp"
      imageAlt="Gulf Coast beach near Gulfport"
      metaTitle="Gulfport Web Design & SEO for Small Businesses | GulfCDD"
      metaDescription="Websites and local SEO for Gulfport contractors, shops and service businesses. Veteran-owned, no contract. Call (228) 278-7782."
      canonical="https://www.gulfcdd.com/service-areas/gulfport"
      relatedLinks={[
        { label: "Local SEO", href: "/services/seo/" },
        { label: "Website design", href: "/services/design/" },
        { label: "Pricing", href: "/pricing/" },
        { label: "Long Beach", href: "/service-areas/long-beach/" },
        { label: "Biloxi", href: "/service-areas/biloxi/" },
      ]}
    />
  );
}
