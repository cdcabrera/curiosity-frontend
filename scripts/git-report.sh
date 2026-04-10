#!/usr/bin/env bash
#
# Time-bounded git commit-message reports for curiosity-frontend.
# Usage (from repo root): bash scripts/git-report.sh --as-of HEAD --report <name> [--format md|json]
# Conventions and recipes: docs/development.md#git-commit-message-reports
#
set -euo pipefail

AS_OF="HEAD"
REPORT=""
FORMAT="md"
SINCE=""
UNTIL=""
LIMIT=15
COMMIT_TYPE=""
SCOPE=""
SUBJECT_GLOB=""
BODY_LINES=12
PATHS=()

usage() {
  cat <<'EOF'
git-report.sh — time-bounded commit-message reports

Options:
  --as-of REV          Tip commit for the report (default: HEAD). Accepts SHA, branch, tag.
  --report NAME        corpus | churn | patternfly | subjects | examples | help
  --format FMT         md (default) or json — corpus and examples support json; others md only.
  --since DATE         With --report examples: git log --since (optional).
  --until DATE         With --report examples: git log --until (optional).
  --limit N            With --report examples: max commits (default 15, max 100).
  --type TYPE          With --report examples: conventional type, e.g. fix, build, feat.
  --scope NAME         With --report examples: conventional scope (exact match).
  --subject-glob PAT   With --report examples: case-insensitive glob on subject (* wildcard).
  --body-lines N       With --report examples: max body lines per commit (default 12).
  --path P             With --report examples: pathspec (repeatable).

Examples (from repository root):
  bash scripts/git-report.sh --as-of main --report corpus
  bash scripts/git-report.sh --as-of v4.19.0 --report patternfly
  bash scripts/git-report.sh --as-of HEAD~100 --report churn
  bash scripts/git-report.sh --report examples --format json --type build --subject-glob '*patternfly*'
EOF
  exit 0
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --as-of) AS_OF="${2:-}"; shift 2 ;;
    --report) REPORT="${2:-}"; shift 2 ;;
    --format) FORMAT="${2:-}"; shift 2 ;;
    --since) SINCE="${2:-}"; shift 2 ;;
    --until) UNTIL="${2:-}"; shift 2 ;;
    --limit) LIMIT="${2:-}"; shift 2 ;;
    --type) COMMIT_TYPE="${2:-}"; shift 2 ;;
    --scope) SCOPE="${2:-}"; shift 2 ;;
    --subject-glob) SUBJECT_GLOB="${2:-}"; shift 2 ;;
    --body-lines) BODY_LINES="${2:-}"; shift 2 ;;
    --path) PATHS+=("${2:-}"); shift 2 ;;
    -h|--help) usage ;;
    *) echo "Unknown option: $1" >&2; usage ;;
  esac
done

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || {
  echo "Not a git repository." >&2
  exit 1
}
cd "$REPO_ROOT"

REV="$(git rev-parse "${AS_OF}^{commit}")"
REV_DATE="$(git log -1 --format='%aI' "$REV")"

if [[ "$REPORT" == "examples" ]]; then
  if [[ "$FORMAT" != "md" && "$FORMAT" != "json" ]]; then
    echo 'Use --format md or json with --report examples' >&2
    exit 1
  fi
  if ! command -v node >/dev/null 2>&1; then
    echo 'node is required for --report examples' >&2
    exit 1
  fi
  if ! [[ "$LIMIT" =~ ^[0-9]+$ ]]; then
    echo '--limit must be a non-negative integer' >&2
    exit 1
  fi
  if ! [[ "$BODY_LINES" =~ ^[0-9]+$ ]]; then
    echo '--body-lines must be a non-negative integer' >&2
    exit 1
  fi
  EXAMPLES=(node "$REPO_ROOT/scripts/git-report-examples.mjs"
    --as-of-commit "$REV"
    --as-of-date "$REV_DATE"
    --format "$FORMAT"
    --limit "$LIMIT"
    --body-lines "$BODY_LINES")
  [[ -n "$SINCE" ]] && EXAMPLES+=(--since "$SINCE")
  [[ -n "$UNTIL" ]] && EXAMPLES+=(--until "$UNTIL")
  [[ -n "$COMMIT_TYPE" ]] && EXAMPLES+=(--type "$COMMIT_TYPE")
  [[ -n "$SCOPE" ]] && EXAMPLES+=(--scope "$SCOPE")
  [[ -n "$SUBJECT_GLOB" ]] && EXAMPLES+=(--subject-glob "$SUBJECT_GLOB")
  if ((${#PATHS[@]} > 0)); then
    for p in "${PATHS[@]}"; do
      EXAMPLES+=(--path "$p")
    done
  fi
  "${EXAMPLES[@]}"
  exit 0
fi

SUBJ_TMP="$(mktemp)"
trap 'rm -f "$SUBJ_TMP"' EXIT

git log "$REV" --format='%s' --no-merges >"$SUBJ_TMP"
TOTAL=$(wc -l <"$SUBJ_TMP" | tr -d ' ')

count_subj() {
  grep -c "$1" "$SUBJ_TMP" 2>/dev/null || echo 0
}

report_corpus_md() {
  local fix chore feat build sw ent
  fix=$(grep -cE '^fix(\(|:)' "$SUBJ_TMP" || true)
  chore=$(grep -cE '^chore(\(|:)' "$SUBJ_TMP" || true)
  feat=$(grep -cE '^feat(\(|:)' "$SUBJ_TMP" || true)
  build=$(grep -cE '^build(\(|:)' "$SUBJ_TMP" || true)
  sw=$(grep -icE 'sw-[0-9]+' "$SUBJ_TMP" || true)
  ent=$(grep -icE 'ent-[0-9]+' "$SUBJ_TMP" || true)
  pr=$(grep -cE '\(#[0-9]+\)$' "$SUBJ_TMP" || true)
  issues=$(grep -cE 'issues/[0-9]+' "$SUBJ_TMP" || true)
  release=$(grep -cE '^chore\(release\)' "$SUBJ_TMP" || true)

  cat <<EOF
# Commit corpus profile

| Field | Value |
|-------|-------|
| **as_of_commit** | \`$REV\` |
| **as_of_date** (author, tip) | $REV_DATE |
| **non_merge_commits** | $TOTAL |
| **fix** subjects | $fix |
| **feat** subjects | $feat |
| **chore** subjects | $chore |
| **build** subjects | $build |
| **chore(release)** | $release |
| **subjects with sw-<digits>** | $sw |
| **subjects with ent-<digits>** | $ent |
| **subjects ending (#PR)** | $pr |
| **subjects with issues/<n>** | $issues |

## Conventions (see docs/development.md#git-commit-message-reports)

- Primary tracker form: \`type(scope): sw-NNNN … (#PR)\` (SWATCH).
- Legacy window: **ent-NNNN** (~2021–2022) in subjects.
- Early era: **issues/N** in subject text.
- **fix(build): npm updates** is usually dependency maintenance, not an application defect.
EOF
}

report_corpus_json() {
  local fix chore feat build sw ent pr issues release
  fix=$(grep -cE '^fix(\(|:)' "$SUBJ_TMP" || true)
  chore=$(grep -cE '^chore(\(|:)' "$SUBJ_TMP" || true)
  feat=$(grep -cE '^feat(\(|:)' "$SUBJ_TMP" || true)
  build=$(grep -cE '^build(\(|:)' "$SUBJ_TMP" || true)
  sw=$(grep -icE 'sw-[0-9]+' "$SUBJ_TMP" || true)
  ent=$(grep -icE 'ent-[0-9]+' "$SUBJ_TMP" || true)
  pr=$(grep -cE '\(#[0-9]+\)$' "$SUBJ_TMP" || true)
  issues=$(grep -cE 'issues/[0-9]+' "$SUBJ_TMP" || true)
  release=$(grep -cE '^chore\(release\)' "$SUBJ_TMP" || true)

  printf '{"as_of_commit":"%s","as_of_date":"%s","non_merge_commits":%s' "$REV" "$REV_DATE" "$TOTAL"
  printf ',"types":{"fix":%s,"feat":%s,"chore":%s,"build":%s}' "$fix" "$feat" "$chore" "$build"
  printf ',"markers":{"sw_numeric":%s,"ent_numeric":%s,"github_pr_suffix":%s,"issues_slash":%s,"chore_release":%s}' \
    "$sw" "$ent" "$pr" "$issues" "$release"
  printf '}\n'
}

report_churn_md() {
  local FIX_TMP
  FIX_TMP="$(mktemp)"
  grep -E '^fix(\(|:)' "$SUBJ_TMP" >"$FIX_TMP" || true
  local nfix
  nfix=$(wc -l <"$FIX_TMP" | tr -d ' ')

  cat <<EOF
# Fix-oriented churn (heuristic)

| Field | Value |
|-------|-------|
| **as_of_commit** | \`$REV\` |
| **as_of_date** | $REV_DATE |
| **fix_commits** | $nfix |

## Top fix scopes (split on comma in scope list)

EOF
  sed -n 's/^fix(\([^)]*\)):.*$/\1/p' "$FIX_TMP" | tr ',' '\n' | sed 's/^ *//;s/ *$//' | grep -v '^$' | sort | uniq -c | sort -rn | head -25 | while read -r cnt name; do
    echo "- **$name** — $cnt"
  done

  cat <<'EOF'

## Keyword hits in fix subjects (substring; interpret carefully)

EOF
  for w in graph inventory locale chart openshift router filter npm i18n; do
    c=$(grep -i "$w" "$FIX_TMP" | wc -l | tr -d ' ')
    echo "- **$w** — $c"
  done

  cat <<'EOF'

*High fix counts often reflect complex domains (graphs, inventory) or **build/npm** maintenance—not necessarily open bugs.*

EOF
  rm -f "$FIX_TMP"
}

report_patternfly_md() {
  cat <<EOF
# Commits mentioning PatternFly (subject grep, case-insensitive)

| Field | Value |
|-------|-------|
| **as_of_commit** | \`$REV\` |
| **as_of_date** | $REV_DATE |

## Matches: patternfly

EOF
  git log "$REV" --no-merges --format='%h | %aI | %s' -i --grep='patternfly' | head -80
  cat <<'EOF'

## Matches: @patternfly (dependency bumps in subject)

EOF
  git log "$REV" --no-merges --format='%h | %aI | %s' -i --grep='@patternfly' | head -80
  cat <<EOF

*For lockfile-only bumps with no subject match, run: \`git log $REV -S'@patternfly' --oneline -- package.json package-lock.json\` (may be slow).*
EOF
}

report_subjects_md() {
  cat <<EOF
# Commit index (abbreviated)

| Field | Value |
|-------|-------|
| **as_of_commit** | \`$REV\` |
| **as_of_date** | $REV_DATE |

First 50 (oldest first):

EOF
  git log "$REV" --no-merges --reverse --format='%h | %aI | %s' | head -50
  cat <<EOF

Latest 50:

EOF
  git log "$REV" --no-merges --format='%h | %aI | %s' | head -50
}

case "$REPORT" in
  help|'')
    usage
    ;;
  corpus)
    if [[ "$FORMAT" == "json" ]]; then
      report_corpus_json
    else
      report_corpus_md
    fi
    ;;
  churn)
    report_churn_md
    ;;
  patternfly)
    report_patternfly_md
    ;;
  subjects)
    report_subjects_md
    ;;
  *)
    echo "Unknown --report: $REPORT" >&2
    echo "Use: corpus | churn | patternfly | subjects | examples | help" >&2
    exit 1
    ;;
esac
