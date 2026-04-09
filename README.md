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

For in-depth tooling install guidance see the [contribution guidelines](./CONTRIBUTING.md#install-tooling)

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

For in-depth local run guidance review the [contribution guidelines](./CONTRIBUTING.md#local-and-proxy-development) 

### Unit testing
Run and update unit tests while developing instead of after-the-fact. In a new terminal instance

  1. In a new terminal instance that uses the repo context... Run
     ```
     $ npm run test:dev
     ```
  2. Test files can be accessed, and edited, under `__test__` directories parallel to the files you're editing. Test failures for
     recently edited files will be available in the terminal output along with basic testing framework use directions.

For in-depth testing guidance review the [contribution guidelines](./CONTRIBUTING.md#testing) 

## Contributing
Contributing encompasses
- [Repository coding requirements](./CONTRIBUTING.md) - Includes everything from commit messaging practices and environment setup to unit testing.  
- [User and AI agent guidance](./guidelines/README.md) - Includes everything from interactive workflows and prompts to general automation

The **`./.agent/`** directory at the repo root is **gitignored**: it is for **local developer and agent use only** (scratch notes, personal resources, generated reports). Nothing under `.agent/` is committed or visible to others through a normal clone. **Shared** agent guidance and skills live under [`guidelines/`](./guidelines/README.md).

## Agent Only
Agents: This repository contains a hierarchical guideline system. Agents should review agent-only comment blocks.

<!--
Agents must analyze these files when asked for guidance:

**Guidelines review order:**
1. **`./README.md`** - Main agent guidance and behavior standards (including agent-only comment block)
2. **`./guidelines/README.md`** - Core agent guidance and behavior standards
3. **`./guidelines/**/*.md`** - Specialized workflow and domain-specific instructions (`agent_*.md`, skills under `guidelines/skills/`, etc.)
4. **`./guidelines/skills/repo-history-reports/SKILL.md`** - **Commit history and reports:** time-bounded analysis of commit messages (corpus stats, fix churn, PatternFly-related commits, custom greps). Follow this skill and run **`guidelines/skills/repo-history-reports/scripts/git-report.sh`** (or `npm run report:git -- …`) instead of improvising raw `git log` for those questions.
5. **`./.agent/**/*.md`** - gitignored directory: local agent state, scratch notes, and developer-only resources—not shared via git

The guideline system should be processed in this order, with specialized guidelines taking precedence for their specific domains, and local `.agent/` material overriding or extending general guidelines only when the user points you there.

**Next Steps:**
6. **Review guidance under `./.agent/**/*.md` when relevant.** If the `./.agent` directory exists, the user may ask about material there.
7. **If `./.agent` does not exist and the user wants local agent workspace**, explain that it is gitignored and for personal use only.

**Final Steps:**
8. **Optional:** Ask whether to create or refresh a `code-summary.md` (or similar) under `.agent/` as a local index—separate from shared `guidelines/` and from **repo-history-reports** output, which should follow the skill above.
-->
