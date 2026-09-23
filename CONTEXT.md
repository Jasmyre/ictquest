# Roles & Permissions Context

The authentication and authorization domain: how users hold roles and what those roles grant.

## Language

**Role**:
One of `ADMIN`, `MODERATOR`, or `USER` (the `RoleName` enum). Users hold zero or more roles; their effective permissions are the union of their roles' grants.
_Avoid_: Permission, access level, group

**Default role**:
The `USER` role; every user receives it at creation — whether registered with credentials or signed up through a social provider. A user who holds only this role sees and posts, but manages nothing.
_Avoid_: Standard role, base role

**Role-less user**:
A user who holds no roles. This is an invalid state that must not exist: they can sign in but are denied every permission check, so the system prevents creating or saving one.
_Avoid_: Disabled user, suspended user, "user with no role"

**Suspended user**:
A user whose `suspendedAt` timestamp is set by an admin. Suspension blocks credential sign-in and denies existing sessions on privileged and admin paths, while every role membership underneath is preserved untouched — unsuspend clears the timestamp and restores exactly what the user had. It is the approved disable mechanism; stripping roles is never suspension.
_Avoid_: Role-less user, deleted user, banned (no separate ban state exists)

**Session-freshness rule**:
Session roles are the JWT-stamped copy used everywhere by default, so non-privileged paths issue no extra membership lookup. Privileged paths — the `(admin)` shell guard, `adminProcedure` / `moderatorProcedure`, and `permissionProcedure("Admin", *)` — re-read current memberships and the suspension flag per request and fall back to the session copy when the lookup fails.
_Avoid_: Per-request reads on learner paths; trusting the session copy on privileged paths; reading the database at the edge proxy

**Nav visibility by session state**:
Presentation filtering deciding which header links the shared site header renders — guests see Home + Lessons only, signed-in users see the full nav (search and privileged palette entries follow the same rule). It grants nothing; real authorization stays in the proxy guards and `permissionProcedure`.
_Avoid_: Calling it ABAC or a permission check; hiding a link as a substitute for guarding its route

## Database language

**Production database**:
The live user-data database, addressed by `DATABASE_URL`. `migrate deploy` only — never `migrate dev`, never `db push`.
_Avoid_: Main db, primary db

**Development database**:
The scratch database for schema authoring, addressed by `DATABASE_URL_DEV` (falls back to `DATABASE_URL` when unset). The only target `migrate dev` may run against.
_Avoid_: Main db, local db (unless truly local-only)

**Test database**:
The ephemeral database for CI/integration runs, addressed by `DATABASE_URL_TEST` (falls back to `DATABASE_URL` when unset; CI constructs it from its Postgres service). Migrated per run, then discarded.
_Avoid_: Dev db, staging db

**Deploy script target**:
One of `prod` / `dev` / `test` passed to `scripts/db-with-url.mjs`, selecting which URL a `db:*` command runs against. The helper re-exports the selection as `DATABASE_URL` and refuses empty values.
_Avoid_: Db package (there is no `packages/db`; scripts only)

## REST and OpenAPI language

**Procedure vs Operation**:
A Procedure is the code-side definition — one name with validated inputs, permission checks, and domain rules behind it, and the source of truth the web app calls. An Operation is the HTTP-side entry — one method plus one path with plain request/response shapes. Each supported Operation maps to exactly one Procedure.
_Avoid_: Swapping the two; "endpoint" or "route" when the code/HTTP distinction matters

**Document vs Reference UI**:
The Document is the machine-readable contract describing every supported Operation — paths, shapes, auth schemes, and error codes — read by generators and agents. The Reference UI is the live, human-readable page that renders the Document so a developer can read and try every Operation without guessing paths.
_Avoid_: Calling the rendered page the contract, or the contract the page; "docs" when the Document/page distinction matters

**REST mount**:
The versioned plain-JSON surface where Operations are called. It sits alongside the unchanged typed in-app transport; the Document describes this mount only, and privileged management stays off it.
_Avoid_: Document, Reference UI (the mount is the callable surface, not its description or its browser page)

**Bearer token vs session**:
A Bearer token is a named, expiring, revocable credential for external callers — presented per request and granting exactly the holder's own access, never more. A session is the browser's cookie-based sign-in. Both resolve to the same user-with-roles, so permission checks behave identically on either.
_Avoid_: Sharing a session cookie with scripts; treating a token as elevated access

## Release language

**Commit**:
The code-side record of one change — one qoomon type (`feat, fix, perf, refactor, style, test, docs, build, ops, chore`), optional free-form scope, imperative lowercase description. Pipeline changes are `ops:`, never `ci:`.
_Avoid_: Using issue IDs as scopes; past-tense or capitalized descriptions

**PR title**:
The squash-merge source of truth for releases — linted to the same Commit format, so the merged commit stays parseable even when branch commits are not.
_Avoid_: Free-form titles; relying on branch commit history after a squash

**Release**:
The automated cutter (release-please) that turns conventional PR titles on `main` into a version bump, tag (`vX.Y.Z`), and GitHub Release. Developers never hand-edit versions.
_Avoid_: Manual tags outside the baseline bootstrap; hand-editing generated bumps

## Overlay language

**Dialog**:
A centered modal requiring a decision or input.
_Avoid_: Popup, drawer

**Sheet**:
An edge-anchored panel for navigation or details.
_Avoid_: Drawer, popup, modal

**Back-close overlay**:
A Dialog or Sheet that pushes a history entry while open so the browser Back button closes it instead of navigating away.
_Avoid_: Treating DropdownMenu, Popover, or Tooltip as back-close overlays — those are anchored transients that dismiss on outside interaction

## PWA language

**Install icon family**:
The committed icon variants that identify the installed web application across platforms: standard icons, a maskable icon, and the Apple touch icon. They are derived from one source image so the install identity remains consistent.
_Avoid_: Using "favicon" for every install icon; the favicon is the source asset, not the full family.

**Apple launch screen**:
An iOS home-screen launch image. This application uses a deliberately minimal generated set; it is separate from the install icon family.
_Avoid_: Calling every iOS image an icon or assuming launch screens are required for installability.

**Service worker**:
A script the browser runs in the background to serve cached files when the network is slow or gone. It never checks identity and never grants access; login, roles, and permission checks still happen on the server for every call. It sends no push notifications and runs no background or periodic sync.
_Avoid_: Treating cached content as proof of access; the worker holds no session. Expecting push notifications or background sync; the worker has none.

**Routing policy**:
The single rule set that decides what the service worker may serve from cache and what must always use the network. All pages with user content, all typed-transport calls, and all REST mount Operations always use the network; unknown future routes do the same by default.
_Avoid_: Caching API answers or signed-in pages "for speed"; freshness rules live on the server, not in the worker.

**Precache**:
The fixed list of public files stored during install: versioned build files, public fonts and icons, the manifest, the static Document, and public marketing pages that never change per user. Entries carry a deployment revision, so an update replaces them instead of expiring them over time.
_Avoid_: Adding user-specific or login-dependent pages; precache holds public files only.

**Offline fallback**:
The one generic public page shown when a navigation fails without a network. It is never a signed-in page and never API data.
_Avoid_: One fallback per page; there is exactly one.

**Standalone styling**:
Styling that applies only when the app runs installed, limited to safe-area and browser-chrome adjustments through native standalone display-mode media (or a small framework-native variant for composition). There is no second layout system for installed mode.
_Avoid_: A legacy display-mode plugin; restyling layouts per display mode.
