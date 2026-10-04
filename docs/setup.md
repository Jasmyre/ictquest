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
| LAN HTTPS, no worker | `npm run dev:https:lan` |
| Phone PWA / install testing (worker on) | `npm run dev:https:lan:sw` (requires LAN cert below) |
| Production check | `npm run build && npm run start` (worker always registers here) |

`dev-lan` scripts auto-point `NEXTAUTH_URL`/`BASE_URL` at the detected LAN IP for the spawned server only — `.env` stays `localhost`. OAuth needs a registered LAN callback at the provider; credentials login is the supported phone path (details in [`pwa.md`](pwa.md)).

## Phone PWA testing (per machine + per phone, one time each)

The default dev cert covers `localhost` only, so a phone rejects the worker with `SecurityError ... SSL certificate error`. Fix: mint a cert that covers the machine's LAN IP.

On the dev machine (use that machine's LAN IP):

```bash
node scripts/gen-lan-cert.mjs 192.168.1.67   # or: npm run pwa:lan-cert -- 192.168.1.67
```

Then trust `certificates/lan-cert.pem` on the phone **once per device**:

- Android: copy the file to the phone → Settings → Security → Install a certificate → CA certificate → open `https://<lan-ip>:3000` and accept.
- iOS: send via AirDrop/mail → install under Settings → General → VPN & Device Management → enable full trust under Settings → General → About → Certificate Trust Settings.

Then run `npm run dev:https:lan:sw` and Add to Home Screen. If the machine's IP changes, re-run the script with the new IP and re-trust.

## Per-machine files (never committed, always regenerate)

| File | How to regenerate |
|---|---|
| `.env` | `cp .env.example .env`, fill per `env.md` |
| `certificates/lan-cert.pem` + `lan-key.pem` | `node scripts/gen-lan-cert.mjs <LAN_IP>` |
| `node_modules/`, `.next/`, build output | `npm install` / `npm run build` |

`certificates/` and `*.pem` are gitignored. If LAN HTTPS suddenly throws `SecurityError` on a new checkout, it is always one of: cert not yet generated on this machine, IP changed since generation, or the phone hasn't trusted this machine's cert — see [`troubleshooting.md`](troubleshooting.md#-pwa--worker).
