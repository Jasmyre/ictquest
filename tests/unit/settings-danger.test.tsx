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
const toast = vi.fn();

vi.mock("@/trpc/react", () => ({
  api: {
    useUtils: () => ({
      user: {
        getProfile: { invalidate: vi.fn() },
        getAccount: { invalidate: vi.fn() },
      },
    }),
    user: {
      updateProfile: {
        useMutation: () => ({ mutateAsync: profileMutate, isPending: false }),
      },
      updateEmail: {
        useMutation: () => ({ mutateAsync: vi.fn(), isPending: false }),
      },
      updatePassword: {
        useMutation: () => ({ mutateAsync: vi.fn(), isPending: false }),
      },
      setPassword: {
        useMutation: () => ({ mutateAsync: vi.fn(), isPending: false }),
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

vi.mock("@/hooks/use-toast", () => ({
  toast: (...args: unknown[]) => toast(...args),
}));

import { SettingsTabs } from "@/components/settings/settings-tabs";

const initial = {
  id: "learner-a",
  name: "Learner A",
  userName: "learner-a",
  biography: null as string | null,
  isPrivate: false,
};

const account = {
  id: "learner-a",
  email: "learner@example.com",
  emailVerified: new Date("2026-01-01T00:00:00.000Z"),
  hasPassword: true,
};

async function openDanger() {
  const user = userEvent.setup();
  render(<SettingsTabs account={account} profile={initial} />);
  await user.click(screen.getByRole("tab", { name: "Danger" }));
  return user;
}

describe("Settings Danger tab (#85)", () => {
  it("renders two separate delete actions, each with its own confirm flow", async () => {
    await openDanger();
    expect(
      screen.getByRole("button", { name: "Delete learning progress" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Delete achievements" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /^reset data$/i })
    ).not.toBeInTheDocument();
  });

  it("deletes only progress through the progress confirm flow", async () => {
    deleteProgress.mockClear();
    deleteAchievements.mockClear();
    await openDanger();
    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "Delete learning progress" }));
    expect(
      await screen.findByText(/permanently delete your learning progress/i)
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Delete progress" }));
    await waitFor(() => {
      expect(deleteProgress).toHaveBeenCalled();
    });
    expect(deleteAchievements).not.toHaveBeenCalled();
  });

  it("deletes only achievements through the achievements confirm flow", async () => {
    deleteProgress.mockClear();
    deleteAchievements.mockClear();
    await openDanger();
    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "Delete achievements" }));
    expect(
      await screen.findByText(/permanently delete your achievements/i)
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: /^delete achievements$/i })
    );
    await waitFor(() => {
      expect(deleteAchievements).toHaveBeenCalled();
    });
    expect(deleteProgress).not.toHaveBeenCalled();
  });

  it("reports a progress failure per-action without touching achievements", async () => {
    deleteProgress.mockClear();
    deleteAchievements.mockClear();
    toast.mockClear();
    deleteProgress.mockRejectedValueOnce(new Error("Progress store is down."));
    await openDanger();
    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "Delete learning progress" }));
    fireEvent.click(
      await screen.findByRole("button", { name: "Delete progress" })
    );
    await waitFor(() => {
      expect(deleteProgress).toHaveBeenCalled();
    });
    expect(deleteAchievements).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({ description: "Progress store is down." })
      );
    });
  });
});
