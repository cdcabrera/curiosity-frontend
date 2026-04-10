# Curiosity Frontend
[![Build](https://github.com/RedHatInsights/curiosity-frontend/actions/workflows/integration.yml/badge.svg?branch=main)](https://github.com/RedHatInsights/curiosity-frontend/actions/workflows/integration.yml)
[![codecov](https://codecov.io/gh/RedHatInsights/curiosity-frontend/branch/main/graph/badge.svg)](https://codecov.io/gh/RedHatInsights/curiosity-frontend)
[![License](https://img.shields.io/github/license/RedHatInsights/curiosity-frontend.svg)](https://github.com/RedHatInsights/curiosity-frontend/blob/main/LICENSE)

A web user interface for subscription reporting, based on [Patternfly](https://www.patternfly.org/)

## Development, Quick Start

### Requirements
Before developing for Curiosity Frontend
 * Your system needs to be running [NodeJS version 20+ and NPM](https://nodejs.org/)
    * Yarn install is discouraged. There are dependency install issues with Yarn `1.x.x` versions.

For in-depth tooling install guidance see [docs/development.md](./docs/development.md#install-tooling)

### Install
  1. Clone the repository
     ```
     $ git clone https://github.com/RedHatInsights/curiosity-frontend.git
     ```

  1. Within the repo context, install project dependencies
     ```
     $ cd curiosity-frontend && npm install
     ```

### Develop
This is the base context for running a local UI against a mock API and styling.

  1. Create a local dotenv file called `.env.local` and add the following contents
      ```
      REACT_APP_DEBUG_MIDDLEWARE=true
      REACT_APP_DEBUG_ORG_ADMIN=true
      REACT_APP_DEBUG_PERMISSION_APP_ONE=subscriptions:*:*
      REACT_APP_DEBUG_PERMISSION_APP_TWO=inventory:*:*
     ```
  1. In a terminal instance that uses the repo context... Run
     ```
     $ npm start
     ```
  1. Start developing against files in `./src`. Linting feedback will be automatically enabled through the terminal output

For in-depth local run guidance review [docs/development.md](./docs/development.md#local-and-proxy-development) 

### Unit testing
Run and update unit tests while developing instead of after-the-fact. In a new terminal instance

  1. In a new terminal instance that uses the repo context... Run
     ```
     $ npm run test:dev
     ```
  2. Test files can be accessed, and edited, under `__test__` directories parallel to the files you're editing. Test failures for
     recently edited files will be available in the terminal output along with basic testing framework use directions.

For in-depth testing guidance review [docs/development.md](./docs/development.md#testing) 

## Contributing
Contributing encompasses
- [Repository coding requirements](./CONTRIBUTING.md) - Includes everything from commit messaging practices and environment setup to unit testing.  
- [User and AI agent guidance](./guidelines/README.md) - Includes everything from interactive workflows and prompts to general automation
- [Optional MCP and local agent tooling](./docs/development.md) - PatternFly MCP setup in your editor, tool plugins, and commit report scripts (not required to build the app)

The **`./.agent/`** directory at the repo root is **gitignored**: it is for **local developer and agent use only** (scratch notes, personal resources, generated reports). Nothing under `.agent/` is committed or visible to others through a normal clone. **Shared** agent guidance and skills live under [`guidelines/`](./guidelines/README.md).

## Agent Only
<!--
Agents: Process guidelines in this order unless the task is narrowed:

1. **./README.md** (this block) - Entry point and review order.
2. **./guidelines/README.md** - Index of agent-only rules and skills.
3. **./guidelines/*.md** - Domain-specific rules (coding, testing, behaviors).
4. **./CONTRIBUTING.md** - Maintainer processes and AI policy (#ai-agent).
5. **./.agent/** - Local, gitignored developer state only.

**Operational Rules:**
- Ask one question at a time.
- Review git history for implementation precedent.
- Use `npm run test:spell-support` when editing guidelines/docs.
- Reference `docs/development.md` for local setup and git-report scripts.
-->
