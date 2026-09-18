import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn(async () => null) }));
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/redis", () => ({ redis: {} }));
vi.mock("@/env", () => ({ env: { NODE_ENV: "test" } }));

const ROOT = join(__dirname, "..", "..");

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

function exists(rel: string): boolean {
  return existsSync(join(ROOT, rel));
}

describe("Migration 18 — Versioned REST core plus PAT plus OpenAPI", () => {
  it("stores PATs hash-only with mint/verify helpers covering expiry and revocation", async () => {
    expect(exists("src/server/auth/personal-access-tokens.ts")).toBe(true);
    const src = read("src/server/auth/personal-access-tokens.ts");
    expect(src).toContain("hashPersonalAccessToken");
    expect(src).toContain("mintPersonalAccessToken");
    expect(src).toContain("verifyPersonalAccessToken");
    expect(src).toContain("tokenHash");
    // Plain token must never be persisted — only its hash.
    expect(src).not.toMatch(/tokenHash:\s*plain/i);

    const mod = await import("@/server/auth/personal-access-tokens");

    type PatRow = {
      id: string;
      userId: string;
      name: string;
      tokenHash: string;
      scopes: string[];
      expiresAt: Date | null;
      revokedAt: Date | null;
      lastUsedAt: Date | null;
    };

    function fakeDb() {
      const rows: PatRow[] = [];
      return {
        rows,
        personalAccessToken: {
          create(args: { data: Omit<PatRow, "id" | "lastUsedAt"> }) {
            const row: PatRow = {
              id: `pat-${rows.length + 1}`,
              lastUsedAt: null,
              ...args.data,
            };
            rows.push(row);
            return Promise.resolve(row);
          },
          findUnique(args: { where: { tokenHash: string } }) {
            return Promise.resolve(
              rows.find((r) => r.tokenHash === args.where.tokenHash) ?? null
            );
          },
          update(args: {
            where: { id: string };
            data: Partial<PatRow>;
          }) {
            const row = rows.find((r) => r.id === args.where.id);
            if (!row) {
              throw new Error("not found");
            }
            Object.assign(row, args.data);
            return Promise.resolve(row);
          },
        },
      };
    }

    // Mint returns the plain token once; storage keeps only the hash.
    const dbA = fakeDb();
    const minted = await mod.mintPersonalAccessToken(dbA as never, "user-1", {
      name: "ci-token",
    });
    expect(minted.plainToken.length).toBeGreaterThan(16);
    expect(minted.record.tokenHash).not.toContain(minted.plainToken);
    expect(dbA.rows).toHaveLength(1);
    expect(dbA.rows[0]?.tokenHash).toBe(
      mod.hashPersonalAccessToken(minted.plainToken)
    );

    // Verify succeeds and stamps lastUsedAt.
    const verified = await mod.verifyPersonalAccessToken(
      dbA as never,
      minted.plainToken
    );
    expect(verified?.userId).toBe("user-1");
    expect(dbA.rows[0]?.lastUsedAt).toBeInstanceOf(Date);

    // Unknown token fails closed.
    await expect(
      mod.verifyPersonalAccessToken(dbA as never, "bogus-token")
    ).resolves.toBeNull();

    // Expired tokens fail closed.
    const dbB = fakeDb();
    const expired = await mod.mintPersonalAccessToken(dbB as never, "user-2", {
      name: "old",
      expiresAt: new Date(Date.now() - 1000),
    });
    await expect(
      mod.verifyPersonalAccessToken(dbB as never, expired.plainToken)
    ).resolves.toBeNull();

    // Revoked tokens fail closed.
    const dbC = fakeDb();
    const revoked = await mod.mintPersonalAccessToken(dbC as never, "user-3", {
      name: "revoked",
    });
    await dbC.personalAccessToken.update({
      where: { id: revoked.record.id },
      data: { revokedAt: new Date() },
    });
    await expect(
      mod.verifyPersonalAccessToken(dbC as never, revoked.plainToken)
    ).resolves.toBeNull();
  });

  it("annotates me/progress/achievement procedures with method/path/protection plus output schemas", async () => {
    const trpcSrc = read("src/server/api/trpc.ts");
    expect(trpcSrc).toContain("OpenApiMeta");
    expect(trpcSrc).toContain(".meta<OpenApiMeta>()");

    for (const rel of [
      "src/server/api/routers/user.ts",
      "src/server/api/routers/progress.ts",
      "src/server/api/routers/achievement.ts",
    ]) {
      const src = read(rel);
      expect(src).toContain("openapi");
      expect(src).toContain("method");
      expect(src).toContain("path");
      expect(src).toContain(".output(");
    }

    const userSrc = read("src/server/api/routers/user.ts");
    expect(userSrc).toContain("/v1/me");

    const progressSrc = read("src/server/api/routers/progress.ts");
    expect(progressSrc).toContain("/v1/me/progress");

    const achievementSrc = read("src/server/api/routers/achievement.ts");
    expect(achievementSrc).toContain("/v1/me/achievements");
  });

  it("serves versioned REST through a force-dynamic catch-all with bearer-or-cookie auth", () => {
    expect(exists("src/app/api/v1/[...rest]/route.ts")).toBe(true);
    const rest = read("src/app/api/v1/[...rest]/route.ts");
    expect(rest).toContain('force-dynamic"');
    expect(rest).toContain("createOpenApiFetchHandler");
    expect(rest).toContain("/api/v1");
    // Per-user responses must never be long-cached.
    expect(rest).toMatch(/no-store|private/);

    const v1CtxExists =
      exists("src/server/api/v1-context.ts") ||
      read("src/server/api/trpc.ts").includes("Bearer");
    expect(v1CtxExists).toBe(true);

    const ctxSrc = exists("src/server/api/v1-context.ts")
      ? read("src/server/api/v1-context.ts")
      : read("src/server/api/trpc.ts");
    expect(ctxSrc).toMatch(/Bearer/i);
    expect(ctxSrc).toContain("verifyPersonalAccessToken");

    // Batch tRPC stays cookie-only: no bearer wiring in the batch handler.
    const batch = read("src/app/api/trpc/[trpc]/route.ts");
    expect(batch).not.toMatch(/Bearer|verifyPersonalAccessToken/);
  });

  it("serves public OpenAPI JSON with gated interactive docs", () => {
    expect(exists("src/app/api/v1/openapi.json/route.ts")).toBe(true);
    const doc = read("src/app/api/v1/openapi.json/route.ts");
    const helper = read("src/server/api/openapi.ts");
    expect(`${doc}\n${helper}`).toContain("generateOpenApiDocument");
    expect(`${doc}\n${helper}`).toContain("securitySchemes");
    expect(`${doc}\n${helper}`).toMatch(/Bearer|bearer/i);

    // Interactive docs are dev-or-admin-only, never in the default bundle.
    const adminDocs = exists("src/app/(admin)/admin/api-docs/page.tsx");
    const devDocs =
      exists("src/app/api/v1/docs/route.ts") ||
      exists("src/app/api-docs/page.tsx");
    expect(adminDocs || devDocs).toBe(true);

    if (adminDocs) {
      const src = read("src/app/(admin)/admin/api-docs/page.tsx");
      expect(src).toMatch(/Scalar|Redoc|openapi\.json|api-docs/i);
      // Client-only docs UI so the Scalar bundle never lands in prod server output.
      expect(src).toMatch(/dynamic|\"use client\"|lazy|Suspense/i);
    }
  });

  it("generates a public OpenAPI document with the v1 operation table", async () => {
    const { buildOpenApiDocument } = await import("@/server/api/openapi");
    const document = buildOpenApiDocument(
      "http://localhost:3000"
    ) as unknown as { paths?: Record<string, unknown> };
    const paths = document.paths ?? {};
    expect(Object.keys(paths).length).toBeGreaterThan(0);
    const flat = JSON.stringify(paths);
    expect(flat).toContain("/v1/me");
    expect(flat).toContain("/v1/me/progress");
    expect(flat).toContain("/v1/me/achievements");
  });

  it("bypasses proxy guards for versioned REST so handlers return 401, not redirects", () => {
    const routesSrc = read("src/routes.ts");
    expect(routesSrc).toContain("/api/v1");
    expect(routesSrc).toContain("isV1ApiRoute");
    const proxySrc = read("src/proxy.ts");
    expect(proxySrc).toContain("isV1ApiRoute");
  });
});
