export type CapabilityPreviewId =
  | "service-one-page" | "service-multipage" | "service-search-structure" | "service-online-store"
  | "service-landing-page" | "service-redesign" | "service-domain-hosting" | "service-maintenance"
  | "feature-contact-form" | "feature-booking" | "feature-gallery" | "feature-map"
  | "feature-reviews" | "feature-seo" | "feature-local-seo" | "feature-social"
  | "feature-responsive" | "feature-custom-domain" | "feature-ssl" | "feature-click-to-call";

export interface CapabilityPreview {
  id: CapabilityPreviewId;
  label: string;
  kind: "service" | "feature";
  image: string;
  alt: string;
  summary: string;
}

const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");
const img = (id: CapabilityPreviewId) => `${base}images/capability-previews/${id}.webp`;

const entries: Omit<CapabilityPreview, "image">[] = [
  { id: "service-one-page", kind: "service", label: "One page sites", alt: "Sample one page website for a fictional lawn care company, Live Oak Lawn Co., with a photo headline, quote button, four service cards with prices, and hours, service area, and contact details on the same page.", summary: "Everything a customer needs, on one scrolling page: what you do, when you are open, and how to reach you." },
  { id: "service-multipage", kind: "service", label: "Full business sites", alt: "Sample About page for a fictional builder, Tidewater Homebuilders, with a shared menu of Home, About, Services, Gallery, and Contact, plus thumbnails of each page on the site.", summary: "Separate pages for each part of your business, connected by one menu that appears on every page." },
  { id: "service-search-structure", kind: "service", label: "Search-ready structure", alt: "Sample roofing service page for fictional Bayline Roofing with labeled breadcrumb, main heading, subheadings, image description, and internal links, beside its page title, meta description, and heading outline.", summary: "Each page gets a clear title, description, headings, and links so visitors and search engines understand it. Visibility is not guaranteed." },
  { id: "service-online-store", kind: "service", label: "Online stores", alt: "Sample candle shop for fictional Salt and Wick with product photos, prices, add to bag buttons, and an open shopping bag showing quantities, an estimated total, and a checkout button.", summary: "Product listings, a cart, and a checkout your customers can follow without help." },
  { id: "service-landing-page", kind: "service", label: "Landing pages", alt: "Sample spring driveway washing offer page for fictional Brightline Wash with a $149 headline, job photo, three offer details, and a filled-in quote request form.", summary: "A page about one specific offer, with the details people need and one clear way to respond." },
  { id: "service-redesign", kind: "service", label: "Website redesigns", alt: "Before and after comparison of a fictional fence company website: a cluttered old page with a scrolling banner and tables, and a clean redesign with a large photo, service cards, and call buttons.", summary: "We agree what to keep, then rebuild the layout so it is clearer and works well on phones." },
  { id: "service-domain-hosting", kind: "service", label: "Domain and hosting", alt: "Sample launch checklist for a fictional pottery studio showing domain, hosting, DNS, SSL certificate, and launch steps completed beside the live secure site and its DNS records.", summary: "Your domain, hosting, and SSL certificate set up and connected, then the site goes live." },
  { id: "service-maintenance", kind: "service", label: "Ongoing maintenance", alt: "Sample text conversation asking to update a cafe menu and Sunday hours, beside the fictional Pier Light Coffee site with the new fall menu and hours highlighted as updated.", summary: "Send a change by text or email and the page is updated. Coverage depends on your support plan." },
  { id: "feature-contact-form", kind: "feature", label: "Contact forms with email delivery", alt: "Sample contact page for fictional Gulfside Plumbing with a filled-in form for name, phone, email, topic, and message, and the resulting message shown arriving in the business inbox.", summary: "Visitors fill in a short form and the message arrives in your email inbox." },
  { id: "feature-booking", kind: "feature", label: "Appointment and booking request forms", alt: "Sample appointment request page for a fictional salon, Studio Marisol, with a monthly calendar, a selected date, service choices with prices, time options, and a request summary.", summary: "Customers pick a preferred date and time and send a request for you to confirm." },
  { id: "feature-gallery", kind: "feature", label: "Photo and video galleries", alt: "Sample project gallery for fictional Bayou Craft Builders with filter buttons, a kitchen video tour tile, and labeled photos of a bathroom, porch, deck, and new home.", summary: "Show your finished work in a tidy grid of photos and videos." },
  { id: "feature-map", kind: "feature", label: "Map and location section", alt: "Illustrated town map with a pin for a fictional bike shop beside a panel listing its address, phone, weekly hours, a shop photo, and directions and call buttons.", summary: "A map with your address, hours, and a button that opens directions." },
  { id: "feature-reviews", kind: "feature", label: "Customer reviews section", alt: "Sample reviews page for a fictional pet groomer, clearly labeled as sample feedback, with a sample rating summary and four sample review cards marked as illustrative.", summary: "A layout for genuine reviews you have permission to share. We never write reviews for you." },
  { id: "feature-seo", kind: "feature", label: "Search Engine Optimization (SEO)", alt: "Example search results page with a highlighted result for a fictional roofing company, labeled to show its web address, page title, and meta description.", summary: "Titles and descriptions written so each page reads clearly in search results. Placement is not guaranteed." },
  { id: "feature-local-seo", kind: "feature", label: "Local SEO and business information", alt: "Sample auto repair contact page with address, phone, and hours marked as matching an example business listing that shows the same name, address, phone, hours, and website.", summary: "Consistent name, address, phone, and hours so local customers and search engines get the right details." },
  { id: "feature-social", kind: "feature", label: "Social Media Integration", alt: "Sample bakery website with Facebook, Instagram, YouTube, and TikTok buttons, a row of sample social posts, and the same social links repeated in the footer.", summary: "Links from your site to the social profiles you already use." },
  { id: "feature-responsive", kind: "feature", label: "Responsive phone and tablet layouts", alt: "The same fictional dental office website shown on a desktop monitor, a tablet, and a phone, with the layout rearranged for each screen.", summary: "One website that rearranges itself to read well on desktops, tablets, and phones." },
  { id: "feature-custom-domain", kind: "feature", label: "Custom domain support", alt: "A generic builder web address crossed out above a custom address, https://www.saltandwick.example, with the matching website and notes about branding, matching email, and ownership.", summary: "Use your own web address instead of a generic one." },
  { id: "feature-ssl", kind: "feature", label: "SSL security certificate included", alt: "Browser showing a padlock and an HTTPS address with a Connection is secure panel over a sample gift card form, illustrating encryption between visitor and website.", summary: "HTTPS encrypts information sent between visitors and your site and shows the padlock." },
  { id: "feature-click-to-call", kind: "feature", label: "Click to call and click to text", alt: "Two phones for a fictional HVAC company: one shows the mobile site with Call now and Send a text buttons, the other shows a call prompt and a sample text message.", summary: "On a phone, one tap starts a call or a text message to your business." },
];

export const capabilityPreviews: CapabilityPreview[] = entries.map((e) => ({ ...e, image: img(e.id) }));

export const capabilityPreviewById = Object.fromEntries(
  capabilityPreviews.map((p) => [p.id, p]),
) as Record<CapabilityPreviewId, CapabilityPreview>;
