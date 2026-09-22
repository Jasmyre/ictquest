# Release-please with qoomon conventional commits

`CHANGELOG.md` was `standard-version` output at `2.1.0` while `docs/versioning.md` described release-please at `0.1.0` with configs and workflows that did not exist, and there was no test CI gate or PR-title lint. We migrate the cutter to release-please (node strategy, `v`-prefixed tags, `bump-minor-pre-major`, GitHub-notes changelog), adopt qoomon's commit vocabulary strict (`feat, fix, perf, refactor, style, test, docs, build, ops, chore` — `ops:` for pipelines, no `ci:`), and add `test.yml` (typecheck + lint + `test:all` on Postgres 16 + build), `pr-title.yml`, and `release.yml`.

## Considered Options

- **Stay on standard-version**: keep `npm run release` locally and the existing changelog format. Rejected — it keeps the docs/reality split, needs a human to cut every release, and has no PR-title enforcement to keep squash-merges parseable.
- **qoomon + `ci:` alias**: accept both `ci:` and `ops:` for pipeline changes. Rejected — the two labels split one concept; qoomon commenters flag exactly this confusion, and `versioning.md` already lists `ci:` as no-bump while the new `commits.md` is the vocabulary source.
- **Strict scope allowlist in lint**: enforce a fixed scope set in `pr-title.yml`. Rejected — lists rot on every new feature area; free-form with suggested scopes (`auth, admin, api, ui, pwa, db, lessons, tests`) matches current usage.

## Consequences

- `release-please-config.json` + `.release-please-manifest.json` (seeded at `2.1.0`) are the release source of truth; `standard-version` script + dep go away on next cleanup.
- Old `standard-version` CHANGELOG entries stay as history; new sections are GitHub-notes style. One-time baseline `git tag v2.1.0` is required so the notes API has a `previous_tag`.
- `database.yml` validate owns migration validity only; `test.yml` owns code correctness — no double test runs.
