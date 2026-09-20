import { expect, test } from "@playwright/test";

/**
 * Slice 5 — Dashboard rename (HTTP route-plus-guard seam, #62).
 *
 * The public dashboard share link must stay anonymous-readable: unlike the
 * owner `/progress` view (which bounces to `/auth` when signed out), a
 * by-id share link never redirects to sign-in. Data assertions stay at the
 * procedure seam in `tests/unit/dashboard.test.ts` since Playwright has no
 * seeded sessions.
 */
const AUTH_URL_RE = /\/auth/;

test("anonymous can open a shared dashboard by-id link without sign-in", async ({
  page,
}) => {
  const response = await page.goto("/dashboard/learner-a");
  expect(response?.status()).not.toBe(404);
  // Share links bypass the session guard: never bounce to sign-in, even
  // with no seeded session (data errors render in place, never redirect).
  await expect(page).not.toHaveURL(AUTH_URL_RE);
});
