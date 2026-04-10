#!/usr/bin/env python3
"""
Commit examples for git-report.sh --report examples.
Reads git history from cwd (repo root). Used by MCP / npm run report:git.
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from fnmatch import fnmatch
from pathlib import Path


def _run_git(args: list[str], cwd: Path) -> str:
    r = subprocess.run(
        ["git", *args],
        cwd=cwd,
        capture_output=True,
        text=True,
        check=False,
    )
    if r.returncode != 0:
        sys.stderr.write(r.stderr or r.stdout or f"git {' '.join(args)} failed\n")
        sys.exit(r.returncode or 1)
    return r.stdout


def _conventional_type(subject: str) -> str | None:
    m = re.match(r"^([a-z]+)(?:\([^)]*\))?:", subject)
    return m.group(1) if m else None


def _conventional_scopes(subject: str) -> list[str]:
    m = re.match(r"^[a-z]+\(([^)]*)\):", subject)
    if not m:
        return []
    return [s.strip() for s in m.group(1).split(",") if s.strip()]


def _scope_matches(subject: str, want: str) -> bool:
    want_l = want.lower()
    for s in _conventional_scopes(subject):
        if s.lower() == want_l:
            return True
    return False


def _type_matches(subject: str, want: str | None) -> bool:
    if not want:
        return True
    t = _conventional_type(subject)
    return t == want.lower() if t else False


def _suggested_patterns(subject: str) -> list[str]:
    s = subject.lower()
    out: list[str] = []
    if s.startswith("build(deps)") and "bump" in s:
        out.append(
            "Grouped dependency bump: build(deps) subject, bullet body listing "
            "package from X to Y, lockfile + occasional snapshot updates."
        )
    if "patternfly" in s or "@patternfly" in s:
        out.append(
            "PatternFly-related change: often paired with @patternfly/* version lines "
            "in the commit body for bumps."
        )
    if re.match(r"^refactor\(deps\):", subject) and "pf" in s:
        out.append(
            "Major PF migration: refactor(deps) with tracker id, long bullet list of "
            "component-level adjustments."
        )
    if re.match(r"^fix(\([^)]*\))?:", subject):
        out.append("Fix commit: fix(scope): or fix: with optional tracker/PR suffix.")
    return out


def main() -> None:
    p = argparse.ArgumentParser(description="Export commit examples as JSON or Markdown.")
    p.add_argument("--as-of-commit", required=True)
    p.add_argument("--as-of-date", required=True)
    p.add_argument("--since", default="")
    p.add_argument("--until", default="")
    p.add_argument("--limit", type=int, default=15)
    p.add_argument("--type", dest="ctype", default="", help="Conventional type, e.g. fix, build")
    p.add_argument("--scope", default="", help="Conventional scope (exact match in scope list)")
    p.add_argument(
        "--subject-glob",
        default="",
        help="Case-insensitive glob on subject (* wildcard), e.g. *patternfly*",
    )
    p.add_argument(
        "--path",
        action="append",
        default=[],
        dest="paths",
        help="Pathspec (repeatable); limits to commits touching these paths",
    )
    p.add_argument("--format", choices=("json", "md"), default="json")
    p.add_argument(
        "--body-lines",
        type=int,
        default=12,
        help="Max body lines per example in JSON/md output",
    )
    args = p.parse_args()

    cwd = Path.cwd()
    limit = max(1, min(args.limit, 100))
    rev = args.as_of_commit

    log_cmd = [
        "log",
        rev,
        "--no-merges",
        "--format=%H\t%s\t%aI",
    ]
    if args.since:
        log_cmd.extend(["--since", args.since])
    if args.until:
        log_cmd.extend(["--until", args.until])
    if args.paths:
        log_cmd.append("--")
        log_cmd.extend(args.paths)

    raw = _run_git(log_cmd, cwd).strip()
    rows: list[tuple[str, str, str]] = []
    for line in raw.splitlines():
        parts = line.split("\t", 2)
        if len(parts) < 3:
            continue
        h, subj, ad = parts[0], parts[1], parts[2]
        if args.ctype and not _type_matches(subj, args.ctype):
            continue
        if args.scope and not _scope_matches(subj, args.scope):
            continue
        if args.subject_glob and not fnmatch(subj.lower(), args.subject_glob.lower()):
            continue
        rows.append((h, subj, ad))

    total_matches = len(rows)
    rows = rows[:limit]

    examples: list[dict] = []
    for sha, subject, adate in rows:
        body = _run_git(["log", "-1", "--format=%b", sha], cwd).strip()
        body_lines = body.splitlines()[: max(0, args.body_lines)] if body else []
        body_excerpt = "\n".join(body_lines)
        if body_excerpt and len(body.splitlines()) > len(body_lines):
            body_excerpt += "\n…"

        stat_out = _run_git(["show", "--no-patch", "--stat", sha], cwd)
        stat_lines = stat_out.strip().splitlines()
        stat_summary = stat_lines[-1] if stat_lines else ""

        examples.append(
            {
                "sha": sha,
                "date": adate,
                "subject": subject,
                "body_excerpt": body_excerpt,
                "stat_summary": stat_summary,
                "suggested_patterns": _suggested_patterns(subject),
            }
        )

    filters = {
        "since": args.since or None,
        "until": args.until or None,
        "limit": limit,
        "type": args.ctype or None,
        "scope": args.scope or None,
        "subject_glob": args.subject_glob or None,
        "paths": args.paths if args.paths else None,
    }

    if args.format == "json":
        out = {
            "as_of_commit": args.as_of_commit,
            "as_of_date": args.as_of_date,
            "filters": filters,
            "match_count": total_matches,
            "returned": len(examples),
            "examples": examples,
        }
        print(json.dumps(out, indent=2))
        return

    # md
    lines = [
        "# Commit examples",
        "",
        f"| Field | Value |",
        f"|-------|-------|",
        f"| **as_of_commit** | `{args.as_of_commit}` |",
        f"| **as_of_date** | {args.as_of_date} |",
        f"| **match_count** | {total_matches} |",
        f"| **returned** | {len(examples)} |",
        "",
        "## Filters",
        "",
        "```json",
        json.dumps(filters, indent=2),
        "```",
        "",
    ]
    for ex in examples:
        lines.extend(
            [
                f"### `{ex['sha'][:7]}` — {ex['subject']}",
                "",
                f"- **date:** {ex['date']}",
                f"- **stat:** {ex['stat_summary']}",
                "",
            ]
        )
        if ex["suggested_patterns"]:
            lines.append("**Patterns:**")
            for sp in ex["suggested_patterns"]:
                lines.append(f"- {sp}")
            lines.append("")
        if ex["body_excerpt"]:
            lines.append("```")
            lines.append(ex["body_excerpt"])
            lines.append("```")
            lines.append("")
    sys.stdout.write("\n".join(lines))


if __name__ == "__main__":
    main()
