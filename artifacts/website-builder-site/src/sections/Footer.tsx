import { Mail, Phone, Facebook, MapPin } from "lucide-react";
import { fireEvent } from "@/lib/analytics";
import { EmailLink } from "@/components/EmailLink";
import companyLogo from "public-media:/images/gulfcdd-logo-128.webp";

export function Footer() {
  return (
    <footer className="bg-[#050505] text-white pt-16 pb-8 border-t border-white/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center gap-3">
              <img
                src={companyLogo}
                alt="Gulf Coast Digital Designs"
                width="112"
                height="112"
                className="h-14 w-14 object-contain rounded"
              />
              <span className="text-white font-bold text-sm leading-tight">
                Gulf Coast<br />Digital Designs
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              We're a veteran-owned web design team on the Mississippi Gulf Coast.
              Need a website or help with local SEO? We can work with you remotely anywhere in the United States.
            </p>
            <a
              href="https://www.facebook.com/profile.php?id=61590833161789"
              target="_blank"
              rel="nofollow noopener noreferrer"
              aria-label="Follow us on Facebook"
              className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium"
            >
              <Facebook className="w-5 h-5" />
              Follow us on Facebook
            </a>
          </div>

          {/* Company */}
          <div>
            <h2 className="font-heading text-base font-semibold mb-4 text-white">Company</h2>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li><a href="/about/" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/what-we-build/" className="hover:text-white transition-colors">Our Work</a></li>
              <li><a href="/blog/" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="/faq/" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="/contact/" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact / NAP */}
          <div>
            <h2 className="font-heading text-base font-semibold mb-4 text-white">Get In Touch</h2>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 text-accent mt-0.5" />
                <span className="leading-relaxed">
                  Gulf Coast Digital Designs<br />
                  Biloxi, MS
                </span>
              </li>
              <li>
                <a
                  href="tel:2282787782"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                  onClick={() => fireEvent("phone_call", { location: "footer" })}
                >
                  <Phone className="w-4 h-4 shrink-0 text-accent" />
                  (228) 278-7782
                </a>
              </li>
              <li>
                <EmailLink
                  className="flex min-w-0 items-center gap-2 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 shrink-0 text-accent" />
                  <span className="min-w-0 [overflow-wrap:anywhere]">aultman@gulfcoastdigitaldesign.com</span>
                </EmailLink>
              </li>
              <li className="pt-1 text-white/70 text-xs leading-relaxed">
                Based on the Mississippi Gulf Coast.<br />
                Web design and SEO, handled remotely.
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/70">
          <p>
            &copy; {new Date().getFullYear()} Gulf Coast Digital Designs. All rights reserved.
            Veteran-owned &amp; operated.
          </p>
          <div className="flex items-center gap-5">
            <a href="/privacy/" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms/" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
