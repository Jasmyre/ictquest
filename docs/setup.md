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

`dev-lan` scripts auto-point `NEXTAUTH_URL`/`BASE_URL` at the detected LAN IP for the spawned server only — `.env` stays `localhost`. OAuth needs a registered LAN callback at the provider; credentials login is the supported phone path (details in [`pwa.md`](pwa.md)).

## Phone PWA testing (one CA trust + `--ip` each run)

The default dev cert covers `localhost` only, so a phone rejects the service worker with `SecurityError ... SSL certificate error`. The fix has two parts: a local CA the phone trusts **one time**, plus a per-IP certificate made from that CA (automatic).

**One time per dev machine** — make the CA (or let the dev script make it for you on first run):

```bash
npm run pwa:lan-ca
```

**One time per phone** — trust `certificates/lan-ca.pem`:

- Android: copy the file to the phone → Settings → Security → Install a certificate → CA certificate. (Vendor names differ; Samsung: Security and privacy → Other security settings → View security certificates.)
- iOS: send via AirDrop/mail → install under Settings → General → VPN and Device Management → enable full trust under Settings → General → About → Certificate Trust Settings.

**Each run** — pass the machine's current LAN IP (`ipconfig` on Windows, look at the Wi-Fi adapter's IPv4):

```bash
npm run dev:https:lan:sw -- --ip=192.168.100.74
```

The script rebuilds the LAN-IP certificate from the CA when missing or stale — **no new phone step at an IP change**, and the phone holds one entry instead of one per IP. Then Add to Home Screen.

**After testing** — remove the CA from the phone (under one minute):

- Android: Settings → Security → Trusted credentials (or View security certificates) → User tab → `ICTQuest LAN CA` → Remove (or Forget).
- iOS: Settings → General → VPN and Device Management → `ICTQuest LAN CA` → Remove Downloaded Profile.

**Safety note (including daily-use phones):** while installed, the phone trusts LAN certificates made by your dev machine. The CA key never leaves `certificates/` (gitignored, never committed) and signs LAN names only. Still, remove the entry when the test session ends — that is the full cleanup.

## Per-machine files (never committed, always regenerate)

| File | How to regenerate |
|---|---|
| `.env` | `cp .env.example .env`, fill per `env.md` |
| `certificates/lan-ca.pem` + `lan-ca-key.pem` | auto-created on first `dev:https:lan*` run, or manually via `npm run pwa:lan-ca`; install `lan-ca.pem` on the phone once, remove after testing |
| `certificates/lan-cert.pem` + `lan-key.pem` | auto-rebuilt by `dev-lan.mjs` when missing/stale for the passed `--ip`, or manually via `npm run pwa:lan-cert -- <LAN_IP>`; no phone step (CA already trusted) |
| `node_modules/`, `.next/`, build output | `npm install` / `npm run build` |

`certificates/` and `*.pem` are gitignored. If LAN HTTPS suddenly throws `SecurityError` on a new checkout, it is always one of: cert not yet generated on this machine, IP changed since generation, or the phone hasn't trusted this machine's cert — see [`troubleshooting.md`](troubleshooting.md#-pwa--worker).
