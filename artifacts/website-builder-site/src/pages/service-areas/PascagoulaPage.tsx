import { ServiceAreaTemplate } from "@/components/ServiceAreaTemplate";

export default function PascagoulaPage() {
  return (
    <ServiceAreaTemplate
      city="Pascagoula"
      state="MS"
      slug="pascagoula"
      headline="Web Design for Pascagoula, MS Businesses"
      subtitle="Shipyard workforce, Jackson County contractors, and people searching after a shift."
      intro="Pascagoula runs on the shipyard and the contractors around it. A lot of your customers are on a shift. They are not searching at a desk at 10 a.m. They look you up after work, on a phone, and they call if the number is obvious."
      bodyP2="That is why the phone line is answered 24/7: (228) 278-7782. The site should make the same thing easy at midnight as it is at noon."
      sections={[
        {
          heading: "After-hours searches",
          body: "Shift workers look for a contractor, a repair, or a meal when they get off. Your hours, the jobs you take, and a way to request an estimate need to be on the first screen. We write those pages for Jackson County work, not for a generic national template.",
        },
      ]}
      faqs={[
        {
          question: "Do you build sites for Pascagoula contractors?",
          answer: "Yes. Estimate requests, the jobs you take, and the towns you actually cover.",
        },
        {
          question: "Can someone reach you after a night shift?",
          answer: "Call (228) 278-7782 any time. The line is answered 24/7.",
        },
        {
          question: "How much does a website cost in Pascagoula?",
          answer: "Essential is $150 a month. Growth is $500 a month, or $250 for founding clients, and adds local SEO and blog posts. No contract.",
        },
      ]}
      imageSrc="/images/biloxi-pier-sunset.webp"
      imageAlt="Coastal sunset near Jackson County"
      metaTitle="Pascagoula, MS Web Design for Small Businesses | GulfCDD"
      metaDescription="Websites for Pascagoula contractors and businesses serving the shipyard workforce. 24/7 phone line. Plans from $150/mo, no contract."
      canonical="https://www.gulfcdd.com/service-areas/pascagoula"
      relatedLinks={[
        { label: "Local SEO", href: "/services/seo/" },
        { label: "Website design", href: "/services/design/" },
        { label: "Pricing", href: "/pricing/" },
        { label: "Gautier", href: "/service-areas/gautier/" },
        { label: "Mobile, AL", href: "/service-areas/mobile/" },
      ]}
    />
  );
}
