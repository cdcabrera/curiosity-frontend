# Agent Guidelines

## Overview

**This directory is for autonomous agents only.** Humans should start from [README.md](../README.md) (quick context) and [CONTRIBUTING.md](../CONTRIBUTING.md) (maintainer processes, including a short [AI Agent](../CONTRIBUTING.md#ai-agent) section). Local setup, testing, MCP, and git report scripts: [docs/development.md](../docs/development.md). Application shape: [docs/architecture.md](../docs/architecture.md).

Content here is optimized for machine use: concise rules, pointers to real paths and scripts, and minimal duplication of `CONTRIBUTING.md`.

## File naming

- **`agent_*.md`** — Always-on agent rules (behaviors, coding, testing).
- **`skills/<skill-name>/SKILL.md`** — Task-specific workflows; add an index row below when you create a skill.
- **`mcp/plugin-*/`** — PatternFly MCP tool plugins (e.g. [plugin-git-reports](./mcp/plugin-git-reports/README.md)).

## Guidelines index

### Agent guidelines

| Document | Purpose |
|----------|---------|
| [agent_behaviors.md](./agent_behaviors.md) | How to operate: doc order, questions, evidence, validation, `.agent/` boundaries |
| [agent_coding.md](./agent_coding.md) | Stack, imports, components, Redux (`storeHooks`), layout, i18n, lint |
| [agent_testing.md](./agent_testing.md) | Test layout, npm commands, snapshots, definition of done |

### Skills

Skills live under **`guidelines/skills/`**. Each skill should be a folder with `SKILL.md` (and optional `reference.md`). Root symlinks **`.agents`** and **`.claude`** point at `guidelines/skills/` for tool discovery.

| Skill | When to use |
|-------|-------------|
| [product-configuration](./skills/product-configuration/SKILL.md) | New or updated subscription product variant; `rhsmConstants`, `src/config` product modules, locales |
| [configurable-banners](./skills/configurable-banners/SKILL.md) | Global/config-driven alerts from `src/config/banners.js`, locales, `useConfigBanners`, banner tests |

**Note:** The **`.agent/`** directory (no “s”) is gitignored and reserved for per-developer agent state. Do not put shared skills or canonical guidelines only under `.agent/`.

## Trigger phrases

Treat these user phrases as signals to open the listed docs (and related source):

| Task / intent | Reference |
|---------------|-----------|
| **"review the repo guidelines"** | [README.md](../README.md) agent block, this file, other `guidelines/*.md`, [CONTRIBUTING.md](../CONTRIBUTING.md#ai-agent) |
| **Product / subscription UI change** | [product-configuration skill](./skills/product-configuration/SKILL.md), [agent_coding](./agent_coding.md), `src/config/`, `src/services/rhsm/` |
| **Global banner, maintenance message, `banners.js`, `useConfigBanners`** | [configurable-banners skill](./skills/configurable-banners/SKILL.md), [docs/architecture.md](../docs/architecture.md) |
| **Release, stage, prod, stable, app-interface** | [CONTRIBUTING.md](../CONTRIBUTING.md) (Process) |
| **Dependencies, Renovate, npm update** | [CONTRIBUTING.md](../CONTRIBUTING.md) (NPM dependency maintenance) |
| **Git history corpus, churn, PatternFly commits, filtered examples** | [docs/development.md — Git commit message reports](../docs/development.md#git-commit-message-reports), `bash scripts/git-report.sh --help` |
| **Blame, path history, “how was X implemented”** | `git log`, `git blame` |
| **JSDoc, src README, build:docs, doc lint** | [docs/development.md — Documentation](../docs/development.md#documentation), [CONTRIBUTING.md](../CONTRIBUTING.md) (PR checks) |
| **Architecture, Redux, component layout, eslint / style** | [docs/architecture.md](../docs/architecture.md), [agent_coding](./agent_coding.md) |
| **MCP, Cursor, PatternFly MCP, IDE agent tools** | [docs/development.md](../docs/development.md) |
| **Tests or CI failure** | [agent_testing](./agent_testing.md), [docs/development.md — Testing](../docs/development.md#testing) |
| **How should you behave / what order to read** | [agent_behaviors](./agent_behaviors.md) |

## Processing order

1. All committed files under **`guidelines/`** (index first, then specialized docs and skills as needed).
2. **`.agent/**`** only if the user points you there—local, non-canonical; never substitute it for updating `guidelines/` when rules should be shared.

## Maintaining this directory

- Update **this README** when you add or remove `agent_*.md` files or skills.
- **Reference** `CONTRIBUTING.md`, `docs/`, and `README.md`; do not copy long procedural sections here.
- Keep trigger and index tables accurate.

### Adding a skill

1. Create `guidelines/skills/<name>/SKILL.md` (YAML frontmatter + workflow recommended).
2. Add a row under **Skills** above.
3. Add a trigger row if the skill has a clear user phrase.
