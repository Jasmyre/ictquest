import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const alias = {
  "@": fileURLToPath(new URL("./src", import.meta.url)),
  "server-only": fileURLToPath(
    new URL("./tests/server-only-stub.ts", import.meta.url)
  ),
  "next/cache": fileURLToPath(
    new URL("./tests/next-cache-stub.ts", import.meta.url)
  ),
};

export default defineConfig({
  resolve: {
    alias,
  },
  test: {
    // Silence stdout plus stderr from passing tests (expected NOT_FOUND
    // logs like "User not found" stay hidden when green, but still print
    // when a test fails for debugging). Root-only: `silent` is a
    // NonProjectOption, so it cannot live inside `projects`.
    silent: "passed-only",
    coverage: {
      provider: "v8",
      include: [
        "src/components/**",
        "src/hooks/**",
        "src/server/api/routers/**",
        "src/services/**",
        "src/data/**",
        "src/schemas/**",
        "src/actions/**",
      ],
      exclude: ["src/components/ui/**"],
    },
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          // node by default: only component tests pay for jsdom. 20 of 21
          // unit files are pure logic (fs reads, routers, route modules) —
          // forcing jsdom on all of them dominated the worker startup clock
          // (environment ~60% of total run time). Component (.tsx) tests opt
          // into jsdom via a `// @vitest-environment jsdom` pragma (pinned
          // by tests/unit/vitest-harness.test.ts).
          environment: "node",
          globals: true,
          include: ["tests/unit/**/*.test.{ts,tsx}"],
          environmentOptions: {
            jsdom: {
              url: "http://localhost:3000",
            },
          },
          setupFiles: ["./tests/unit/setup.ts"],
          // Test isolation: every test starts from a clean slate —
          // mock call history cleared, stubbed env/globals restored, so
          // files stay order-independent with workers reused.
          clearMocks: true,
          restoreMocks: true,
          unstubEnvs: true,
          unstubGlobals: true,
          // Keep worker isolation on: disabling it trades correctness for
          // speed. Startup is fixed at the source instead (light setupFiles
          // above, node-by-default here, zero vite plugins in this config
          // so no third-party init runs per thread).
          isolate: true,
          pool: "forks",
        },
      },
      "./vitest.config.integration.mts",
    ],
  },
});
