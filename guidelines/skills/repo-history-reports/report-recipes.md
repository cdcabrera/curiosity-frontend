# Report recipes — git commands (MCP-shaped)

Parameters map cleanly to a future tool: `as_of`, `report`, `filter`, `limit`.

## Core

| Parameter | Example | Notes |
|-----------|---------|--------|
| `as_of` | `HEAD`, `main`, `v4.19.0`, `abc1234` | Resolved with `git rev-parse ${as_of}^{commit}` |
| `limit` | `80`, `100` | Cap list output for tokens |

## recipe: `corpus`

- **Script:** `bash guidelines/skills/repo-history-reports/scripts/git-report.sh --as-of "$as_of" --report corpus`
- **JSON:** add `--format json`

## recipe: `churn`

- **Script:** `bash guidelines/skills/repo-history-reports/scripts/git-report.sh --as-of "$as_of" --report churn`

## recipe: `patternfly`

- **Script:** `bash guidelines/skills/repo-history-reports/scripts/git-report.sh --as-of "$as_of" --report patternfly`
- **Pickaxe (lockfile):**  
  `git log "$as_of" -S'@patternfly' --oneline -- package.json package-lock.json | head -n "$limit"`

## recipe: `grep_corpus`

Custom token in subjects:

```bash
git log "$as_of" --no-merges -i --grep="$filter" --format='%h | %aI | %s' | head -n "$limit"
```

## recipe: `story_timeline`

```bash
git log "$as_of" --no-merges --grep='sw-1234' --format='%h | %aI | %s'
git log "$as_of" --no-merges -i --grep='ent-4669' --format='%h | %aI | %s'
```

## recipe: `path_history`

```bash
git log "$as_of" --oneline -- src/config/ src/services/rhsm/rhsmConstants.js
```

## recipe: `since_snapshot`

Delta between two SHAs:

```bash
git log --no-merges "$old"..$new --format='%h | %aI | %s'
```
