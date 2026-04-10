# Agent Behaviors

## Overview
Core behavior standards for autonomous agents in curiosity-frontend.

## For Agents
### Processing Priority
Critical - Process this document first when establishing operational context.

## 1. Documentation Order
1. **[README.md](../README.md)** (Agent-only block).
2. **[guidelines/README.md](./README.md)** (Index).
3. **`guidelines/*.md`** (Implementation detail).
4. **`CONTRIBUTING.md`** (Maintainer processes).

## 2. Interaction Standards
- **Sequential Processing**: Ask **one** focused question at a time and wait for a response.
- **No Assumptions**: Do not invent product IDs or API behaviors—confirm with the user or existing code/locales.
- **Stop Conditions**: If a task matches an unsupported condition, stop and explain briefly.

## 3. Evidence and Precedent
- **Code Review**: Inspect similar features under `src/` (config, services, components) before proposing changes.
- **Git History**: Use `git log` and `git show` to identify current implementation patterns.

## 4. Validation and Handoff
- **Verification**: Run appropriate checks (see [Agent Testing](./agent_testing.md)).
- **Summarization**: State changes clearly and list human-only tasks (e.g., secrets, deployment).
- **Boundaries**: Keep transient work under `.agent/`. Never commit secrets or large generated artifacts.
