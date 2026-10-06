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

## Full setup: service worker on LAN (PC + phone)

Goal: open `https://<lan-ip>:3000` on the dev PC **and** on a phone, with the
service worker registered on both. The default dev cert covers `localhost`
only, so a LAN host rejects the worker with
`SecurityError ... SSL certificate error` — the setup below replaces it with
a LAN certificate chained to a local CA that both devices trust.

### 1. Prerequisites

- Node.js 24 + npm 11, OpenSSL on `PATH` (`openssl version` must print).
- Dev PC and phone on the same Wi-Fi.
- `.env` per [`env.md`](env.md): `BASE_URL` / `NEXTAUTH_URL` stay
  `http://localhost:3000` (the LAN scripts override them per-process —
  never edit `.env` for LAN), `AUTH_SECRET` set, Upstash placeholders
  acceptable locally. No PWA variable goes in `.env` — the scripts set them
  (table below).

### 2. One time per dev machine: make the local CA

```bash
npm run pwa:lan-ca
```

Writes `certificates/lan-ca.pem` (+ `lan-ca-key.pem`, gitignored, never
committed, never shared). Every LAN certificate is made from this CA, so
devices trust it **once** and IP changes need no new trust step.

### 3. One time per PC: trust the CA on Windows

Without this, the dev PC itself throws the same `SecurityError` as the phone.

1. Open `certificates\lan-ca.pem` (double-click).
2. Click `Install Certificate` → `Local Machine` → `Next` (approve the UAC prompt).
3. `Place all certificates in the following store` → `Browse` →
   `Trusted Root Certification Authorities` → `OK` → `Next` → `Finish`.
4. Fully quit Chrome and open it again (Chrome reads the new trust entry only at start).

### 4. One time per phone: trust the CA

- Android: copy `lan-ca.pem` to the phone → Settings → Security → Install a
  certificate → CA certificate (Samsung: Security and privacy → Other
  security settings → View security certificates).
- iOS: send via AirDrop/mail → install under Settings → General → VPN and
  Device Management → enable full trust under Settings → General → About →
  Certificate Trust Settings.

### 5. Each run: start with the live LAN IP

Find the PC's current Wi-Fi IPv4 (`ipconfig` on Windows), then:

```bash
npm run dev:https:lan:sw -- --ip=<lan-ip>
# example: npm run dev:https:lan:sw -- --ip=192.168.1.27
```

Bare `npm run dev:https:lan:sw` auto-detects the Wi-Fi IP (virtual
WSL/Hyper-V adapters never win); `--ip=` pins it explicitly and survives
DHCP changes. The script points `NEXTAUTH_URL`/`BASE_URL`/`AUTH_URL` at
`https://<lan-ip>:3000` (child process only), rebuilds the leaf certificate
when missing or stale for that IP, serves the pair, and sets
`NEXT_PUBLIC_SW_ALLOW_LAN=1` so the worker registers.

### 6. Verify

- PC: open `https://<lan-ip>:3000` — lock icon, no console error,
  DevTools → Application → Service workers: registered + controlling.
- Phone: same Wi-Fi → `https://<lan-ip>:3000` → credentials login (OAuth
  needs a registered LAN callback at the provider) → Add to Home Screen.
- Offline: DevTools offline → reload → the single generic offline fallback
  serves (retry = real reload, never a cached signed-in page or API payload).

### Env used for PWA testing (scripts set these — do not hand-set)

| Variable | Who sets it | Meaning |
|---|---|---|
| `NEXT_PUBLIC_SW_IN_DEV=1` | `dev-lan.mjs` via `--sw` | Register the worker in dev (never set in production). |
| `NEXT_PUBLIC_SW_ALLOW_LAN=1` | `dev-lan.mjs`, only when a SAN-covering LAN cert is served (forced back to `"0"` with a visible error when none exists) | Allow dev registration on a LAN host. Hand-setting it against an untrusted cert reproduces the raw `SecurityError`. |
| `LAN_IP` | `dev-lan.mjs` (resolved host: `--ip=` flag > `LAN_IP` env > auto-detect) | Published to the child so `allowedDevOrigins` agrees with the server URL. |
| `AUTH_TRUST_HOST=true` | `dev-lan.mjs` (child only) | Trust the LAN host for Auth.js. |
| `NEXTAUTH_URL` / `BASE_URL` / `AUTH_URL` | `dev-lan.mjs` (child only, explicit parent values overwritten with a warning) | Point auth + metadata at `https://<lan-ip>:3000` so phones never bounce to localhost. `.env` stays `localhost`. |

### Command matrix

```bash
npm run dev                 # local HTTP, worker off
npm run dev:https           # local HTTPS only (localhost SANs), worker off
npm run dev:lan             # LAN HTTP, worker off (default LAN testing, cert-free)
npm run dev:https:lan -- --ip=<lan-ip>      # LAN HTTPS, worker off
npm run dev:https:lan:sw -- --ip=<lan-ip>   # LAN HTTPS + worker on (install testing)
```

Only one dev server per directory at a time.

### If the IP changes (DHCP)

Re-run with the new `--ip=` — the leaf certificate rebuilds from the CA
automatically, and **no device needs a new trust step**. The phone holds one
CA entry, not one per IP.

### After testing: remove the CA

- PC: `certmgr.msc` → Trusted Root Certification Authorities →
  `ICTQuest LAN CA` → Delete, then restart Chrome.
- Android: Settings → Security → Trusted credentials (User tab) →
  `ICTQuest LAN CA` → Remove.
- iOS: Settings → General → VPN and Device Management →
  `ICTQuest LAN CA` → Remove Downloaded Profile.

While installed, a device trusts LAN certificates made by the dev machine
(LAN names only; the key never leaves `certificates/`). Remove the entry
when the session ends — that is the full cleanup.

### When it fails

- Visible `[serwist] SW registration failed ... SSL certificate error`:
  the SAN covers the IP but a device does not trust the CA yet — redo
  steps 3–4, then restart with the current `--ip=`.
- Check the SAN directly:
  `openssl x509 -in certificates/lan-cert.pem -noout -ext subjectAltName`
  must list the live IP.
- `dev:https` opened via a LAN IP always fails (localhost-only cert) — use
  `dev:https:lan:sw` instead. Plain `npm run dev:lan` needs no cert at all.

## Decisions

- ADR `0003`: locked viewport (`maximumScale: 1`, `userScalable: false`) + Apple metadata — accessibility tradeoff recorded, revisit on audit/feedback.
- ADR `0004`: Serwist configurator + assets-only policy.
