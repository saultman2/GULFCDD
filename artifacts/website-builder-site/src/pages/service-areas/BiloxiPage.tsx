import { ServiceAreaTemplate } from "@/components/ServiceAreaTemplate";

export default function BiloxiPage() {
  return (
    <ServiceAreaTemplate
      city="Biloxi"
      state="MS"
      slug="biloxi"
      headline="Biloxi Web Design and Local SEO, From People Who Live Here"
      subtitle="Restaurants, contractors, and tourism businesses. Plans from $150 a month, no contract."
      intro="Biloxi is home, so we know the two crowds your website has to serve: people who live here, and people driving in for the casinos, the beach, and a weekend on the water. A visitor at a hotel on Beach Boulevard wants your hours, menu and directions in five seconds. A family in Woolmarket hiring a roofer wants to know you cover their street and how to get a quote. Good sites answer both."
      bodyP2="We're local, so a sit-down is easy. Or we handle it by phone. Call (228) 278-7782 any hour."
      sections={[
        {
          heading: "Who we build for in Biloxi",
          body: "Restaurants and seafood spots, charter and tourism businesses, contractors and home-service crews, shops in downtown and along the Point, and businesses serving Keesler families.",
        },
        {
          heading: "Showing up when Biloxi searches",
          body: "Your Google Business Profile does a lot of the heavy lifting for \"near me\" searches. We set it up right, keep your listings matching, and write your service pages around what people here type and ask.",
        },
      ]}
      faqs={[
        {
          question: "Do you work with Biloxi tourism and hospitality businesses?",
          answer: "Yes. Those sites need fast mobile pages, clear hours, and booking or reservation links that work for out-of-town visitors.",
        },
        {
          question: "How much does a website cost in Biloxi?",
          answer: "Same as anywhere we work: from $150 a month, no contract, with a free build for founding clients through January 31, 2027.",
        },
        {
          question: "Can you help my business show up on Google Maps in Biloxi?",
          answer: "We can improve your Google Business Profile, reviews process and listings, which are the main things you control. No one can guarantee a map ranking.",
        },
      ]}
      imageSrc="/images/biloxi-coast-optimized.webp"
      imageAlt="Biloxi coastline, Mississippi"
      metaTitle="Biloxi Web Design & Local SEO | Veteran-Owned | GulfCDD"
      metaDescription="Biloxi-based web design and local SEO for restaurants, contractors and tourism businesses. Plans from $150/mo, no contract. (228) 278-7782."
      canonical="https://www.gulfcdd.com/service-areas/biloxi"
      relatedLinks={[
        { label: "Local SEO", href: "/services/seo/" },
        { label: "Website design", href: "/services/design/" },
        { label: "Pricing", href: "/pricing/" },
        { label: "Gulfport", href: "/service-areas/gulfport/" },
        { label: "D'Iberville", href: "/service-areas/diberville/" },
      ]}
    />
  );
}
