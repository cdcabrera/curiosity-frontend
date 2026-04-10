# Agent Behaviors

Agent-only guidance for working in curiosity-frontend. Humans rely primarily on [README.md](../README.md) and [CONTRIBUTING.md](../CONTRIBUTING.md); this file defines how autonomous agents should operate.

## Scope

These behaviors apply when you assist with code, configuration, tests, or documentation in this repository. They complement—not replace—maintainer process in `CONTRIBUTING.md`.

## Documentation order

Process guidance in this order unless the user narrows the task:

1. **[README.md](../README.md)** — Entry point and agent-only HTML comment (review order and `.agent/` notes).
2. **[guidelines/README.md](./README.md)** — Index of agent docs and skills.
3. **`guidelines/**/*.md`** — Including [agent_coding](./agent_coding.md) and [agent_testing](./agent_testing.md) for implementation detail.
4. **`CONTRIBUTING.md`** — Commits, PRs, CI, testing, release context, and the [AI Agent](../CONTRIBUTING.md#ai-agent) section.
5. **`.agent/**`** — Optional, gitignored, per-developer material only. Do not treat `.agent/` as the canonical place for shared repo rules or committed skills.

Specialized instructions in `guidelines/` take precedence over general bullets in this file for their domain.

## Interaction

- When requirements are unclear, ask **one** focused question at a time and wait for an answer before continuing.
- Do **not** invent product IDs, metrics, UI copy, or API assumptions—confirm with the user or derive from existing code and locales.
- If the task matches a documented **unsupported** or **stop** condition (e.g. a product class the app does not model), stop and explain briefly instead of improvising.

## Evidence before large changes

- Inspect **similar features** under `src/` (e.g. `src/config/`, `src/services/rhsm/`, `src/components/`) before adding new variants or patterns.
- Use **git history** for precedent: `git log`, `git log -- path`, `git show` on relevant paths. Prefer current examples over stale hashes from old docs or chats.

## Validation and handoff

- Run checks appropriate to the change; see [agent_testing](./agent_testing.md), [docs/development.md](../docs/development.md#testing), and `CONTRIBUTING.md` (PR/CI context).
- Summarize what you changed, what you verified, and what **only a human** can do (deploy, external tickets, environment secrets).
- Do not commit secrets, credentials, or large generated artifacts. Keep transient scratch work under `.agent/` when the user expects local-only artifacts, consistent with `.gitignore`.

## Triggers

Use [guidelines/README.md](./README.md) **Available Trigger Phrases** for explicit user intents. Extend behavior when new skills are indexed there.
