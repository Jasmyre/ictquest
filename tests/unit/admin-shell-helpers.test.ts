import { describe, expect, it } from "vitest";
import { getSectionTitle, mapSessionToNavUser } from "@/lib/shell";

describe("admin shell helpers", () => {
  it("resolves direct section titles", () => {
    const map = { "/admin": "Admin", "/admin/users": "Users" };
    expect(getSectionTitle("/admin", map, "Admin")).toBe("Admin");
    expect(getSectionTitle("/admin/users", map, "Admin")).toBe("Users");
  });

  it("falls back to the last path segment", () => {
    expect(getSectionTitle("/admin/api-docs", {}, "Admin")).toBe("Api docs");
    expect(getSectionTitle("/", {}, "Admin")).toBe("Admin");
  });

  it("resolves nested routes to their parent section", () => {
    const map = { "/admin": "Admin", "/admin/users": "Users" };
    expect(getSectionTitle("/admin/users/123", map, "Admin")).toBe("Users");
  });

  it("maps a session user to nav footer data", () => {
    expect(mapSessionToNavUser(undefined)).toBeNull();
    const user = {
      email: "a@example.com",
      name: "Ada",
    } as unknown as NonNullable<Parameters<typeof mapSessionToNavUser>[0]>;
    expect(mapSessionToNavUser(user)).toEqual({
      email: "a@example.com",
      image: undefined,
      userName: "Ada",
    });
  });

  it("falls back to email when the name is missing", () => {
    const user = {
      email: "a@example.com",
      name: null,
    } as unknown as NonNullable<Parameters<typeof mapSessionToNavUser>[0]>;
    expect(mapSessionToNavUser(user)?.userName).toBe("a@example.com");
  });
});
