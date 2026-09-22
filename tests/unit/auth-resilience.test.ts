import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = join(__dirname, "..", "..");

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

function jwtBlock(src: string): string {
  const start = src.indexOf("async jwt(");
  if (start === -1) {
    throw new Error("jwt callback not found in src/auth.ts");
  }
  return src.slice(start);
}

function authorizeBlock(src: string): string {
  const start = src.indexOf("async authorize(");
  if (start === -1) {
    throw new Error("authorize not found in src/auth.config.ts");
  }
  return src.slice(start);
}

describe("Auth resilience — DB/env faults degrade, never Configuration (#75 follow-up)", () => {
  it("jwt returns the existing token when the DB lookup fails", () => {
    const block = jwtBlock(read("src/auth.ts"));
    expect(block).toContain("try {");
    expect(block).toContain("catch");
    expect(block).toContain("return token;");
  });

  it("authorize returns null instead of throwing on unexpected faults", () => {
    const block = authorizeBlock(read("src/auth.config.ts"));
    expect(block).toContain("try {");
    expect(block).toContain("catch");
    expect(block).toContain("return null;");
  });

  it("register returns an error payload instead of throwing", () => {
    const src = read("src/actions/register.ts");
    expect(src).toContain("try {");
    expect(src).toContain("catch");
    expect(src).toMatch(/return \{ error: /);
  });

  it("the /auth page wraps the search-param form in a Suspense boundary", () => {
    const src = read("src/app/auth/page.tsx");
    expect(src).toContain("Suspense");
    expect(src).toMatch(/<Suspense/);
  });
});
