import { useRouter } from "next/navigation";
import { describe, expect, it, vi } from "vitest";

describe("sample", () => {
  it("adds two numbers (ported placeholder)", () => {
    expect(2 + 3).toBe(5);
  });

  it("serves the stub user via the MSW mock server", async () => {
    const res = await fetch("https://api.example.com/user");
    expect(res.ok).toBe(true);
    await expect(res.json()).resolves.toMatchObject({
      id: "abc-123",
      firstName: "John",
    });
  });

  it("mocks next/navigation router in the new harness style", () => {
    const router = useRouter();
    expect(vi.isMockFunction(router.push)).toBe(true);
    expect(vi.isMockFunction(router.replace)).toBe(true);
    expect(vi.isMockFunction(router.refresh)).toBe(true);
    expect(vi.isMockFunction(router.prefetch)).toBe(true);
  });
});
