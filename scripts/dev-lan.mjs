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
 *   node scripts/dev-lan.mjs --sw [--experimental-https ...]
 *
 * Phone SW testing: generate once with
 *   node scripts/gen-lan-cert.mjs 192.168.1.67
 * trust `certificates/lan-cert.pem` on the phone, then run
 * `npm run dev:https:lan:sw`. When the LAN pair exists, this script serves
 * it automatically and sets `NEXT_PUBLIC_SW_ALLOW_LAN=1` so `SwProvider`
 * registers the worker on the LAN host. Without the pair, LAN registration
 * stays disabled (localhost-only dev cert → SSL certificate error); plain
 * `npm run dev:lan` remains the default for non-PWA LAN testing.
 */
import { networkInterfaces } from "node:os";
import { join } from "node:path";

const port = process.env.PORT ?? "3000";
const host = process.env.HOSTNAME ?? "0.0.0.0";
const rawArgs = process.argv.slice(2);

// `--sw` is a dev-lan flag (enable the worker in dev via
// NEXT_PUBLIC_SW_IN_DEV=1), not a `next dev` option. Strip it before
// forwarding the rest to `next dev`.
const enableSw = rawArgs.includes("--sw");
const extraArgs = rawArgs.filter((arg) => arg !== "--sw");
if (enableSw) {
  process.env.NEXT_PUBLIC_SW_IN_DEV ||= "1";
}

function lanAddresses() {
  const nets = networkInterfaces();
  const addrs = [];
  for (const list of Object.values(nets)) {
    for (const net of list ?? []) {
      if (net.family === "IPv4" && !net.internal) {
        addrs.push(net.address);
      }
    }
  }
  return addrs;
}

const addrs = lanAddresses();

// Point auth + metadata URLs at the LAN address so phones don't bounce
// to localhost: NextAuth derives its baseUrl from NEXTAUTH_URL and the
// redirect callback returns it, so a localhost value redirects every
// LAN sign-in to localhost. Overrides apply to the spawned server only
// (explicit parent env still wins); `.env` stays localhost for `dev`.
const useHttps = extraArgs.some((arg) =>
  arg.startsWith("--experimental-https")
);
const scheme = useHttps ? "https" : "http";
const lanHost = addrs[0];
if (lanHost) {
  const lanUrl = `${scheme}://${lanHost}:${port}`;
  process.env.NEXTAUTH_URL ||= lanUrl;
  process.env.BASE_URL ||= lanUrl;
  process.env.AUTH_TRUST_HOST ||= "true";
}

console.log(`Starting Next.js dev server on ${host}:${port} ...`);
const lanKeyPath = join(
  import.meta.dirname,
  "..",
  "certificates",
  "lan-key.pem"
);
const lanCertPath = join(
  import.meta.dirname,
  "..",
  "certificates",
  "lan-cert.pem"
);
const hasLanCert = existsSync(lanKeyPath) && existsSync(lanCertPath);
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
    // SAN-covering cert is served, so the phone can register the worker once
    // the cert is trusted on the device.
    process.env.NEXT_PUBLIC_SW_ALLOW_LAN ||= "1";
    console.log(
      "  SW on LAN: enabled (serving LAN cert — trust it on the phone)."
    );
  } else {
    console.warn(
      "[serwist] --sw + --experimental-https without a LAN cert will skip worker registration: " +
        "the default dev cert is localhost-only (SSL certificate error on LAN). " +
        "Run node scripts/gen-lan-cert.mjs <LAN_IP>, trust certificates/lan-cert.pem " +
        "on the phone, and restart — or use plain HTTP `npm run dev:lan`."
    );
  }
}
if (addrs.length > 0) {
  for (const addr of addrs) {
    console.log(`  LAN: ${scheme}://${addr}:${port}`);
  }
  console.log(`  NEXTAUTH_URL=${process.env.NEXTAUTH_URL}`);
  console.log(`  BASE_URL=${process.env.BASE_URL}`);
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
