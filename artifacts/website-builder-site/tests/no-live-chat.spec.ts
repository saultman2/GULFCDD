import { expect, test } from "@playwright/test";

test("does not load Tawk.to or show a live-chat launcher", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator('script[src*="tawk.to"]')).toHaveCount(0);
  await expect(page.getByTestId("support-toggle")).toHaveCount(0);
  await expect(page.getByText("Live chat", { exact: true })).toHaveCount(0);
});
