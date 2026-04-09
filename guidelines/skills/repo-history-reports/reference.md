# Repo history reports — corpus reference

## Tracker and PR tokens (subjects)

| Pattern | Meaning | Era |
|---------|---------|-----|
| `sw-<digits>` | SWATCH / Jira-style id (see CONTRIBUTING) | Dominant from ~2022 onward |
| `ent-<digits>` | Legacy enterprise tracker in subject | ~2021–2022 concentration in this repo |
| `(#<digits>)` at end | GitHub PR number | Very common on merged work |
| `issues/<digits>` in text | Early GitHub issue reference | ~2019–2020 common |
| `chore(release):` | Version / release line | Use with tags for “what shipped when” |

## Conventional shape

Typical: `type(scope): [tracker] description (#PR)`

Types observed in bulk: `fix`, `feat`, `chore`, `build`, `refactor`, `style`, `docs`, `test`, `perf`, `ci`, `revert`.

Scopes often mirror areas: `config`, `graphCard`, `locale`, `build`, `deps`, `deps-dev`, `release`, etc.

## Interpreting fix churn

- **High `fix(build)` + “npm”** → dependency and tooling churn; **not** the same as application regressions.
- **High `fix` in `graphCard`, `config`, `locale`, `inventory`** → complex product surface; may be iterative delivery or recurring edge cases—investigate with `git log --grep` on story ids.
- **Duplicate fix subjects** → stronger signal for regression or incomplete first fix.

## as_of semantics

- **`git log REV`** = all commits **reachable from** `REV` (history **up to and including** that tip).
- For “state at release tag `v4.19.0`”, use `--as-of v4.19.0`.

## Regenerating frozen stats

To save a snapshot for agents or humans:

```bash
bash guidelines/skills/repo-history-reports/scripts/git-report.sh --as-of v4.19.0 --report corpus --format json > .agent/history-corpus-v4.19.0.json
bash guidelines/skills/repo-history-reports/scripts/git-report.sh --as-of v4.19.0 --report churn > .agent/history-churn-v4.19.0.md
```

(Use `.agent/` only if team policy allows; otherwise commit under `docs/` or attach to release artifacts.)
