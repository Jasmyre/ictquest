import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = join(__dirname, "..", "..");

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

function exists(rel: string): boolean {
  return existsSync(join(ROOT, rel));
}

const ROUTE_REL = "src/app/serwist/[path]/route.ts";

const MUTATION_RE = /POST|method.*GET|request\.method/i;
const MEDIA_RE = /mp4|webm/;
const LESSON_PRECACHE_RE = /precache.*lessons/i;
const DEFERRED_RE = /deferred|per-user|never public/i;

describe("Service worker plus cache rules (@serwist/turbopack)", () => {
  it("wraps the Next config with the Turbopack integration", () => {
    const config = read("next.config.ts");
    expect(config).toContain("@serwist/turbopack");
    expect(config).toContain("withSerwist");
    // No webpack-only wrapper and no Turbopack-warning suppression hack:
    // the worker build lives in the route handler below.
    expect(config).not.toContain("@serwist/next");
    expect(config).not.toContain("withSerwistInit");
    expect(config).not.toContain("SERWIST_SUPPRESS_TURBOPACK_WARNING");
    expect(config).not.toContain("swDest");
  });

  it("serves the worker from the Serwist route with the versioned public precache set", () => {
    expect(exists(ROUTE_REL), ROUTE_REL).toBe(true);
    const route = read(ROUTE_REL);
    expect(route).toContain("createSerwistRoute");
    expect(route).toContain("src/app/sw.ts");
    expect(route).toContain("additionalPrecacheEntries");
    expect(route).toContain("SW_PRECACHED_URLS");
    // Revision keyed by source (git HEAD with UUID fallback).
    expect(route).toContain("revision");
    expect(route).toContain("rev-parse");
  });

  it("registers the worker at the route URL without wiping state on reconnect", () => {
    const provider = read("src/components/pwa/sw-provider.tsx");
    expect(provider).toContain("@serwist/turbopack/react");
    expect(provider).toContain("/serwist/sw.js");
    expect(provider).toContain("reloadOnOnline");
    // No forced reload on reconnect: in-progress quiz/form state survives.
    expect(provider).toContain("false");
    // Production-only: disabled outside production to avoid dev cache hell.
    expect(provider).toContain("disable");
    expect(provider).toContain('NODE_ENV !== "production"');

    const layout = read("src/app/layout.tsx");
    expect(layout).toContain("/serwist/sw.js");
  });

  it("serves network-only for mutations and heavy media with document fallback to offline", () => {
    expect(exists("src/app/sw.ts"), "src/app/sw.ts").toBe(true);
    const sw = read("src/app/sw.ts");
    expect(sw).toContain("self.__SW_MANIFEST");
    expect(sw).toContain("precacheEntries");
    expect(sw).toContain("skipWaiting");
    expect(sw).toContain("clientsClaim");
    expect(sw).toContain("navigationPreload");
    expect(sw).toContain("defaultCache");
    expect(sw).toContain("@serwist/turbopack/worker");
    expect(sw).toContain("NetworkOnly");
    // Mutations/POSTs never serve stale.
    expect(sw).toMatch(MUTATION_RE);
    // Heavy lesson media never blindly cached.
    expect(sw).toMatch(MEDIA_RE);
    expect(sw).toContain("/~offline");
    expect(sw).toContain("document");
    expect(sw).toContain("addEventListeners");
  });

  it("defers lesson-body caching and never caches it publicly", () => {
    const sw = read("src/app/sw.ts");
    // No public CacheFirst/StaleWhileRevalidate rule keyed on lesson bodies,
    // no precache of lesson routes — per-user only, deferred.
    expect(sw).not.toContain("/lessons/[topic]");
    expect(sw).not.toMatch(LESSON_PRECACHE_RE);
    expect(sw).toMatch(DEFERRED_RE);
  });

  it("emits no static worker output to public/", () => {
    // The worker is served from the `/serwist/sw.js` route handler, so no
    // build writes `public/sw.js` anymore and nothing ignores it.
    const gitignore = read(".gitignore");
    expect(gitignore).not.toContain("public/sw");
    expect(exists("public/sw.js"), "stale public/sw.js").toBe(false);
  });
});
