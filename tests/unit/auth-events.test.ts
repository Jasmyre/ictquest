import { readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

const ROOT = join(__dirname, "..", "..");

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

const { updateMock, ensureDefaultRoleMock } = vi.hoisted(() => ({
  updateMock: vi.fn(),
  ensureDefaultRoleMock: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: { user: { update: updateMock } },
}));

vi.mock("@/lib/roles", () => ({
  ensureDefaultRole: ensureDefaultRoleMock,
}));

describe("Auth events — linkAccount verifies email, createUser grants default", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("wires both events through src/auth.ts", () => {
    const authSrc = read("src/auth.ts");
    expect(authSrc).toContain("authEvents");
    expect(authSrc).toContain("@/auth-events");
    expect(authSrc).not.toContain("linkAccount({ user }) {");
  });

  it("linkAccount stamps emailVerified and ignores missing ids", async () => {
    const { authEvents } = await import("@/auth-events");
    await authEvents.linkAccount({ user: { id: "user-1" } });
    expect(updateMock).toHaveBeenCalledTimes(1);
    expect(updateMock).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: { emailVerified: expect.any(Date) },
    });

    updateMock.mockClear();
    await authEvents.linkAccount({ user: { id: null } });
    await authEvents.linkAccount({ user: {} });
    expect(updateMock).not.toHaveBeenCalled();
  });

  it("createUser grants the default role and ignores missing ids", async () => {
    const { authEvents } = await import("@/auth-events");
    await authEvents.createUser({ user: { id: "user-2" } });
    expect(ensureDefaultRoleMock).toHaveBeenCalledTimes(1);
    expect(ensureDefaultRoleMock).toHaveBeenCalledWith("user-2");

    ensureDefaultRoleMock.mockClear();
    await authEvents.createUser({ user: { id: null } });
    await authEvents.createUser({ user: {} });
    expect(ensureDefaultRoleMock).not.toHaveBeenCalled();
  });
});
