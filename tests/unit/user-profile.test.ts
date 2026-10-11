import { TRPCError } from "@trpc/server";
import { describe, expect, it, vi } from "vitest";
import {
  BIOGRAPHY_MAX_LENGTH,
  DISPLAY_NAME_MAX_LENGTH,
  getOwnProfile,
  normalizeBiography,
  normalizeDisplayName,
  normalizeUserName,
  USER_NAME_MAX_LENGTH,
  updateOwnProfile,
} from "@/server/services/user-profile";

function fakeDb(initial: {
  name: string;
  userName: string | null;
  biography: string | null;
  isPrivate: boolean;
}) {
  const state = { id: "u1", ...initial };
  return {
    state,
    db: {
      user: {
        findUnique: vi.fn(() => Promise.resolve({ ...state })),
        update: vi.fn(({ data }: { data: Record<string, unknown> }) => {
          Object.assign(state, data);
          return Promise.resolve({ ...state });
        }),
      },
    },
  };
}

const seed = {
  name: "Learner One",
  userName: "learner-one",
  biography: null as string | null,
  isPrivate: false,
};

describe("user-profile normalization (#58)", () => {
  it("maps empty and whitespace-only biography to unset (null)", () => {
    expect(normalizeBiography("")).toBeNull();
    expect(normalizeBiography("   ")).toBeNull();
    expect(normalizeBiography(null)).toBeNull();
  });

  it("passes through undefined so updates can skip the field", () => {
    expect(normalizeBiography(undefined)).toBeUndefined();
  });

  it("trims surrounding whitespace", () => {
    expect(normalizeBiography("  hello  ")).toBe("hello");
  });

  it("accepts exactly 500 characters and rejects 501", () => {
    expect(normalizeBiography("a".repeat(BIOGRAPHY_MAX_LENGTH))).toBe(
      "a".repeat(BIOGRAPHY_MAX_LENGTH)
    );
    expect(() =>
      normalizeBiography("a".repeat(BIOGRAPHY_MAX_LENGTH + 1))
    ).toThrowError(TRPCError);
  });

  it("reads pre-migration rows back as unset plus public", async () => {
    const { db } = fakeDb(seed);
    const result = await getOwnProfile(
      db as unknown as Parameters<typeof getOwnProfile>[0],
      "u1"
    );
    expect(result).toEqual({
      success: true,
      data: { id: "u1", ...seed },
    });
  });

  it("normalizes identity fields (trim, empty rules, limits)", () => {
    expect(normalizeDisplayName("  Ada  ")).toBe("Ada");
    expect(() => normalizeDisplayName("   ")).toThrowError(TRPCError);
    expect(normalizeDisplayName("a".repeat(DISPLAY_NAME_MAX_LENGTH))).toBe(
      "a".repeat(DISPLAY_NAME_MAX_LENGTH)
    );
    expect(() =>
      normalizeDisplayName("a".repeat(DISPLAY_NAME_MAX_LENGTH + 1))
    ).toThrowError(TRPCError);
    expect(normalizeUserName("")).toBeNull();
    expect(normalizeUserName("   ")).toBeNull();
    expect(normalizeUserName(null)).toBeNull();
    expect(normalizeUserName("  handle  ")).toBe("handle");
    expect(() =>
      normalizeUserName("a".repeat(USER_NAME_MAX_LENGTH + 1))
    ).toThrowError(TRPCError);
    expect(normalizeUserName(undefined)).toBeUndefined();
    expect(normalizeDisplayName(undefined)).toBeUndefined();
  });
});

describe("user-profile owner update round-trip (#58)", () => {
  it("sets and clears biography while toggling privacy", async () => {
    const { db, state } = fakeDb(seed);
    const typed = db as unknown as Parameters<typeof updateOwnProfile>[0];

    const set = await updateOwnProfile(typed, "u1", {
      biography: "  I love ICT  ",
      isPrivate: true,
    });
    expect(set.data).toEqual({
      id: "u1",
      name: "Learner One",
      userName: "learner-one",
      biography: "I love ICT",
      isPrivate: true,
    });
    expect(state.biography).toBe("I love ICT");

    const cleared = await updateOwnProfile(typed, "u1", {
      biography: "",
      isPrivate: false,
    });
    expect(cleared.data).toEqual({
      id: "u1",
      name: "Learner One",
      userName: "learner-one",
      biography: null,
      isPrivate: false,
    });
  });

  it("updates display name and handle", async () => {
    const { db } = fakeDb(seed);
    const typed = db as unknown as Parameters<typeof updateOwnProfile>[0];
    const result = await updateOwnProfile(typed, "u1", {
      name: "  New Name  ",
      userName: "new-handle",
    });
    expect(result.data).toMatchObject({
      name: "New Name",
      userName: "new-handle",
      biography: null,
    });
  });

  it("leaves untouched fields alone on partial update", async () => {
    const { db } = fakeDb({ ...seed, biography: "keep me", isPrivate: true });
    const typed = db as unknown as Parameters<typeof updateOwnProfile>[0];
    const result = await updateOwnProfile(typed, "u1", { isPrivate: false });
    expect(result.data.biography).toBe("keep me");
    expect(result.data.isPrivate).toBe(false);
    expect(result.data.name).toBe("Learner One");
  });
});
