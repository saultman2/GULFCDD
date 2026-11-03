import { useState, useEffect, useRef } from "react";
import { Menu, X, Phone, Mail, ChevronDown, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { fireEvent } from "@/lib/analytics";
import { EmailLink } from "@/components/EmailLink";
import companyLogo from "public-media:/images/gulfcdd-logo-128.webp";

interface NavChild {
  name: string;
  href: string;
  external?: boolean;
  icon?: React.ElementType;
}

interface NavItem {
  name: string;
  href: string;
  children?: NavChild[];
}

const navItems: NavItem[] = [
  { name: "SERVICES", href: "/services/" },
  { name: "PRICING", href: "/pricing/" },
  { name: "OUR WORK", href: "/what-we-build/" },
  { name: "BLOG", href: "/blog/" },
  { name: "ABOUT US", href: "/about/" },
  { name: "CONTACT", href: "/contact/" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [location] = useLocation();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        document.getElementById("mobile-menu-toggle")?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location]);

  function handleMouseEnter(name: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(name);
  }

  function handleMouseLeave() {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 120);
  }

  const isActive = (href: string) => {
    const base = href.split("#")[0].replace(/\/$/, "");
    const loc = location.replace(/\/$/, "");
    return loc === base || (base !== "" && loc.startsWith(base + "/"));
  };

  return (
    <>
      {/* Sticky wrapper — keeps utility bar + nav bar together */}
      <div className="sticky top-0 z-50">

        {/* Top utility bar */}
        <div className="bg-primary text-primary-foreground py-2 px-4 md:px-6 hidden md:block">
          <div className="container mx-auto flex items-center justify-between text-xs font-medium">
            <span className="font-semibold tracking-wide text-white/80 text-[11px] uppercase">
              Gulf Coast Digital Designs
            </span>
            <div className="flex items-center gap-5">
              <a
                href="tel:2282787782"
                className="flex items-center gap-1.5 hover:text-white/80 transition-colors"
                onClick={() => fireEvent("phone_call", { location: "header_utility" })}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>(228) 278-7782</span>
              </a>
              <EmailLink
                className="flex items-center gap-1.5 hover:text-white/80 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>aultman@gulfcoastdigitaldesign.com</span>
              </EmailLink>
            </div>
          </div>
        </div>

        {/* Main nav bar */}
        <header
          className={`transition-shadow duration-300 ${
            isScrolled || mobileMenuOpen
              ? "bg-white shadow-md border-b border-border py-3"
              : "bg-white py-3 border-b border-border/40"
          }`}
        >
          <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center" aria-label="Gulf Coast Digital Designs home">
              <img
                  src={companyLogo}
                alt="Gulf Coast Digital Designs"
                width="128"
                height="128"
                className="h-16 w-16 object-contain rounded border border-white/10"
              />
            </a>

            {/* Desktop nav */}
            <nav aria-label="Main" className="hidden lg:flex items-center gap-4 xl:gap-6">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.children ? handleMouseEnter(item.name) : undefined}
                  onMouseLeave={item.children ? handleMouseLeave : undefined}
                >
                  <a
                    href={item.href}
                    className={`inline-flex items-center gap-1 text-[13px] font-bold tracking-wide transition-colors ${
                      isActive(item.href)
                        ? "text-accent"
                        : "text-foreground hover:text-accent"
                    }`}
                    data-testid={`nav-link-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {item.name}
                    {item.children && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          openDropdown === item.name ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </a>

                  {/* Dropdown */}
                  {item.children && openDropdown === item.name && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden z-50"
                      onMouseEnter={() => handleMouseEnter(item.name)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-t border-l border-slate-200 rotate-45" />
                      <div className="py-1.5">
                        {item.children.map((child) => {
                          const Icon = child.icon;
                          return (
                            <a
                              key={child.name}
                              href={child.href}
                              target={child.external ? "_blank" : undefined}
                              rel={child.external ? "noopener noreferrer" : undefined}
                              className="flex items-center gap-2.5 px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-accent/5 hover:text-accent transition-colors"
                            >
                              {Icon && <Icon className="w-4 h-4 text-accent shrink-0" />}
                              {child.name}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <a
                href="https://calendar.app.google/hkgTknWFLqBGq89b8"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => fireEvent("book_appointment", { location: "header_desktop" })}
                className="text-[13px] font-bold tracking-wide text-foreground hover:text-accent transition-colors"
              >
                BOOK A CALL
              </a>

              <Button
                asChild
                className="bg-accent hover:bg-accent/90 text-white rounded-md px-5 font-bold text-sm tracking-wide"
                data-testid="nav-cta-button"
              >
                <a
                  href="/intake/?mode=quick"
                  onClick={() => fireEvent("cta_click", { cta_label: "nav_free_quote" })}
                >
                  GET A FREE QUOTE
                </a>
              </Button>
            </nav>

            {/* Mobile toggle */}
            <button
              type="button"
              id="mobile-menu-toggle"
              className="lg:hidden text-foreground h-12 w-12 inline-flex items-center justify-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              data-testid="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </header>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="fixed inset-0 z-40 bg-white flex flex-col pt-24 px-6 pb-10 lg:hidden overflow-y-auto">
          <nav aria-label="Mobile" className="flex flex-col mt-4">
            {navItems.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <>
                    <button
                      onClick={() =>
                        setMobileExpanded(mobileExpanded === item.name ? null : item.name)
                      }
                      className={`w-full flex items-center justify-between text-xl font-heading font-bold border-b border-border py-5 transition-colors ${
                        isActive(item.href) ? "text-accent" : "text-foreground"
                      }`}
                    >
                      {item.name}
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          mobileExpanded === item.name ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {mobileExpanded === item.name && (
                      <div className="flex flex-col pb-2 border-b border-border">
                        {item.children.map((child) => {
                          const Icon = child.icon;
                          return (
                            <a
                              key={child.name}
                              href={child.href}
                              target={child.external ? "_blank" : undefined}
                              rel={child.external ? "noopener noreferrer" : undefined}
                              className="flex items-center gap-2.5 pl-5 py-3 text-sm font-semibold text-muted-foreground hover:text-accent transition-colors"
                            >
                              {Icon && <Icon className="w-4 h-4 text-accent shrink-0" />}
                              {child.name}
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <a
                    href={item.href}
                    className={`block text-xl font-heading font-bold border-b border-border py-5 transition-colors ${
                      isActive(item.href) ? "text-accent" : "text-foreground"
                    }`}
                    data-testid={`mobile-nav-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {item.name}
                  </a>
                )}
              </div>
            ))}
          </nav>

          <div className="mt-8 flex flex-col gap-3">
            <Button
              asChild
              className="w-full bg-accent hover:bg-accent/90 text-white text-lg h-14 rounded-md font-bold"
            >
              <a
                href="/intake/?mode=quick"
                onClick={() => fireEvent("cta_click", { cta_label: "nav_free_quote_mobile" })}
              >
                GET A FREE QUOTE
              </a>
            </Button>
            <a
              href="https://calendar.app.google/hkgTknWFLqBGq89b8"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => { setMobileMenuOpen(false); fireEvent("book_appointment", { location: "header_mobile" }); }}
              className="w-full h-14 rounded-md border-2 border-primary text-primary font-bold text-lg hover:bg-primary hover:text-white transition-colors flex items-center justify-center"
            >
              BOOK A CALL
            </a>
          </div>

          {/* Mobile contact info */}
          <div className="mt-8 pt-6 border-t border-border flex flex-col gap-3">
            <a
              href="tel:2282787782"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
              onClick={() => fireEvent("phone_call", { location: "header_mobile" })}
            >
              <Phone className="w-4 h-4 text-accent" /> (228) 278-7782
            </a>
            <EmailLink className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Mail className="w-4 h-4 text-accent" /> aultman@gulfcoastdigitaldesign.com
            </EmailLink>
          </div>
        </div>
      )}
    </>
  );
}
