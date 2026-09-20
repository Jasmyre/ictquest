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

const OFFLINE_RE = /offline/i;
const MAINTENANCE_HEADING_RE = /Maintenance/;
const NOT_MAINTENANCE_RE = /currently in maintenance/;
const NOT_OFFLINE_HEADING_RE = /You.re offline|You're offline/;

describe("Migration 16 — PWA manifest plus offline page", () => {
  it("serves the manifest from the app manifest handler with the full icon set", async () => {
    expect(exists("src/app/manifest.ts"), "src/app/manifest.ts").toBe(true);

    const src = read("src/app/manifest.ts");
    expect(src).toContain("MetadataRoute.Manifest");
    expect(src).toContain("start_url");
    expect(src).toContain("display");
    expect(src).toContain("192");
    expect(src).toContain("512");
    expect(src).toContain("maskable");
    expect(src).toContain("apple-touch-icon");

    const manifestModule = await import("@/app/manifest");
    const manifest = (manifestModule.default as () => unknown)();
    const m = manifest as {
      name: string;
      short_name: string;
      start_url: string;
      scope: string;
      display: string;
      background_color: string;
      theme_color: string;
      icons: { src: string; sizes: string; type: string; purpose?: string }[];
    };
    expect(m.start_url).toBe("/");
    expect(m.display).toBe("standalone");
    const bySrc = new Map(m.icons.map((icon) => [icon.src, icon]));
    expect(bySrc.has("/pwa/icon-192.png")).toBe(true);
    expect(bySrc.has("/pwa/icon-512.png")).toBe(true);
    expect(bySrc.has("/pwa/maskable-512.png")).toBe(true);
    expect(bySrc.has("/pwa/apple-touch-icon.png")).toBe(true);
    const maskable = bySrc.get("/pwa/maskable-512.png");
    expect(maskable?.purpose).toContain("maskable");
  });

  it("ships the PWA icon set plus favicon", () => {
    for (const rel of [
      "public/pwa/icon-192.png",
      "public/pwa/icon-512.png",
      "public/pwa/maskable-512.png",
      "public/pwa/apple-touch-icon.png",
      "public/favicon.ico",
    ]) {
      expect(exists(rel), rel).toBe(true);
    }
  });

  it("wires root metadata plus theme color on a non-cached boundary with the worker provider", () => {
    const root = read("src/app/layout.tsx");
    expect(root).toContain("manifest: ");
    expect(root).toContain("/manifest.webmanifest");
    expect(root).toContain("appleWebApp");
    expect(root).toContain("themeColor");
    expect(root).toContain("swUrl");
    expect(root).toContain("/serwist/sw.js");

    const providerRel = "src/components/pwa/sw-provider.tsx";
    expect(exists(providerRel), providerRel).toBe(true);
    const providerSrc = read(providerRel);
    expect(providerSrc).toContain('"use client"');
    expect(providerSrc).toContain("swUrl");
    expect(providerSrc).toContain("reloadOnOnline");
    // No forced reload on reconnect: in-progress quiz/form state survives.
    expect(providerSrc).toContain("false");
  });

  it("renders a dedicated offline fallback reusing maintenance card language", () => {
    expect(
      exists("src/app/~offline/page.tsx"),
      "src/app/~offline/page.tsx"
    ).toBe(true);
    const offline = read("src/app/~offline/page.tsx");
    expect(offline).toMatch(OFFLINE_RE);
    expect(offline).toContain("Card");
    expect(offline).toContain('href="/"');

    const maintenance = read("src/app/maintenance/page.tsx");
    expect(maintenance).toMatch(MAINTENANCE_HEADING_RE);
    // Separate surfaces: offline is a connectivity fallback, maintenance is server-down.
    expect(offline).not.toMatch(NOT_MAINTENANCE_RE);
    expect(maintenance).not.toMatch(NOT_OFFLINE_HEADING_RE);
  });
});
