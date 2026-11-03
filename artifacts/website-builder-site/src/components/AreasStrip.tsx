import { MapPin } from "lucide-react";
import { serviceCities } from "@/data/service-regions";

/**
 * Slim service-area strip displayed on the homepage.
 * Passes internal PageRank to city pages and signals areaServed to crawlers.
 */
export function AreasStrip() {
  return (
    <section className="bg-primary/95 border-b border-white/10 py-4">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="flex items-center gap-1.5 text-white/50 text-xs font-bold uppercase tracking-[0.16em] shrink-0">
            <MapPin className="w-3.5 h-3.5 text-accent" />
            Mississippi Gulf Coast based
          </span>
          <span className="text-white/75 text-xs font-medium">Biloxi, Gulfport, and Ocean Springs</span>
          <span className="text-white/50 text-xs">•</span>
          <span className="text-white/75 text-xs font-medium">Remote projects nationwide</span>
        </div>
        <p className="mt-3 text-sm text-white/70 leading-relaxed max-w-4xl">
          We also work remotely with businesses in New Orleans, Mobile, and elsewhere in the United States.{" "}
          <a href="/service-areas/remote/" className="text-white underline decoration-2 underline-offset-4 hover:text-accent">See how remote projects work.</a>
        </p>
        <details className="mt-3 text-xs text-white/70">
          <summary className="cursor-pointer hover:text-white">Browse our Gulf Coast and nearby city pages</summary>
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3">
            {serviceCities.map((city) => (
              <a key={city.slug} href={`/service-areas/${city.slug}/`} className="hover:text-white underline underline-offset-4">
                {city.name}, {city.state}
              </a>
            ))}
          </div>
        </details>
      </div>
    </section>
  );
}
