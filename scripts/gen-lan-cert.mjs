#!/usr/bin/env node
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Generate a LAN HTTPS cert covering the static LAN IP + localhost.
 *
 * Why: `next dev --experimental-https` ships a localhost-only self-signed
 * cert, so a phone at `https://192.168.1.67:3000` rejects the worker fetch
 * (`SecurityError: ... SSL certificate error ...`). A cert with a proper
 * Subject Alternative Name (SAN) for the LAN IP lets the phone register the
 * service worker for real install/offline testing.
 *
 * Usage:
 *   node scripts/gen-lan-cert.mjs [LAN_IP]
 *   node scripts/gen-lan-cert.mjs 192.168.1.67
 *
 * Output (gitignored except the localhost pair):
 *   certificates/lan-cert.pem / certificates/lan-key.pem
 *
 * Requires `openssl` on PATH. After generating, `dev-lan.mjs` picks the
 * pair up automatically when `--experimental-https` is passed.
 *
 * Phone trust (required once per device):
 *   Android: copy lan-cert.pem to the phone, Settings > Security >
 *     Install a certificate > CA certificate, then open
 *     https://192.168.1.67:3000 and accept.
 *   iOS: AirDrop/mail lan-cert.pem, install under
 *     Settings > General > VPN & Device Management, then enable full trust
 *     under Settings > General > About > Certificate Trust Settings.
 */

const root = join(import.meta.dirname, "..");
const dir = join(root, "certificates");
const lanIp = process.argv[2] ?? process.env.LAN_IP ?? "192.168.1.67";
const keyPath = join(dir, "lan-key.pem");
const certPath = join(dir, "lan-cert.pem");

mkdirSync(dir, { recursive: true });

const hasOpenssl =
  spawnSync("openssl", ["version"], { stdio: "ignore" }).status === 0;
if (!hasOpenssl) {
  console.error("openssl not found on PATH; install OpenSSL or mkcert first.");
  process.exit(1);
}

const san = `subjectAltName=DNS:localhost,DNS:*.localhost,IP:127.0.0.1,IP:${lanIp},DNS:${lanIp}`;
try {
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
      keyPath,
      "-out",
      certPath,
      "-subj",
      `/CN=${lanIp}`,
      "-addext",
      san,
    ],
    { stdio: "inherit" }
  );
} catch {
  process.exit(1);
}

if (!(existsSync(certPath) && existsSync(keyPath))) {
  console.error("Certificate generation failed.");
  process.exit(1);
}

console.log(`LAN cert written for ${lanIp}:`);
console.log("  key : certificates/lan-key.pem");
console.log("  cert: certificates/lan-cert.pem");
console.log(
  "Install certificates/lan-cert.pem on the phone as a trusted CA/user cert, then run:"
);
console.log(
  `  npm run dev:https:lan:sw   (serves https://${lanIp}:3000 with this cert)`
);
