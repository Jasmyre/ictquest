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
 */
import { networkInterfaces } from "node:os";

const port = process.env.PORT ?? "3000";
const host = process.env.HOSTNAME ?? "0.0.0.0";
const extraArgs = process.argv.slice(2);

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
console.log(`Starting Next.js dev server on ${host}:${port} ...`);
if (addrs.length > 0) {
  for (const addr of addrs) {
    console.log(`  LAN: http://${addr}:${port}`);
  }
} else {
  console.log("  (no external IPv4 interface detected)");
}

const binary = `npx${process.platform === "win32" ? ".cmd" : ""}`;
const child = spawn(
  binary,
  ["next", "dev", "-H", host, "-p", port, ...extraArgs],
  {
    stdio: "inherit",
  }
);

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
