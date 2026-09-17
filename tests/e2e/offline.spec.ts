import { expect, test } from "@playwright/test";

/**
 * Migration 16 — PWA manifest plus offline page (HTTP route seam).
 *
 * The full service-worker precache plus cache rules land in #40; here we pin
 * the user-visible surface: the manifest handler serves installable metadata,
 * and the dedicated offline fallback renders when offline while maintenance
 * stays a separate server-down route.
 */

const OFFLINE_HEADING = /offline/i;
const HOME_LINK = /home/i;
const MAINTENANCE_HEADING = /maintenance/i;

test("manifest handler serves installable metadata with the full icon set", async ({
  request,
}) => {
  const response = await request.get("/manifest.webmanifest");
  expect(response.status()).toBe(200);
  const manifest = await response.json();
  expect(manifest.start_url).toBe("/");
  expect(manifest.display).toBe("standalone");
  const srcs = (manifest.icons as { src: string }[]).map((icon) => icon.src);
  expect(srcs).toContain("/pwa/icon-192.png");
  expect(srcs).toContain("/pwa/icon-512.png");
  expect(srcs).toContain("/pwa/maskable-512.png");
  expect(srcs).toContain("/pwa/apple-touch-icon.png");
});

test("offline fallback page renders when offline", async ({ page }) => {
  await page.goto("/~offline");
  await expect(
    page.getByRole("heading", { name: OFFLINE_HEADING })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: HOME_LINK })).toBeVisible();

  // Maintenance stays a separate server-down route with its own language.
  await page.goto("/maintenance");
  await expect(
    page.getByRole("heading", { name: MAINTENANCE_HEADING })
  ).toBeVisible();
});
