// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import UserHeader from "@/components/pages/user/[id]/user-header";
import type { DashboardData } from "@/server/schemas/dashboard";

function makeUser(overrides: Partial<DashboardData> = {}): DashboardData {
  return {
    userName: "Ada Lovelace",
    id: "user-1",
    image: null,
    biography: null,
    isPrivate: false,
    totalAchievements: 3,
    totalSubtopicsCompleted: 7,
    level: "Intermediate",
    totalProgress: 42.5,
    progressData: [],
    achievements: [],
    ...overrides,
  };
}

beforeEach(() => {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(() => false),
  }));
});

describe("user/[id] header (#92)", () => {
  it("shows the real display name and the level/lessons/achievements meta line", () => {
    render(<UserHeader user={makeUser()} />);

    expect(
      screen.getByRole("heading", { name: "Ada Lovelace" })
    ).toBeInTheDocument();
    const meta = screen.getByText(/Level Intermediate/);
    expect(meta).toHaveTextContent("7 lessons");
    expect(meta).toHaveTextContent("3 achievements");
  });

  it("falls back to a neutral name when the learner has no username", () => {
    render(<UserHeader user={makeUser({ userName: null })} />);

    expect(screen.getByText("Unnamed learner")).toBeInTheDocument();
  });

  it("renders the biography when the account is public and a bio is set", () => {
    render(
      <UserHeader
        user={makeUser({ biography: "I build accessible interfaces." })}
      />
    );

    expect(
      screen.getByText("I build accessible interfaces.")
    ).toBeInTheDocument();
  });

  it("omits the biography entirely when the bio is unset", () => {
    render(<UserHeader user={makeUser({ biography: null })} />);

    expect(screen.queryByText(/bio/i)).not.toBeInTheDocument();
  });

  it("hides the biography for a private account even when one is set", () => {
    render(
      <UserHeader user={makeUser({ biography: "secret", isPrivate: true })} />
    );

    expect(screen.queryByText("secret")).not.toBeInTheDocument();
  });

  it("keeps Follow visibly disabled with a coming-soon hint and full styling", () => {
    render(<UserHeader user={makeUser()} />);

    const follow = screen.getByRole("button", { name: /follow/i });
    expect(follow).toHaveAttribute("aria-disabled", "true");
    expect(follow).toHaveAttribute("title", "Follow coming soon");
    expect(follow).not.toBeDisabled();
  });

  it("keeps Report and Block as disabled overflow items", async () => {
    render(<UserHeader user={makeUser()} />);

    const trigger = screen.getByRole("button", {
      name: /more actions for ada lovelace/i,
    });
    fireEvent.pointerDown(trigger, { button: 0, pointerType: "mouse" });
    fireEvent.pointerUp(trigger, { button: 0, pointerType: "mouse" });

    const report = await screen.findByRole("menuitem", {
      name: /report user/i,
    });
    const block = await screen.findByRole("menuitem", { name: /block user/i });
    expect(report).toHaveAttribute("data-disabled");
    expect(block).toHaveAttribute("data-disabled");
  });
});

describe("user/[id] page shell (#92)", () => {
  it("reads the public dashboard by id and leaves no mock profile data", () => {
    const page = readFileSync(
      join(__dirname, "..", "..", "src/app/(app)/user/[id]/page.tsx"),
      "utf8"
    );

    expect(page).toContain("api.dashboard.getDashboardById");
    expect(page).toContain("sr-only");
    expect(page).not.toContain("Sarah Wilson");
    expect(page).not.toContain("userData");
    expect(page).not.toContain("recentActivity");
  });
});
