import { defineConfig, devices } from "@playwright/test";

const CHROMIUM_PATH =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
  "/nix/store/qa9cnw4v5xkxyip6mb9kxqfq1z4x2dx1-chromium-138.0.7204.100/bin/chromium";

export default defineConfig({
  testDir: "./artifacts/website-builder-site/tests",
  fullyParallel: false,
  retries: 0,
  reporter: "list",
  webServer: {
    command:
      "PLAYWRIGHT_TEST=true PORT=4173 BASE_PATH=/ NODE_ENV=production pnpm --filter @workspace/website-builder-site run dev",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false,
    timeout: 120_000,
  },
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "off",
    launchOptions: {
      executablePath: CHROMIUM_PATH,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 5"] },
    },
  ],
});
