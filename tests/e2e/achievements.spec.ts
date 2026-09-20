import { expect, test } from "@playwright/test";

/**
 * Migration 13 — Achievements plus Post deletion (HTTP route-plus-guard seam).
 *
 * Denied side runs here against a live server without a session: the
 * profile inventory must bounce anonymous callers to `/auth` (proxy: not
 * logged in), never render `data-testid="achievement-inventory"`, and never
 * 404 (the path is registered). The allowed side (learner unlocks an
 * achievement and sees it in the inventory, per-user isolation, idempotent
 * re-unlock) is pinned at the procedure seam in
 * `tests/unit/achievement-inventory.test.ts` with a shared fake db, since
 * Playwright has no seeded sessions.
 */
const AUTH_URL_RE = /\/auth/;

test("anonymous is denied profile inventory navigation", async ({ page }) => {
  const response = await page.goto("/profile");
  expect(response?.status()).not.toBe(404);
  await expect(page).toHaveURL(AUTH_URL_RE);
  await expect(
    page.getByTestId("achievement-inventory"),
    "profile inventory must not render when denied"
  ).toHaveCount(0);
});
