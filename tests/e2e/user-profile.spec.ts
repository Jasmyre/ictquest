import { test as base, expect, type Page } from "@playwright/test";
import {
  e2eSeeded,
  MISSING_ID,
  PRIVATE_ACCOUNT,
  PUBLIC_WITH_BIO,
  PUBLIC_WITHOUT_BIO,
} from "./fixtures/profile-accounts";

/**
 * `/user/[id]` public profile sign-off (#95).
 *
 * Real-browser verification of the finished profile: mobile + desktop widths,
 * light + dark modes, the header / summary / tabs / private-card surfaces, the
 * anonymous share twin, reduced-motion fallbacks, hover/press feedback, shell
 * spacing against the design system, and a zero-console-error budget. Seeded
 * data comes from `setup/profile.setup.ts`; without a test database the whole
 * file skips cleanly.
 */

const AUTH_URL_RE = /\/auth/;
const FAVICON_RE = /favicon/i;
const PRESS_FEEDBACK_RE = /active:scale-\[0\.97\]/;
const TRANSITION_RE = /transition-transform/;
const MAX_WIDTH_RE = /max-w-7xl/;
const PX_RE = /px-4/;
const PY_RE = /py-8/;
const HEADER_GAP_RE = /mb-8/;
const SUMMARY_GAP_RE = /mb-6/;
const TAB_PANEL_GAP_RE = /mt-6/;

const MOBILE = { height: 844, width: 390 };
const DESKTOP = { height: 800, width: 1280 };

type ConsoleFixtures = { consoleErrors: string[] };

const test = base.extend<ConsoleFixtures>({
  consoleErrors: async ({ page }, use) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error" && !FAVICON_RE.test(message.text())) {
        errors.push(message.text());
      }
    });
    page.on("pageerror", (error) => errors.push(error.message));
    await use(errors);
  },
});

test.skip(
  !e2eSeeded,
  "DATABASE_URL_TEST is not set; seeded /user/[id] sign-off skips."
);

async function openProfile(
  page: Page,
  id: string,
  theme: "light" | "dark"
): Promise<void> {
  await page.addInitScript((value) => {
    window.localStorage.setItem("theme", value);
  }, theme);
  await page.goto(`/user/${id}`);
}

test.describe("signed-in public profile", () => {
  test("shows the real bio, meta line, summary, and tabs (desktop light)", async ({
    page,
    consoleErrors,
  }) => {
    await page.setViewportSize(DESKTOP);
    await openProfile(page, PUBLIC_WITH_BIO.id, "light");

    const header = page.getByTestId("user-header-card");
    await expect(header).toBeVisible();
    await expect(
      page.getByRole("heading", { exact: true, name: PUBLIC_WITH_BIO.userName })
    ).toBeVisible();
    await expect(header).toContainText("Level");
    await expect(header).toContainText("lessons");
    await expect(header).toContainText("achievements");
    await expect(page.getByText(PUBLIC_WITH_BIO.biography)).toBeVisible();

    const summary = page.getByTestId("user-stat-summary");
    await expect(summary).toBeVisible();
    await expect(summary).toContainText("Lessons Completed");
    await expect(summary).toContainText("Achievements");

    const tabs = page.getByTestId("user-stats");
    await expect(tabs).toBeVisible();
    await expect(page.getByRole("tab", { name: "Progress" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Achievements" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Activity" })).toHaveCount(0);

    await expect(page.getByText("Overall HTML Mastery")).toBeVisible();
    expect(await page.getByRole("progressbar").count()).toBeGreaterThan(1);

    await page.getByRole("tab", { name: "Achievements" }).click();
    const rows = page.getByTestId("achievement-row");
    await expect(rows).toHaveCount(2);
    await expect(rows.first()).toContainText("HTML Hero");

    expect(consoleErrors).toEqual([]);
  });

  test("hides the bio block and shows the empty achievements state (mobile dark)", async ({
    page,
    consoleErrors,
  }) => {
    await page.setViewportSize(MOBILE);
    await openProfile(page, PUBLIC_WITHOUT_BIO.id, "dark");

    await expect(
      page.getByRole("heading", {
        exact: true,
        name: PUBLIC_WITHOUT_BIO.userName,
      })
    ).toBeVisible();
    await expect(page.getByText("Bio not available")).toHaveCount(0);
    await expect(page.getByTestId("user-stat-summary")).toBeVisible();

    await page.getByRole("tab", { name: "Achievements" }).click();
    await expect(page.getByText("No achievements yet")).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });

  test("shows only the header plus the private card for a private account (desktop dark)", async ({
    page,
    consoleErrors,
  }) => {
    await page.setViewportSize(DESKTOP);
    await openProfile(page, PRIVATE_ACCOUNT.id, "dark");

    await expect(page.getByTestId("user-header-card")).toBeVisible();
    const privateCard = page.getByTestId("private-account-card");
    await expect(privateCard).toBeVisible();
    await expect(privateCard).toContainText("This account is private");
    await expect(page.getByTestId("user-stat-summary")).toHaveCount(0);
    await expect(page.getByTestId("user-stats")).toHaveCount(0);
    await expect(page.getByText(PRIVATE_ACCOUNT.biography)).toHaveCount(0);

    expect(consoleErrors).toEqual([]);
  });

  test("renders the not-found boundary for an unknown id", async ({
    page,
    consoleErrors,
  }) => {
    await page.goto(`/user/${MISSING_ID}`);
    await expect(page.getByTestId("user-not-found")).toBeVisible();
    expect(consoleErrors).toEqual([]);
  });
});

const MATRIX = [
  { label: "mobile light", theme: "light", viewport: MOBILE },
  { label: "mobile dark", theme: "dark", viewport: MOBILE },
  { label: "desktop light", theme: "light", viewport: DESKTOP },
  { label: "desktop dark", theme: "dark", viewport: DESKTOP },
] as const;

test.describe("responsive and theme matrix", () => {
  for (const entry of MATRIX) {
    test(`renders every surface at ${entry.label} with no console errors`, async ({
      page,
      consoleErrors,
    }) => {
      await page.setViewportSize(entry.viewport);
      await openProfile(page, PUBLIC_WITH_BIO.id, entry.theme);

      await expect(page.getByTestId("user-header-card")).toBeVisible();
      await expect(page.getByTestId("user-stat-summary")).toBeVisible();
      await expect(page.getByTestId("user-stats")).toBeVisible();
      await expect(
        page.getByRole("heading", {
          exact: true,
          name: PUBLIC_WITH_BIO.userName,
        })
      ).toBeVisible();

      expect(consoleErrors).toEqual([]);
    });
  }
});

test.describe("design-system shell rhythm", () => {
  test("uses the shell max width and padding at mobile and desktop", async ({
    page,
    consoleErrors,
  }) => {
    await page.setViewportSize(MOBILE);
    await openProfile(page, PUBLIC_WITH_BIO.id, "light");
    const shell = page.getByTestId("user-profile-shell");
    await expect(shell).toBeVisible();
    await expect(shell).toHaveClass(MAX_WIDTH_RE);
    await expect(shell).toHaveClass(PX_RE);
    await expect(shell).toHaveClass(PY_RE);
    const mobilePadding = await shell.evaluate(
      (element) => getComputedStyle(element).paddingLeft
    );
    expect(mobilePadding).toBe("16px");

    await page.setViewportSize(DESKTOP);
    const desktopPadding = await shell.evaluate(
      (element) => getComputedStyle(element).paddingLeft
    );
    expect(desktopPadding).toBe("32px");

    expect(consoleErrors).toEqual([]);
  });

  test("keeps the header, summary, and tab panel rhythm", async ({
    page,
    consoleErrors,
  }) => {
    await openProfile(page, PUBLIC_WITH_BIO.id, "light");
    await expect(page.getByTestId("user-header-card")).toHaveClass(
      HEADER_GAP_RE
    );
    await expect(page.getByTestId("user-stat-summary")).toHaveClass(
      SUMMARY_GAP_RE
    );
    const panel = page.getByTestId("user-stats").getByRole("tabpanel");
    await expect(panel).toBeVisible();
    await expect(panel).toHaveClass(TAB_PANEL_GAP_RE);

    expect(consoleErrors).toEqual([]);
  });

  test("gates motion behind reduced-motion and keeps press feedback", async ({
    page,
    consoleErrors,
  }) => {
    await openProfile(page, PUBLIC_WITH_BIO.id, "dark");

    const follow = page.getByRole("button", { name: "Follow" });
    await expect(follow).toHaveAttribute("aria-disabled", "true");
    await expect(follow).toHaveClass(TRANSITION_RE);
    await expect(follow).toHaveClass(PRESS_FEEDBACK_RE);

    const box = await follow.boundingBox();
    if (!box) {
      throw new Error("Follow button has no box to press");
    }
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(250);
    const pressedTransform = await follow.evaluate(
      (element) => getComputedStyle(element).transform
    );
    await page.mouse.up();
    expect(pressedTransform).not.toBe("none");

    expect(consoleErrors).toEqual([]);
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("renders achievement rows statically with opacity only", async ({
    page,
    consoleErrors,
  }) => {
    await openProfile(page, PUBLIC_WITH_BIO.id, "dark");
    await page.getByRole("tab", { name: "Achievements" }).click();

    const row = page.getByTestId("achievement-row").first();
    await expect(row).toBeVisible();
    const { opacity, transform } = await row.evaluate((element) => {
      const style = getComputedStyle(element);
      return { opacity: style.opacity, transform: style.transform };
    });
    expect(opacity).toBe("1");
    expect(transform).toBe("none");

    expect(consoleErrors).toEqual([]);
  });
});

test.describe("anonymous share twin", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("never redirects a public id to sign-in and shows header plus summary", async ({
    page,
    consoleErrors,
  }) => {
    const response = await page.goto(`/dashboard/${PUBLIC_WITH_BIO.id}`);
    expect(response?.status()).not.toBe(404);
    await expect(page).not.toHaveURL(AUTH_URL_RE);
    await expect(page.getByTestId("dashboard-share")).toBeVisible();
    await expect(page.getByTestId("user-stat-summary")).toBeVisible();
    await expect(page.getByTestId("user-stats")).toHaveCount(0);

    expect(consoleErrors).toEqual([]);
  });

  test("never redirects a private id to sign-in and shows the private card", async ({
    page,
    consoleErrors,
  }) => {
    const response = await page.goto(`/dashboard/${PRIVATE_ACCOUNT.id}`);
    expect(response?.status()).not.toBe(404);
    await expect(page).not.toHaveURL(AUTH_URL_RE);
    await expect(page.getByTestId("dashboard-share")).toBeVisible();
    await expect(page.getByTestId("private-account-card")).toBeVisible();
    await expect(page.getByTestId("user-stat-summary")).toHaveCount(0);

    expect(consoleErrors).toEqual([]);
  });

  test("never redirects an unknown id to sign-in", async ({ page }) => {
    await page.goto(`/dashboard/${MISSING_ID}`);
    await expect(page).not.toHaveURL(AUTH_URL_RE);
  });
});
