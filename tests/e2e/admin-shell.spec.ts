import { expect, test } from "@playwright/test";

/**
 * Migration 11 — Admin shell plus guards (HTTP route-plus-guard seam).
 *
 * Denied side runs here against a live server without a session: every admin
 * path must bounce anonymous callers to `/auth` (proxy: not logged in), never
 * render the admin shell, and never 404 (paths are registered). The allowed
 * side (ADMIN session renders `data-testid="admin-shell"`, learner session
 * redirects to `/`) is pinned at the unit seam in
 * `tests/unit/admin-shell.test.ts` via `isAdminRoute` plus the layout's
 * `auth()`/`hasRole(ADMIN)` check, since Playwright has no seeded sessions.
 */
const AUTH_URL_RE = /\/auth/;

const ADMIN_PATHS = [
  "/admin",
  "/admin/users",
  "/admin/lessons",
  "/admin/achievements",
  "/admin/progress",
];

for (const path of ADMIN_PATHS) {
  test(`anonymous is denied admin navigation at ${path}`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status(), path).not.toBe(404);
    await expect(page, path).toHaveURL(AUTH_URL_RE);
    await expect(
      page.getByTestId("admin-shell"),
      `${path} must not render the admin shell when denied`
    ).toHaveCount(0);
  });
}

test("public shell still loads with no login", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL("/");
  await expect(
    page.getByTestId("admin-shell"),
    "public home must not leak the admin shell"
  ).toHaveCount(0);
});

test("lessons index needs a session", async ({ page }) => {
  await page.goto("/lessons");
  await expect(page).toHaveURL(AUTH_URL_RE);
});
