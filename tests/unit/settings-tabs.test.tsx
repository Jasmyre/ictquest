// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn(async () => null) }));
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/redis", () => ({ redis: {} }));
vi.mock("@/env", () => ({ env: { NODE_ENV: "test" } }));

const mutateAsync = vi.fn(async () => ({
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
        useMutation: () => ({ mutateAsync, isPending: false }),
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

describe("Settings tabs (#82)", () => {
  it("exposes a real tablist with all five tabs", () => {
    render(<SettingsTabs profile={initial} />);
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    for (const name of ["Profile", "Appearance", "Account", "Danger"]) {
      expect(screen.getByRole("tab", { name })).toBeInTheDocument();
    }
    // The Tokens tab carries its badge in its accessible name.
    expect(
      screen.getByRole("tab", { name: "TokensIn development" })
    ).toBeInTheDocument();
  });

  it("disables the Tokens tab with an In development badge", () => {
    render(<SettingsTabs profile={initial} />);
    const tokens = screen.getByRole("tab", { name: /tokens/i });
    expect(tokens).toHaveAttribute("aria-disabled", "true");
    expect(tokens).toBeDisabled();
    expect(screen.getByText("In development")).toBeInTheDocument();
  });

  it("keeps the Tokens tab unactivatable", () => {
    render(<SettingsTabs profile={initial} />);
    const tokens = screen.getByRole("tab", { name: /tokens/i });
    fireEvent.click(tokens);
    expect(tokens).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tab", { name: "Profile" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("switches live panels by keyboard and click", async () => {
    const user = userEvent.setup();
    render(<SettingsTabs profile={initial} />);
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
    render(<SettingsTabs profile={initial} />);
    expect(screen.getByLabelText(/display name/i)).toHaveValue("Learner A");
    expect(screen.getByLabelText(/handle/i)).toHaveValue("learner-a");

    const nameInput = screen.getByLabelText(/display name/i);
    fireEvent.change(nameInput, { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(
      await screen.findByText(/display name must not be empty/i)
    ).toBeInTheDocument();
    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it("renders placeholders for tickets that come later", () => {
    render(<SettingsTabs profile={initial} />);
    fireEvent.click(screen.getByRole("tab", { name: "Appearance" }));
    expect(screen.getByText(/appearance settings ship/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: "Account" }));
    expect(screen.getByText(/account settings ship/i)).toBeInTheDocument();
  });
});
