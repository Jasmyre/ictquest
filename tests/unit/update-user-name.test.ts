import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/server/services/user-profile", () => ({
  updateOwnProfile: vi.fn(async () => ({ success: true as const })),
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { updateUserName } from "@/actions/update-user-name";
import { auth } from "@/auth";
import { updateOwnProfile } from "@/server/services/user-profile";

const authMock = vi.mocked(auth);
const updateOwnProfileMock = vi.mocked(updateOwnProfile);

describe("updateUserName legacy action (spec #81)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws when signed out instead of silently returning", async () => {
    authMock.mockResolvedValue(null as never);
    await expect(updateUserName("Learner A")).rejects.toThrow(
      "You must be signed in."
    );
    expect(updateOwnProfileMock).not.toHaveBeenCalled();
  });

  it("throws when the session carries no user id", async () => {
    authMock.mockResolvedValue({ user: {} } as never);
    await expect(updateUserName("Learner A")).rejects.toThrow(
      "You must be signed in."
    );
    expect(updateOwnProfileMock).not.toHaveBeenCalled();
  });

  it("routes signed-in writes through the profile service", async () => {
    authMock.mockResolvedValue({ user: { id: "learner-a" } } as never);
    await updateUserName("Learner A");
    expect(updateOwnProfileMock).toHaveBeenCalledWith(
      expect.anything(),
      "learner-a",
      { userName: "Learner A" }
    );
  });
});
