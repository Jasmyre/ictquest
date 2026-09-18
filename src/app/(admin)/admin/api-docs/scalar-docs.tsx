"use client";

import { useEffect, useState } from "react";

/**
 * Client-only Scalar docs loader.
 *
 * The Scalar bundle is loaded lazily at runtime so the interactive docs UI
 * never lands in the default prod bundle (ADR 0005). Reads the public
 * `/api/v1/openapi.json` contract. Falls back to a direct JSON link when
 * the CDN/bundle cannot load (e.g. offline).
 */
export default function ScalarDocs() {
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">(
    "loading"
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const specRes = await fetch("/api/v1/openapi.json");
        if (!specRes.ok || cancelled) {
          if (!cancelled) {
            setStatus("fallback");
          }
          return;
        }
        // Lazily pull the Scalar reference UI only inside the admin shell.
        await import("@scalar/api-reference");
        if (!cancelled) {
          setStatus("ready");
        }
      } catch {
        if (!cancelled) {
          setStatus("fallback");
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "fallback") {
    return (
      <p data-testid="api-docs-fallback">
        Scalar interactive docs are unavailable here. Fetch /api/v1/openapi.json
        directly.
      </p>
    );
  }

  return (
    <div data-testid="api-docs">
      <p>Scalar API reference for /api/v1/openapi.json</p>
      {status === "loading" ? <p>Loading API reference…</p> : null}
      <div id="scalar-reference" />
    </div>
  );
}
