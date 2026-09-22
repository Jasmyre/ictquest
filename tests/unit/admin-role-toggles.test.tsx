// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn(async () => null) }));
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/redis", () => ({ redis: {} }));
vi.mock("@/env", () => ({ env: { NODE_ENV: "test" } }));
vi.mock("@/trpc/react", () => ({
  api: {
    useUtils: () => ({ admin: { listUsers: { invalidate: vi.fn() } } }),
    admin: {
      grantRole: { useMutation: () => ({ mutateAsync: vi.fn() }) },
      revokeRole: { useMutation: () => ({ mutateAsync: vi.fn() }) },
    },
  },
}));

import {
  AdminRoleToggles,
  isRoleToggleDisabled,
} from "@/components/admin-role-toggles";

describe("Admin role toggles (#71)", () => {
  it("never enables the USER floor toggle", () => {
    expect(isRoleToggleDisabled(["USER"], "USER")).toBe(true);
    expect(isRoleToggleDisabled(["ADMIN", "USER"], "USER")).toBe(true);
    expect(isRoleToggleDisabled(["ADMIN"], "USER")).toBe(true);
  });

  it("locks the only remaining membership toggle", () => {
    expect(isRoleToggleDisabled(["ADMIN"], "ADMIN")).toBe(true);
    expect(isRoleToggleDisabled(["ADMIN", "USER"], "ADMIN")).toBe(false);
    expect(isRoleToggleDisabled(["USER"], "MODERATOR")).toBe(false);
  });

  it("renders USER checked and disabled with no submittable last-removal", () => {
    render(<AdminRoleToggles initialRoles={["USER"]} userId="learner-a" />);
    const userToggle = screen.getByLabelText("USER role for user learner-a");
    expect(userToggle).toBeChecked();
    expect(userToggle).toBeDisabled();
    // Granting a new role stays enabled.
    expect(
      screen.getByLabelText("ADMIN role for user learner-a")
    ).toBeEnabled();
  });

  it("disables unchecking the sole non-floor role", () => {
    render(<AdminRoleToggles initialRoles={["ADMIN"]} userId="admin-1" />);
    expect(screen.getByLabelText("ADMIN role for user admin-1")).toBeDisabled();
    expect(screen.getByLabelText("USER role for user admin-1")).toBeDisabled();
  });
});
