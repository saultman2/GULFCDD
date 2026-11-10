import { Link } from "wouter";
import { ArrowRight, MapPin } from "lucide-react";
import { useEffect } from "react";
import { fireEvent } from "@/lib/analytics";
import { ResponsiveCoastImage } from "@/components/ResponsiveCoastImage";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { SupportWidget } from "@/components/SupportWidget";
import { useSEO } from "@/hooks/useSEO";
import { serviceCities } from "@/data/service-regions";

const priorityCitySlugs = ["gulfport", "biloxi", "ocean-springs"];
const priorityCities = priorityCitySlugs
  .map((slug) => serviceCities.find((city) => city.slug === slug)!)
  .filter(Boolean);
const featuredRemoteCities = ["new-orleans", "mobile"]
  .map((slug) => serviceCities.find((city) => city.slug === slug)!)
  .filter(Boolean);
const otherCoastCities = serviceCities.filter(
  (city) => !priorityCitySlugs.includes(city.slug) && !["new-orleans", "mobile"].includes(city.slug),
);

function CityCard({ city, featured = false }: {
  city: (typeof serviceCities)[number];
  featured?: boolean;
}) {
  return (
    <Link
      href={`/service-areas/${city.slug}/`}
      className={`group flex flex-col rounded-xl border p-6 transition-colors ${
        featured
          ? "border-white/15 bg-white/[0.06] hover:border-accent/60 hover:bg-white/[0.10]"
          : "border-slate-200 bg-white hover:border-accent/50 hover:shadow-sm"
      }`}
    >
      <span className={`mb-3 flex items-center gap-2 font-semibold ${featured ? "text-white" : "text-primary"}`}>
        <MapPin className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
        {city.name}, {city.state}
      </span>
      <span className={`flex-1 text-sm leading-relaxed ${featured ? "text-white/65" : "text-muted-foreground"}`}>
        {city.description}
      </span>
      <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent">
        Web design &amp; local SEO <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

export default function ServiceAreasPage() {
  useEffect(() => {
    const target = window.location.hash.slice(1);
    if (target) document.getElementById(target)?.scrollIntoView({ block: "start" });
  }, []);

  useSEO({
    title: "Service Areas: Mississippi Gulf Coast, New Orleans & Mobile | GulfCDD",
    description: "Web design and local SEO in Biloxi, Gulfport, Ocean Springs and across the Coast, plus New Orleans and Mobile. Remote work in more states.",
    canonical: "https://www.gulfcdd.com/service-areas",
    breadcrumbs: [{ name: "Service Areas", url: "https://www.gulfcdd.com/service-areas" }],
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main>
        <section className="relative overflow-hidden bg-primary py-20 pt-32">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <ResponsiveCoastImage
              src="/images/biloxi-coast-optimized.webp"
              alt="Biloxi coastline and marshland on the Mississippi Gulf Coast"
              width={1920}
              height={1080}
              fetchPriority="high"
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/70 to-primary/40" />
          </div>
          <div className="container relative z-10 mx-auto max-w-4xl px-4 text-center">
            <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.2em] text-white/65">
              Mississippi Gulf Coast based
            </span>
            <h1 className="mb-5 font-heading text-4xl font-extrabold leading-tight text-white drop-shadow-md md:text-5xl">
              Where We Work
            </h1>
            <p className="mx-auto max-w-3xl text-lg font-medium leading-relaxed text-white/85 drop-shadow">
              GulfCDD is based in Biloxi and works with businesses across the Mississippi Gulf Coast, New Orleans, and Mobile. We also plan and build websites remotely for businesses anywhere in the United States.
            </p>
            <a
              href="#local-service-areas"
              className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 font-bold text-white transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Explore our service areas <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </section>

        <section id="local-service-areas" className="scroll-mt-24 bg-white py-16">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.18em] text-accent">Our home market</span>
              <h2 className="mb-4 font-heading text-3xl font-extrabold leading-tight text-primary md:text-4xl">
                Web design for Mississippi Gulf Coast businesses
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                From our Biloxi base, we work with businesses along the Coast. Choose a city to see the kind of website questions we can help answer for local customers.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {priorityCities.map((city) => <CityCard key={city.slug} city={city} featured />)}
            </div>
          </div>
        </section>

        <section className="bg-[#0E1826] py-16">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.18em] text-accent">Nearby Gulf Coast markets</span>
              <h2 className="mb-4 font-heading text-3xl font-extrabold leading-tight text-white md:text-4xl">
                New Orleans and Mobile web design
              </h2>
              <p className="text-lg leading-relaxed text-white/70">
                These projects are handled remotely from Biloxi. We plan pages around the business, its customers, and the locations it actually serves—without suggesting we have an office in either city.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {featuredRemoteCities.map((city) => <CityCard key={city.slug} city={city} featured />)}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="mb-8 max-w-3xl">
              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.18em] text-accent">More Mississippi Coast communities</span>
              <h2 className="font-heading text-2xl font-extrabold text-primary md:text-3xl">
                Website services in nearby cities
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {otherCoastCities.map((city) => <CityCard key={city.slug} city={city} />)}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto max-w-5xl px-4 md:px-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm md:p-10">
              <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.18em] text-accent">Remote website projects</span>
              <h2 className="mb-4 font-heading text-3xl font-extrabold leading-tight text-primary md:text-4xl">
                Need web design outside the Gulf Coast?
              </h2>
              <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
                We can work with businesses anywhere in the United States by phone, email, and video. You review the plan, content, and design online, then approve the finished site before launch. Our team and business address remain in Biloxi, Mississippi.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/service-areas/remote/"
                  className="inline-flex min-h-11 items-center gap-2 rounded-md bg-accent px-5 py-3 font-bold text-white transition-colors hover:bg-accent/90"
                >
                  See how remote projects work <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/intake/"
                  onClick={() => fireEvent("cta_click", { cta_label: "service_areas_get_quote" })}
                  className="inline-flex min-h-11 items-center gap-2 rounded-md border border-primary/20 px-5 py-3 font-bold text-primary transition-colors hover:bg-slate-50"
                >
                  Get a free quote <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <SupportWidget />
    </div>
  );
}
