import { expect, test } from "@playwright/test";

/**
 * Settings page (spec #81, code-review follow-up).
 *
 * Logged-out HTTP seam only: anonymous callers must bounce to `/auth`
 * (proxy: not logged in) and never render the settings tablist. The
 * signed-in side stays at the unit seam (`tests/unit/settings-*.test.*`)
 * since Playwright has no seeded sessions (#86 accepted scope).
 */
const AUTH_URL_RE = /\/auth/;

test("anonymous is denied settings navigation", async ({ page }) => {
  const response = await page.goto("/settings");
  expect(response?.status()).not.toBe(404);
  await expect(page).toHaveURL(AUTH_URL_RE);
  await expect(
    page.getByRole("tablist"),
    "settings must not render its tablist when denied"
  ).toHaveCount(0);
});
