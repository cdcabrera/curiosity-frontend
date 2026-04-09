# Agent Guidelines

## Overview

Agent-specific guidelines for the Curiosity Frontend project, optimized for machine processing.

## File Naming Convention

- `agent_*`: Guidance for autonomous agents

## Guidelines Index

### Agent Guidelines

- [Agent Behaviors](./agent_behaviors.md) - Comprehensive guide to agent behaviors, workflows, and standards
- [Agent Coding](./agent_coding.md) - Coding standards
- [Agent Testing](./agent_testing.md) - Testing procedures

### Skills

- [Add docs links](./skills/add-docs-links/SKILL.md) - Add documentation links to `src/docs.json` in a structured way (format, duplicate check, URL confirmation, tests)

**Note:** `guidelines/skills/` is the canonical location for skills. Root symlinks `.agents` and `.claude` point here so agents can discover them (Cursor, Claude). The `.agent/` directory (no “s”) is reserved for each developer’s local work and is off limits—do not use it for shared skills or guidelines.

## User Guide

### Available Trigger Phrases

Agents should use these phrases as signals to consult specific documentation and source code:

| Task / Intent                       | Reference Document                                                                                                                                     |
|:------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------|
| **"review the repo guidelines"**    | Scan markdown files and guidelines directory. See [AI agent context](../CONTRIBUTING.md#ai-agent).                                                     |

## Guidelines Processing Order

1. **Guidelines Directory** (all files in the `guidelines/` directory)
2. **Local guidelines** (`.agent/` directory) — reserved for each user’s agent interaction; gitignored and off limits for shared repo assets. Do not create or reference shared skills or guidelines in `.agent/`.

## Maintaining This Directory

### File Maintenance Principles
- Update index files (e.g., `guidelines/README.md`) immediately when adding or removing content.
- Reference and index guidelines. Don't duplicate content.
- Update references when adding new files.
- Keep descriptions concise and focused.

### Adding New Guidelines
1. Add entry to "Guidelines Index" section
2. Include essential metadata
3. Provide brief description
4. Update processing order if needed
