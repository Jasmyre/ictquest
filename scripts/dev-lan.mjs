#!/usr/bin/env node
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
/**
 * Run the Next.js dev server bound to the LAN.
 *
 * Shape adopted for Migration 03 (#26): repath-only helper, no new deps.
 * Binds to 0.0.0.0 so phones/tablets on the same network can load the app.
 * Respects PORT / HOSTNAME env vars; passes extra args through to `next dev`.
 *
 * Usage:
 *   npm run dev:lan -- --turbo
 *   node scripts/dev-lan.mjs --sw [--experimental-https ...] [--ip=192.168.1.67]
 *
 * The LAN IP is an input (`--ip=` / `--lan-ip=`): DHCP leases change, so
 * pass the machine's current IPv4 each run and this script points
 * NEXTAUTH_URL/BASE_URL at it. When `--experimental-https` is passed, a
 * SAN-covering cert for that IP is auto-built from the local CA
 * (`scripts/gen-lan-ca.mjs`, one time per machine) if missing or stale,
 * served automatically, and `NEXT_PUBLIC_SW_ALLOW_LAN=1` is set so
 * `SwProvider` registers the worker. Trust the CA file
 * (`certificates/lan-ca.pem`) on the phone ONE time — IP changes need no
 * new phone step. Without `--experimental-https`, plain `npm run dev:lan`
 * stays cert-free.
 */
import { join } from "node:path";
import { buildLanCert, lanCertCoversIp } from "./gen-lan-cert.mjs";
import { getLanEntries, resolveLanHost } from "./lan-address.mjs";

const port = process.env.PORT ?? "3000";
const host = process.env.HOSTNAME ?? "0.0.0.0";
const rawArgs = process.argv.slice(2);

// `--sw` is a dev-lan flag (enable the worker in dev via
// NEXT_PUBLIC_SW_IN_DEV=1), not a `next dev` option. `--ip=` / `--lan-ip=`
// pins the LAN IP for this run (DHCP leases change); also stripped before
// forwarding. Supports `--ip=1.2.3.4` and `--ip 1.2.3.4` forms.
const enableSw = rawArgs.includes("--sw");
const IP_FLAG_PATTERN = /^--(?:lan-)?ip=(.+)$/;
let lanIpFlag;
const forwardedArgs = [];
for (let i = 0; i < rawArgs.length; i += 1) {
  const arg = rawArgs[i];
  if (arg === "--sw") {
    continue;
  }
  const eqMatch = arg.match(IP_FLAG_PATTERN);
  if (eqMatch) {
    lanIpFlag = eqMatch[1].trim();
    continue;
  }
  if (arg === "--ip" || arg === "--lan-ip") {
    lanIpFlag = (rawArgs[i + 1] ?? "").trim();
    i += 1;
    continue;
  }
  forwardedArgs.push(arg);
}
const extraArgs = forwardedArgs;
if (enableSw) {
  process.env.NEXT_PUBLIC_SW_IN_DEV ||= "1";
}
let lanHost;
let lanSource = "auto-detect";
try {
  const resolved = resolveLanHost({ flag: lanIpFlag });
  lanHost = resolved.host;
  lanSource =
    resolved.source === "flag"
      ? "--ip"
      : resolved.source === "LAN_IP"
        ? "LAN_IP"
        : `auto-detect ("${resolved.iface ?? "unknown"}")`;
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

const lanEntries = getLanEntries();
const addrs = lanEntries.map((entry) => entry.address);

// Point auth + metadata URLs at the LAN address so phones don't bounce
// to localhost: NextAuth derives its baseUrl from NEXTAUTH_URL and the
// redirect callback returns it, so a localhost value redirects every
// LAN sign-in to localhost. LAN mode owns these three vars for the
// spawned server only (`.env` stays localhost for `dev`): an explicit
// parent value is overwritten with a warning so the auth host and the
// LAN host can never silently diverge.
const useHttps = extraArgs.some((arg) =>
  arg.startsWith("--experimental-https")
);
const scheme = useHttps ? "https" : "http";
if (lanIpFlag && !addrs.includes(lanIpFlag)) {
  console.warn(
    `  --ip=${lanIpFlag} is not among this machine's addresses (${addrs.join(", ") || "none detected"}); using the flag value anyway.`
  );
}
if (lanHost) {
  const lanUrl = `${scheme}://${lanHost}:${port}`;
  for (const key of ["NEXTAUTH_URL", "BASE_URL", "AUTH_URL"]) {
    const prior = process.env[key];
    if (prior && prior !== lanUrl) {
      console.warn(
        `  ${key} was "${prior}", now "${lanUrl}" (LAN mode owns it).`
      );
    }
    process.env[key] = lanUrl;
  }
  process.env.AUTH_TRUST_HOST ||= "true";
  // Publish the single resolved host so `next.config.ts`
  // (`allowedDevOrigins`) resolves identically in the child process.
  process.env.LAN_IP = lanHost;
}

console.log(`Starting Next.js dev server on ${host}:${port} ...`);
const certificatesDir = join(import.meta.dirname, "..", "certificates");
const lanKeyPath = join(certificatesDir, "lan-key.pem");
const lanCertPath = join(certificatesDir, "lan-cert.pem");

let hasLanCert = existsSync(lanKeyPath) && existsSync(lanCertPath);
if (useHttps && lanHost && !lanCertCoversIp(lanCertPath, lanHost)) {
  // Missing or stale (IP changed) cert: rebuild from the local CA so the
  // browser stops failing with `SecurityError ... SSL certificate error`.
  // The phone needs no new trust step — it already trusts the CA.
  try {
    console.log(`  LAN cert missing/stale for ${lanHost}; rebuilding ...`);
    buildLanCert(lanHost);
    // Re-verify: a failed build must not leave a stale pair marked valid.
    hasLanCert =
      existsSync(lanKeyPath) &&
      existsSync(lanCertPath) &&
      lanCertCoversIp(lanCertPath, lanHost);
    if (!hasLanCert) {
      console.error(
        `  [serwist] Rebuilt LAN cert still does not cover ${lanHost}; ` +
          "service worker registration will fail visibly in the browser. " +
          `Re-run npm run pwa:lan-cert for ${lanHost} and check openssl output.`
      );
    }
  } catch {
    // A stale pair plus a failed rebuild is still stale: never enable SW
    // against it (the browser would throw a visible SecurityError).
    hasLanCert = false;
    console.error(
      "  [serwist] Failed to build LAN cert (openssl required). " +
        "Service worker registration stays disabled; fix openssl, then " +
        `re-run with --ip=${lanHost} — or use plain HTTP \`npm run dev:lan\` ` +
        "for non-PWA LAN testing."
    );
  }
}
const hasExplicitCert = extraArgs.some(
  (arg) =>
    arg === "--experimental-https-key" ||
    arg === "--experimental-https-cert" ||
    arg.startsWith("--experimental-https-key=") ||
    arg.startsWith("--experimental-https-cert=")
);
if (useHttps && hasLanCert && !hasExplicitCert) {
  extraArgs.push(`--experimental-https-key=${lanKeyPath}`);
  extraArgs.push(`--experimental-https-cert=${lanCertPath}`);
}
if (enableSw && useHttps) {
  if (hasLanCert || hasExplicitCert) {
    // SAN-covering cert is served, so the browser can install the service
    // worker once the local CA is trusted on the device (PC via certmgr +
    // Chrome restart, phone via one-time CA install).
    process.env.NEXT_PUBLIC_SW_ALLOW_LAN ||= "1";
    console.log(
      "  SW on LAN: enabled (serving LAN cert — trust the local CA on the PC + phone)."
    );
  } else {
    // No usable LAN cert: a stale parent ALLOW_LAN=1 must not survive —
    // LAN mode owns this flag for the child (same pattern as
    // NEXTAUTH_URL/BASE_URL above), otherwise the browser throws a raw
    // SecurityError instead of the actionable message.
    if (process.env.NEXT_PUBLIC_SW_ALLOW_LAN === "1") {
      console.warn(
        '  NEXT_PUBLIC_SW_ALLOW_LAN was "1", now "0" (no LAN cert).'
      );
    }
    process.env.NEXT_PUBLIC_SW_ALLOW_LAN = "0";
    console.error(
      "[serwist] --sw + --experimental-https without a LAN cert: service worker " +
        "registration stays disabled and the browser will report a visible " +
        "`SecurityError ... SSL certificate error` on LAN. " +
        "PC: install certificates/lan-ca.pem into Windows Trusted Root CA " +
        "(certmgr) and restart Chrome; phone: trust certificates/lan-ca.pem " +
        "once (npm run pwa:lan-ca), then restart with --ip=<lan-ip> — " +
        "or use plain HTTP `npm run dev:lan`."
    );
  }
}
if (lanEntries.length > 0) {
  for (const entry of lanEntries) {
    if (entry.virtual) {
      console.log(
        `  skipped virtual: ${scheme}://${entry.address}:${port} ("${entry.name}")`
      );
      continue;
    }
    console.log(
      `  LAN: ${scheme}://${entry.address}:${port} ("${entry.name}")`
    );
  }
  if (lanHost) {
    console.log(`  LAN host: ${lanHost} (source: ${lanSource})`);
  }
  console.log(`  NEXTAUTH_URL=${process.env.NEXTAUTH_URL}`);
  console.log(`  BASE_URL=${process.env.BASE_URL}`);
  console.log(`  AUTH_URL=${process.env.AUTH_URL}`);
} else {
  console.log("  (no external IPv4 interface detected)");
}

// Run the Next.js CLI directly with node so no shell (and no .cmd shim)
// is needed on Windows. Spawning `npx.cmd` without `shell: true` throws
// EINVAL on Node 24, while `shell: true` triggers DEP0190 and leaves
// args unescaped.
const { createRequire } = await import("node:module");
const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");
const child = spawn(
  process.execPath,
  [nextBin, "dev", "-H", host, "-p", port, ...extraArgs],
  {
    stdio: "inherit",
    env: process.env,
  }
);

child.on("error", (err) => {
  console.error(err);
  process.exit(1);
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
