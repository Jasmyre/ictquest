# Conventional commits

Commit style follows [qoomon's Conventional Commits cheatsheet](https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13) (MIT, (c) Bengt Brodersen), adapted below. The spec itself is [conventionalcommits.org](https://www.conventionalcommits.org/).

Format: `<type>(<optional scope>): <description>` + optional body + optional footer.

```text
feat(auth): add email notifications on new direct messages

The error occurred due to <reasons>.

Closes #123
```

## Types (qoomon-strict)

| Type | Use |
|---|---|
| `feat` | New/changed feature in API or UI (minor bump) |
| `fix` | Bug fix for a preceding `feat` (patch bump) |
| `perf` | Performance-focused refactor (no bump on its own) |
| `refactor` | Rewrite/restructure with no API/UI behavior change |
| `style` | Formatting only (whitespace, semicolons) |
| `test` | Add or correct tests (a faster test is still `test:`, not `perf:`) |
| `docs` | Documentation only |
| `build` | Build tools, dependencies, versions |
| `ops` | Infra, deployment, CI/CD pipelines, backups, monitoring. Use this for pipeline changes — there is no `ci:` type |
| `chore` | Maintenance / non-code tasks (`chore: init`, `.gitignore`) |

Breaking change: append `!` before the colon (`feat(api)!: remove status endpoint`) and describe it with a `BREAKING CHANGE:` footer. Breaking bumps minor while `0.x`, major after `1.0.0`.

## Scopes

Free-form, no issue IDs. Suggested: `auth, admin, api, ui, pwa, db, lessons, tests`.

- Lowercase, imperative description (`add …`, not `adds …`), no trailing period.
- Body (optional): motivation + contrast with previous behavior, imperative present tense.
- Footer (optional): `Closes #123`, `Fixes JIRA-456`; breaking changes start with `BREAKING CHANGE:`.

## Examples

```text
feat(shopping cart): add the amazing button
fix(api): fix wrong calculation of request body checksum
perf: decrease memory footprint for unique visitors by using HyperLogLog
docs: update testing layers
ops: add test workflow with Postgres service
chore: init
```

## Enforcement

PR titles are linted (`.github/workflows/pr-title.yml`, `amannn/action-semantic-pull-request@v6`) — squash-merge keeping the conventional title. Local `commit-msg` hooks are opt-in only.
