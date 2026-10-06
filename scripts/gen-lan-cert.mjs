#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { certificatesDir, ensureLanCa, hasOpenssl } from "./gen-lan-ca.mjs";

/**
 * LAN HTTPS certificate covering one LAN IP + localhost, made from the
 * local CA (`scripts/gen-lan-ca.mjs`).
 *
 * Why: `next dev --experimental-https` ships a localhost-only self-signed
 * cert, so a phone at `https://<lan-ip>:3000` rejects the service worker
 * file (`SecurityError: ... SSL certificate error ...`). A certificate with
 * a proper Subject Alternative Name (SAN) for the LAN IP, chained to the
 * CA the phone already trusts, lets the phone install the service worker
 * for real install/offline testing — with zero new phone steps when the IP
 * changes.
 *
 * Usage:
 *   node scripts/gen-lan-cert.mjs [LAN_IP]
 *   node scripts/gen-lan-cert.mjs 192.168.1.67
 *
 * Output (gitignored, per-machine):
 *   certificates/lan-cert.pem / certificates/lan-key.pem
 *
 * Requires `openssl` on PATH. Normally you never call this directly:
 * `dev-lan.mjs` calls `buildLanCert` automatically when the pair is
 * missing or stale for the requested `--ip`.
 */

export function lanCertPaths(dir = certificatesDir()) {
  return {
    lanCertPath: join(dir, "lan-cert.pem"),
    lanKeyPath: join(dir, "lan-key.pem"),
  };
}

/** True when the existing pair covers `ip` in its SAN list. */
export function lanCertCoversIp(certPath, ip) {
  try {
    const out = execFileSync(
      "openssl",
      ["x509", "-in", certPath, "-noout", "-ext", "subjectAltName"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
    );
    return out.includes(ip);
  } catch {
    return false;
  }
}

/** Build (or rebuild) the leaf pair for `ip`, chained to the local CA. */
export function buildLanCert(ip, dir = certificatesDir()) {
  if (!hasOpenssl()) {
    throw new Error("openssl not found on PATH; install OpenSSL first.");
  }
  mkdirSync(dir, { recursive: true });
  const { caCertPath, caKeyPath } = ensureLanCa(dir);
  const { lanCertPath, lanKeyPath } = lanCertPaths(dir);
  const csrPath = join(dir, ".lan-cert.csr");
  const extPath = join(dir, ".lan-cert.ext.cnf");
  try {
    execFileSync(
      "openssl",
      [
        "req",
        "-newkey",
        "rsa:2048",
        "-nodes",
        "-keyout",
        lanKeyPath,
        "-out",
        csrPath,
        "-subj",
        `/CN=${ip}`,
      ],
      { stdio: "pipe" }
    );
    writeFileSync(
      extPath,
      `basicConstraints=CA:false\nsubjectAltName=DNS:localhost,DNS:*.localhost,IP:127.0.0.1,IP:${ip},DNS:${ip}\n`
    );
    execFileSync(
      "openssl",
      [
        "x509",
        "-req",
        "-in",
        csrPath,
        "-CA",
        caCertPath,
        "-CAkey",
        caKeyPath,
        "-CAcreateserial",
        "-days",
        "825",
        "-sha256",
        "-extfile",
        extPath,
        "-out",
        lanCertPath,
      ],
      { stdio: "pipe" }
    );
  } finally {
    rmSync(csrPath, { force: true });
    rmSync(extPath, { force: true });
  }
  return { lanCertPath, lanKeyPath };
}

const isMain = (process.argv[1] ?? "").endsWith("gen-lan-cert.mjs");
if (isMain) {
  const lanIp = process.argv[2] ?? process.env.LAN_IP ?? "192.168.1.67";
  try {
    const { lanCertPath, lanKeyPath } = buildLanCert(lanIp);
    if (!(existsSync(lanCertPath) && existsSync(lanKeyPath))) {
      throw new Error("Certificate generation failed.");
    }
    console.log(`LAN cert written for ${lanIp} (chained to local CA):`);
    console.log("  key : certificates/lan-key.pem");
    console.log("  cert: certificates/lan-cert.pem");
    console.log(
      "The phone needs no new trust step (CA already trusted). Then run:"
    );
    console.log(
      `  npm run dev:https:lan:sw -- --ip=${lanIp}   (serves https://${lanIp}:3000)`
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
