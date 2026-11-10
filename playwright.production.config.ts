import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

// Critical-shell assertions need the built HTML and deferred stylesheet that
// production serves, not Vite's client-only development bootstrap.
export default defineConfig({
  ...base,
  testMatch: /homepage-(loading|promotion)\.spec\.ts/,
  webServer: {
    command: "PORT=4173 BASE_PATH=/ NODE_ENV=production pnpm --filter @workspace/website-builder-site serve",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
