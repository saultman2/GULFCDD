import { ServiceAreaTemplate } from "@/components/ServiceAreaTemplate";

export default function MobilePage() {
  return (
    <ServiceAreaTemplate
      city="Mobile"
      state="AL"
      slug="mobile"
      headline="Web Design and SEO in Mobile, Alabama"
      subtitle="Website design and local SEO for Mobile small businesses. Plans from $150 a month, no contract."
      intro="Mobile's about an hour east of us on I-10, close enough to come meet you and close enough that we know the Coast customer. From shops in downtown and Midtown to contractors working West Mobile, we build sites that make it easy to call you."
      bodyP2="We're based in Biloxi, Mississippi, and serve Mobile in person and remotely. Call (228) 278-7782."
      sections={[
        {
          heading: "Built for Mobile's mix",
          body: "Port, shipbuilding, and aerospace jobs bring in new residents every year who don't know anybody yet. They find businesses through search and reviews. We help you be the one they find and trust.",
        },
        {
          heading: "Website design and SEO together",
          body: "Search results for web design in Mobile often show people want both a site and local SEO. Growth adds local SEO and blog posts on top of hosting and upkeep. Every plan includes an analytics report.",
        },
      ]}
      faqs={[
        {
          question: "Do you work across the bay from Mobile?",
          answer: "Tell us the towns you really cover and we'll set your Google profile and pages to match. We won't claim areas you don't serve.",
        },
        {
          question: "Are you an Alabama company?",
          answer: "We're based in Biloxi, Mississippi, and serve Mobile in person and remotely.",
        },
        {
          question: "Will I be locked into a contract?",
          answer: "No. Month to month.",
        },
      ]}
      imageSrc="/images/gulf-coast-beach-walkers.webp"
      imageAlt="Gulf Coast beach between Biloxi and Mobile"
      metaTitle="Web Design & SEO in Mobile, AL | Gulf Coast Digital Designs"
      metaDescription="Website design and local SEO for Mobile, Alabama small businesses. Veteran-owned Gulf Coast team, plans from $150/mo, no contract."
      canonical="https://www.gulfcdd.com/service-areas/mobile"
      relatedLinks={[
        { label: "Local SEO", href: "/services/seo/" },
        { label: "Website design", href: "/services/design/" },
        { label: "Pricing", href: "/pricing/" },
        { label: "Pascagoula", href: "/service-areas/pascagoula/" },
        { label: "Biloxi", href: "/service-areas/biloxi/" },
      ]}
    />
  );
}
