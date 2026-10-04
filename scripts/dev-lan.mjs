#!/usr/bin/env node
import { spawn } from "node:child_process";
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
 * NOTE: `--sw` with `--experimental-https` on a LAN IP (e.g. static
 * 192.168.1.67) cannot register a worker: the default Next.js dev cert
 * covers `localhost` only, so the browser rejects `/serwist/sw.js` with
 * `SecurityError: ... SSL certificate error ...`. The client guard in
 * `SwProvider` skips registration there with a warning. Prefer plain HTTP
 * `npm run dev:lan` for LAN testing; use localhost HTTPS for PWA tests.
 */
import { networkInterfaces } from "node:os";

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
if (enableSw && useHttps) {
  console.warn(
    "[serwist] --sw + --experimental-https on a LAN IP will skip worker registration: " +
      "the default dev cert is localhost-only (SSL certificate error on LAN). " +
      "Use plain HTTP `npm run dev:lan` for LAN testing."
  );
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
