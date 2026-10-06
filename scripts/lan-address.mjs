#!/usr/bin/env node
/**
 * Shared LAN address selection for dev tooling.
 *
 * Single source of truth for picking the machine's real LAN IPv4:
 * virtual adapters (WSL, Hyper-V, Docker, VPN, ...) never win over
 * real Wi-Fi/Ethernet addresses. Used by `scripts/dev-lan.mjs`
 * (NEXTAUTH_URL/BASE_URL + cert target) and `next.config.ts`
 * (`allowedDevOrigins`) so both agree on the same host.
 */
import { networkInterfaces } from "node:os";

export const VIRTUAL_IFACE_PATTERN =
  /wsl|vethernet|hyper-?v|virtualbox|vmware|vbox|docker|br-|veth|tailscale|zerotier|loopback|isatap|teredo|\btun\d*|\btap\d*|\bvpn/i;
export const PRIVATE_172_PATTERN = /^172\.(\d{1,3})\./;
export const IPV4_PATTERN = /^\d{1,3}(\.\d{1,3}){3}$/;

/**
 * Lower rank wins: 192.168.x > 10.x > 172.16-31.x > other, virtual last.
 * WSL/Hyper-V defaults (172.25/29/30.x) rank below other 172.16-31.x
 * even when the adapter name hides the virtual origin.
 */
export function rankLanAddress(address, isVirtual) {
  if (isVirtual) {
    return 100;
  }
  if (address.startsWith("192.168.")) {
    return 0;
  }
  if (address.startsWith("10.")) {
    return 10;
  }
  const m172 = address.match(PRIVATE_172_PATTERN);
  if (m172) {
    const second = Number(m172[1]);
    if (second >= 16 && second <= 31) {
      if (second === 25 || second === 29 || second === 30) {
        return 50;
      }
      return 20;
    }
  }
  return 60;
}

/**
 * Ranked external IPv4 entries. Accepts an injectable `nets` map
 * (shape of `os.networkInterfaces()`) for unit tests.
 */
export function getLanEntries(nets = networkInterfaces()) {
  const entries = [];
  for (const [name, list] of Object.entries(nets ?? {})) {
    for (const net of list ?? []) {
      if (net?.family === "IPv4" && !net.internal) {
        entries.push({
          address: net.address,
          name,
          virtual: VIRTUAL_IFACE_PATTERN.test(name),
        });
      }
    }
  }
  entries.sort(
    (a, b) =>
      rankLanAddress(a.address, a.virtual) -
        rankLanAddress(b.address, b.virtual) ||
      a.address.localeCompare(b.address)
  );
  return entries;
}

/** Best-guess real LAN host, or `undefined` when none exists. */
export function getLanHost(nets) {
  return getLanEntries(nets)[0]?.address;
}

/**
 * Non-virtual LAN addresses for `allowedDevOrigins`, plus loopbacks.
 * Honors an explicit `LAN_IP` env override first when it looks like IPv4.
 */
export function getAllowedDevOrigins(nets) {
  const origins = new Set(["localhost", "127.0.0.1"]);
  const override = process.env.LAN_IP?.trim();
  if (override && IPV4_PATTERN.test(override)) {
    origins.add(override);
  }
  for (const entry of getLanEntries(nets)) {
    if (!entry.virtual) {
      origins.add(entry.address);
    }
  }
  // When every interface is virtual (WSL-only box), still allow the
  // detected host so the dev server stays reachable.
  const entries = getLanEntries(nets);
  if (origins.size <= 2 && entries[0]) {
    origins.add(entries[0].address);
  }
  return [...origins];
}
