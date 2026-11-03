import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, TrendingUp, Palette, Scissors,
  Star, Globe, Mail, Calendar, Image, Map, Clock, ShieldCheck,
  BarChart2, Search, Phone, FileText, ShoppingCart, Instagram,
  Music, Camera, Users, Award, ExternalLink, ArrowRight,
  Briefcase, Target, BookOpen, CheckCircle2, Info,
} from "lucide-react";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { SupportWidget } from "@/components/SupportWidget";
import { PageHero } from "@/components/PageHero";
import { fireEvent } from "@/lib/analytics";
import { useSEO } from "@/hooks/useSEO";

/* ─── Mini visual previews ──────────────────────────────────────── */

const MiniCalendar = () => (
  <div className="rounded border border-border bg-background p-2 w-full">
    <div className="grid grid-cols-7 gap-px mb-1.5">
      {["S","M","T","W","T","F","S"].map((d, i) => (
        <div key={i} className="text-center text-[7px] text-muted-foreground font-medium">{d}</div>
      ))}
    </div>
    <div className="grid grid-cols-7 gap-px">
      {[...Array(14)].map((_, i) => (
        <div key={i} className={`h-4 rounded-sm flex items-center justify-center text-[7px] ${i === 9 ? "bg-primary text-white font-bold" : "bg-muted/50 text-muted-foreground"}`}>
          {i + 1}
        </div>
      ))}
    </div>
    <div className="mt-2 h-5 bg-primary/90 rounded flex items-center justify-center">
      <span className="text-white text-[7px] font-semibold">Book Appointment</span>
    </div>
  </div>
);

const MiniPhone = () => (
  <div className="flex flex-col gap-1 w-full">
    <div className="h-7 bg-teal-600 rounded flex items-center justify-center gap-1.5">
      <Phone className="w-3 h-3 text-white" />
      <span className="text-white text-[9px] font-semibold">Tap to call</span>
    </div>
    <div className="text-[8px] text-muted-foreground text-center">Shows your number — one tap dials</div>
  </div>
);

const MiniMap = () => (
  <div className="rounded border border-border overflow-hidden w-full h-16 relative bg-[#e8e8e8]">
    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "repeating-linear-gradient(0deg, #ccc 0px, #ccc 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, #ccc 0px, #ccc 1px, transparent 1px, transparent 30px)" }} />
    <div className="absolute inset-0 flex items-center justify-center flex-col gap-1">
      <div className="w-5 h-5 rounded-full border-2 border-primary bg-white flex items-center justify-center shadow">
        <div className="w-2 h-2 rounded-full bg-primary" />
      </div>
      <div className="bg-white rounded px-2 py-0.5 shadow text-[7px] font-semibold text-foreground">Gulf Coast, MS</div>
    </div>
  </div>
);

const MiniShield = () => (
  <div className="flex flex-col gap-1.5 w-full">
    <div className="flex items-center gap-2 bg-muted/40 rounded p-2">
      <ShieldCheck className="w-4 h-4 text-teal-500 shrink-0" />
      <div>
        <div className="text-[8px] font-semibold text-foreground">General contact form</div>
        <div className="text-[7px] text-muted-foreground">Do not send medical details</div>
      </div>
    </div>
  </div>
);

const MiniStars = () => (
  <div className="flex flex-col gap-1.5 w-full">
    <div className="flex items-center gap-1 justify-center">
      {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
    </div>
    <div className="text-[8px] text-center text-muted-foreground italic">Space for an approved customer review</div>
    <div className="text-[7px] text-center text-muted-foreground">Review section concept</div>
  </div>
);

const MiniSearch = () => (
  <div className="space-y-1.5 w-full">
    <div className="rounded border border-border p-1.5 bg-background">
      <div className="text-[8px] text-blue-500 font-medium">Your business · Your service area</div>
      <div className="text-[7px] text-green-600">Your website address</div>
      <div className="text-[7px] text-muted-foreground">A clear description of your services</div>
    </div>
    <div className="text-[7px] text-center text-muted-foreground">Search result concept, not guaranteed display</div>
  </div>
);

const MiniForm = () => (
  <div className="space-y-1.5 w-full">
    <div className="h-5 rounded border border-border bg-background px-2 flex items-center">
      <span className="text-[8px] text-muted-foreground">Your name</span>
    </div>
    <div className="h-5 rounded border border-border bg-background px-2 flex items-center">
      <span className="text-[8px] text-muted-foreground">Your email</span>
    </div>
    <div className="h-4 bg-primary rounded flex items-center justify-center">
      <span className="text-white text-[7px] font-semibold">Submit inquiry</span>
    </div>
  </div>
);

const MiniGallery = () => (
  <div className="grid grid-cols-2 gap-1 w-full">
    {["Before", "After", "Before", "After"].map((label, i) => (
      <div key={i} className={`h-9 rounded flex items-end p-1 ${i % 2 === 0 ? "bg-muted/60" : "bg-primary/20"}`}>
        <span className="text-[6px] text-muted-foreground uppercase tracking-wide">{label}</span>
      </div>
    ))}
  </div>
);

const MiniCTA = () => (
  <div className="space-y-1.5 w-full">
    <div className="bg-amber-500 rounded h-6 flex items-center justify-center">
      <span className="text-white text-[8px] font-bold">Request a Consultation</span>
    </div>
    <div className="text-[7px] text-center text-muted-foreground">Placed where visitors naturally look</div>
  </div>
);

const MiniBooking = () => (
  <div className="space-y-1.5 w-full">
    <div className="rounded border border-border p-2 bg-background">
      <div className="text-[7px] font-semibold text-foreground mb-1">Pick a time</div>
      <div className="flex gap-1 flex-wrap">
        {["9:00", "10:00", "2:00"].map((t, i) => (
          <div key={t} className={`rounded-full px-2 py-0.5 text-[7px] ${i === 1 ? "bg-amber-500 text-white" : "border border-border text-muted-foreground"}`}>{t} AM</div>
        ))}
      </div>
    </div>
  </div>
);

const MiniCredentials = () => (
  <div className="flex gap-2 w-full">
    {["Experience", "Training", "Credentials"].map((badge) => (
      <div key={badge} className="flex-1 rounded border border-amber-400/40 px-1 py-1.5 text-center bg-amber-500/5">
        <div className="text-[9px] font-bold text-amber-600">{badge}</div>
      </div>
    ))}
  </div>
);

const MiniTestimonials = () => (
  <div className="space-y-1 w-full">
    {["Approved client feedback", "Attributed customer review"].map((q, i) => (
      <div key={i} className="rounded bg-muted/40 px-2 py-1">
        <div className="text-[7px] italic text-foreground">{q}</div>
      </div>
    ))}
  </div>
);

const MiniAnalytics = () => (
  <div className="w-full">
    <div className="flex items-end gap-1 h-10 px-1">
      {[40, 55, 38, 70, 62, 80, 75].map((h, i) => (
        <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: i === 5 ? "#d97706" : "#d97706aa" }} />
      ))}
    </div>
    <div className="text-[7px] text-center text-muted-foreground mt-1">Analytics display concept, not client results</div>
  </div>
);

const MiniPortfolio = () => (
  <div className="grid grid-cols-3 gap-1 w-full">
    {["Case A", "Case B", "Case C"].map((label, i) => (
      <div key={i} className="h-10 rounded bg-muted/50 flex items-end p-1">
        <span className="text-[6px] text-muted-foreground">{label}</span>
      </div>
    ))}
  </div>
);

const MiniEmail = () => (
  <div className="space-y-1.5 w-full">
    <div className="rounded border border-border p-2 bg-background">
      <div className="text-[7px] text-muted-foreground mb-1">Get updates on new content</div>
      <div className="flex gap-1">
        <div className="flex-1 h-4 rounded border border-border bg-muted/30" />
        <div className="h-4 bg-amber-500 rounded px-2 flex items-center">
          <span className="text-white text-[7px]">Join</span>
        </div>
      </div>
    </div>
  </div>
);

const MiniBlog = () => (
  <div className="space-y-1.5 w-full">
    {["How Our Services Work", "Common Customer Questions"].map((title, i) => (
      <div key={i} className="flex items-start gap-1.5 rounded bg-muted/30 p-1.5">
        <div className="w-8 h-6 rounded bg-muted/70 shrink-0" />
        <div className="text-[7px] text-foreground leading-tight">{title}</div>
      </div>
    ))}
  </div>
);

const MiniImageGallery = () => (
  <div className="grid grid-cols-3 gap-0.5 w-full">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="aspect-square rounded-sm" style={{ background: `hsl(${i * 20 + 30}, 40%, ${25 + i * 4}%)` }} />
    ))}
  </div>
);

const MiniCommission = () => (
  <div className="space-y-1.5 w-full">
    <div className="rounded border border-border p-2 bg-background">
      <div className="text-[7px] font-medium text-foreground mb-1">Commission request</div>
      <div className="h-4 rounded border border-border bg-muted/30 mb-1" />
      <div className="h-4 bg-primary/80 rounded flex items-center justify-center">
        <span className="text-white text-[7px]">Send request</span>
      </div>
    </div>
  </div>
);

const MiniSocialFeed = () => (
  <div className="flex gap-1 w-full overflow-hidden">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="flex-1 aspect-square rounded" style={{ background: `hsl(${i * 25 + 200}, 30%, 30%)` }} />
    ))}
  </div>
);

const MiniMusicPlayer = () => (
  <div className="rounded border border-border p-2 bg-background w-full">
    <div className="flex items-center gap-2 mb-1.5">
      <div className="w-7 h-7 rounded bg-primary/20 shrink-0" />
      <div>
        <div className="text-[8px] font-semibold text-foreground">Track Title</div>
        <div className="text-[7px] text-muted-foreground">Artist Name</div>
      </div>
    </div>
    <div className="h-1 rounded-full bg-muted overflow-hidden">
      <div className="h-full w-2/5 bg-primary rounded-full" />
    </div>
  </div>
);

const MiniEvents = () => (
  <div className="space-y-1.5 w-full">
    {[{ date: "Date", event: "Gallery opening details" }, { date: "Date", event: "Performance details" }].map(({ date, event }) => (
      <div key={event} className="flex items-center gap-2 rounded bg-muted/30 p-1.5">
        <div className="rounded bg-primary/15 px-1.5 py-0.5 text-[7px] font-bold text-primary shrink-0">{date}</div>
        <div className="text-[8px] text-foreground">{event}</div>
      </div>
    ))}
  </div>
);

const MiniPress = () => (
  <div className="space-y-1 w-full">
    <div className="text-[7px] text-muted-foreground uppercase tracking-widest mb-1">Verified press links</div>
    <div className="flex gap-2">
      {["Publication", "Article", "Interview"].map((pub) => (
        <div key={pub} className="rounded border border-border px-2 py-1">
          <div className="text-[7px] font-semibold text-muted-foreground">{pub}</div>
        </div>
      ))}
    </div>
  </div>
);

const MiniTattooGallery = () => (
  <div className="w-full">
    <div className="grid grid-cols-3 gap-0.5">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="aspect-square rounded-sm" style={{ background: `rgba(220,38,38,${0.1 + i * 0.08})`, border: "1px solid rgba(220,38,38,0.15)" }} />
      ))}
    </div>
  </div>
);

const MiniTattooBooking = () => (
  <div className="space-y-1.5 w-full">
    <div className="rounded border border-white/10 p-2 bg-white/5">
      <div className="text-[7px] font-semibold text-white/70 mb-1">Book your session</div>
      <div className="h-4 rounded border border-white/10 bg-black/30 mb-1" />
      <div className="h-4 rounded flex items-center justify-center" style={{ background: "#dc2626" }}>
        <span className="text-white text-[7px] font-bold">BOOK NOW</span>
      </div>
    </div>
  </div>
);

const MiniArtistRoster = () => (
  <div className="flex gap-2 w-full">
    {["Artist A", "Artist B", "Artist C"].map((name) => (
      <div key={name} className="flex-1 text-center">
        <div className="w-8 h-8 rounded-full mx-auto mb-1 border border-red-500/30" style={{ background: "rgba(220,38,38,0.15)" }} />
        <div className="text-[7px] text-white/60">{name}</div>
      </div>
    ))}
  </div>
);

const MiniFlashBoard = () => (
  <div className="grid grid-cols-3 gap-1 w-full">
    {["Flash #1", "Flash #2", "Flash #3"].map((f, i) => (
      <div key={f} className="rounded border border-white/10 p-1 text-center" style={{ background: i === 1 ? "rgba(220,38,38,0.2)" : "rgba(255,255,255,0.03)" }}>
        <div className="text-[7px] text-white/50">{f}</div>
        <div className="text-[7px] font-bold" style={{ color: i === 1 ? "#dc2626" : "rgba(255,255,255,0.3)" }}>
          {"AVAILABLE"}
        </div>
      </div>
    ))}
  </div>
);

const MiniCustomRequest = () => (
  <div className="space-y-1 w-full">
    <div className="rounded border border-white/10 p-2 bg-white/4">
      <div className="text-[7px] text-white/50 mb-1">Describe your idea</div>
      <div className="h-8 rounded border border-white/8 bg-black/30" />
    </div>
  </div>
);

/* ─── Feature card with hover tooltip ──────────────────────────── */

interface SiteFeature {
  icon: React.ElementType;
  text: string;
  description: string;
  preview: React.ReactNode;
}

function FeatureCard({ icon: Icon, text, description, preview }: SiteFeature) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`flex items-center gap-2.5 p-2.5 rounded-lg border transition-all cursor-default select-none ${hovered ? "border-primary/40 bg-primary/5" : "border-border/60 bg-card/40 hover:bg-card/70"}`}>
        <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-3.5 h-3.5 text-primary" />
        </div>
        <span className="text-sm text-foreground leading-tight">{text}</span>
        <Info className={`w-3 h-3 ml-auto shrink-0 transition-colors ${hovered ? "text-primary/60" : "text-muted-foreground/30"}`} />
      </div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            className="absolute z-50 bottom-full left-0 mb-2 w-60 rounded-xl border border-border bg-card p-3.5 shadow-2xl shadow-black/40"
          >
            <div className="mb-3">{preview}</div>
            <div className="font-semibold text-foreground text-xs mb-1">{text}</div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Industry tab definitions ─────────────────────────────────── */

const industries = [
  { id: "healthcare",   label: "Healthcare",         icon: Heart },
  { id: "entrepreneurs", label: "Entrepreneurs",     icon: TrendingUp },
  { id: "artists",      label: "Independent Artists", icon: Palette },
  { id: "tattoo",       label: "Tattoo Studios",     icon: Scissors },
];

interface IndustryConfig {
  headline: string;
  sub: string;
  niches: string[];
  pages: string[];
  features: SiteFeature[];
}

const industryContent: Record<string, IndustryConfig> = {
  healthcare: {
    headline: "Help patients find services, practical information, and a way to contact your office.",
    sub: "A healthcare website can explain your services, introduce the team, and outline what to expect at a visit. These are design ideas, not claims of healthcare compliance. Patient information, consent, and any clinical systems need a separate requirements review.",
    niches: ["Prosthetics and orthotics", "General dentistry", "Orthodontist", "Dentures and implants", "Oral surgery", "Pediatric dentistry", "Physical therapy", "Urgent care clinics", "Chiropractic offices", "Optometry practices"],
    pages: ["Home with trust signals", "Services by condition or procedure", "Meet the team", "Patient resources and FAQ", "Insurance and payment info", "Contact and location"],
    features: [
      { icon: Calendar, text: "Appointment request forms", description: "Collect a preferred date and contact details for your office to review. A request is not a confirmed appointment; scheduling integration is scoped separately.", preview: <MiniCalendar /> },
      { icon: Phone, text: "Click to call from mobile", description: "A single tap on a phone screen dials your office directly. Essential for anyone searching for care on the go.", preview: <MiniPhone /> },
      { icon: Map, text: "Map and directions embed", description: "Show your real office address and a map link so patients can plan their visit. Include parking or access information when needed.", preview: <MiniMap /> },
      { icon: ShieldCheck, text: "General contact guidance", description: "A general inquiry form should clearly tell patients not to send medical details. Handling sensitive information requires a separate privacy and compliance review.", preview: <MiniShield /> },
      { icon: Star, text: "Patient review section", description: "Display genuine, approved feedback with attribution and appropriate permission. Any review feed depends on the source's access and usage requirements.", preview: <MiniStars /> },
      { icon: Search, text: "Local search optimization", description: "Use accurate service descriptions, page titles, and local context. Search engines decide whether and where to show your pages; placement is not guaranteed.", preview: <MiniSearch /> },
      { icon: FileText, text: "New patient intake prompts", description: "A dedicated page tells new patients exactly what to bring, what to expect, and how your intake works — reducing first-visit anxiety.", preview: <MiniForm /> },
      { icon: Image, text: "Before and after galleries", description: "Organize images supplied and approved by your practice. Patient consent and applicable advertising or privacy requirements must be reviewed before publication.", preview: <MiniGallery /> },
    ],
  },
  entrepreneurs: {
    headline: "Your business is real. Your website should look like it.",
    sub: "A website for a coach, consultant, freelancer, or founder should explain the offer, show relevant work, and make it easy to start a conversation. Choose the pages and tools that fit how you take inquiries, rather than adding features you will not use.",
    niches: ["Business coaches", "Marketing consultants", "Freelancers and independents", "Real estate agents", "Financial advisors", "Life coaches", "Online course creators", "Service-based startups", "Event planners", "Virtual assistants"],
    pages: ["Hero with strong value proposition", "Services and what you offer", "About and credibility section", "Testimonials and social proof", "Booking or discovery call form", "Blog or thought leadership"],
    features: [
      { icon: Target, text: "Lead capture and CTA sections", description: "Give visitors a clear next step, such as a quote form or consultation request. The design supports inquiries without guaranteeing them.", preview: <MiniCTA /> },
      { icon: Calendar, text: "Discovery call booking form", description: "Collect call requests or connect an agreed scheduling tool. Live availability and confirmation depend on the calendar integration and its settings.", preview: <MiniBooking /> },
      { icon: Award, text: "Credentials and trust badges", description: "Display only the experience, qualifications, and achievements you can verify. The preview shows a layout, not credentials supplied by GulfCDD.", preview: <MiniCredentials /> },
      { icon: Star, text: "Client testimonials", description: "Feature genuine client quotes with attribution and permission. We do not create reviews or claim results on a client's behalf.", preview: <MiniTestimonials /> },
      { icon: BarChart2, text: "Analytics and goal tracking", description: "Basic visitor tracking built in so you know which pages perform and where people drop off. Data without the complexity.", preview: <MiniAnalytics /> },
      { icon: Briefcase, text: "Portfolio or case studies", description: "A showcase section that walks visitors through your past work and the results you delivered. Proof beats promises every time.", preview: <MiniPortfolio /> },
      { icon: Mail, text: "Email list opt-in integration", description: "Connect a consent-based subscriber form to a compatible email platform. Provider access, privacy wording, and integration details are confirmed in the scope.", preview: <MiniEmail /> },
      { icon: BookOpen, text: "Blog for thought leadership", description: "A built-in blog that lets you publish articles on your area of expertise. Builds authority and gives Google fresh content to index.", preview: <MiniBlog /> },
    ],
  },
  artists: {
    headline: "Your art is the product. Your website is the gallery.",
    sub: "An artist website can put the portfolio first, with supporting pages for commissions, shows, a shop, and contact details. We organize the work around how visitors browse it and what they need to know before making an inquiry.",
    niches: ["Musicians and bands", "Visual artists and painters", "Illustrators and digital artists", "Photographers", "Sculptors and ceramicists", "Printmakers", "Performers and entertainers", "Graphic designers", "Writers and poets", "Art educators"],
    pages: ["Portfolio or gallery home", "About the artist", "Shop or commission request", "Upcoming shows and events", "Press and media kit", "Contact and booking"],
    features: [
      { icon: Image, text: "Full-bleed gallery layouts", description: "Your work fills the screen. No sidebars, no clutter — just your images displayed at the size they deserve, with a lightbox click-through.", preview: <MiniImageGallery /> },
      { icon: ShoppingCart, text: "Print or commission shop", description: "Sell prints, originals, or accept commission requests directly from your site. A simple form or product listing, depending on how you work.", preview: <MiniCommission /> },
      { icon: Instagram, text: "Social media feed integration", description: "Link to or embed supported social content. Live feeds depend on the platform's permissions and available integration options; we confirm these before quoting.", preview: <MiniSocialFeed /> },
      { icon: Music, text: "Embedded music players", description: "Spotify, SoundCloud, or Bandcamp players embedded directly in your page. Visitors hear your work without leaving your site.", preview: <MiniMusicPlayer /> },
      { icon: Camera, text: "Photography portfolio mode", description: "A full-screen, masonry, or grid-style photo gallery built specifically for photographers who want their images to be the primary experience.", preview: <MiniImageGallery /> },
      { icon: Calendar, text: "Event and show listings", description: "A section that lists your upcoming appearances, shows, and exhibitions — with dates, locations, and ticketing links.", preview: <MiniEvents /> },
      { icon: Mail, text: "Commission and inquiry forms", description: "A structured form that collects the right details about a commission request so you can respond with all the information you need already in hand.", preview: <MiniCommission /> },
      { icon: Globe, text: "Press and media kit page", description: "A dedicated page with your bio, high-res photos, and press mentions — ready to send to journalists, curators, and event organizers.", preview: <MiniPress /> },
    ],
  },
  tattoo: {
    headline: "Show your studio's work and explain how booking works.",
    sub: "A tattoo studio website can lead with portfolios and artist styles, then answer questions about consultations, deposits, preparation, and aftercare. Publish your actual studio policies and make the request process clear.",
    niches: ["Custom tattoo studios", "Flash walk-in shops", "Fine line specialists", "Traditional and neo-traditional", "Black and grey realism", "Color and illustration style", "Cover-up specialists", "Piercing studios", "Multi-artist shops", "Solo artists booking private"],
    pages: ["Portfolio gallery front and center", "Artist profiles and specialties", "Booking and deposit request", "Care instructions and FAQ", "Flash available page", "Studio location and hours"],
    features: [
      { icon: Image, text: "Bold full-screen portfolio gallery", description: "Your work displayed full-width and full-screen. The first thing visitors see is the quality of your tattooing — not your address or a long paragraph.", preview: <MiniTattooGallery /> },
      { icon: Calendar, text: "Booking and deposit request form", description: "A structured intake form that collects everything you need to evaluate a request — idea, placement, size, reference images — before you respond.", preview: <MiniTattooBooking /> },
      { icon: Users, text: "Multi-artist profile pages", description: "Each artist in your shop gets their own profile with their portfolio, style description, and booking link so clients can find the right match.", preview: <MiniArtistRoster /> },
      { icon: Instagram, text: "Instagram portfolio integration", description: "Link to or embed supported Instagram content. Automatic syncing depends on platform permissions and the integration available for your account.", preview: <MiniSocialFeed /> },
      { icon: Map, text: "Studio location and parking", description: "An embedded map with your address, hours, and parking notes — so new clients show up at the right place without needing to call ahead.", preview: <MiniMap /> },
      { icon: Clock, text: "Hours and walk-in availability", description: "Display your studio hours and walk-in policy. Any daily availability note needs a defined update process so it stays accurate.", preview: <MiniFlashBoard /> },
      { icon: ShieldCheck, text: "Flash availability board", description: "Show available flash designs and explain how clients can ask about them. Your team supplies artwork, availability, and booking policies.", preview: <MiniFlashBoard /> },
      { icon: Mail, text: "Custom request intake form", description: "A detailed form for custom tattoo requests that gathers reference images, size, placement, and style so every quote conversation starts with context.", preview: <MiniCustomRequest /> },
    ],
  },
};

/* ─── Unique preview cards per industry ────────────────────────── */

function HealthcarePreview() {
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl border border-black/10 font-sans" style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}>
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#e8e8e8]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 mx-3 bg-white rounded text-[11px] text-gray-400 px-3 py-1 font-mono">Healthcare website concept</div>
      </div>
      <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-teal-600 flex items-center justify-center">
            <span className="text-white text-[8px] font-bold">GC</span>
          </div>
          <span className="text-[11px] font-semibold text-gray-800">Your Practice</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          {["Home", "Services", "Team", "Contact"].map(l => <span key={l} className="text-[10px] text-gray-400">{l}</span>)}
          <div className="bg-teal-600 rounded-full px-3 py-1 text-[9px] font-semibold text-white">Book Appointment</div>
        </div>
      </div>
      <div className="grid grid-cols-5 bg-white min-h-[160px]">
        <div className="col-span-3 px-5 py-6 flex flex-col justify-center">
          <div className="inline-flex items-center gap-1.5 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            <span className="text-[9px] font-semibold uppercase tracking-widest text-teal-600">Gulf Coast, MS</span>
          </div>
          <div className="font-bold text-gray-900 text-base leading-snug mb-2" style={{ fontFamily: "'Georgia', serif" }}>
            Your Care.<br />Your Community.
          </div>
          <p className="text-[10px] text-gray-500 leading-relaxed mb-4 max-w-[160px]">Introduce your services and explain how to contact your office.</p>
          <div className="flex gap-2">
            <div className="bg-teal-600 rounded px-3 py-1.5 text-[9px] font-semibold text-white">Schedule a Visit</div>
            <div className="border border-gray-200 rounded px-3 py-1.5 text-[9px] text-gray-500">Our Services</div>
          </div>
        </div>
        <div className="col-span-2 relative overflow-hidden">
          <img src="/images/preview-healthcare.jpg" alt="Modern dental clinic" width={1200} height={675} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
        </div>
      </div>
      <div className="grid grid-cols-3 divide-x divide-gray-100 bg-gray-50 border-t border-gray-100">
        {[{ stat: "Services", label: "What we offer" }, { stat: "Team", label: "Meet the practice" }, { stat: "Visit", label: "Plan your appointment" }].map(({ stat, label }) => (
          <div key={label} className="py-3 px-4 text-center">
            <div className="text-[11px] font-bold text-teal-700">{stat}</div>
            <div className="text-[9px] text-gray-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EntrepreneurPreview() {
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl border border-white/5" style={{ fontFamily: "'Inter', sans-serif", background: "#0f172a" }}>
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1e293b]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-white/10" />
          <div className="w-3 h-3 rounded-full bg-white/10" />
          <div className="w-3 h-3 rounded-full bg-white/10" />
        </div>
        <div className="flex-1 mx-3 bg-white/6 rounded text-[11px] text-white/30 px-3 py-1 font-mono">Consulting website concept</div>
      </div>
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/6" style={{ background: "#0f172a" }}>
        <span className="text-[12px] font-bold tracking-tight text-white">Your Consulting Business</span>
        <div className="hidden sm:flex items-center gap-4">
          {["Work", "About", "Services"].map(l => <span key={l} className="text-[10px] text-white/40">{l}</span>)}
          <div className="rounded px-3 py-1 text-[9px] font-semibold text-[#0f172a]" style={{ background: "#d97706" }}>Book a Call</div>
        </div>
      </div>
      <div className="relative overflow-hidden" style={{ minHeight: 180 }}>
        <img src="/images/preview-entrepreneur.jpg" alt="Business professional" width={1200} height={675} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover object-top" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(15,23,42,0.94) 45%, rgba(15,23,42,0.4) 100%)" }} />
        <div className="relative px-5 py-7">
          <div className="text-[9px] font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: "#d97706" }}>Business Strategy</div>
          <div className="font-bold text-white leading-snug mb-2" style={{ fontSize: 17 }}>A clear plan for<br />your next step.</div>
          <p className="text-[10px] leading-relaxed mb-4 max-w-[180px]" style={{ color: "rgba(255,255,255,0.55)" }}>Describe who you help, what you offer, and how a consultation works.</p>
          <div className="flex gap-2">
            <div className="rounded px-3 py-1.5 text-[9px] font-semibold text-[#0f172a]" style={{ background: "#d97706" }}>Work With Me</div>
            <div className="rounded px-3 py-1.5 text-[9px]" style={{ border: "1px solid rgba(217,119,6,0.4)", color: "#d97706" }}>See Case Studies</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 divide-x border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        {[{ stat: "Services", label: "Explore the offer" }, { stat: "Work", label: "View real projects" }, { stat: "Contact", label: "Start a conversation" }].map(({ stat, label }) => (
          <div key={label} className="py-3 text-center" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="text-[12px] font-bold" style={{ color: "#d97706" }}>{stat}</div>
            <div className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArtistPreview() {
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl border border-white/5" style={{ background: "#120f0a", fontFamily: "'Georgia', serif" }}>
      <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: "#1e1812" }}>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: "rgba(197,150,79,0.3)" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "rgba(197,150,79,0.3)" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "rgba(197,150,79,0.3)" }} />
        </div>
        <div className="flex-1 mx-3 rounded text-[11px] px-3 py-1 font-mono" style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.25)" }}>Artist website concept</div>
      </div>
      <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: "rgba(197,150,79,0.15)", background: "#120f0a" }}>
        <span className="text-[13px] italic font-normal tracking-wide" style={{ color: "#c5964f" }}>Your Artist Name</span>
        <div className="hidden sm:flex items-center gap-5">
          {["Gallery", "About", "Commission", "Contact"].map(l => <span key={l} className="text-[9px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Inter', sans-serif" }}>{l}</span>)}
        </div>
      </div>
      <div className="relative overflow-hidden" style={{ minHeight: 200 }}>
        <img src="/images/preview-artist.jpg" alt="Artist in studio" width={1200} height={675} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(18,15,10,0.97) 0%, rgba(18,15,10,0.35) 55%, transparent 100%)" }} />
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
          <div className="text-[8px] uppercase tracking-[0.25em] mb-2" style={{ color: "#c5964f", fontFamily: "'Inter', sans-serif" }}>Original works · Gulf Coast roots</div>
          <div className="font-bold leading-tight text-white" style={{ fontSize: 18 }}>Art that holds<br />its ground.</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-px p-px" style={{ background: "rgba(197,150,79,0.12)" }}>
        {["Available Works", "Commissions Open", "Latest Series"].map((label) => (
          <div key={label} className="aspect-square flex items-end p-2.5 relative overflow-hidden" style={{ background: "#1a160f" }}>
            <div className="absolute inset-0 opacity-10" style={{ background: "linear-gradient(135deg, #c5964f22 0%, transparent 100%)" }} />
            <span className="text-[8px] relative z-10" style={{ color: "rgba(197,150,79,0.7)", fontFamily: "'Inter', sans-serif", letterSpacing: "0.1em" }}>{label}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between px-5 py-3.5" style={{ background: "#1a160f" }}>
        <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif" }}>Ask about commission availability</span>
        <div className="rounded-sm px-4 py-1.5 text-[9px] uppercase tracking-widest" style={{ border: "1px solid rgba(197,150,79,0.5)", color: "#c5964f", fontFamily: "'Inter', sans-serif" }}>Inquire</div>
      </div>
    </div>
  );
}

function TattooPreview() {
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl border border-white/5" style={{ background: "#000", fontFamily: "'Inter', sans-serif" }}>
      <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: "#111" }}>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-white/10" />
          <div className="w-3 h-3 rounded-full bg-white/10" />
          <div className="w-3 h-3 rounded-full bg-white/10" />
        </div>
        <div className="flex-1 mx-3 bg-white/6 rounded text-[11px] text-white/25 px-3 py-1 font-mono">Tattoo studio website concept</div>
      </div>
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/8" style={{ background: "#000" }}>
        <span className="text-[11px] font-black uppercase tracking-[0.15em] text-white">Your Tattoo Studio</span>
        <div className="hidden sm:flex items-center gap-4">
          {["Portfolio", "Artists", "Book"].map(l => <span key={l} className="text-[9px] uppercase tracking-widest text-white/30">{l}</span>)}
          <div className="rounded px-3 py-1 text-[9px] font-bold uppercase tracking-wider" style={{ background: "#dc2626", color: "#fff" }}>Book Now</div>
        </div>
      </div>
      <div className="relative overflow-hidden" style={{ minHeight: 190 }}>
        <img src="/images/preview-tattoo.jpg" alt="Tattoo artist at work" width={1200} height={675} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.45) contrast(1.1)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 100%)" }} />
        <div className="relative px-5 py-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5" style={{ background: "#dc2626" }} />
            <span className="text-[8px] font-bold uppercase tracking-[0.25em]" style={{ color: "#dc2626" }}>Your Art · Your Studio</span>
          </div>
          <div className="font-black uppercase leading-none mb-2 text-white" style={{ fontSize: 20, letterSpacing: "-0.01em" }}>
            CUSTOM INK.<br /><span style={{ color: "#dc2626" }}>NO LIMITS.</span>
          </div>
          <p className="text-[10px] leading-relaxed mb-5 max-w-[200px]" style={{ color: "rgba(255,255,255,0.45)" }}>Explain your booking process and invite clients to discuss a design.</p>
          <div className="flex gap-2">
            <div className="rounded px-4 py-1.5 text-[9px] font-bold uppercase tracking-wider" style={{ background: "#dc2626", color: "#fff" }}>Book a Session</div>
            <div className="rounded px-4 py-1.5 text-[9px] font-semibold uppercase tracking-wider" style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)" }}>See Portfolio</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 border-t border-white/8">
        {[{ name: "Artist A", spec: "Portfolio" }, { name: "Artist B", spec: "Portfolio" }, { name: "Artist C", spec: "Portfolio" }].map(({ name, spec }) => (
          <div key={name} className="px-3 py-3 border-r border-white/8 last:border-r-0">
            <div className="w-6 h-6 rounded-full mb-1.5" style={{ background: "rgba(220,38,38,0.2)", border: "1px solid rgba(220,38,38,0.3)" }} />
            <div className="text-[10px] font-bold text-white">{name}</div>
            <div className="text-[8px] uppercase tracking-wider mt-0.5" style={{ color: "#dc2626" }}>{spec}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const previewMap: Record<string, React.ReactNode> = {
  healthcare:    <HealthcarePreview />,
  entrepreneurs: <EntrepreneurPreview />,
  artists:       <ArtistPreview />,
  tattoo:        <TattooPreview />,
};

/* ─── Live work showcase ────────────────────────────────────────── */

const liveWork = [
  {
    name: "KNP Power",
    url: "https://knppower.com",
    description: "KNP Power is a family-owned, fully insured Gulf Coast electrician with seven years of service. Its website uses a black and red design, service-area content, click-to-call actions, and a custom price estimator.",
    tag: "Service Business",
    screenshotSrc: "/images/knppower-screenshot.webp",
    highlights: ["Multi-page site", "Price estimator tool", "Click to call", "Local search targeting"],
  },
];

/* ─── Page ──────────────────────────────────────────────────────── */

export default function DesignIdeasPage() {
  const [activeTab, setActiveTab] = useState("healthcare");
  const config = industryContent[activeTab];

  // Not linked from nav or sitemap — keep out of search indexes
  useSEO({
    title: "Website Design Ideas & Industry Concepts | GulfCDD",
    description: "Explore GulfCDD website concepts for healthcare practices, consultants, artists, and tattoo studios, plus a live Gulf Coast project. Features are scoped individually.",
    canonical: "https://www.gulfcdd.com/design-ideas",
    noindex: true,
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <PageHero
          title="Design Ideas"
          subtitle="Not sure what your site could look like? Browse these example layouts for a few ideas. They're concepts, not completed client websites."
          imageSrc="/images/biloxi-coast-optimized.webp"
          imageAlt="Gulf Coast"
          location="Gulf Coast, Mississippi"
        />

        {/* Industry tabs */}
        <section className="py-20 border-b border-border">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-semibold text-foreground mb-4 leading-tight">Which pages and features fit your business?</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">Pick an industry and look at the layout, page ideas, and possible features. You don't have to use the whole example. We'll discuss what suits your business and confirm the actual content and integrations in your quote.</p>
            </div>

            {/* Tab pills */}
            <div className="flex flex-wrap gap-2 mb-12">
              {industries.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${
                    activeTab === id
                      ? "bg-primary border-primary text-white"
                      : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid lg:grid-cols-2 gap-12 items-start"
              >
                {/* Left: content */}
                <div>
                  <p className="text-xl font-heading font-semibold text-foreground leading-snug mb-4">{config.headline}</p>
                  <p className="text-muted-foreground leading-relaxed mb-8">{config.sub}</p>

                  <div className="mb-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4">Who this is for</p>
                    <div className="grid grid-cols-2 gap-2">
                      {config.niches.map((n) => (
                        <div key={n} className="flex items-center gap-2 text-sm text-foreground">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                          {n}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4">Page ideas</p>
                    <div className="space-y-2">
                      {config.pages.map((p, i) => (
                        <div key={p} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded bg-card border border-border flex items-center justify-center shrink-0">
                            <span className="text-[9px] font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
                          </div>
                          <span className="text-sm text-foreground">{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Feature cards with hover previews */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Feature ideas</p>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60 border border-border/50 rounded-full px-2 py-0.5">
                        <Info className="w-3 h-3" />
                        hover to preview
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {config.features.map((feature) => (
                        <FeatureCard key={feature.text} {...feature} />
                      ))}
                    </div>
                  </div>

                  <div className="mt-10">
                    <a
                      href="/contact/"
                      className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-md px-7 h-11 transition-colors text-sm"
                      onClick={() => fireEvent("cta_click", { cta_label: "design_ideas_start_site" })}
                    >
                      Start this site <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Right: industry-specific preview */}
                <div className="lg:sticky lg:top-24">
                  {previewMap[activeTab]}
                  <p className="text-xs text-muted-foreground text-center mt-3">Illustrative layout only, not a client site. Your content and features are agreed separately.</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Live work showcase */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-3">Real work</p>
              <h2 className="text-3xl md:text-4xl font-heading font-semibold text-foreground mb-4 leading-tight">Sites we have built and launched.</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">Below is a live Gulf Coast project built by GulfCDD. It is separate from the illustrative industry concepts above.</p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {liveWork.map((site) => (
                <motion.div
                  key={site.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35 }}
                  className="group rounded-xl border border-border overflow-hidden bg-card hover:border-primary/30 transition-colors"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-[#111]">
                    <img src={site.screenshotSrc} alt={`${site.name} website screenshot`} width={1200} height={675} loading="lazy" decoding="async" className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider bg-primary/90 text-white rounded px-2 py-0.5">{site.tag}</span>
                    </div>
                    <a href={site.url} target="_blank" rel="noopener noreferrer" className="absolute top-3 right-3 w-8 h-8 rounded-md bg-black/60 backdrop-blur flex items-center justify-center text-white/70 hover:text-white transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-heading font-semibold text-foreground text-lg">{site.name}</h3>
                      <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                        {site.url.replace("https://", "")} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">{site.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {site.highlights.map((h) => (
                        <span key={h} className="text-xs bg-background border border-border rounded-full px-3 py-1 text-muted-foreground">{h}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}

              <div className="rounded-xl border border-dashed border-border bg-card/50 flex flex-col items-center justify-center text-center p-10 min-h-[320px]">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <p className="font-semibold text-foreground mb-2">More coming soon</p>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">We add new launches here as projects go live. Want your site on this page?</p>
                <a href="/contact/" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors" onClick={() => fireEvent("cta_click", { cta_label: "design_ideas_live_work_start" })}>
                  Start your project <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-3">Ready to see what yours looks like?</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto font-medium">Tell us what you like in these examples and what you'd do differently. We'll discuss a site for your business and give you a free quote.</p>
            <a href="/contact/" className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold rounded-md px-8 h-12 transition-colors shadow-md" onClick={() => fireEvent("cta_click", { cta_label: "design_ideas_cta_bottom" })}>
              Start the conversation <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </main>
      <Footer />
      <SupportWidget />
    </div>
  );
}
