#!/usr/bin/env node
/**
 * Verify the provisional PWA asset list.
 *
 * Shape adopted for Migration 03 (#26): provisional only, pending PWA
 * tickets (#39 manifest + offline page, #40 service worker + cache rules).
 * Per docs/research/pwa-rest-surface.md the final set is:
 *   - public/pwa/icon-192.png, icon-512.png, maskable-512.png, apple-touch-icon.png
 *   - public/favicon.ico (globPublicPatterns)
 *   - public/sw.js (built from src/app/sw.ts, production only)
 *   - src/app/manifest.ts route + src/app/~offline page
 *
 * Until those tickets land this script reports missing entries as warnings
 * and exits 0. Pass --strict to fail on missing assets (for CI after PWA lands).
 */
import { existsSync } from "node:fs";

const strict = process.argv.includes("--strict");

const expectedFiles = [
  "public/favicon.ico",
  "public/pwa/icon-192.png",
  "public/pwa/icon-512.png",
  "public/pwa/maskable-512.png",
  "public/pwa/apple-touch-icon.png",
];

const expectedSources = [
  "src/app/manifest.ts",
  "src/app/sw.ts",
  "src/app/~offline/page.tsx",
];

const generatedArtifacts = ["public/sw.js", "public/manifest.webmanifest"];

let missing = 0;

function checkGroup(label, entries) {
  console.log(`${label}:`);
  for (const entry of entries) {
    const ok = existsSync(new URL(`../${entry}`, import.meta.url));
    console.log(`  ${ok ? "FOUND  " : "MISSING"} ${entry}`);
    if (!ok) {
      missing += 1;
    }
  }
}

console.log("PWA asset check (provisional — PWA surface pending #39/#40)");
checkGroup("Static assets", expectedFiles);
checkGroup("App sources", expectedSources);
checkGroup("Generated artifacts (production build only)", generatedArtifacts);

if (missing > 0) {
  console.log(
    `\n${missing} PWA path(s) missing — expected before #39/#40 land.`
  );
  if (strict) {
    console.error("Failing with --strict.");
    process.exit(1);
  }
} else {
  console.log("\nAll provisional PWA paths present.");
}
