/**
 * Shared analytics wrapper for GA4 and Replit Analytics.
 * Both integrations are optional and must never affect the user experience.
 */
type AnalyticsData = Record<string, string | number | boolean>;
let pageViewTimer: number | undefined;

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      params?: AnalyticsData,
    ) => void;
    umami?: {
      track(name: string, data?: AnalyticsData): void;
    };
  }
}

function fireGoogleEvent(eventName: string, params?: AnalyticsData): void {
  if (typeof window === "undefined") return;

  try {
    window.gtag?.("event", eventName, params ?? {});
  } catch {
    // Analytics must never break the app.
  }
}

/**
 * Records a meaningful interaction in Replit Analytics when its injected
 * tracker is available. Safe to call during development or before injection.
 */
export function trackEvent(eventName: string, params?: AnalyticsData): void {
  if (typeof window === "undefined") return;

  try {
    window.umami?.track(eventName, params);
  } catch {
    // Analytics must never break the app.
  }
}

export function fireEvent(
  eventName: string,
  params?: AnalyticsData,
): void {
  fireGoogleEvent(eventName, params);
  trackEvent(eventName, params);
}

/**
 * Records a client-side navigation as a GA4 page view. The initial GA4
 * config disables its automatic page view, so this works consistently for
 * both the first route and subsequent wouter navigations. Replit Analytics
 * receives pageviews from its injected tracker automatically.
 */
export function firePageView(path: string): void {
  // Let the route's useSEO effect update document.title before reading it.
  window.clearTimeout(pageViewTimer);
  pageViewTimer = window.setTimeout(() => {
    fireGoogleEvent("page_view", {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, 0);
}
