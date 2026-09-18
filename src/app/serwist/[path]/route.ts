import { spawnSync } from "node:child_process";
import { createSerwistRoute } from "@serwist/turbopack";
import { SW_PRECACHED_URLS } from "@/sw-policy";

/**
 * Service-worker route handler (@serwist/turbopack).
 *
 * Serves the worker at `/serwist/sw.js` (registered by `SwProvider`), built
 * from `src/app/sw.ts` with esbuild. The precache manifest is the
 * Turbopack build output plus the public deployment-versioned set
 * (`SW_PRECACHED_URLS` in `src/sw-policy.ts`, the single source of truth —
 * pinned by `tests/unit/sw-policy.test.ts`).
 *
 * `useNativeEsbuild` pins the native `esbuild` binary (a direct dev
 * dependency) instead of the wasm fallback.
 */
const gitRevision = spawnSync("git", ["rev-parse", "HEAD"], {
  encoding: "utf-8",
}).stdout?.trim();

const revision =
  gitRevision === "" || gitRevision === undefined
    ? crypto.randomUUID()
    : gitRevision;

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } =
  createSerwistRoute({
    swSrc: "src/app/sw.ts",
    additionalPrecacheEntries: SW_PRECACHED_URLS.map((url) => ({
      url,
      revision,
    })),
    useNativeEsbuild: true,
  });
