import { expect, test } from "@playwright/test";

/**
 * Slice 6 — Per-entity service/repository/schema triples (HTTP
 * route-plus-guard seam, #63).
 *
 * Allowed side runs here against a live server without a session: the
 * public lessons list plus the lesson reader live in the app shell but
 * stay public with no guard on reads. The denied side (progress, attempt,
 * and grant writes require sign-in) is pinned at the procedure seam in
 * `tests/unit/progress-stats.test.ts` plus `tests/unit/slice6-triples.test.ts`,
 * since Playwright has no seeded sessions.
 */
const AUTH_URL_RE = /\/auth/;

test("signed-out visitor reads the public lessons list without sign-in", async ({
  page,
}) => {
  const response = await page.goto("/lessons");
  expect(response?.status()).not.toBe(404);
  await expect(page).not.toHaveURL(AUTH_URL_RE);
  await expect(
    page.getByRole("heading", { name: "HTML Lessons" })
  ).toBeVisible();
});

test("anonymous progress write over REST fails closed without a session", async ({
  request,
}) => {
  const response = await request.get("/api/v1/me/progress");
  expect(response.status()).toBe(401);
});
