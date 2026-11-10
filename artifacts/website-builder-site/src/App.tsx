import { lazy, Suspense, useEffect } from "react";
import { Redirect, Route, Router as WouterRouter, Switch, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { firePageView } from "@/lib/analytics";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";

const AuthenticatedApp = lazy(() => import("@/AuthenticatedApp"));
const ServicesPage = lazy(() => import("@/pages/ServicesPage"));
const ServiceDesignPage = lazy(() => import("@/pages/services/DesignPage"));
const ServiceDevelopmentPage = lazy(() => import("@/pages/services/DevelopmentPage"));
const ServiceHostingPage = lazy(() => import("@/pages/services/HostingPage"));
const ServiceMaintenancePage = lazy(() => import("@/pages/services/MaintenancePage"));
const WhatWeBuildPage = lazy(() => import("@/pages/WhatWeBuildPage"));
const MembershipPage = lazy(() => import("@/pages/MembershipPage"));
const PricingPage = lazy(() => import("@/pages/PricingPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const ContactThanksPage = lazy(() => import("@/pages/ContactThanksPage"));
const PrivacyPage = lazy(() => import("@/pages/PrivacyPage"));
const TermsPage = lazy(() => import("@/pages/TermsPage"));
const DesignIdeasPage = lazy(() => import("@/pages/DesignIdeasPage"));
const FAQPage = lazy(() => import("@/pages/FAQPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const IntakePage = lazy(() => import("@/pages/IntakePage"));
const ServiceAreaOceanSprings = lazy(() => import("@/pages/service-areas/OceanSpringsPage"));
const ServiceAreaBiloxi = lazy(() => import("@/pages/service-areas/BiloxiPage"));
const ServiceAreaGulfport = lazy(() => import("@/pages/service-areas/GulfportPage"));
const ServiceAreaPascagoula = lazy(() => import("@/pages/service-areas/PascagoulaPage"));
const ServiceAreaGautier = lazy(() => import("@/pages/service-areas/GautierPage"));
const ServiceAreaBayStLouis = lazy(() => import("@/pages/service-areas/BayStLouisPage"));
const ServiceAreaLongBeach = lazy(() => import("@/pages/service-areas/LongBeachPage"));
const ServiceAreaDIberville = lazy(() => import("@/pages/service-areas/DIbervillePage"));
const ServiceAreaNewOrleans = lazy(() => import("@/pages/service-areas/NewOrleansPage"));
const ServiceAreaMobile = lazy(() => import("@/pages/service-areas/MobilePage"));
const RemoteServiceAreaPage = lazy(() => import("@/pages/service-areas/RemoteServiceAreaPage"));
const ServiceSEOPage = lazy(() => import("@/pages/services/SEOPage"));
const ServiceAreasPage = lazy(() => import("@/pages/ServiceAreasPage"));
const SoroBlogPage = lazy(() => import("@/pages/blog/SoroBlogPage"));
const FreeWebsiteLanding = lazy(() => import("@/pages/free-website/LandingPage"));
const FreeWebsiteThankYou = lazy(() => import("@/pages/free-website/ThankYouPage"));
const FreeWebsiteOnboarding = lazy(() => import("@/pages/free-website/OnboardingPage"));

const LEGACY_STATE_SLUGS = [
  "mississippi", "texas", "louisiana", "alabama", "florida", "georgia",
  "tennessee", "oklahoma", "kansas", "missouri", "kentucky", "virginia",
  "north-carolina", "south-carolina",
];

function LazyWrap({ children }: { children: React.ReactNode }) {
  const initialPage = (window as Window & { __GULFCDD_INITIAL_PAGE__?: { path: string; html: string } }).__GULFCDD_INITIAL_PAGE__;
  return (
    <Suspense
      fallback={
        initialPage?.path === window.location.pathname ?
        <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: initialPage.html }} /> :
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

const PublicToaster = lazy(() =>
  import("@/components/ui/toaster").then((module) => ({ default: module.Toaster })),
);

function PublicRoutes() {
  const { toasts } = useToast();
  return (
    <>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/services"><LazyWrap><ServicesPage /></LazyWrap></Route>
          <Route path="/services/design"><LazyWrap><ServiceDesignPage /></LazyWrap></Route>
          <Route path="/services/development"><LazyWrap><ServiceDevelopmentPage /></LazyWrap></Route>
          <Route path="/services/hosting"><LazyWrap><ServiceHostingPage /></LazyWrap></Route>
          <Route path="/services/maintenance"><LazyWrap><ServiceMaintenancePage /></LazyWrap></Route>
          <Route path="/what-we-build"><LazyWrap><WhatWeBuildPage /></LazyWrap></Route>
          <Route path="/design-ideas"><LazyWrap><DesignIdeasPage /></LazyWrap></Route>
          <Route path="/membership"><LazyWrap><MembershipPage /></LazyWrap></Route>
          <Route path="/pricing"><LazyWrap><PricingPage /></LazyWrap></Route>
          <Route path="/contact"><LazyWrap><ContactPage /></LazyWrap></Route>
          <Route path="/contact/"><LazyWrap><ContactPage /></LazyWrap></Route>
          <Route path="/contact/thanks"><LazyWrap><ContactThanksPage /></LazyWrap></Route>
          <Route path="/about"><LazyWrap><AboutPage /></LazyWrap></Route>
          <Route path="/faq"><LazyWrap><FAQPage /></LazyWrap></Route>
          <Route path="/intake"><LazyWrap><IntakePage /></LazyWrap></Route>
          <Route path="/service-areas"><LazyWrap><ServiceAreasPage /></LazyWrap></Route>
          <Route path="/service-areas/ocean-springs"><LazyWrap><ServiceAreaOceanSprings /></LazyWrap></Route>
          <Route path="/service-areas/biloxi"><LazyWrap><ServiceAreaBiloxi /></LazyWrap></Route>
          <Route path="/service-areas/gulfport"><LazyWrap><ServiceAreaGulfport /></LazyWrap></Route>
          <Route path="/service-areas/new-orleans"><LazyWrap><ServiceAreaNewOrleans /></LazyWrap></Route>
          <Route path="/service-areas/mobile"><LazyWrap><ServiceAreaMobile /></LazyWrap></Route>
          <Route path="/service-areas/remote"><LazyWrap><RemoteServiceAreaPage /></LazyWrap></Route>
          <Route path="/service-areas/pascagoula"><LazyWrap><ServiceAreaPascagoula /></LazyWrap></Route>
          <Route path="/service-areas/gautier"><LazyWrap><ServiceAreaGautier /></LazyWrap></Route>
          <Route path="/service-areas/bay-st-louis"><LazyWrap><ServiceAreaBayStLouis /></LazyWrap></Route>
          <Route path="/service-areas/long-beach"><LazyWrap><ServiceAreaLongBeach /></LazyWrap></Route>
          <Route path="/service-areas/diberville"><LazyWrap><ServiceAreaDIberville /></LazyWrap></Route>
          {LEGACY_STATE_SLUGS.map((slug) => (
            <Route key={slug} path={`/service-areas/${slug}`}>
              <Redirect
                to={slug === "mississippi" ? "/service-areas/" : "/service-areas/remote/"}
                replace
              />
            </Route>
          ))}
          <Route path="/services/seo"><LazyWrap><ServiceSEOPage /></LazyWrap></Route>
          <Route path="/blog"><LazyWrap><SoroBlogPage /></LazyWrap></Route>
          <Route path="/blog/:slug"><Redirect to="/blog/" replace /></Route>
          <Route path="/free-website"><LazyWrap><FreeWebsiteLanding /></LazyWrap></Route>
          <Route path="/free-website/"><LazyWrap><FreeWebsiteLanding /></LazyWrap></Route>
          <Route path="/free-website/thank-you/?"><LazyWrap><FreeWebsiteThankYou /></LazyWrap></Route>
          <Route path="/free-website/onboarding/:token/?"><LazyWrap><FreeWebsiteOnboarding /></LazyWrap></Route>
          <Route path="/privacy"><LazyWrap><PrivacyPage /></LazyWrap></Route>
          <Route path="/terms"><LazyWrap><TermsPage /></LazyWrap></Route>
          <Route component={NotFound} />
        </Switch>
        {toasts.length > 0 && (
          <Suspense fallback={null}><PublicToaster /></Suspense>
        )}
    </>
  );
}

function RouteAwareApp() {
  const [location] = useLocation();
  const clerkRoute = /^\/(sign-in|sign-up|account|checkout|thank-you|admin)(\/|$)/.test(location);

  useEffect(() => {
    // Campaign and admin paths are excluded: the campaign uses explicit opt-in
    // tracking, and private onboarding tokens must never reach third-party analytics.
    if (/^\/(free-website|admin)(\/|$)/.test(location)) return;
    firePageView(location);
  }, [location]);

  return clerkRoute ? (
    <Suspense fallback={<LazyWrap><div /></LazyWrap>}>
      <AuthenticatedApp />
    </Suspense>
  ) : (
    <PublicRoutes />
  );
}

export default function App() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  return (
    <WouterRouter base={basePath}>
      <RouteAwareApp />
    </WouterRouter>
  );
}
