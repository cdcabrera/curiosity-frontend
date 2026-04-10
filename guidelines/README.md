# Agent Guidelines

## Overview
Agent-specific guidelines for curiosity-frontend, optimized for machine processing. Refer to [CONTRIBUTING.md](../CONTRIBUTING.md#ai-agent) for user-facing AI policy.

## For Agents
### Processing Priority
High - This document is the entry point for all agent-specific instructions.

### Related Guidelines
See individual `agent_*.md` files and `skills/` for domain-specific rules.

## File Naming Convention
- `agent_*.md`: Always-on rules (behaviors, coding, testing).
- `skills/<name>/SKILL.md`: Task-specific workflows and triggers.
- `mcp/plugin-*/`: PatternFly MCP tool plugins.

## Guidelines Index
### Core Guidelines
- [Agent Behaviors](./agent_behaviors.md) (Critical) - Doc order, sequential interaction, and validation.
- [Agent Coding](./agent_coding.md) (High) - Stack, Redux hooks, i18n, and linting.
- [Agent Testing](./agent_testing.md) (High) - Test layout, npm commands, and snapshots.

### Skills
- [Product Configuration](./skills/product-configuration/SKILL.md) - Add/update product variants.
- [Configurable Banners](./skills/configurable-banners/SKILL.md) - Manage global alerts.

## User Guide: Trigger Phrases
 Task / Intent | Reference |
:--------------|:----------|
 **"review the repo guidelines"** | [README.md](../README.md) agent block, this file, `CONTRIBUTING.md#ai-agent` |
 **Product / UI change** | [Product Configuration skill](./skills/product-configuration/SKILL.md), [Agent Coding](./agent_coding.md) |
 **Global banner** | [Configurable Banners skill](./skills/configurable-banners/SKILL.md), `docs/architecture.md` |
 **Release / Deploy** | [CONTRIBUTING.md](../CONTRIBUTING.md) (Process) |
 **Dependencies** | [CONTRIBUTING.md](../CONTRIBUTING.md) (NPM maintenance) |
 **Git reports** | [docs/development.md#git-commit-message-reports](../docs/development.md#git-commit-message-reports) |

## Guidelines Processing Order
1. **`guidelines/`** - Canonical, committed assets.
2. **`.agent/`** - Local, gitignored developer state.

## Maintaining This Directory
- Update this index immediately when adding/removing guidelines or skills.
- Reference `CONTRIBUTING.md` and `docs/` instead of duplicating content.
