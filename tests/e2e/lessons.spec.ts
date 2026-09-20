import { expect, test } from "@playwright/test";

/**
 * Slice 6 — Per-entity service/repository/schema triples (HTTP
 * route-plus-guard seam, #63).
 *
 * The lessons index lives in the (app) group on purpose, so a signed-out
 * visitor bounces to `/auth` here. The denied side for writes (progress,
 * attempt, and grant writes require sign-in) is pinned at the procedure
 * seam in `tests/unit/progress-stats.test.ts` plus
 * `tests/unit/slice6-triples.test.ts`, since Playwright has no seeded
 * sessions.
 */
const AUTH_URL_RE = /\/auth/;

test("signed-out visitor bounces from the lessons list to sign-in", async ({
  page,
}) => {
  await page.goto("/lessons");
  await expect(page).toHaveURL(AUTH_URL_RE);
});

test("anonymous progress write over REST fails closed without a session", async ({
  request,
}) => {
  const response = await request.get("/api/v1/me/progress");
  expect(response.status()).toBe(401);
});
