import { ServiceAreaTemplate } from "@/components/ServiceAreaTemplate";

export default function LongBeachPage() {
  return (
    <ServiceAreaTemplate
      city="Long Beach"
      state="MS"
      slug="long-beach"
      headline="Web Design for Long Beach, MS Businesses"
      subtitle="Neighborhood services, harbor businesses, and shops that still live on word of mouth."
      intro="Long Beach still runs on people telling their neighbors who to call. That referral now comes with a phone search. The next customer wants to see the work you do, when you're available, and how to reach you before they dial."
      bodyP2="We build sites for neighborhood services and for businesses around the harbor and the beach. Reviews back up the word of mouth. Call (228) 278-7782."
      sections={[
        {
          heading: "Word of mouth, then the phone",
          body: "A recommendation gets you the search. The site and the Google profile have to agree with what the neighbor said: what you do, where you work, and that you actually pick up. We keep those facts consistent.",
        },
      ]}
      faqs={[
        {
          question: "Do you work with harbor and beach businesses in Long Beach?",
          answer: "Yes. Hours, directions, and a simple way to call or book matter more than a long brochure.",
        },
        {
          question: "I get most of my work from referrals. Do I still need a site?",
          answer: "The referral is the start. People still check you before they call. A short site and a current Google profile are what they look at.",
        },
        {
          question: "Do you also cover Gulfport and Pass Christian?",
          answer: "Yes. See the Gulfport page for the bigger-city search picture. Long Beach stays its own page because the customers are different.",
        },
      ]}
      imageSrc="/images/biloxi-pier-sunset.webp"
      imageAlt="Pier at sunset on the Mississippi Gulf Coast"
      metaTitle="Long Beach, MS Web Design & Local SEO | GulfCDD"
      metaDescription="Websites for Long Beach neighborhood services and harbor businesses. Veteran-owned, no contract. Call (228) 278-7782."
      canonical="https://www.gulfcdd.com/service-areas/long-beach"
      relatedLinks={[
        { label: "Local SEO", href: "/services/seo/" },
        { label: "Website design", href: "/services/design/" },
        { label: "Pricing", href: "/pricing/" },
        { label: "Gulfport", href: "/service-areas/gulfport/" },
        { label: "Pass Christian area via Gulfport", href: "/service-areas/gulfport/" },
      ]}
    />
  );
}
