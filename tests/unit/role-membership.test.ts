import { describe, expect, it, vi } from "vitest";
import {
  connectMembership,
  disconnectMembership,
} from "@/server/services/role-membership";

function fakeDb(behavior?: {
  connectThrowsP2002Once?: boolean;
  disconnectThrows?: unknown;
}) {
  let connectCalls = 0;
  return {
    db: {
      user: {
        update: vi.fn(({ data }: { data: Record<string, unknown> }) => {
          if ("roles" in data && typeof data.roles === "object") {
            const op = data.roles as Record<string, unknown>;
            if ("connect" in op) {
              connectCalls += 1;
              if (behavior?.connectThrowsP2002Once && connectCalls === 2) {
                return Promise.reject({ code: "P2002" });
              }
              return Promise.resolve({ id: "u1" });
            }
            if ("disconnect" in op) {
              if (behavior?.disconnectThrows) {
                return Promise.reject(behavior.disconnectThrows);
              }
              return Promise.resolve({ id: "u1" });
            }
          }
          return Promise.resolve({ id: "u1" });
        }),
      },
    },
  };
}

describe("role membership connect/disconnect idempotency (#59)", () => {
  it("connect resolves connected twice (second via unique-violation tolerance)", async () => {
    const { db } = fakeDb({ connectThrowsP2002Once: true });
    const typed = db as unknown as Parameters<typeof connectMembership>[0];

    const first = await connectMembership(typed, "u1", "r-user");
    expect(first).toEqual({
      success: true,
      data: { userId: "u1", roleId: "r-user", status: "connected" },
    });

    // Repeat connect hits the join PK conflict - still resolves connected.
    const second = await connectMembership(typed, "u1", "r-user");
    expect(second).toEqual(first);
  });

  it("disconnect resolves disconnected twice (repeat is a no-op)", async () => {
    const { db } = fakeDb();
    const typed = db as unknown as Parameters<typeof disconnectMembership>[0];

    const first = await disconnectMembership(typed, "u1", "r-user");
    expect(first).toEqual({
      success: true,
      data: { userId: "u1", roleId: "r-user", status: "disconnected" },
    });

    const second = await disconnectMembership(typed, "u1", "r-user");
    expect(second).toEqual(first);
  });

  it("disconnect maps unexpected failures to INTERNAL_SERVER_ERROR", async () => {
    const boom = new Error("db down");
    const { db } = fakeDb({ disconnectThrows: boom });
    const typed = db as unknown as Parameters<typeof disconnectMembership>[0];
    await expect(
      disconnectMembership(typed, "u1", "r-x")
    ).rejects.toMatchObject({ code: "INTERNAL_SERVER_ERROR" });
  });
});
