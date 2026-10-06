# Retire mock social-new, server-rendered People list, LAN-first PWA testing

`social/new` was a client mock: hardcoded sample users, dead compose surface, no data behind it. It is deleted (`social/new/page.tsx` + `loading.tsx`, nav/guard references retargeted to `/social`). `/social` becomes a server-rendered People list — async Server Component calling `getUsersStats()` with `"use cache"`, narrow `"use client"` `SocialList` leaf for search — because story 13's "post to the mock social flow" never had a backing entity and #23 keeps it out of scope ("social-new stays mock with no moderator gate; no new UGC entity"). Compose returns only when a real UGC entity lands; Follow/Report/Block stay visibly disabled with TODOs as the honest interim. Phone PWA testing moves to a per-machine local CA + SAN leaf flow (`gen-lan-ca.mjs`, `gen-lan-cert.mjs`, `lan-address.mjs` as the single rank/select source, `dev:https:lan:sw`, `NEXT_PUBLIC_SW_ALLOW_LAN=1`) with SW skipped on untrusted LAN hosts (`shouldDisableSwRegistration` + visible cert-error message), because story 26's offline shell can't be exercised on a phone without trusted TLS first.

## Considered Options

- **Keep social-new as the spec-mandated mock**: preserve the route exactly per #23 ("social plus mock social-new"). Rejected — it keeps a dead surface that contradicts the no-placeholder-identity production rule in `AGENTS.md`; the guard matrix then protects a page with no function.
- **Restore posting via a quick UGC table**: add a minimal post entity so compose works. Rejected — #23 explicitly scopes UGC out ("MODERATOR is reserved … no new UGC entity"); a drive-by entity would bypass the domain decision.
- **Exercise the offline story over plain-HTTP LAN**: register the worker without TLS. Rejected — service workers require a secure context; the choice is trusted-CA TLS or no SW, and silent failure is worse than a visible skip with remediation.

## Consequences

- `/social/new` is gone from routes, guards (`route-guards.test.ts` expectation deleted), `site-header`, and `command-search`; authed social surface is `/social` only.
- Follow/Report/Block are disabled TODOs; wiring them is blocked on a future UGC entity decision, not on this ADR.
- LAN TLS artifacts (`certificates/lan-ca.pem`, `lan-cert.pem`, `lan-key.pem`) are per-machine, gitignored, never committed; phone trusts the CA once, IP changes need zero phone steps.
- SW stays disabled outside production and on untrusted LAN hosts; the cert-error path is console-visible by design until a UI surface exists.
