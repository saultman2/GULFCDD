import { ServiceAreaTemplate } from "@/components/ServiceAreaTemplate";

export default function GautierPage() {
  return (
    <ServiceAreaTemplate
      city="Gautier"
      state="MS"
      slug="gautier"
      headline="Web Design for Gautier, MS Businesses"
      subtitle="Home services and growing neighborhoods between Ocean Springs and Pascagoula."
      intro="Gautier is the stretch of homes and job sites between Ocean Springs and Pascagoula. A lot of the businesses we talk to here are home services: roofing, plumbing, lawn, electrical, and the crews that cover more than one town. The website question is simple. Does this address fall inside the area you actually work?"
      bodyP2="We put that coverage on the page in plain language, without inventing an office you don't have. Call (228) 278-7782."
      sections={[
        {
          heading: "Between Ocean Springs and Pascagoula",
          body: "Customers here search the town they live in, not a county slogan. If you take jobs in Gautier and also drive to Ocean Springs or Pascagoula, say so. If you don't, say that too. We write the service area to match the truck, not the whole Coast.",
        },
      ]}
      faqs={[
        {
          question: "Do you build sites for home-service crews in Gautier?",
          answer: "Yes. Estimate forms, the jobs you take, and a clear map of where you will drive.",
        },
        {
          question: "Can the site say I also work in Ocean Springs or Pascagoula?",
          answer: "Yes, when that is true. We link the towns you really cover and leave off the ones you don't.",
        },
        {
          question: "Is there a contract?",
          answer: "No. Plans are month to month, starting at $150 for hosting and upkeep.",
        },
      ]}
      imageSrc="/images/ocean-springs-beach-sunset-optimized.webp"
      imageAlt="Beach sunset between Ocean Springs and Gautier"
      metaTitle="Gautier, MS Web Design for Service Businesses | GulfCDD"
      metaDescription="Websites for Gautier home services and growing neighborhoods between Ocean Springs and Pascagoula. No contract. (228) 278-7782."
      canonical="https://www.gulfcdd.com/service-areas/gautier"
      relatedLinks={[
        { label: "Local SEO", href: "/services/seo/" },
        { label: "Website design", href: "/services/design/" },
        { label: "Pricing", href: "/pricing/" },
        { label: "Ocean Springs", href: "/service-areas/ocean-springs/" },
        { label: "Pascagoula", href: "/service-areas/pascagoula/" },
      ]}
    />
  );
}
