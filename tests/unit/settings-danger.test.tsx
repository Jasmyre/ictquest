// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn(async () => null) }));
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/redis", () => ({ redis: {} }));
vi.mock("@/env", () => ({ env: { NODE_ENV: "test" } }));

const deleteAchievements = vi.fn(async () => ({ success: true as const }));
const deleteProgress = vi.fn(async () => ({ success: true as const }));
const profileMutate = vi.fn(async () => ({
  success: true as const,
  data: {
    id: "learner-a",
    name: "Learner A",
    userName: "learner-a",
    biography: null,
    isPrivate: false,
  },
}));

vi.mock("@/trpc/react", () => ({
  api: {
    useUtils: () => ({ user: { getProfile: { invalidate: vi.fn() } } }),
    user: {
      updateProfile: {
        useMutation: () => ({ mutateAsync: profileMutate, isPending: false }),
      },
      deleteAllUserProgress: {
        useMutation: () => ({ mutateAsync: deleteProgress, isPending: false }),
      },
      deleteAllUserAchievements: {
        useMutation: () => ({
          mutateAsync: deleteAchievements,
          isPending: false,
        }),
      },
    },
  },
}));

vi.mock("@/hooks/use-toast", () => ({ toast: vi.fn() }));

import { SettingsTabs } from "@/components/settings/settings-tabs";

const initial = {
  id: "learner-a",
  name: "Learner A",
  userName: "learner-a",
  biography: null as string | null,
  isPrivate: false,
};

describe("Settings Danger tab (#85)", () => {
  it("renders a Reset data confirm flow in the Danger panel", async () => {
    const user = userEvent.setup();
    render(<SettingsTabs profile={initial} />);
    await user.click(screen.getByRole("tab", { name: "Danger" }));
    expect(
      screen.getByRole("button", { name: /reset data/i })
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^reset data$/i }));
    expect(
      await screen.findByText(/this action cannot be undone/i)
    ).toBeInTheDocument();
  });

  it("calls the same Procedures as the profile reset (achievements then progress)", async () => {
    const user = userEvent.setup();
    render(<SettingsTabs profile={initial} />);
    await user.click(screen.getByRole("tab", { name: "Danger" }));
    await user.click(screen.getByRole("button", { name: /^reset data$/i }));
    const confirm = await screen.findByRole("button", {
      name: /^reset data$/i,
    });
    fireEvent.click(confirm);
    await waitFor(() => {
      expect(deleteAchievements).toHaveBeenCalled();
      expect(deleteProgress).toHaveBeenCalled();
    });
    expect(deleteAchievements.mock.invocationCallOrder[0]).toBeLessThan(
      deleteProgress.mock.invocationCallOrder[0]
    );
  });
});
