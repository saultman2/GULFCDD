import { useEffect, useState } from "react";
import { Check, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fireEvent } from "@/lib/analytics";
import desktopImage from "public-media:/images/hero-bg-desktop-1340.webp";
import largeImage from "public-media:/images/hero-bg-optimized.webp";
import mobileAvif from "public-media:/images/hero-bg-mobile.avif";
import mobileWebp from "public-media:/images/hero-bg-mobile.webp";
import backgroundVideo from "public-media:/videos/beach-hero.mp4";

// Vite fingerprints these files so long-lived browser caches remain safe
// when a future release changes an image, font, or background video.

export function Hero() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [loadVideo, setLoadVideo] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    if (motionQuery.matches || mobileQuery.matches || connection?.saveData ||
      /^(slow-2g|2g|3g)$/.test(connection?.effectiveType ?? "") ||
      (window as Window & { __GULFCDD_PRERENDER__?: boolean }).__GULFCDD_PRERENDER__) return;

    const startVideo = () => setLoadVideo(true);
    let idle: number | undefined;
    // Decorative motion must not compete with the first paint or app startup.
    const timeout = window.setTimeout(() => {
      if (window.requestIdleCallback) idle = window.requestIdleCallback(startVideo, { timeout: 1000 });
      else startVideo();
    }, 5000);

    return () => {
      if (idle !== undefined) window.cancelIdleCallback?.(idle);
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <section className="relative min-h-[78vh] md:min-h-[86vh] flex flex-col justify-center text-center items-center pt-20 md:pt-28 pb-12 md:pb-16 overflow-hidden">
      <div className="absolute inset-0 -z-20">
          <picture className="absolute inset-0 block w-full h-full">
            <source
              media="(max-width: 767px)"
              type="image/avif"
              srcSet={mobileAvif}
            />
            <source
              media="(max-width: 767px)"
              type="image/webp"
              srcSet={mobileWebp}
            />
            <img
              src={desktopImage}
              srcSet={`${desktopImage} 1340w, ${largeImage} 1600w`}
              alt="Mississippi Gulf Coast beach at sunset"
              fetchPriority="high"
              width={1340}
              height={890}
              loading="eager"
              decoding="async"
              sizes="100vw"
              className="w-full h-full object-cover object-center"
            />
          </picture>

        {loadVideo && (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster={desktopImage}
            aria-hidden="true"
            tabIndex={-1}
            onCanPlay={() => setVideoLoaded(true)}
            className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000"
            style={{ opacity: videoLoaded ? 1 : 0 }}
          >
            <source src={backgroundVideo} type="video/mp4" />
          </video>
        )}
      </div>

      <div className="absolute inset-0 -z-10 bg-black/45" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/65 via-transparent to-black/45" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center">
          <div className="inline-flex items-center gap-2.5 mb-6 md:mb-8">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/90">
              Gulf Coast Digital Designs • Veteran-owned
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-[4.75rem] font-heading font-extrabold text-white leading-[1.05] uppercase tracking-tight max-w-5xl mx-auto drop-shadow-lg">
               Web Design and Local SEO for Biloxi and the Gulf Coast
          </h1>

          <p className="text-base md:text-2xl text-white/90 font-semibold max-w-3xl leading-relaxed mt-5 drop-shadow">
             We're Gulf Coast Digital Designs, two brothers from the Coast who build websites for the businesses we grew up around. If your phone isn't ringing from your website, or customers can't find you on Google, that's the problem we fix.
          </p>
           <p className="text-sm md:text-base text-white/75 font-medium mt-3">
              Based in Biloxi, Mississippi. Remote projects nationwide. You'll talk to the people doing the work. No contract.
           </p>

          <ul className="flex flex-wrap justify-center gap-4 mt-5 text-sm text-white/90" data-testid="list-hero-paths">
            {[
              ["Web design & redesign", "/services/design/"],
              ["Local SEO", "/services/seo/"],
              ["Website maintenance", "/services/maintenance/"],
              ["Business automation", "/services/development/"],
            ].map(([title, href]) => (
              <li key={title}>
                <a href={href} className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4 hover:text-white">{title}</a>
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-4 mt-8 md:mt-10 w-full sm:w-auto justify-center">
            <Button
              size="lg"
              asChild
              className="bg-accent hover:bg-accent/90 text-white rounded-md h-14 px-10 text-lg font-bold w-full sm:w-auto shadow-xl"
            >
              <a
                href="/intake/?mode=quick"
                data-testid="hero-primary-cta"
                onClick={() => fireEvent("cta_click", { cta_label: "hero_get_free_quote" })}
              >
                GET A FREE QUOTE
              </a>
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  variant="outline"
                  data-testid="hero-contact-cta"
                  className="border-white/40 bg-white/10 hover:bg-white/20 text-white rounded-md h-14 px-10 text-lg font-bold w-full sm:w-auto backdrop-blur-sm"
                >
                  CONTACT US
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>How would you like to reach us?</DialogTitle>
                  <DialogDescription>
                    Call or text GulfCDD at (228) 278-7782 to discuss your website or ask about our services.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 pt-2">
                  <Button
                    asChild
                    className="h-12 bg-accent hover:bg-accent/90 text-white font-bold"
                  >
                    <a
                      href="tel:2282787782"
                      data-testid="hero-dialog-call-cta"
                      onClick={() => fireEvent("phone_call", { location: "hero_contact_dialog" })}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      CALL US
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-12 font-bold"
                  >
                    <a
                      href="sms:2282787782"
                      data-testid="hero-dialog-text-cta"
                      onClick={() => fireEvent("text_message", { location: "hero_contact_dialog" })}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      TEXT US
                    </a>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-5 text-sm font-bold">
            <a href="/what-we-build/" data-testid="hero-view-work" className="text-white underline underline-offset-4 decoration-accent hover:text-white/80">See what we build</a>
            <a href="/pricing/" data-testid="hero-compare-plans" className="text-white underline underline-offset-4 decoration-accent hover:text-white/80">Compare plans</a>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-8 md:mt-10 pt-6 border-t border-white/20 text-white/90 text-sm md:text-base font-semibold w-full max-w-5xl">
            <span className="flex items-center gap-2">
              <Check className="w-5 h-5 text-accent" /> Veteran-owned and operated
            </span>
            <span className="flex items-center gap-2">
               <Check className="w-5 h-5 text-accent" /> Custom websites and applications
            </span>
            <span className="flex items-center gap-2">
               <Check className="w-5 h-5 text-accent" /> Local SEO and Google Business Profile support
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-5 h-5 text-accent" /> No contracts. Cancel anytime.
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-5 h-5 text-accent" /> Mobile-friendly design
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
