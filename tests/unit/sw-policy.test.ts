import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  buildSwCertErrorMessage,
  decideSwRequest,
  isSwCertError,
  OFFLINE_FALLBACK_URL,
  SW_PRECACHED_URLS,
  SW_SCOPE,
  SW_URL,
  type SwRequestSnapshot,
  shouldServeOfflineFallback,
} from "@/sw-policy";

const ROOT = join(__dirname, "..", "..");

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

function snapshot(
  url: string,
  overrides: Partial<SwRequestSnapshot> = {}
): SwRequestSnapshot {
  return {
    destination: "",
    getHeader: () => null,
    method: "GET",
    mode: "navigate",
    origin: "https://ictquest.test",
    url,
    ...overrides,
  };
}

const headerSnapshot = (url: string, header: string): SwRequestSnapshot =>
  snapshot(url, { getHeader: (name) => (name === header ? "1" : null) });

describe("Service-worker routing policy — pure offline decision", () => {
  it("exposes the worker identity and fallback", () => {
    expect(SW_URL).toBe("/serwist/sw.js");
    expect(SW_SCOPE).toBe("/");
    expect(OFFLINE_FALLBACK_URL).toBe("/~offline");
  });

  it("serves only the public deployment-versioned set from precache", () => {
    expect([...SW_PRECACHED_URLS]).toEqual([
      "/~offline",
      "/maintenance",
      "/manifest.webmanifest",
      "/api/v1/openapi.json",
    ]);
    for (const url of SW_PRECACHED_URLS) {
      expect(decideSwRequest(snapshot(`https://ictquest.test${url}`))).toBe(
        "precached"
      );
    }
  });

  it("keeps every live surface network-only", () => {
    // Document navigations and unknown future routes default network-only.
    expect(decideSwRequest(snapshot("https://ictquest.test/"))).toBe(
      "network-only"
    );
    expect(decideSwRequest(snapshot("https://ictquest.test/landing"))).toBe(
      "network-only"
    );
    expect(decideSwRequest(snapshot("https://ictquest.test/lessons"))).toBe(
      "network-only"
    );
    expect(decideSwRequest(snapshot("https://ictquest.test/admin/users"))).toBe(
      "network-only"
    );
    // Auth, typed transport, versioned REST (either scheme) stay live —
    // except the exact static contract, which is allowlisted above.
    expect(
      decideSwRequest(snapshot("https://ictquest.test/api/auth/session"))
    ).toBe("network-only");
    expect(
      decideSwRequest(
        snapshot("https://ictquest.test/api/trpc/user.getUserProgress")
      )
    ).toBe("network-only");
    expect(decideSwRequest(snapshot("https://ictquest.test/api/v1/me"))).toBe(
      "network-only"
    );
    expect(
      decideSwRequest(snapshot("https://ictquest.test/api/public/lessons"))
    ).toBe("network-only");
    // RSC payloads, router prefetches, and Server Actions stay live.
    for (const header of [
      "rsc",
      "next-router-prefetch",
      "next-router-state-tree",
      "next-action",
    ]) {
      expect(
        decideSwRequest(
          headerSnapshot("https://ictquest.test/~offline", header)
        )
      ).toBe("network-only");
    }
    // Mutations, cross-origin, and unparsable URLs never serve stale.
    expect(
      decideSwRequest(
        snapshot("https://ictquest.test/~offline", { method: "POST" })
      )
    ).toBe("network-only");
    expect(decideSwRequest(snapshot("https://evil.test/~offline"))).toBe(
      "network-only"
    );
    expect(decideSwRequest(snapshot("not-a-url"))).toBe("network-only");
  });

  it("serves the offline fallback for documents only", () => {
    expect(shouldServeOfflineFallback({ destination: "document" })).toBe(true);
    for (const destination of ["image", "script", "style", "font", ""]) {
      expect(shouldServeOfflineFallback({ destination })).toBe(false);
    }
  });

  it("detects LAN-TLS cert failures for the visible error path", () => {
    const certError = new DOMException(
      "Failed to register a ServiceWorker for scope ('https://192.168.1.27:3000/') with script ('https://192.168.1.27:3000/serwist/sw.js'): An SSL certificate error occurred when fetching the script.",
      "SecurityError"
    );
    expect(isSwCertError(certError)).toBe(true);
    // DOMException is not `instanceof Error` in browsers: a plain
    // name/message record must match too.
    expect(
      isSwCertError({
        name: "SecurityError",
        message: "An SSL certificate error occurred when fetching the script.",
      })
    ).toBe(true);
    expect(
      isSwCertError(
        "SecurityError: Failed to register a ServiceWorker: An SSL certificate error occurred"
      )
    ).toBe(true);
    expect(isSwCertError({ reason: certError })).toBe(true);
    expect(isSwCertError(new Error("NetworkError: offline"))).toBe(false);
    expect(isSwCertError("SecurityError: permission denied")).toBe(false);
    expect(isSwCertError(null)).toBe(false);
    expect(isSwCertError(undefined)).toBe(false);
  });

  it("builds a remediation naming the failing host and both trust stores", () => {
    const message = buildSwCertErrorMessage("192.168.1.27:3000");
    expect(message).toContain("192.168.1.27:3000");
    expect(message).toContain("lan-ca.pem");
    expect(message).toContain("certmgr");
    expect(message).toContain("dev:https:lan:sw");
    expect(message).toContain("dev:lan");
  });

  it("stays in sync with the worker source and the build precache", () => {
    const sw = read("src/app/sw.ts");
    expect(sw).toContain(OFFLINE_FALLBACK_URL);
    expect(sw).toContain("NetworkOnly");
    expect(sw).toContain("document");

    const config = read("src/app/serwist/[path]/route.ts");
    expect(config).toContain("createSerwistRoute");
    expect(config).toContain("SW_PRECACHED_URLS");
    // The versioned set is consumed, not duplicated: every allowlisted URL
    // flows into additionalPrecacheEntries via the shared constant (whose
    // exact contents are pinned above).
    expect(config).toContain("additionalPrecacheEntries");
    expect(config).toMatch(/SW_PRECACHED_URLS\.map/);
    // No stale template entries survive the adaptation.
    expect(config).not.toContain('"/offline"');
    expect(config).not.toContain('"/reference"');
    expect(config).not.toContain('"/api/openapi.json"');

    const routes = read("src/routes.ts");
    expect(routes).toContain(OFFLINE_FALLBACK_URL);
    expect(routes).toContain("/maintenance");
  });
});
