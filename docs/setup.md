# Setup (fresh clone)

One-time setup per machine. Anything device-specific stays out of git and is regenerated — see "Per-machine files" below.

## Prerequisites

- Node.js 24 + npm 11 (see `packageManager` in `package.json`; CI pins the exact image in `.github/`).
- PostgreSQL connection string (Neon or local) — the app never runs without one.
- OpenSSL on `PATH` — only needed for phone PWA testing (`openssl version` to check).
- Same Wi-Fi for the dev machine and any test phone.

## Steps

```bash
git clone <repo-url> && cd ictquest
npm install
cp .env.example .env   # or: Copy-Item .env.example .env
```

Fill in `.env` per [`env.md`](env.md): `DATABASE_URL` (prod, never point at dev), `DATABASE_URL_DEV` (local runs), `AUTH_SECRET` (`openssl rand -base64 32`), `BASE_URL` / `NEXTAUTH_URL` as `http://localhost:3000`, plus OAuth/Upstash values or placeholders as documented there.

```bash
npm run db:generate   # migrate dev DB + regenerate Prisma client
npm run dev           # http://localhost:3000
```

Verify with `npm run typecheck` and `npm run test` (full gates: `npm run validate`).

## Everyday commands

| Need | Command |
|---|---|
| Local dev (HTTP) | `npm run dev` |
| Local HTTPS | `npm run dev:https` |
| LAN testing, no worker (default) | `npm run dev:lan` → `http://<lan-ip>:3000` |
| LAN HTTPS, no worker | `npm run dev:https:lan -- --ip=<lan-ip>` |
| Phone PWA / install testing (worker on) | `npm run dev:https:lan:sw -- --ip=<lan-ip>` (cert auto-generated; trust it on the phone) |
| Production check | `npm run build && npm run start` (worker always registers here) |

`dev-lan` scripts set `NEXTAUTH_URL`/`BASE_URL`/`AUTH_URL` to the resolved LAN host (`--ip=` flag > `LAN_IP` env > auto-detect) for the spawned server only — `.env` stays `localhost`. An explicit parent value is overwritten with a warning, so the auth host and the LAN host stay identical. OAuth needs a registered LAN callback at the provider; credentials login is the supported phone path (details in [`pwa.md`](pwa.md)).

## Phone PWA testing (service worker on LAN)

Summary: one local CA per dev machine (trusted once per PC + phone), then
`npm run dev:https:lan:sw -- --ip=<lan-ip>` each run. The complete flow —
prerequisites, `.env` rules, Windows certmgr steps, Android/iOS trust steps,
the env table (`NEXT_PUBLIC_SW_IN_DEV`, `NEXT_PUBLIC_SW_ALLOW_LAN`,
`LAN_IP`, `AUTH_TRUST_HOST`, owned `NEXTAUTH_URL`/`BASE_URL`), DHCP IP
changes, verification, and cleanup — lives in
[`pwa.md`](pwa.md#full-setup-service-worker-on-lan-pc--phone) (single source
of truth, not repeated here).

```bash
npm run pwa:lan-ca                              # one time per dev machine
npm run dev:https:lan:sw -- --ip=192.168.100.74  # each run, with the live LAN IP
```

## Per-machine files (never committed, always regenerate)

| File | How to regenerate |
|---|---|
| `.env` | `cp .env.example .env`, fill per `env.md` |
| `certificates/lan-ca.pem` + `lan-ca-key.pem` | auto-created on first `dev:https:lan*` run, or manually via `npm run pwa:lan-ca`; install `lan-ca.pem` on the phone once, remove after testing |
| `certificates/lan-cert.pem` + `lan-key.pem` | auto-rebuilt by `dev-lan.mjs` when missing/stale for the passed `--ip`, or manually via `npm run pwa:lan-cert -- <LAN_IP>`; no phone step (CA already trusted) |
| `node_modules/`, `.next/`, build output | `npm install` / `npm run build` |

`certificates/` and `*.pem` are gitignored. If LAN HTTPS suddenly throws `SecurityError` on a new checkout, it is always one of: cert not yet generated on this machine, IP changed since generation, or the phone hasn't trusted this machine's cert — see [`troubleshooting.md`](troubleshooting.md#-pwa--worker).
