import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.clock.install({ time: new Date("2026-10-07T16:00:00Z") });
});

test("homepage offer is non-blocking, with optional details, on refresh and return", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const offer = page.getByTestId("section-home-promotion");
  const details = page.getByTestId("dialog-home-promotion");
  await expect(offer).toBeVisible();
  await expect(offer).toContainText("$500");
  await expect(offer).toContainText("$1,000");
  await expect(offer).toContainText("$150 per month");
  await expect(offer).toContainText("No contract");
  await expect(details).toBeHidden();
  await page.getByTestId("button-promotion-details").click();
  await expect(details).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(details).toBeHidden();
  await expect(offer).toBeVisible();
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(offer).toBeVisible();
  await expect(details).toBeHidden();
  await page.getByTestId("button-promotion-details").click();
  await page.getByTestId("button-dismiss-promotion").click();
  await expect(details).toBeHidden();
  await page.getByTestId("link-promotion-cta").click({ noWaitAfter: true });
  await expect(page).toHaveURL(/\/contact\/$/);
  await expect(offer).toBeHidden();
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(offer).toBeVisible();
});

test("offer is homepage-only and fits the viewport", async ({ page }) => {
  await page.goto("/services");
  await expect(page.getByTestId("dialog-home-promotion")).toBeHidden();
  await page.goto("/");
  await expect(page.getByTestId("section-home-promotion")).toBeVisible();
  await expect(page.getByTestId("dialog-home-promotion")).toBeHidden();
  await page.getByTestId("button-promotion-details").click();
  const offer = page.getByTestId("dialog-home-promotion");
  await expect(offer).toBeVisible();
  for (const heading of [
    "Essential",
    "Growth",
    "Full Service",
    "Founding offer",
    "No contract",
    "Every plan includes an analytics report",
  ]) {
    await expect(offer.getByRole("heading", { name: heading, exact: true })).toBeAttached();
  }
  await expect(offer).toContainText("Founding rates are $250");
  await expect(offer).toContainText("January 31, 2027");
  await expect(page.getByTestId("link-promotion-dialog-cta")).toBeInViewport();
  await expect(page.getByTestId("button-dismiss-promotion")).toBeInViewport();
  const box = await offer.boundingBox();
  const viewport = page.viewportSize()!;
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
});

test("offer ends after January 31 in Central time, including open tabs", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2027-02-01T05:59:50Z"));
  await page.goto("/");
  await expect(page.getByTestId("section-home-promotion")).toBeVisible();
  await page.getByTestId("button-promotion-details").click();
  await expect(page.getByTestId("dialog-home-promotion")).toBeVisible();
  await page.clock.setFixedTime(new Date("2027-02-01T06:00:00Z"));
  await page.clock.runFor(30_001);
  await expect(page.getByTestId("dialog-home-promotion")).toBeHidden();
  await expect(page.getByTestId("section-home-promotion")).toBeHidden();
  await page.reload();
  await expect(page.getByTestId("dialog-home-promotion")).toBeHidden();
});
