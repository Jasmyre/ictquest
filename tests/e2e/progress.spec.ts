import { expect, test } from "@playwright/test";

/**
 * Migration 12 — Progress writes plus stats router (HTTP route-plus-guard seam).
 *
 * Denied side runs here against a live server without a session: the
 * progress dashboard must bounce anonymous callers to `/auth` (proxy: not
 * logged in), never render per-user stats, and never 404 (the path is
 * registered). The allowed side (learner session lists/creates/deletes
 * progress and sees stats plus completion counts) is pinned at the
 * procedure seam in `tests/unit/progress-stats.test.ts` with a shared fake
 * db, since Playwright has no seeded sessions.
 */
const AUTH_URL_RE = /\/auth/;

test("anonymous is denied progress dashboard navigation", async ({ page }) => {
  const response = await page.goto("/progress");
  expect(response?.status()).not.toBe(404);
  await expect(page).toHaveURL(AUTH_URL_RE);
  await expect(
    page.getByTestId("progress-stats"),
    "progress dashboard must not render per-user stats when denied"
  ).toHaveCount(0);
});
