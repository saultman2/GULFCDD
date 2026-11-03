import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ResponsiveCoastImage } from "@/components/ResponsiveCoastImage";

interface PageHeroProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt?: string;
  location?: string;
  videoSrc?: string;
  compact?: boolean;
  children?: ReactNode;
}

export function PageHero({
  title,
  subtitle,
  imageSrc,
  imageAlt = "",
  location,
  videoSrc,
  compact = false,
  children,
}: PageHeroProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <section className={`relative flex items-end overflow-hidden ${compact ? "py-10 md:py-14" : "min-h-[52vh] pb-16 pt-32"}`}>
      {/* Background image — always shown; serves as poster for video */}
      <div className="absolute inset-0 -z-20">
        <ResponsiveCoastImage
          src={imageSrc}
          alt={imageAlt}
          width={1920}
          height={1080}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover object-center"
        />
        {/* Autoplaying video fades in over the photo once ready */}
        {videoSrc && (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster={imageSrc}
            onCanPlay={() => setVideoLoaded(true)}
            className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000"
            style={{ opacity: videoLoaded ? 1 : 0 }}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}
      </div>

      {/* Overlays — deep left gradient so text always pops */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/70 to-black/35" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-transparent to-black/40" />

      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="max-w-3xl"
        >
          {location && (
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/65">
                {location}
              </span>
            </div>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-heading font-extrabold text-white leading-[1.06] mb-5 drop-shadow-md">
            {title}
          </h1>

          {/* Accent rule beneath heading */}
          <div className="h-[3px] w-14 bg-accent rounded-full mb-5" />

          <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl font-medium drop-shadow">
            {subtitle}
          </p>
          {children}
        </motion.div>
      </div>
    </section>
  );
}
