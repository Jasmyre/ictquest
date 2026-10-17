// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProfileError from "@/app/(app)/user/[id]/error";
import UserNotFound from "@/app/(app)/user/[id]/not-found";
import PrivateAccountCard from "@/components/pages/user/[id]/private-account-card";
import { ProfileSkeleton } from "@/components/pages/user/[id]/profile-skeleton";

const ROOT = join(__dirname, "..", "..");

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

const APP_PAGE = "src/app/(app)/user/[id]/page.tsx";
const TWIN_PAGE = "src/app/(marketing)/dashboard/[id]/page.tsx";

describe("private account card (#94)", () => {
  it("renders a lock icon, the private title, and a muted explainer", () => {
    render(<PrivateAccountCard />);

    const card = screen.getByTestId("private-account-card");
    expect(card).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "This account is private" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/keeps their progress and achievements private/i)
    ).toBeInTheDocument();
    // The lock glyph is the visual signal; it must survive as an icon.
    expect(card.querySelector("svg")).not.toBeNull();
  });
});

describe("route state files (#94)", () => {
  it("labels the loading skeleton busy and mirrors the shell", () => {
    render(<ProfileSkeleton />);

    const skeleton = screen.getByTestId("profile-skeleton");
    expect(skeleton).toHaveAttribute("aria-busy", "true");
    expect(skeleton).toHaveAttribute("aria-label");
  });

  it("ships a route loading.tsx that renders the busy skeleton", () => {
    const src = read("src/app/(app)/user/[id]/loading.tsx");
    expect(src).toContain("ProfileSkeleton");
  });

  it("offers a retry action through reset in the route error card", () => {
    const reset = vi.fn();
    render(<ProfileError error={new Error("boom")} reset={reset} />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it("renders a not-found card for a missing id", () => {
    render(<UserNotFound />);

    expect(screen.getByTestId("user-not-found")).toBeInTheDocument();
    expect(
      screen.getByText(/may have been removed or the link is incorrect/i)
    ).toBeInTheDocument();
  });

  it("declares error.tsx as a client component with a retry callback", () => {
    const src = read("src/app/(app)/user/[id]/error.tsx");
    expect(src).toContain('"use client"');
    expect(src).toContain("reset");
  });
});

describe("private branch on the app profile route (#94)", () => {
  it("branches on isPrivate and keeps stats in the public branch only", () => {
    const src = read(APP_PAGE);
    expect(src).toContain("PrivateAccountCard");
    expect(src).toContain("isPrivate");
    expect(src).toContain("<UserStatSummary user={user} />");
    expect(src).toContain("<UserStats user={user} />");
  });

  it("maps a missing id to not-found but rethrows real load failures", () => {
    const src = read(APP_PAGE);
    expect(src).toContain("notFound()");
    expect(src).toContain("NOT_FOUND");
    expect(src).toContain("throw");
  });
});

describe("share twin parity (#94)", () => {
  it("reuses the header and private branch without the tabs section", () => {
    const src = read(TWIN_PAGE);
    expect(src).toContain("UserHeader");
    expect(src).toContain("PrivateAccountCard");
    expect(src).toContain("isPrivate");
    expect(src).not.toContain("UserStats");
    expect(src).not.toContain("Tabs");
  });
});
