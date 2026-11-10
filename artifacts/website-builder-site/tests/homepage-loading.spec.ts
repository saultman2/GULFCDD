import { test, expect } from "@playwright/test";

test.describe("homepage critical shell", () => {
  test("does not shift the page when JavaScript arrives after CSS", async ({ page }) => {
    await page.addInitScript(() => {
      (window as Window & { __layoutShiftTotal?: number }).__layoutShiftTotal = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
          if (!shift.hadRecentInput) {
            const state = window as Window & { __layoutShiftTotal: number };
            state.__layoutShiftTotal += shift.value;
          }
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.route("**/assets/*.js", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      await route.continue();
    });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForFunction(() => document.documentElement.dataset.stylesReady === "true");
    const cls = await page.evaluate(() =>
      (window as Window & { __layoutShiftTotal: number }).__layoutShiftTotal);
    expect(cls).toBeLessThan(0.1);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("keeps the header and hero styled while CSS is delayed", async ({
    page,
  }, testInfo) => {
    let stylesheetFinished = false;
    let releaseStylesheet: () => void = () => {};
    const stylesheetGate = new Promise<void>((resolve) => {
      releaseStylesheet = resolve;
    });

    await page.route("**/*.css", async (route) => {
      // Hold CSS until assertions finish instead of racing a timer on a
      // busy browser. This proves the static shell is independently styled.
      await stylesheetGate;
      stylesheetFinished = true;
      await route.continue();
    });

    await page.goto("/", { waitUntil: "commit" });
    // The desktop and mobile projects start together. Allow the dev server
    // and browser to cold-start without weakening the delayed-CSS assertions.
    await page.locator("h1").waitFor({ state: "attached", timeout: 3000 });
    await page.waitForTimeout(300);

    const criticalState = await page.evaluate(() => {
      const hero = document.querySelector("h1");
      const header = document.querySelector("header");
      const stylesheet = document.querySelector(
        'link[data-deferred="true"]',
      ) as HTMLLinkElement | null;
      const heroStyle = hero ? getComputedStyle(hero) : null;
      const headerStyle = header ? getComputedStyle(header) : null;

      return {
        heroText: hero?.textContent?.trim(),
        heroDisplay: heroStyle?.display,
        heroFontSize: heroStyle?.fontSize,
        heroColor: heroStyle?.color,
        headerDisplay: headerStyle?.display,
        deferredStylesheetPresent: Boolean(stylesheet),
        deferredStylesheetLoaded: Boolean(stylesheet?.sheet),
        documentReadyState: document.readyState,
      };
    });

    try {
    expect(stylesheetFinished).toBe(false);
    expect(criticalState.heroText).toContain(
      "Web Design & Local SEO for Small Businesses",
    );
    expect(criticalState.heroDisplay).toBe("block");
    expect(criticalState.heroColor).toBe("rgb(255, 255, 255)");
    expect(criticalState.headerDisplay).toBe("block");
    expect(criticalState.deferredStylesheetPresent).toBe(true);
    expect(criticalState.deferredStylesheetLoaded).toBe(false);

    await page.screenshot({
      path: testInfo.outputPath("homepage-critical-shell.png"),
    });
    } finally {
      releaseStylesheet();
    }

    await expect
      .poll(() =>
        page.evaluate(
          () =>
            Boolean(
              document.querySelector('link[data-deferred="true"]')?.sheet,
            ),
        ),
      )
      .toBe(true);
  });
});
