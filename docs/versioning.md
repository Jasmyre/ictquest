# Semantic versioning

Releases are automated with [release-please](https://github.com/googleapis/release-please)
(`googleapis/release-please-action@v5`). You never edit the version by hand —
conventional commits on `main` drive everything. Commit style: `docs/commits.md`
(qoomon vocabulary, `ops:` for pipelines — no `ci:` type).

Config: `release-please-config.json` (node strategy, `v`-prefixed tags) +
`.release-please-manifest.json` (tracks the last released version, currently `2.1.0`).
Workflow: `.github/workflows/release.yml`. PR-title enforcement:
`.github/workflows/pr-title.yml`. Test gate: `.github/workflows/test.yml`.

## How it works

1. You merge PRs into `main` with conventional titles (`feat: …`, `fix: …`, …).
   The title lint (`amannn/action-semantic-pull-request@v6`) blocks non-conforming titles.
2. On every push to `main`, the release workflow scans commits since the last
   release and opens (or updates) a single release PR titled
   `chore(main): release <version>` that bumps `version` in `package.json`,
   records it in `.release-please-manifest.json`, and prepends the new section
   to `CHANGELOG.md`.
3. You review that PR like any other and merge it when you want to cut the release.
   Merging triggers the workflow again, which now creates the tag (`v0.2.0`)
   and the GitHub Release with generated notes. No release PR = no release —
   merging features just accumulates them into the next pending release PR.

## Commit type → version bump

| Commit | Bump |
|---|---|
| `fix: …` | patch (`2.1.0 → 2.1.1`) |
| `feat: …` | minor (`2.1.0 → 2.2.0`) |
| `feat!: …` or `BREAKING CHANGE:` footer | major (`2.1.0 → 3.0.0`) |
| `chore:`, `docs:`, `test:`, `refactor:`, `perf:`, `style:`, `build:`, `ops:`, … | none |

Semver is strict past `1.0.0`: breaking = major.

Scopes are free-form (`feat(auth): …`, `fix(pwa): …`) and appear grouped in the
changelog. Keep the subject lowercase and imperative (`add …`, not `adds …`).

## Working with it day to day

- **Normal feature/fix**: open a PR with a conventional title, get review, squash-merge
  keeping the conventional title. The release PR updates itself automatically.
- **Stacking work**: merge as many PRs as you like — they all collect into the one
  open release PR. Merge the release PR whenever the batch is shippable.
- **Release PR hygiene**: it is generated — don't hand-edit the version bump, but do
  review the changelog entries. If the bump looks wrong (e.g. a breaking change
  snuck into a `fix:`), fix the originating commit message before merging, not the PR.
- **Skipping a release**: close the release PR without merging and the bot re-opens
  it on the next `main` push. Nothing is tagged until you merge.
- **Hotfix**: branch from `main`, merge a `fix: …` PR, then merge the resulting
  release PR immediately — that tags a patch (`2.1.0 → 2.1.1`).
- **Breaking change**: use `feat!: …` (or a `BREAKING CHANGE:` footer) so it stands
  out in the changelog. This bumps major.
- **No-release commits** (`docs:`, `chore:`, `ops:`, `test:` …): safe anytime —
  they never trigger a version bump on their own.

## Baseline / template forks

Tags use the plain form `v2.1.0` (`include-component-in-tag: false` — a
single-package repo needs no component prefix).

One manual bootstrap is required because the changelog uses GitHub-generated
notes, and that API rejects a `previous_tag` that does not exist yet. Tag the
current baseline once, then automation takes over:

```bash
git tag v2.1.0
git push origin v2.1.0
gh release create v2.1.0 --title "v2.1.0" --notes "Release-please baseline."
```

Then re-run the release workflow (`Actions → Release → Run workflow`). From
there, the first merged conventional PR creates the first release PR
(`2.1.0 → 2.1.1` for `fix:`, `→ 2.2.0` for `feat:`). Forks and template
consumers do the same: keep the three config files as-is, make sure
`.release-please-manifest.json` matches the `version` in `package.json`
(`2.1.0` here), tag the baseline, and go.

## Notes & troubleshooting

- Auth uses `secrets.GITHUB_TOKEN` — zero setup. Consequence: pushes made by the
  bot (release PR commits, tags) do not trigger other workflows. If you need CI
  on release-please PRs, switch `token:` to a PAT secret.
- The `## [Unreleased]` section in `CHANGELOG.md` is hand-maintained and stays —
  release-please only prepends versioned sections above/below it.
- Release PR title `chore(main): release x.y.z` already satisfies the title lint.
- `workflow_dispatch` on the release workflow re-runs the scan on demand
  (e.g. after fixing a commit message or editing config).
- `private: true` in `package.json` is fine — nothing is published to npm;
  only GitHub tags + releases are created.
- `Error: Invalid previous_tag parameter` means the baseline tag is missing —
  do the one-time `git tag v2.1.0` + `gh release create` bootstrap above, then
  re-run the workflow. Do not delete release tags afterwards; the notes API
  needs them.
- `commit could not be parsed` warnings for `Merge pull request #N …` commits
  are harmless — release-please skips them and reads the PR titles instead.
