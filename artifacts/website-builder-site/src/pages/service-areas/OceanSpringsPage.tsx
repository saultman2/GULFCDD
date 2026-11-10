import { ServiceAreaTemplate } from "@/components/ServiceAreaTemplate";

export default function OceanSpringsPage() {
  return (
    <ServiceAreaTemplate
      city="Ocean Springs"
      state="MS"
      slug="ocean-springs"
      headline="A Website Designer for Ocean Springs Businesses"
      subtitle="Shops, galleries, restaurants, and service pros. Local, veteran-owned, no contract."
      intro="Ocean Springs runs on small, independent businesses: the shops and galleries on Government and Washington, the restaurants people drive over the bridge for, and the trades working in the neighborhoods off Highway 90. Festival weekends bring a lot of first-time visitors searching on their phones."
      bodyP2="We're across the bay in Biloxi. Call (228) 278-7782."
      sections={[
        {
          heading: "What Ocean Springs sites need",
          body: "Shop hours that are always right, event and festival updates you can post fast, a gallery or menu that looks good on a phone, and a Google profile people trust.",
        },
      ]}
      faqs={[
        {
          question: "Can you make updates around festivals and events?",
          answer: "Yes. Text us the change and we'll post it.",
        },
        {
          question: "Do you work with artists and galleries?",
          answer: "Yes. Image-heavy sites that still load fast.",
        },
        {
          question: "Are you local?",
          answer: "We're across the bay in Biloxi.",
        },
      ]}
      imageSrc="/images/ocean-springs-downtown.webp"
      imageAlt="Downtown Ocean Springs, Mississippi"
      metaTitle="Ocean Springs Website Designer & Local SEO | GulfCDD"
      metaDescription="Websites for Ocean Springs shops, galleries, restaurants and service pros. Local, veteran-owned, no contract. (228) 278-7782."
      canonical="https://www.gulfcdd.com/service-areas/ocean-springs"
      relatedLinks={[
        { label: "Local SEO", href: "/services/seo/" },
        { label: "Website design", href: "/services/design/" },
        { label: "Pricing", href: "/pricing/" },
        { label: "Biloxi", href: "/service-areas/biloxi/" },
        { label: "Gautier", href: "/service-areas/gautier/" },
      ]}
    />
  );
}
