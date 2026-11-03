import { expect, test } from "@playwright/test";

test("quick intake requires the correct math answer", async ({ page }) => {
  await page.goto("/intake?mode=quick");

  const answer = page.locator("#quick-intake-math-challenge");
  const submit = page.getByRole("form", { name: "Quick start project form" }).locator('button[type="submit"]');

  await expect(answer).toBeVisible();
  await expect(submit).toBeDisabled();
  await answer.fill("3");
  await expect(submit).toBeDisabled();
  await answer.fill("2");
  await expect(submit).toBeEnabled();
});

test("full intake requires the correct math answer", async ({ page }) => {
  await page.goto("/intake?mode=full");

  const answer = page.locator("#full-intake-math-challenge");
  const submit = page.getByRole("button", { name: "Submit Details" });

  await expect(answer).toBeVisible();
  await expect(submit).toBeDisabled();
  await answer.fill("3");
  await expect(submit).toBeDisabled();
  await answer.fill("2");
  await expect(submit).toBeEnabled();
});
