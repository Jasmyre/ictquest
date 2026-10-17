// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import UserStats from "@/components/pages/user/[id]/user-stats";
import type { DashboardData } from "@/server/schemas/dashboard";

const pageSrc = readFileSync(
  join(process.cwd(), "src/app/(app)/user/[id]/page.tsx"),
  "utf8"
);
const componentSrc = readFileSync(
  join(process.cwd(), "src/components/pages/user/[id]/user-stats.tsx"),
  "utf8"
);

const baseUser: DashboardData = {
  userName: "Sarah Wilson",
  id: "learner-a",
  image: null,
  biography: "Passionate about web development.",
  isPrivate: false,
  totalAchievements: 1,
  totalSubtopicsCompleted: 2,
  level: "Beginner",
  totalProgress: 41.67,
  progressData: [
    {
      topic: "introduction-to-html",
      subtopics: ["html_introduction", "html_brief_examples"],
    },
  ],
  achievements: [
    {
      id: 7,
      name: "Fast Learner",
      description: "Completed 5 lessons in one day",
      unlockedAt: "2026-01-02T00:00:00.000Z",
    },
  ],
};

describe("public profile tabs (#93)", () => {
  it("renders only Progress and Achievements tabs", () => {
    render(<UserStats user={baseUser} />);

    expect(screen.getByRole("tab", { name: "Progress" })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Achievements" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("tab", { name: "Activity" })
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/recent activity/i)).not.toBeInTheDocument();
  });

  it("derives overall and per-lesson percentages from the lesson registry", () => {
    render(<UserStats user={baseUser} />);

    // Overall comes straight from the derived read.
    expect(screen.getByText("41.67%")).toBeInTheDocument();

    // Introduction to HTML: 2 of 3 topics completed -> 67%.
    expect(screen.getByText("Introduction to HTML")).toBeInTheDocument();
    expect(screen.getByText("67%")).toBeInTheDocument();

    // Every registry lesson is listed; untouched ones sit at 0%.
    expect(screen.getByText("Test Your Expertise")).toBeInTheDocument();
    expect(screen.getAllByText("0%").length).toBeGreaterThan(0);
  });

  it("renders the unlocked achievements newest-first with name and description", () => {
    render(
      <UserStats
        user={{
          ...baseUser,
          totalAchievements: 2,
          achievements: [
            {
              id: 2,
              name: "Newest badge",
              description: "Newest win",
              unlockedAt: "2026-02-02T00:00:00.000Z",
            },
            {
              id: 1,
              name: "Older badge",
              description: "Older win",
              unlockedAt: "2026-01-01T00:00:00.000Z",
            },
          ],
        }}
      />
    );

    const rows = screen.getAllByTestId("achievement-row");
    expect(rows.map((row) => row.textContent)).toEqual([
      "Newest badgeNewest win",
      "Older badgeOlder win",
    ]);
  });

  it("renders progress bars on primary tokens, not the legacy palette", () => {
    render(<UserStats user={baseUser} />);

    const bars = screen.getAllByRole("progressbar");
    expect(bars.length).toBeGreaterThan(0);
    for (const bar of bars) {
      const indicator = bar.firstElementChild as HTMLElement | null;
      expect(indicator?.className).toContain("bg-primary");
      expect(indicator?.className).not.toMatch(/indigo/);
    }
  });

  it("shows a dashed empty state when the learner has no achievements", () => {
    const { container } = render(
      <UserStats
        user={{ ...baseUser, achievements: [], totalAchievements: 0 }}
      />
    );

    expect(screen.queryByTestId("achievement-row")).not.toBeInTheDocument();
    expect(screen.getByText(/no achievements yet/i)).toBeInTheDocument();
    expect(container.querySelector(".border-dashed")).not.toBeNull();
  });
});

describe("public profile tabs source contract (#93)", () => {
  it("deletes the Activity tab, mock props, and legacy palette tokens", () => {
    expect(componentSrc).not.toMatch(/activity/i);
    expect(componentSrc).not.toContain("recentActivity");
    expect(componentSrc).not.toContain("userData");
    expect(componentSrc).not.toContain('from "@/app/(app)/user/[id]/page"');
    expect(componentSrc).not.toMatch(/indigo|gray-\d/);
    expect(componentSrc).not.toContain("transition-all");
  });

  it("uses card/primary/muted tokens with reduced-motion-safe transitions", () => {
    expect(componentSrc).toContain("text-primary");
    expect(componentSrc).toContain("transition-colors");
  });

  it("stops passing the mock userData prop into the tabs", () => {
    expect(pageSrc).toContain("<UserStats user={user} />");
  });
});
