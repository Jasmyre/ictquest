import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = join(__dirname, "..", "..");

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

const DOCS = [
  "docs/architecture.md",
  "docs/database.md",
  "docs/auth.md",
  "docs/api.md",
  "memory-bank/systemPatterns.md",
];

/**
 * Docs-correction spec gate (Slice 7, #64).
 *
 * The five corrected files must carry no example-resource entity claims.
 * `PostgreSQL` (the database engine) and the generic HTTP-methods line are
 * not entity claims, so they are excluded before matching.
 */
function stripNonEntityMatches(content: string): string {
  return content
    .split("\n")
    .filter((line) => !line.includes("HTTP methods"))
    .join("\n")
    .replaceAll("PostgreSQL", "")
    .replaceAll("Postgres", "");
}

describe("docs truth (Slice 7, #64)", () => {
  it.each(
    DOCS
  )("contains no example-resource entity claims: %s", (rel: string) => {
    const body = stripNonEntityMatches(read(rel));
    expect(body).not.toMatch(/\bposts?\b/i);
  });

  it("names the ICTQuest truth in every corrected file", () => {
    const bodies = DOCS.map(read).join("\n");
    for (const term of [
      "dashboard.getDashboardById",
      "dashboard.getMyDashboard",
      "biography",
      "isPrivate",
      "implicit",
      "_RoleToUser",
      "ensureDefaultRole",
    ]) {
      expect(bodies).toContain(term);
    }
  });

  it("carries per-file before/after maps plus a deleted-example reference list", () => {
    for (const rel of DOCS) {
      const body = read(rel);
      expect(body).toContain("before/after");
      expect(body).toContain("Deleted-example reference list");
    }
  });

  it("records role-join plus dashboard-rename supersede notes on the ADRs", () => {
    expect(
      read("docs/adr/0001-users-must-have-at-least-one-role.md")
    ).toContain("Supersede note");
    expect(
      read("docs/adr/0002-versioned-rest-openapi-and-bearer-tokens.md")
    ).toContain("Supersede note");
  });

  it("documents the versioned dashboard path with no legacy stats path", () => {
    const api = read("docs/api.md");
    expect(api).toContain("/api/v1/dashboard/{id}");
    expect(api).toContain("no shim");
    const arch = read("docs/architecture.md");
    expect(arch).toContain("/api/v1/dashboard/{id}");
  });
});
