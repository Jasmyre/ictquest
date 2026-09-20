import type { MetadataRoute } from "next";

/**
 * Installable-app manifest (Migration 16, #39).
 *
 * Served by Next at `/manifest.webmanifest`. Full icon set lives under
 * `public/pwa/` (192/512 `any`, 512 `maskable`, 180 apple-touch). The
 * service-worker build integration (shell plus offline precache, cache
 * rules) lands separately in #40 — this file only describes the metadata.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ICTQuest | Master HTML",
    short_name: "ICTQuest",
    description: "ICTQuest. Master HTML from zero to hero",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#111827",
    theme_color: "#4F46E5",
    icons: [
      {
        src: "/pwa/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/pwa/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
