import { test, expect, Page } from "@playwright/test";

type AnalyticsEvent = {
  name: string;
  params: Record<string, string | number | boolean>;
};

const contactDetails = {
  name: "Analytics Test Person",
  business: "Privacy Safe Business",
  email: "analytics-test@example.com",
  phone: "2285550199",
};

async function getAnalyticsEvents(page: Page): Promise<AnalyticsEvent[]> {
  return page.evaluate(() => {
    const dataLayer = (window as Window & {
      dataLayer?: unknown[];
    }).dataLayer ?? [];

    return dataLayer
      .map((entry) => {
        if (
          !entry ||
          (typeof entry !== "object" && typeof entry !== "function")
        ) {
          return null;
        }
        const values = Array.from(entry as ArrayLike<unknown>);
        if (values[0] !== "event") return null;
        return {
          name: values[1] as string,
          params: values[2] as Record<string, string | number | boolean>,
        };
      })
      .filter((event): event is AnalyticsEvent => event !== null);
  });
}

async function clearAnalyticsEvents(page: Page) {
  await page.evaluate(() => {
    const dataLayer = (window as Window & { dataLayer?: unknown[] }).dataLayer;
    if (dataLayer) dataLayer.length = 0;
  });
}

function expectOnlyAllowedParams(
  event: AnalyticsEvent,
  allowedKeys: string[],
) {
  expect(Object.keys(event.params).sort()).toEqual([...allowedKeys].sort());
  for (const value of Object.values(event.params)) {
    expect(String(value)).not.toContain(contactDetails.name);
    expect(String(value)).not.toContain(contactDetails.business);
    expect(String(value)).not.toContain(contactDetails.email);
    expect(String(value)).not.toContain(contactDetails.phone);
  }
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const testWindow = window as Window & {
      dataLayer?: unknown[];
      __PLAYWRIGHT_TEST__?: boolean;
    };
    testWindow.dataLayer = [];
    testWindow.__PLAYWRIGHT_TEST__ = true;
  });
});

test.describe("conversion analytics", () => {
  test("does not load the production GA4 tracker on the development host", async ({
    page,
  }) => {
    await page.goto("/");

    await expect
      .poll(() =>
        page.evaluate(() =>
          Boolean(
            document.querySelector(
              'script[src*="googletagmanager.com/gtag/js"]',
            ),
          ),
        ),
      )
      .toBe(false);
    expect(
      await page.evaluate(
        () =>
          (window as Window & { __GA4_LOADED__?: boolean }).__GA4_LOADED__ ??
          false,
      ),
    ).toBe(false);
  });

  test("records page views with the routed path and approved metadata", async ({
    page,
  }) => {
    await page.goto("/pricing");

    const pageView = (await getAnalyticsEvents(page)).find(
      (event) => event.name === "page_view",
    );

    expect(pageView).toBeDefined();
    expectOnlyAllowedParams(pageView!, [
      "page_path",
      "page_location",
      "page_title",
    ]);
    expect(pageView!.params.page_path).toBe("/pricing");
    expect(pageView!.params.page_location).toContain("/pricing");
    expect(pageView!.params.page_title).toContain("GulfCDD");
  });

  test("records a contact lead without sending contact details to analytics", async ({
    page,
  }) => {
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });
    await page.goto("/contact");
    await page.locator('[data-testid="input-name"]').fill(contactDetails.name);
    await page
      .locator('[data-testid="input-business"]')
      .fill(contactDetails.business);
    await page.locator('[data-testid="input-email"]').fill(contactDetails.email);
    await page.locator('[data-testid="input-phone"]').fill(contactDetails.phone);
    await page.locator("#contact-math-challenge").fill("2");

    await page.getByTestId("select-service").click();
    await page.getByRole("option", { name: "A new website" }).click();
    await page.getByTestId("select-budget").click();
    await page.getByRole("option", { name: "Medium — several pages and features" }).click();
    await page.getByTestId("select-timeline").click();
    await page.getByRole("option", { name: /within two weeks/i }).click();
    await page.getByTestId("button-submit-contact").click();

    await expect(page).toHaveURL(/\/thank-you$/);
    const leadEvents = (await getAnalyticsEvents(page)).filter(
      (event) => event.name === "generate_lead",
    );

    expect(leadEvents).toHaveLength(1);
    expectOnlyAllowedParams(leadEvents[0], ["method"]);
    expect(leadEvents[0].params.method).toBe("contact_form");
  });

  test("requires the correct math answer before contact form submission", async ({
    page,
  }) => {
    await page.goto("/contact");
    const submitButton = page.getByTestId("button-submit-contact");

    await expect(submitButton).toBeDisabled();
    await page.locator("#contact-math-challenge").fill("3");
    await expect(submitButton).toBeDisabled();
    await page.locator("#contact-math-challenge").fill("2");
    await expect(submitButton).toBeEnabled();
  });

  test("records booking and phone clicks with location only", async ({ page }) => {
    await page.goto("/");
    await clearAnalyticsEvents(page);

    const mobileMenuToggle = page.getByTestId("mobile-menu-toggle");
    if (await mobileMenuToggle.isVisible()) {
      await mobileMenuToggle.click();
    }
    await page
      .locator('a:visible[href^="https://calendar.app.google"]')
      .click({ noWaitAfter: true });
    const bookingEvent = (await getAnalyticsEvents(page)).find(
      (event) => event.name === "book_appointment",
    );
    expect(bookingEvent).toBeDefined();
    expectOnlyAllowedParams(bookingEvent!, ["location"]);
    expect(bookingEvent!.params.location).toMatch(/^header_(desktop|mobile)$/);

    await clearAnalyticsEvents(page);
    await page.locator('a:visible[href="tel:2282787782"]').first().click({
      noWaitAfter: true,
    });
    const phoneEvent = (await getAnalyticsEvents(page)).find(
      (event) => event.name === "phone_call",
    );
    expect(phoneEvent).toBeDefined();
    expectOnlyAllowedParams(phoneEvent!, ["location"]);
    expect(phoneEvent!.params.location).toMatch(
      /^(header_utility|header_mobile|footer)$/,
    );
  });

  test("counts a completed purchase once across refreshes", async ({ page }) => {
    const checkoutUrl =
      "/checkout/success?plan=starter&session_id=cs_test_analytics_once";
    await page.goto(checkoutUrl);
    await expect(page.getByText("Payment confirmed.")).toBeVisible();

    const firstPurchase = (await getAnalyticsEvents(page)).filter(
      (event) => event.name === "purchase",
    );
    expect(firstPurchase).toHaveLength(1);
    expectOnlyAllowedParams(firstPurchase[0], [
      "transaction_id",
      "value",
      "currency",
      "item_name",
      "item_id",
    ]);
    expect(firstPurchase[0].params.transaction_id).toBe(
      "cs_test_analytics_once",
    );
    expect(firstPurchase[0].params.value).toBe(0);
    expect(firstPurchase[0].params.currency).toBe("USD");
    expect(firstPurchase[0].params.item_name).toBe("Starter");
    expect(firstPurchase[0].params.item_id).toBe("starter");

    await page.reload();
    const purchasesAfterRefresh = (await getAnalyticsEvents(page)).filter(
      (event) => event.name === "purchase",
    );
    expect(purchasesAfterRefresh).toHaveLength(0);
  });
});
