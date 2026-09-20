import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "server-only": fileURLToPath(
        new URL("./tests/server-only-stub.ts", import.meta.url)
      ),
      "next/cache": fileURLToPath(
        new URL("./tests/next-cache-stub.ts", import.meta.url)
      ),
    },
  },
  test: {
    name: "integration",
    environment: "node",
    globals: true,
    include: ["tests/integration/**/*.test.{ts,tsx}"],
    setupFiles: ["./tests/integration/setup.ts"],
    // Same isolation contract as the unit project: fresh mocks/stubs per
    // test so DB-shaped fakes never leak call history across cases.
    clearMocks: true,
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
    fileParallelism: false,
    pool: "forks",
    globalSetup: ["./tests/integration/global-setup.ts"],
  },
});
