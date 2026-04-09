---
name: release-and-deploy
description: Explains curiosity-frontend branch flow (main/stage vs stable/prod), app-interface production promotion, and verification commands. Use when the user asks about releasing, deploying to stage or production, stable branch, tagging, or app-interface GitLab MRs.
---

# Release and deploy

## Agent role

Summarize **maintainer-owned** steps from [CONTRIBUTING.md](../../../CONTRIBUTING.md) (Process → Using Git). **Do not** perform deployments, GitLab merges, or tag pushes yourself.

## Branch and environment mapping

| Branch   | Meaning | Deploy / URL (per CONTRIBUTING) |
|----------|---------|----------------------------------|
| `main`   | Development / stage | Push to `main` deploys stage (`https://console.stage.redhat.com/`) |
| `stable` | Production line   | No automatic deploy from `stable`; prod via **app-interface** MR with a git hash → `https://console.redhat.com/` |

## Typical flows

**Land work for stage:** PRs target **`main`** (fork/PR workflow, linear history, conventional commits—see CONTRIBUTING).

**Promote to prod:** Maintainer submits **Git hash** via **GitLab Merge Request** in the **`app-interface`** repository. Prefer a **tag** on the release commit; release commit message form: `chore(release): [version number]` (per CONTRIBUTING).

**Branch sync (conceptual):** `main` rebased from `stable` after releases (or prep); `stable` fast-forwarded from `main` when preparing release—details in CONTRIBUTING.

## Verification before release-related PRs

Use what the team expects for the change size, e.g.:

- `npm run verify` — ephemeral tests + PR-style build checks (`package.json`).
- `npm test` / `npm run test:integration` as appropriate for the diff.

## Checklist for the human

- [ ] Correct branch and PR target (`main` for normal dev).
- [ ] CI green (GitHub Actions; Jenkins `/retest` if needed—CONTRIBUTING).
- [ ] Prod promotion explicitly via **app-interface** + tag preference documented there.
