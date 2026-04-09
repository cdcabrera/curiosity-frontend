---
name: repo-history-reports
description: Generates time-bounded reports from git commit messages—corpus stats, fix churn heuristics, PatternFly-related commits, and custom greps. Use when the user asks for repo history analysis, commit conventions as of a date or tag, recurring fixes or risk areas, PatternFly update frequency, what commits mention X, or an initial codebase health snapshot from git metadata.
---

# Repo history reports

## Role

Act as a **report generator** over the **commit-message corpus**, anchored at **`as_of`** (commit, tag, branch, or `HEAD`). This complements live `git blame` / file history: here the signal is **how the team records change**, not line-level authorship.

## First step: anchor time

1. Resolve **`as_of`**: user may say “today”, a **tag** (`v4.19.0`), **branch tip** (`main`), or **SHA**.
2. Run `git rev-parse "${as_of}^{commit}"` and record **full SHA** + **author date of that commit** in every report header.
3. All stats are **ancestors of that commit** (`git log <REV>`), i.e. history **through** that point.

## Preferred: helper script

From repo root:

```bash
bash scripts/git-report.sh --as-of <REV> --report <name> [--format md|json]
```

| `--report` | Output |
|------------|--------|
| `corpus` | Table of message conventions: type counts, `sw-` / `ent-` / `(#PR)` / `issues/` / `chore(release)` |
| `churn` | Heuristic “recurring fixes”: top `fix(` scopes, keyword hits in fix subjects |
| `patternfly` | Commits whose subject matches `patternfly` or `@patternfly` (see [report-recipes](report-recipes.md) for lockfile pickaxe) |
| `subjects` | First/latest 50 commits (sanity / sampling) |

`--format json` is supported for **`corpus`** only (machine-readable counts).

## User-facing report templates

### A. Initial snapshot (“potential issues” / health from git)

1. Run **`corpus`** + **`churn`** at chosen `as_of`.
2. Summarize: dominant **fix** scopes, **graph/inventory/locale** keywords, **build/npm** volume—explicitly say **maintenance vs defect** (see [reference — interpretation](reference.md#interpreting-fix-churn)).
3. Add **limitations**: subjects only; no runtime bugs; stale if `as_of` is old.

### B. “How often is PatternFly updated?”

1. Run **`patternfly`** report.
2. Count rows / time span; group by month if useful.
3. Mention **subject-only** bias: bumps may appear as `build(deps)` without the word “patternfly”—offer `git log <REV> -S'@patternfly' --oneline -- package.json package-lock.json` when needed (can be slower).

### C. “What commits relate to X?”

1. Normalize token (e.g. `sw-4754`, `ent-4669`, `patternfly`, scope `config`).
2. `git log <REV> -i --grep='<token>' --no-merges --format='%h | %aI | %s'` (cap lines, e.g. 100).
3. For path coupling: `git log <REV> --oneline -- path1 path2`.

### D. Delta since a snapshot

If a **manifest** or prior report listed `as_of_commit_old`, run:

`git log --no-merges <old>..<new> --format='%h | %aI | %s'`

## Output contract

Every report must include:

- **as_of_commit** (full SHA) and **as_of_date**
- **Method** (script name + args, or git commands)
- **Results** (tables/lists)
- **Caveats** (subject-only, keyword false positives, shallow clone)

## Deep reference

- [reference.md](reference.md) — Corpus vocabulary (`sw-`, `ent-`, eras)
- [report-recipes.md](report-recipes.md) — Extra git one-liners and MCP-shaped parameters

## Related

- [agent_behaviors.md](../../agent_behaviors.md) — evidence before claiming policy from history alone
- [dependency-updates skill](../dependency-updates/SKILL.md) — NPM/PatternFly bump workflow
