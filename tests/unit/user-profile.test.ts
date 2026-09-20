import { TRPCError } from "@trpc/server";
import { describe, expect, it, vi } from "vitest";
import {
  BIOGRAPHY_MAX_LENGTH,
  getOwnProfile,
  normalizeBiography,
  updateOwnProfile,
} from "@/server/services/user-profile";

function fakeDb(initial: { biography: string | null; isPrivate: boolean }) {
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
    const { db } = fakeDb({ biography: null, isPrivate: false });
    const result = await getOwnProfile(
      db as unknown as Parameters<typeof getOwnProfile>[0],
      "u1"
    );
    expect(result).toEqual({
      success: true,
      data: { id: "u1", biography: null, isPrivate: false },
    });
  });
});

describe("user-profile owner update round-trip (#58)", () => {
  it("sets and clears biography while toggling privacy", async () => {
    const { db, state } = fakeDb({ biography: null, isPrivate: false });
    const typed = db as unknown as Parameters<typeof updateOwnProfile>[0];

    const set = await updateOwnProfile(typed, "u1", {
      biography: "  I love ICT  ",
      isPrivate: true,
    });
    expect(set.data).toEqual({
      id: "u1",
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
      biography: null,
      isPrivate: false,
    });
  });

  it("leaves untouched fields alone on partial update", async () => {
    const { db } = fakeDb({ biography: "keep me", isPrivate: true });
    const typed = db as unknown as Parameters<typeof updateOwnProfile>[0];
    const result = await updateOwnProfile(typed, "u1", { isPrivate: false });
    expect(result.data.biography).toBe("keep me");
    expect(result.data.isPrivate).toBe(false);
  });
});
