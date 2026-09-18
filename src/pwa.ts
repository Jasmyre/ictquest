import type { Metadata, MetadataRoute, Viewport } from "next";

/**
 * PWA installability surface (adapted from the template `pwa.ts` reference).
 *
 * Single source of truth for the web app manifest identity, the Install icon
 * family inventory, and the Apple / viewport metadata policy. `src/app/manifest.ts`
 * and `src/app/layout.tsx` must stay in sync with these values —
 * `tests/unit/pwa.test.ts` fails on drift.
 *
 * Divergences from the template, all intentional:
 * - Branding is ICTQuest ("ICTQuest | Master HTML"), not "Template".
 * - Icon binaries are the committed set under `public/pwa/` (`icon-192.png`,
 *   `icon-512.png`, `maskable-512.png`, `apple-touch-icon.png`) plus
 *   `public/favicon.ico`. The template's `manifest-icon-*` names and the 20
 *   hand-referenced Apple launch splash screens do not exist here, so there
 *   is no `PWA_STARTUP_IMAGES` inventory.
 * - Chrome colors are the brand pair (`#4F46E5` theme, `#111827` background)
 *   already served by `src/app/manifest.ts`, not hex renders of the oklch
 *   `--background` tokens in `src/styles/globals.css`.
 * - The viewport stays zoomable (no `maximumScale: 1` / `userScalable: false`
 *   lock): a zoom lock trades away pinch-zoom for a native-app feel and is
 *   the wrong default for a learning app.
 */

export const PWA_SHORT_NAME = "ICTQuest";

export const PWA_NAME = "ICTQuest | Master HTML";

export const PWA_DESCRIPTION = "ICTQuest. Master HTML from zero to hero";

export const PWA_MANIFEST_URL = "/manifest.webmanifest";

/** Brand chrome: theme text/chrome + install-splash background. */
export const PWA_THEME_COLOR = "#4F46E5";

export const PWA_BACKGROUND_COLOR = "#111827";

type ManifestIcon = NonNullable<MetadataRoute.Manifest["icons"]>[number];

export interface PwaIcon extends ManifestIcon {
  height: number;
  width: number;
}

/** Install icon family: standard sizes plus the maskable variant. */
export const PWA_ICONS: PwaIcon[] = [
  {
    height: 192,
    purpose: "any",
    sizes: "192x192",
    src: "/pwa/icon-192.png",
    type: "image/png",
    width: 192,
  },
  {
    height: 512,
    purpose: "any",
    sizes: "512x512",
    src: "/pwa/icon-512.png",
    type: "image/png",
    width: 512,
  },
  {
    height: 512,
    purpose: "maskable",
    sizes: "512x512",
    src: "/pwa/maskable-512.png",
    type: "image/png",
    width: 512,
  },
  {
    height: 180,
    purpose: "any",
    sizes: "180x180",
    src: "/pwa/apple-touch-icon.png",
    type: "image/png",
    width: 180,
  },
];

export const PWA_APPLE_TOUCH_ICON = {
  sizes: "180x180",
  type: "image/png",
  url: "/pwa/apple-touch-icon.png",
} as const;

/**
 * Generic browser icon slots (`icons.icon`): the maskable variant is
 * manifest-only, so it stays out of the favicon set. The Apple touch icon
 * is served via `icons.apple`, so it stays out of here too.
 */
export const PWA_METADATA_ICONS = PWA_ICONS.filter(
  (icon) => icon.purpose !== "maskable" && icon.src !== PWA_APPLE_TOUCH_ICON.url
);

export const pwaManifest: MetadataRoute.Manifest = {
  background_color: PWA_BACKGROUND_COLOR,
  description: PWA_DESCRIPTION,
  display: "standalone",
  // Width/height stay in the inventory for the contract test; the served
  // manifest carries only Web App Manifest members.
  icons: PWA_ICONS.map((icon) => {
    const { height: _height, width: _width, ...manifestIcon } = icon;
    return manifestIcon;
  }),
  name: PWA_NAME,
  orientation: "portrait",
  scope: "/",
  short_name: PWA_SHORT_NAME,
  start_url: "/",
  theme_color: PWA_THEME_COLOR,
};

export const PWA_APPLE_WEB_APP = {
  capable: true,
  statusBarStyle: "default",
  title: PWA_NAME,
} as const satisfies NonNullable<Metadata["appleWebApp"]>;

/** Viewport policy: zoomable, device-width, theme-aware chrome. */
export const PWA_VIEWPORT: Viewport = {
  initialScale: 1,
  themeColor: PWA_THEME_COLOR,
  width: "device-width",
};
