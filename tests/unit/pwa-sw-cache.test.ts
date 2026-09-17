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

const MUTATION_RE = /POST|method.*GET|request\.method/i;
const MEDIA_RE = /mp4|webm/;
const LESSON_PRECACHE_RE = /precache.*lessons/i;
const DEFERRED_RE = /deferred|per-user|never public/i;

describe("Migration 17 — Service worker plus cache rules", () => {
  it("builds the worker from app source to public output, production-only", () => {
    const config = read("next.config.ts");
    expect(config).toContain("@serwist/next");
    expect(config).toContain("withSerwistInit");
    expect(config).toContain("src/app/sw.ts");
    expect(config).toContain("public/sw.js");
    // Production-only: disabled outside production to avoid dev cache hell.
    expect(config).toContain("disable");
    expect(config).toContain('NODE_ENV !== "production"');
  });

  it("precaches shell plus offline by source revision and favicon plus PWA assets", () => {
    const config = read("next.config.ts");
    expect(config).toContain("additionalPrecacheEntries");
    expect(config).toContain("/~offline");
    expect(config).toContain("revision");
    // Shell ("/") precached alongside the offline fallback.
    expect(config).toContain('"/"');
    // Revision keyed by source (git HEAD with UUID fallback).
    expect(config).toContain("rev-parse");
    // Public-pattern precache for favicon plus PWA assets.
    expect(config).toContain("globPublicPatterns");
    expect(config).toContain("favicon.ico");
    expect(config).toContain("pwa/");
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

  it("ignores built worker output", () => {
    const gitignore = read(".gitignore");
    expect(gitignore).toContain("public/sw");
  });
});
