import { useSEO } from "@/hooks/useSEO";
import { AreasStrip } from "@/components/AreasStrip";
import { Header } from "@/sections/Header";
import { Hero } from "@/sections/Hero";
import { ServicePlans } from "@/sections/ServicePlans";
import { HomeMarketing } from "@/sections/HomeMarketing";
import { Reviews } from "@/sections/Reviews";
import { Footer } from "@/sections/Footer";
import { HomePromotion } from "@/components/HomePromotion";
import { FreeWebsiteCTA } from "@/components/FreeWebsiteCTA";

export default function Home() {
  useSEO({
    title: "Biloxi Web Design & Local SEO | Gulf Coast Digital Designs",
    description: "Veteran-owned web design, local SEO and AI search help for Gulf Coast businesses. Plans from $150/mo, no contract. Call (228) 278-7782, any hour.",
    canonical: "https://www.gulfcdd.com/",
  });
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <Hero />
        <HomePromotion />
        <FreeWebsiteCTA location="home" />
        <Reviews />
        <ServicePlans />
        <AreasStrip />
        <HomeMarketing />
      </main>
      <Footer />
    </div>
  );
}
