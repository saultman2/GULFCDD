import { createRoot } from "react-dom/client";
import App from "./App";
import stylesheetUrl from "./index.css?url";

let mounted = false;
const mount = () => {
  if (mounted) return;
  mounted = true;
  // Keep the static page in place until its complete stylesheet is ready.
  document.querySelector("#critical-shell[data-fallback]")?.remove();
  const root = document.getElementById("root")!;
  (window as Window & { __GULFCDD_INITIAL_PAGE__?: { path: string; html: string } }).__GULFCDD_INITIAL_PAGE__ =
    root.children.length ? { path: window.location.pathname, html: root.innerHTML } : undefined;
  createRoot(root).render(<App />);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.documentElement.dataset.stylesReady = "true";
  }));
};

// Keep the prerendered critical shell paintable while the full utility
// stylesheet downloads. The stylesheet is preloaded by the prerendered HTML
// and promoted after the first paint (or immediately when it finishes).
// This avoids a render-blocking CSS request without relying on an incomplete
// desktop/mobile approximation.
const stylesheet =
  (document.querySelector('link[data-deferred="true"]') as HTMLLinkElement | null) ??
  document.createElement("link");
const promoteStylesheet = () => {
  if (stylesheet.rel !== "stylesheet") {
    stylesheet.rel = "stylesheet";
  }
  stylesheet.removeAttribute("as");
  if (stylesheet.sheet) mount();
};

// The HTML onload handler may have already applied this CSS before the JS
// arrives. Never demote an applied stylesheet back to preload: doing so
// briefly removed all utility styles and caused almost a full viewport shift.
if (stylesheet.rel === "stylesheet" && stylesheet.sheet) {
  promoteStylesheet();
} else {
  stylesheet.addEventListener("load", () => {
    promoteStylesheet();
    mount();
  }, { once: true });
  if (!stylesheet.isConnected) {
    stylesheet.rel = "preload";
    stylesheet.as = "style";
    stylesheet.href = stylesheetUrl;
    stylesheet.dataset.deferred = "true";
    document.head.appendChild(stylesheet);
  }
  promoteStylesheet();
}
