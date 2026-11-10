import { ExternalLink, Star } from "lucide-react";
import { fireEvent } from "@/lib/analytics";

const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/search/Gulf+Coast+Digital+Designs+Biloxi+MS";
const YELP_REVIEWS_URL =
  "https://www.yelp.com/biz/gulf-coast-digital-designs-biloxi?override_cta=Schedule+a+consultation&ylpcid=ab48ec460a7b415e9198427dba98eecbd11a1507";

export function Reviews() {
  return (
    <section id="reviews" className="border-b border-slate-200 bg-slate-50 py-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
              Customer feedback
            </span>
            <h2 className="mt-1 text-xl font-heading font-extrabold text-primary">
              Read GulfCDD customer reviews
            </h2>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              Visit Google or Yelp to read customer feedback directly.
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-accent/90"
              onClick={() => fireEvent("google_reviews_view", { location: "homepage_reviews" })}
              data-testid="google-reviews-view-button"
            >
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              Google Reviews
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href={YELP_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-primary px-4 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white"
              onClick={() => fireEvent("yelp_reviews_view", { location: "homepage_reviews" })}
              data-testid="yelp-reviews-view-button"
            >
              Yelp Reviews
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
