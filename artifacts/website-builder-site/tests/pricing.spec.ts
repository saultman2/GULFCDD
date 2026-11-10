import { test, expect } from "@playwright/test";
import { tiers } from "../src/data/plans";

test.beforeEach(async ({ page }) => {
  await page.goto("/pricing");
  await page.locator("#packages").waitFor({ state: "visible" });
});

test.describe("Packages section", () => {
  test("shows all tier names", async ({ page }) => {
    for (const tier of tiers) {
      const card = page.getByTestId(`tier-card-${tier.key}`);
      await expect(card).toBeVisible();
      await expect(card).toContainText(tier.name);
    }
  });

  test("shows a free quote CTA on every plan", async ({ page }) => {
    for (const tier of tiers) {
      const cta = page.getByTestId(`tier-cta-${tier.key}`);
      await expect(cta).toBeVisible();
      await expect(cta).toContainText("Free Quote");
    }
  });

  test("shows all tier features", async ({ page }) => {
    for (const tier of tiers) {
      const card = page.getByTestId(`tier-card-${tier.key}`);
      for (const feature of tier.features) {
        await expect(card).toContainText(feature);
      }
    }
  });

  test("shows the approved monthly plans and founding offer", async ({ page }) => {
    await expect(page.getByTestId("tier-card-essential")).toContainText("Hosting and upkeep");
    await expect(page.getByTestId("tier-card-essential")).toContainText("$150/mo");
    await expect(page.getByTestId("tier-card-growth")).toContainText("Local SEO");
    await expect(page.getByTestId("tier-card-growth")).toContainText("Blog posts");
    await expect(page.getByTestId("tier-card-growth")).toContainText("$500/mo");
    await expect(page.getByTestId("tier-card-growth")).toContainText("$250/mo founding");
    await expect(page.getByTestId("tier-card-full-service")).toContainText("$1,000/mo");
    await expect(page.getByTestId("tier-card-full-service")).toContainText("$500/mo founding");
    const body = page.locator("body");
    await expect(body).toContainText("January 31, 2027");
    await expect(body).toContainText("analytics report");
    await expect(body).not.toContainText("Standard");
    await expect(body).not.toContainText("Platinum");
    await expect(body).not.toContainText("$50");
  });
});
