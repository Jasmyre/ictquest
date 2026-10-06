"use client";

import { SerwistProvider } from "@serwist/turbopack/react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import {
  buildSwCertErrorMessage,
  isSwCertError,
  shouldDisableSwRegistration,
} from "@/sw-policy";

/**
 * Non-cached client boundary for worker registration (Migration 16, #39).
 *
 * The root layout is a cached (`"use cache"`) server segment, so SW
 * registration must live in a client component: `SerwistProvider` only
 * touches `window`/`navigator` on the client and no-ops on the server.
 * `reloadOnOnline` stays `false` so a reconnect never wipes in-progress
 * quiz/form state; registration itself is disabled outside production to
 * avoid dev cache hell, except when explicitly opted in
 * (`NEXT_PUBLIC_SW_IN_DEV=1`) on localhost — or on a LAN host with the
 * trusted-LAN escape hatch (`NEXT_PUBLIC_SW_ALLOW_LAN=1`, set by
 * `dev:https:lan:sw` when `certificates/lan-cert.pem` exists). LAN hosts
 * without a SAN-covering trusted cert stay disabled: the default
 * `next dev --experimental-https` cert covers `localhost` only, so
 * registering there throws `SecurityError: ... SSL certificate error ...`.
 * When the SAN covers the IP but no device trusts the local CA yet, the
 * browser still rejects the script — that failure stays a visible
 * `console.error` with remediation (per user choice), never a silent skip.
 * The worker is built by the Serwist route handler
 * (`src/app/serwist/[path]/route.ts`) and served at `/serwist/sw.js`.
 */
export function SwProvider({
  children,
  swUrl = "/serwist/sw.js",
}: Readonly<{ children: ReactNode; swUrl?: string }>) {
  const envDisable =
    process.env.NODE_ENV !== "production" &&
    process.env.NEXT_PUBLIC_SW_IN_DEV !== "1";
  const [guardDisabled, setGuardDisabled] = useState(false);
  const certErrorLogged = useRef(false);

  useEffect(() => {
    const guard = shouldDisableSwRegistration({
      allowLan: process.env.NEXT_PUBLIC_SW_ALLOW_LAN,
      hostname: window.location.hostname,
      isSecureContext: window.isSecureContext,
      nodeEnv: process.env.NODE_ENV,
      swInDev: process.env.NEXT_PUBLIC_SW_IN_DEV,
    });
    if (guard && !envDisable) {
      setGuardDisabled(true);
      console.warn(
        `[serwist] SW registration skipped on "${window.location.host}": ` +
          "dev worker requires localhost + secure context, or a trusted LAN " +
          "cert (localhost-only self-signed cert fails on LAN IPs with SSL " +
          "certificate error). PC: install certificates/lan-ca.pem into " +
          "Windows Trusted Root CA (certmgr) and restart Chrome; phone: " +
          "install certificates/lan-ca.pem once as trusted " +
          "(npm run pwa:lan-ca), then restart with " +
          "npm run dev:https:lan:sw -- --ip=<lan-ip> — or use plain HTTP " +
          "npm run dev:lan for non-PWA LAN testing."
      );
    }
  }, [envDisable]);

  useEffect(() => {
    if (envDisable || guardDisabled) {
      return;
    }
    const report = (value: unknown): void => {
      if (certErrorLogged.current || !isSwCertError(value)) {
        return;
      }
      certErrorLogged.current = true;
      console.error(buildSwCertErrorMessage(window.location.host));
    };
    const onError = (event: ErrorEvent): void => {
      report(event.error ?? event.message);
    };
    const onRejection = (event: PromiseRejectionEvent): void => {
      report(event.reason);
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, [envDisable, guardDisabled]);

  const disable = envDisable || guardDisabled;
  return (
    <SerwistProvider disable={disable} reloadOnOnline={false} swUrl={swUrl}>
      {children}
    </SerwistProvider>
  );
}
