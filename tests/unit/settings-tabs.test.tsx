// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn(async () => null) }));
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/redis", () => ({ redis: {} }));
vi.mock("@/env", () => ({ env: { NODE_ENV: "test" } }));

const { mutateAsync, updateEmail, updatePassword, setPassword } = vi.hoisted(
  () => ({
    mutateAsync: vi.fn(async () => ({
      success: true as const,
      data: {
        id: "learner-a",
        name: "Learner A",
        userName: "learner-a",
        biography: null,
        isPrivate: false,
      },
    })),
    updateEmail: vi.fn(async () => ({
      success: true as const,
      data: {
        id: "learner-a",
        email: "new@example.com",
        emailVerified: null,
      },
    })),
    updatePassword: vi.fn(async () => ({ success: true as const })),
    setPassword: vi.fn(async () => ({ success: true as const })),
  })
);

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
        useMutation: () => ({ mutateAsync, isPending: false }),
      },
      updateEmail: {
        useMutation: () => ({ mutateAsync: updateEmail, isPending: false }),
      },
      updatePassword: {
        useMutation: () => ({ mutateAsync: updatePassword, isPending: false }),
      },
      setPassword: {
        useMutation: () => ({ mutateAsync: setPassword, isPending: false }),
      },
      deleteAllUserProgress: {
        useMutation: () => ({ mutateAsync: vi.fn(), isPending: false }),
      },
      deleteAllUserAchievements: {
        useMutation: () => ({ mutateAsync: vi.fn(), isPending: false }),
      },
    },
  },
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

const oauthAccount = {
  id: "oauth-only",
  email: "oauth@example.com",
  emailVerified: new Date("2026-01-01T00:00:00.000Z"),
  hasPassword: false,
};

describe("Settings tabs (#82)", () => {
  it("exposes a real tablist with all five tabs", () => {
    render(<SettingsTabs account={account} profile={initial} />);
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    for (const name of ["Profile", "Appearance", "Account", "Danger"]) {
      expect(screen.getByRole("tab", { name })).toBeInTheDocument();
    }
    // The Tokens tab carries its badge in its accessible name.
    expect(
      screen.getByRole("tab", { name: "TokensIn development" })
    ).toBeInTheDocument();
  });

  it("announces the Tokens tab as aria-disabled without native disabled", () => {
    render(<SettingsTabs account={account} profile={initial} />);
    const tokens = screen.getByRole("tab", { name: /tokens/i });
    expect(tokens).toHaveAttribute("aria-disabled", "true");
    expect(tokens).not.toBeDisabled();
    expect(tokens).not.toHaveAttribute("disabled");
    expect(screen.getByText("In development")).toBeInTheDocument();
  });

  it("keeps the Tokens tab focusable for keyboard users", () => {
    render(<SettingsTabs account={account} profile={initial} />);
    const tokens = screen.getByRole("tab", { name: /tokens/i });
    tokens.focus();
    expect(document.activeElement).toBe(tokens);
    expect(tokens).toHaveAttribute("aria-selected", "false");
  });

  it("keeps the Tokens tab unactivatable by pointer and keyboard", async () => {
    const user = userEvent.setup();
    render(<SettingsTabs account={account} profile={initial} />);
    const tokens = screen.getByRole("tab", { name: /tokens/i });
    await user.click(tokens);
    expect(tokens).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tab", { name: "Profile" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    // Keyboard activation (Enter/Space) on the focused Tokens tab selects
    // nothing either.
    tokens.focus();
    await user.keyboard("{Enter}");
    expect(tokens).toHaveAttribute("aria-selected", "false");
    await user.keyboard(" ");
    expect(tokens).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tab", { name: "Profile" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("moves focus through Tokens without selecting it on arrow keys", async () => {
    const user = userEvent.setup();
    render(<SettingsTabs account={account} profile={initial} />);
    const tokens = screen.getByRole("tab", { name: /tokens/i });
    await user.click(screen.getByRole("tab", { name: "Account" }));
    // Arrow-key navigation reaches the Tokens trigger (it stays in the
    // roving order) but the value guard refuses to select it.
    await user.keyboard("{ArrowRight}");
    expect(tokens).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tab", { name: "Account" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    // One more step reaches Danger and selects it.
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Danger" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(tokens).toHaveAttribute("aria-selected", "false");
  });

  it("renders no activatable panel for the Tokens tab (#86)", async () => {
    const user = userEvent.setup();
    render(<SettingsTabs account={account} profile={initial} />);
    await user.click(screen.getByRole("tab", { name: "Danger" }));
    // Every live tab owns a tabpanel; the disabled Tokens trigger points at
    // no panel element, so there is nothing to activate.
    const tokens = screen.getByRole("tab", { name: /tokens/i });
    const panelId = tokens.getAttribute("aria-controls");
    expect(panelId).toBeTruthy();
    expect(
      panelId ? document.getElementById(panelId) : null
    ).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Danger" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("keeps grouped-card parity on mobile plus sidebar tablist on desktop (#86)", () => {
    render(<SettingsTabs account={account} profile={initial} />);
    const tablist = screen.getByRole("tablist");
    for (const token of [
      "rounded-xl",
      "border",
      "bg-card",
      "motion-reduce:transition-none",
      "md:w-56",
    ]) {
      expect(tablist).toHaveClass(token);
    }
    const tokens = screen.getByRole("tab", { name: /tokens/i });
    for (const token of [
      "focus-visible:ring-2",
      "motion-reduce:transition-none",
    ]) {
      expect(tokens).toHaveClass(token);
    }
  });

  it("switches live panels by keyboard and click", async () => {
    const user = userEvent.setup();
    render(<SettingsTabs account={account} profile={initial} />);
    await user.click(screen.getByRole("tab", { name: "Profile" }));
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Appearance" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await user.click(screen.getByRole("tab", { name: "Danger" }));
    expect(screen.getByRole("tab", { name: "Danger" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("renders the profile form with inline validation", async () => {
    render(<SettingsTabs account={account} profile={initial} />);
    expect(screen.getByLabelText(/display name/i)).toHaveValue("Learner A");
    expect(screen.getByLabelText(/handle/i)).toHaveValue("learner-a");

    const nameInput = screen.getByLabelText(/display name/i);
    fireEvent.change(nameInput, { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
    expect(
      await screen.findByText(/display name must not be empty/i)
    ).toBeInTheDocument();
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it("renders the live Account panel (#84)", async () => {
    const user = userEvent.setup();
    render(<SettingsTabs account={account} profile={initial} />);
    await user.click(screen.getByRole("tab", { name: "Account" }));
    expect(screen.getByLabelText(/email address/i)).toHaveValue(
      "learner@example.com"
    );
    expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /set password/i })
    ).not.toBeInTheDocument();
  });

  it("renders set-password with no current field for OAuth-only learners (#84)", async () => {
    const user = userEvent.setup();
    render(<SettingsTabs account={oauthAccount} profile={initial} />);
    await user.click(screen.getByRole("tab", { name: "Account" }));
    expect(
      screen.getByRole("button", { name: /set password/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText(/current password/i)
    ).not.toBeInTheDocument();
  });

  it("shows account failures inline without throwing (#84)", async () => {
    const user = userEvent.setup();
    updateEmail.mockRejectedValueOnce(new Error("That email is taken."));
    render(<SettingsTabs account={account} profile={initial} />);
    await user.click(screen.getByRole("tab", { name: "Account" }));
    await user.click(screen.getByRole("button", { name: /save email/i }));
    expect(await screen.findByText("That email is taken.")).toBeInTheDocument();
  });

  it("renders the live Danger panel with no placeholders remaining (#85)", async () => {
    const user = userEvent.setup();
    render(<SettingsTabs account={account} profile={initial} />);
    await user.click(screen.getByRole("tab", { name: "Danger" }));
    expect(screen.getByText(/danger zone/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/ship in a later ticket/i)
    ).not.toBeInTheDocument();
  });
});
