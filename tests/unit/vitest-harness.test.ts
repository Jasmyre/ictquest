import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = join(__dirname, "..", "..");

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

describe("Vitest harness — fast worker startup without dropping isolation", () => {
  it("runs unit tests in node by default, jsdom only for component files", () => {
    const config = read("vitest.config.mts");
    expect(config).toContain('environment: "node"');
    expect(config).not.toMatch(/environment:\s*"jsdom"/);
    // Component (.tsx) tests opt into jsdom via a per-file pragma (Vitest 5
    // has no environmentMatchGlobs): every .tsx test must carry it.
    const unitDir = join(ROOT, "tests", "unit");
    const tsxFiles = readdirSync(unitDir).filter((f) => f.endsWith(".tsx"));
    expect(tsxFiles.length).toBeGreaterThan(0);
    for (const file of tsxFiles) {
      expect(read(join("tests", "unit", file))).toContain(
        "@vitest-environment jsdom"
      );
    }
  });

  it("keeps worker isolation on (no isolate:false / single-fork shortcuts)", () => {
    const config = read("vitest.config.mts");
    expect(config).not.toContain("isolate: false");
    expect(config).not.toContain("isolate:false");
    expect(config).not.toContain("singleFork");
    expect(config).not.toContain("fileParallelism: false");
  });

  it("keeps the unit setup file light: no static MSW/jest-dom/DB imports", () => {
    const setup = read("tests/unit/setup.ts");
    // Heavy or side-effectful modules must load lazily (dynamic import),
    // never at the top level of the setup file that every worker runs.
    expect(setup).not.toMatch(/^\s*import\s+["']msw/m);
    // `import type` is erased at build time (zero runtime cost) and is the
    // only static msw import allowed — the runtime module stays lazy.
    expect(setup).toMatch(/^\s*import\s+type\s+.*from\s+["']msw/m);
    expect(setup).not.toMatch(/^\s*import(?!\s+type\b).*from\s+["']msw/m);
    expect(setup).not.toMatch(/^\s*import\s+["']@testing-library\/jest-dom/m);
    expect(setup).not.toMatch(/^\s*import\s.*@\/mocks\/server/m);
    expect(setup).not.toMatch(/from\s+["']@\/mocks\/server["']/);
    expect(setup).not.toMatch(/^\s*import\s+.*prisma/i);
    expect(setup).not.toContain("@/lib/db");
    // Laziness itself is pinned: the server arrives via dynamic import.
    expect(setup).toMatch(/await import\(["']@\/mocks\/server["']\)/);
    // The next/navigation stub stays (cheap, synchronous, no deps).
    expect(setup).toContain("next/navigation");
  });

  it("clears mocks plus stubs between tests so files stay order-independent", () => {
    const config = read("vitest.config.mts");
    expect(config).toContain("clearMocks: true");
    expect(config).toContain("restoreMocks: true");
    expect(config).toContain("unstubEnvs: true");
    expect(config).toContain("unstubGlobals: true");
    const integration = read("vitest.config.integration.mts");
    expect(integration).toContain("clearMocks: true");
    expect(integration).toContain("restoreMocks: true");
    expect(integration).toContain("unstubEnvs: true");
    expect(integration).toContain("unstubGlobals: true");
  });

  it("resets MSW handlers plus mocks/stubs plus RTL DOM after each test", () => {
    const setup = read("tests/unit/setup.ts");
    expect(setup).toContain("resetHandlers");
    expect(setup).toContain("unstubAllEnvs");
    expect(setup).toContain("unstubAllGlobals");
    expect(setup).toContain("cleanup");
    const integrationSetup = read("tests/integration/setup.ts");
    expect(integrationSetup).toContain("unstubAllEnvs");
    expect(integrationSetup).toContain("unstubAllGlobals");
  });
  it("caps the Serwist precache at 12 MB", () => {
    const route = read("src/app/serwist/[path]/route.ts");
    expect(route).toContain("maximumFileSizeToCacheInBytes");
    expect(route).toMatch(/12\s*\*\s*1024\s*\*\s*1024/);
  });
});
