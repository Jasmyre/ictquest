import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import manifestRoute from "@/app/manifest";
import {
  PWA_APPLE_TOUCH_ICON,
  PWA_BACKGROUND_COLOR,
  PWA_DESCRIPTION,
  PWA_ICONS,
  PWA_MANIFEST_URL,
  PWA_METADATA_ICONS,
  PWA_NAME,
  PWA_SHORT_NAME,
  PWA_THEME_COLOR,
  pwaManifest,
} from "@/pwa";

const ROOT = join(__dirname, "..", "..");

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

describe("PWA contract — src/pwa.ts is the source of truth", () => {
  it("keeps the manifest route in sync with the inventory", () => {
    const served = manifestRoute();
    expect(served).toEqual(pwaManifest);
    expect(served.name).toBe(PWA_NAME);
    expect(served.short_name).toBe(PWA_SHORT_NAME);
    expect(served.description).toBe(PWA_DESCRIPTION);
    expect(served.start_url).toBe("/");
    expect(served.scope).toBe("/");
    expect(served.display).toBe("standalone");
    expect(served.background_color).toBe(PWA_BACKGROUND_COLOR);
    expect(served.theme_color).toBe(PWA_THEME_COLOR);
    // Install family: 192 + 512 any, 512 maskable, 180 apple-touch.
    const bySrc = new Map((served.icons ?? []).map((icon) => [icon.src, icon]));
    for (const icon of PWA_ICONS) {
      expect(bySrc.has(icon.src)).toBe(true);
    }
    expect(bySrc.get("/pwa/maskable-512.png")?.purpose).toContain("maskable");
  });

  it("keeps the root metadata in sync (manifest URL, Apple app, icons)", () => {
    const layout = read("src/app/layout.tsx");
    // Manifest identity wired at the root.
    expect(layout).toContain(PWA_MANIFEST_URL);
    expect(layout).toContain(PWA_SHORT_NAME);
    expect(layout).toContain(PWA_NAME);
    expect(layout).toContain("appleWebApp");
    expect(layout).toContain(PWA_APPLE_TOUCH_ICON.url);
    for (const icon of PWA_METADATA_ICONS) {
      expect(layout).toContain(icon.src);
    }
    // Maskable stays manifest-only, never in the favicon set.
    const iconBlock = layout.slice(layout.indexOf("icons:"));
    expect(iconBlock).not.toContain("/pwa/maskable-512.png");
    // Theme chrome matches the contract.
    expect(layout).toContain(PWA_THEME_COLOR);
  });

  it("keeps the viewport zoomable (no pinch-zoom lock)", () => {
    const layout = read("src/app/layout.tsx");
    expect(layout).not.toContain("maximumScale");
    expect(layout).not.toContain("userScalable");
  });
});
