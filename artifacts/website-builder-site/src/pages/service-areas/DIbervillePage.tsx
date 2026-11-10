import { ServiceAreaTemplate } from "@/components/ServiceAreaTemplate";

export default function DIbervillePage() {
  return (
    <ServiceAreaTemplate
      city="D'Iberville"
      state="MS"
      slug="diberville"
      headline="Web Design for D'Iberville, MS Businesses"
      subtitle="Retail, restaurants, and service businesses along the Promenade and I-110."
      intro="D'Iberville sits on the retail corridor where I-110 meets people who already decided to go out. A shop or restaurant near the Promenade is often the second stop for someone staying at a Biloxi hotel. They have a phone in their hand and about a minute to decide if you're open and worth the drive."
      bodyP2="If you need a quote before a visit, the site should say what you do and how to ask. If they are ready to walk in, hours and directions should be the first thing they see. Call (228) 278-7782."
      sections={[
        {
          heading: "Visitors from Biloxi hotels",
          body: "A lot of D'Iberville customers are not from D'Iberville. They crossed the bridge from a casino hotel or the beach and searched for dinner, a store, or a service nearby. Your page has to work for that search, not only for neighbors who already know you.",
        },
      ]}
      faqs={[
        {
          question: "Do you build sites for restaurants and shops near the Promenade?",
          answer: "Yes. Those pages need current hours, a short menu or product list, and directions that make sense to someone who just got off I-110.",
        },
        {
          question: "How much does a website cost in D'Iberville?",
          answer: "Essential is $150 a month for hosting and upkeep. Growth is $500 a month, or $250 for founding clients. No contract. Founding clients get the build free through January 31, 2027.",
        },
        {
          question: "Can you meet in D'Iberville?",
          answer: "Yes. We're based in Biloxi, a few minutes away, or we can do it by phone.",
        },
      ]}
      imageSrc="/images/biloxi-coast-optimized.webp"
      imageAlt="Coastal marsh near D'Iberville and Biloxi"
      metaTitle="D'Iberville, MS Web Design & Local SEO | GulfCDD"
      metaDescription="Web design for D'Iberville shops and restaurants near the Promenade and I-110, including visitors from Biloxi. Plans from $150/mo, no contract."
      canonical="https://www.gulfcdd.com/service-areas/diberville"
      relatedLinks={[
        { label: "Local SEO", href: "/services/seo/" },
        { label: "Website design", href: "/services/design/" },
        { label: "Pricing", href: "/pricing/" },
        { label: "Biloxi", href: "/service-areas/biloxi/" },
        { label: "Ocean Springs", href: "/service-areas/ocean-springs/" },
      ]}
    />
  );
}
