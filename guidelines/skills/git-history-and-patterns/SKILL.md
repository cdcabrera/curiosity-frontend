---
name: git-history-and-patterns
description: Finds implementation precedent in curiosity-frontend using git history and code search across src/config, services/rhsm, components. Use when the user asks why something was done, for a similar feature, blame, precedent commits, or migration examples.
---

# Git history and patterns

## Workflow

1. **Narrow paths** from the question (e.g. `src/services/rhsm/`, `src/config/`, a specific component directory).
2. **Search history**
   - `git log --oneline -- <path>`
   - `git log -S'stringOrSymbol' -- <path>` for introductions of constants or API shapes
   - `git show <commit>:path` for file state at a point in time
3. **Read current neighbors**—open the closest matching file today; history explains *change*, neighbors explain *current convention*.
4. **Summarize** for the user: which commits touched what, what pattern to copy, and what is **uncertain** (needs maintainer or ticket).

## Interpretation rules

- Old commit hashes in chats or archived docs are **hints only**; confirm relevance with `git show` and current tree.
- **Inference is not policy**—if the pattern is ambiguous, say so and suggest opening a small PR with tests.

## Related agent docs

- [agent_behaviors.md](../../agent_behaviors.md) — evidence-before-change expectations
- [agent_coding.md](../../agent_coding.md) — Redux and layout norms when mirroring patterns
