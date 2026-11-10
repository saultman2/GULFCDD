import { ServiceAreaTemplate } from "@/components/ServiceAreaTemplate";

export default function BayStLouisPage() {
  return (
    <ServiceAreaTemplate
      city="Bay St. Louis"
      state="MS"
      slug="bay-st-louis"
      headline="Web Design for Bay St. Louis, MS Businesses"
      subtitle="Old Town shops, galleries, and restaurants, including weekend visitors from New Orleans."
      intro="Bay St. Louis draws two kinds of customers: people who live here, and weekend visitors who drove over from New Orleans. Old Town shops, galleries, and restaurants need a site that answers both. A visitor wants hours, a menu or a gallery, and whether you're open on Saturday. A local wants to know you are still the same place."
      bodyP2="We plan that from Biloxi and can meet you in town. Call (228) 278-7782."
      sections={[
        {
          heading: "Weekend traffic from New Orleans",
          body: "A lot of Saturday searches are not from Bay St. Louis. They are from people already in the car. The page has to load on a phone, show what you sell, and say if you are open. We keep those details easy to update when the weekend schedule changes.",
        },
      ]}
      faqs={[
        {
          question: "Do you work with Old Town shops and galleries?",
          answer: "Yes. Image-heavy pages that still load fast, with hours that stay current.",
        },
        {
          question: "Can you update the site when hours change for a festival or a weekend?",
          answer: "Yes. Text us the change and we'll post it.",
        },
        {
          question: "Do you also serve New Orleans businesses?",
          answer: "Yes. Bay St. Louis is its own page. New Orleans work is on the New Orleans page, mostly by phone, with a drive over when it helps.",
        },
      ]}
      imageSrc="/images/gulf-coast-beach-walkers.webp"
      imageAlt="People walking a Gulf Coast beach"
      metaTitle="Bay St. Louis, MS Web Design for Local Shops | GulfCDD"
      metaDescription="Websites for Bay St. Louis Old Town shops, galleries, and restaurants, including weekend visitors from New Orleans. No contract."
      canonical="https://www.gulfcdd.com/service-areas/bay-st-louis"
      relatedLinks={[
        { label: "Local SEO", href: "/services/seo/" },
        { label: "Website design", href: "/services/design/" },
        { label: "Pricing", href: "/pricing/" },
        { label: "New Orleans", href: "/service-areas/new-orleans/" },
        { label: "Long Beach", href: "/service-areas/long-beach/" },
      ]}
    />
  );
}
