import { useEffect, useRef, lazy, Suspense } from "react";
import { Redirect, Route, Switch, useLocation } from "wouter";
import { ClerkProvider, SignIn, SignUp, Show, useClerk, AuthenticateWithRedirectCallback } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const CheckoutSuccess = lazy(() => import("@/pages/CheckoutSuccess"));
const SignInPage = lazy(() => import("@/pages/SignInPage"));
const CampaignAdminAccess = lazy(() => import("@/campaign/CampaignAdminAccess"));
const SignUpPage = lazy(() => import("@/pages/SignUpPage"));
const AccountDashboard = lazy(() => import("@/pages/AccountDashboard"));
const AccountPayments = lazy(() => import("@/pages/AccountPayments"));
const AccountMessages = lazy(() => import("@/pages/AccountMessages"));
const ServicesPage = lazy(() => import("@/pages/ServicesPage"));
const ServiceDesignPage = lazy(() => import("@/pages/services/DesignPage"));
const ServiceDevelopmentPage = lazy(() => import("@/pages/services/DevelopmentPage"));
const ServiceHostingPage = lazy(() => import("@/pages/services/HostingPage"));
const ServiceMaintenancePage = lazy(() => import("@/pages/services/MaintenancePage"));
const WhatWeBuildPage = lazy(() => import("@/pages/WhatWeBuildPage"));
const MembershipPage = lazy(() => import("@/pages/MembershipPage"));
const PricingPage = lazy(() => import("@/pages/PricingPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
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
const ServiceSEOPage = lazy(() => import("@/pages/services/SEOPage"));
const ThankYouPage = lazy(() => import("@/pages/ThankYouPage"));
const ServiceAreasPage = lazy(() => import("@/pages/ServiceAreasPage"));
const SoroBlogPage = lazy(() => import("@/pages/blog/SoroBlogPage"));

function LazyWrap({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const queryClient = new QueryClient();
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "hsl(214 52% 24%)",
    colorForeground: "hsl(217 33% 12%)",
    colorMutedForeground: "hsl(215 16% 47%)",
    colorDanger: "hsl(0 84% 60%)",
    colorBackground: "hsl(0 0% 100%)",
    colorInput: "hsl(214 32% 91%)",
    colorInputForeground: "hsl(217 33% 12%)",
    colorNeutral: "hsl(215 16% 47%)",
    fontFamily: "'Inter', sans-serif",
    borderRadius: "0.5rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-white border border-slate-200 rounded-xl w-[440px] max-w-full overflow-hidden shadow-xl",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-primary font-bold font-heading",
    headerSubtitle: "text-muted-foreground font-medium",
    socialButtonsBlockButtonText: "text-foreground font-semibold",
    formFieldLabel: "text-primary font-semibold text-sm",
    footerActionLink: "text-accent hover:text-accent/80 font-bold",
    footerActionText: "text-muted-foreground font-medium",
    dividerText: "text-muted-foreground",
    identityPreviewEditButton: "text-accent",
    formFieldSuccessText: "text-green-600",
    alertText: "text-foreground",
    logoBox: "flex justify-center",
    logoImage: "h-10 w-auto",
    socialButtonsBlockButton: "border border-slate-200 bg-white hover:bg-slate-50 text-foreground font-medium",
    formButtonPrimary: "bg-accent hover:bg-accent/90 text-white font-bold h-11",
    formFieldInput: "bg-white border-slate-200 text-foreground font-medium placeholder:text-muted-foreground/60",
    footerAction: "border-t border-slate-100 bg-slate-50/50",
    dividerLine: "bg-slate-200",
    alert: "border-slate-200 bg-slate-50",
    otpCodeFieldInput: "bg-white border-slate-200 text-foreground font-bold",
    formFieldRow: "",
    main: "",
  },
};

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Show when="signed-in">{children}</Show>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
    </>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: "Welcome back",
            subtitle: "Sign in to your GulfCDD account",
          },
        },
        signUp: {
          start: {
            title: "Create your account",
            subtitle: "Manage your site and stay in touch",
          },
        },
      }}
      routerPush={(to) => setLocation(to.startsWith(basePath) ? to.slice(basePath.length) || "/" : to)}
      routerReplace={(to) =>
        setLocation(to.startsWith(basePath) ? to.slice(basePath.length) || "/" : to, { replace: true })
      }
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <Switch>
            <Route path="/sign-in/*?"><LazyWrap><SignInPage /></LazyWrap></Route>
            <Route path="/sign-up/*?"><LazyWrap><SignUpPage /></LazyWrap></Route>
            <Route path="/account">
              <ProtectedRoute><LazyWrap><AccountDashboard /></LazyWrap></ProtectedRoute>
            </Route>
            <Route path="/account/payments">
              <ProtectedRoute><LazyWrap><AccountPayments /></LazyWrap></ProtectedRoute>
            </Route>
            <Route path="/account/messages">
              <ProtectedRoute><LazyWrap><AccountMessages /></LazyWrap></ProtectedRoute>
            </Route>
            <Route path="/admin/free-website/sso-callback/?">
              <AuthenticateWithRedirectCallback signInUrl={`${basePath}/admin/free-website/`} signUpUrl={`${basePath}/admin/free-website/`} signInForceRedirectUrl={`${basePath}/admin/free-website/`} signUpForceRedirectUrl={`${basePath}/admin/free-website/`} />
            </Route>
            <Route path="/admin/free-website/?">
              <LazyWrap><CampaignAdminAccess /></LazyWrap>
            </Route>
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
            <Route path="/about"><LazyWrap><AboutPage /></LazyWrap></Route>
            <Route path="/faq"><LazyWrap><FAQPage /></LazyWrap></Route>
            <Route path="/intake"><LazyWrap><IntakePage /></LazyWrap></Route>
            <Route path="/service-areas"><LazyWrap><ServiceAreasPage /></LazyWrap></Route>
            <Route path="/service-areas/ocean-springs"><LazyWrap><ServiceAreaOceanSprings /></LazyWrap></Route>
            <Route path="/service-areas/biloxi"><LazyWrap><ServiceAreaBiloxi /></LazyWrap></Route>
            <Route path="/service-areas/gulfport"><LazyWrap><ServiceAreaGulfport /></LazyWrap></Route>
            <Route path="/service-areas/pascagoula"><LazyWrap><ServiceAreaPascagoula /></LazyWrap></Route>
            <Route path="/service-areas/gautier"><LazyWrap><ServiceAreaGautier /></LazyWrap></Route>
            <Route path="/service-areas/bay-st-louis"><LazyWrap><ServiceAreaBayStLouis /></LazyWrap></Route>
            <Route path="/service-areas/long-beach"><LazyWrap><ServiceAreaLongBeach /></LazyWrap></Route>
            <Route path="/service-areas/diberville"><LazyWrap><ServiceAreaDIberville /></LazyWrap></Route>
            <Route path="/services/seo"><LazyWrap><ServiceSEOPage /></LazyWrap></Route>
            <Route path="/blog"><LazyWrap><SoroBlogPage /></LazyWrap></Route>
            <Route path="/blog/:slug"><Redirect to="/blog/" replace /></Route>
            <Route path="/thank-you"><LazyWrap><ThankYouPage /></LazyWrap></Route>
            <Route path="/privacy"><LazyWrap><PrivacyPage /></LazyWrap></Route>
            <Route path="/terms"><LazyWrap><TermsPage /></LazyWrap></Route>
            <Route path="/checkout/success"><LazyWrap><CheckoutSuccess /></LazyWrap></Route>
          </Switch>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default function AuthenticatedApp() {
  return <ClerkProviderWithRoutes />;
}
