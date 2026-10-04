# PWA

Assets-only offline worker (Serwist 9). No push, no background/periodic sync, no auth logic in the worker — pinned by the `sw background behavior absence` suite.

## Concepts (see `CONTEXT.md`)

Install icon family (standard + maskable + Apple touch, from `public/favicon.ico`) · Apple launch screens (minimal portrait set) · precache (public files only, revisioned) · routing policy (pages with user content + all APIs network-only; unknown routes network by default) · offline fallback (single generic `/offline`) · standalone styling (native display-mode media only).

## Pipeline

- Source: `src/pwa.ts` (identity), `src/app/manifest.ts`, root layout (viewport lock + Apple metadata), `src/sw-policy.ts` + `src/sw.ts`.
- Regenerate binaries: `npm run pwa:assets` (`scripts/pwa-assets.mjs`, pinned `pwa-asset-generator@8.1.5`) → 24 committed files under `public/pwa/`.
- Build: `npm run build` runs `next build && serwist build` → `public/sw.js` (65 precached URLs, gitignored).

## Audit gate (release bar)

Run over a secure context — production build on `http://localhost:3000`, or LAN HTTPS for devices. Plain `npm run dev` never registers the worker (`SerwistProvider` disables it); `dev:https:lan:sw` opts in via `NEXT_PUBLIC_SW_IN_DEV=1`.

```bash
npm run build
npm run start
```

Keep route statuses: `/offline` ◐, `/manifest.webmanifest` ○, `/api/openapi.json` ○, `/reference` ○.

1. DevTools → Application → Manifest: no errors, installability green.
2. Application → Service workers: registered + controlling.
3. Offline (SW Offline or Network Offline) → reload: every failed navigation serves `/offline` (retry = real reload, never a cached signed-in page or API payload).

Lighthouse has no PWA category since v12 — no score gate; legacy ≤11 audits optional.

## LAN device testing

```bash
npm run dev:https          # local HTTPS only (localhost SANs)
npm run dev:https:lan -- --ip=<lan-ip>      # phone testing: LAN IP + BASE_URL/NEXTAUTH_URL pointed at it
npm run dev:https:lan:sw -- --ip=<lan-ip>   # + worker enabled (install testing; cert auto-generated)
```

`scripts/dev-lan.mjs` auto-points `NEXTAUTH_URL`/`BASE_URL` at the detected LAN IP (and sets `AUTH_TRUST_HOST=true`) for the spawned server only — explicit env still wins, `.env` stays `localhost` for plain `npm run dev`. OAuth logins still need a registered LAN callback URL at the provider; credentials login is the supported phone path.

First run may prompt for password (mkcert CA install). `certificates/` is per-machine, gitignored — each dev regenerates. For phone worker testing, pass `--ip=<lan-ip>` (your machine's current IPv4): `dev-lan.mjs` auto-generates a SAN-covering cert if missing or stale for that IP (`certificates/lan-cert.pem` + `lan-key.pem`, via `openssl`), serves it, and sets `NEXT_PUBLIC_SW_ALLOW_LAN=1` so the worker registers on the LAN host. On the phone: same Wi-Fi → install `lan-cert.pem` as a trusted certificate (again after each regeneration) → open `https://<lan-ip>:3000` → credentials login (OAuth needs a registered LAN callback) → Add to Home Screen. Without a covering trusted cert, LAN registration stays disabled with a warning (localhost-only dev cert → `SecurityError ... SSL certificate error`). Only one dev server per directory at a time. Full flow in `docs/setup.md`.

## Decisions

- ADR `0003`: locked viewport (`maximumScale: 1`, `userScalable: false`) + Apple metadata — accessibility tradeoff recorded, revisit on audit/feedback.
- ADR `0004`: Serwist configurator + assets-only policy.
