#!/usr/bin/env node
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

/**
 * One local certificate authority (CA) per dev machine for phone testing.
 *
 * Why a CA: the phone trusts the CA one time. Every LAN-IP certificate made
 * from it is then trusted with no extra phone step, so a DHCP IP change
 * costs zero trust steps and the phone holds one entry instead of one per
 * IP (same model as the `mkcert` tool).
 *
 * Usage:
 *   node scripts/gen-lan-ca.mjs
 *
 * Output (gitignored, per-machine):
 *   certificates/lan-ca-key.pem (private key — never share, never commit)
 *   certificates/lan-ca.pem     (install this one file on the phone)
 *
 * Requires `openssl` on PATH. Safe to re-run: existing files are reused.
 * Removal from the phone after testing: Android Settings > Security >
 * Trusted credentials > User tab > ICTQuest LAN CA > Remove; iOS
 * Settings > General > VPN & Device Management > ICTQuest LAN CA >
 * Remove Downloaded Profile.
 */

export function certificatesDir(root = join(import.meta.dirname, "..")) {
  return join(root, "certificates");
}

export function lanCaPaths(dir = certificatesDir()) {
  return {
    caCertPath: join(dir, "lan-ca.pem"),
    caKeyPath: join(dir, "lan-ca-key.pem"),
  };
}

export function hasOpenssl() {
  return spawnSync("openssl", ["version"], { stdio: "ignore" }).status === 0;
}

/** Create the CA pair if missing. Returns paths plus whether it was created. */
export function ensureLanCa(dir = certificatesDir()) {
  mkdirSync(dir, { recursive: true });
  const { caCertPath, caKeyPath } = lanCaPaths(dir);
  if (existsSync(caCertPath) && existsSync(caKeyPath)) {
    return { caCertPath, caKeyPath, created: false };
  }
  if (!hasOpenssl()) {
    throw new Error("openssl not found on PATH; install OpenSSL first.");
  }
  execFileSync(
    "openssl",
    [
      "req",
      "-x509",
      "-newkey",
      "rsa:2048",
      "-sha256",
      "-days",
      "825",
      "-nodes",
      "-keyout",
      caKeyPath,
      "-out",
      caCertPath,
      "-subj",
      "/CN=ICTQuest LAN CA",
      "-addext",
      "basicConstraints=critical,CA:true",
    ],
    { stdio: "inherit" }
  );
  return { caCertPath, caKeyPath, created: true };
}

const isMain = (process.argv[1] ?? "").endsWith("gen-lan-ca.mjs");
if (isMain) {
  try {
    const { caCertPath, created } = ensureLanCa();
    console.log(
      created ? "Local CA created:" : "Local CA already exists, reused:"
    );
    console.log(`  ${caCertPath}`);
    console.log(
      "Install certificates/lan-ca.pem on the phone as trusted ONE time, then run:"
    );
    console.log("  npm run dev:https:lan:sw -- --ip=<lan-ip>");
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
