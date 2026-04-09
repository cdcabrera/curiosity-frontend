# Architecture

High-level shape of **curiosity-frontend**: a React UI for subscription reporting, hosted on Red Hat Hybrid Cloud Console patterns (FEC / Insights). For day-to-day commands and policies, see [CONTRIBUTING.md](../CONTRIBUTING.md). For local runs, env files, and optional MCP setup, see [development.md](./development.md).

## Stack

| Layer | Notes |
|-------|--------|
| **UI** | React (function components, hooks), [PatternFly](https://www.patternfly.org/) (`@patternfly/react-*`) |
| **State** | Redux with a project-specific surface (`storeHooks`, `reduxHelpers`) — see [Agent coding — Redux](../guidelines/agent_coding.md#redux) and [`src/redux/README.md`](../src/redux/README.md) |
| **Data** | RHSM and platform services under `src/services/`; API constants in `src/services/rhsm/` |
| **Build** | `fec` / webpack via shared Console tooling; scripts and config under [`config/`](../config/README.md), [`fec.config.js`](../fec.config.js), [`package.json`](../package.json) |
| **i18n** | Locale strings in `public/locales/`; helpers in `src/components/i18n/` |

Agent-oriented coding norms (imports, tests, lint): [`guidelines/agent_coding.md`](../guidelines/agent_coding.md).

## Repository layout

| Path | Role |
|------|------|
| [`src/components/`](../src/components/README.md) | Feature UI: graph cards, inventory, product views, contexts, shared form/chart helpers |
| [`src/config/`](../src/config/README.md) | Product variants, display config, **global banner definitions** (`banners.js`), app config aggregation |
| [`src/services/`](../src/services/README.md) | API clients, mocks, RHSM paths and transforms |
| [`src/redux/`](../src/redux/README.md) | Store, reducers, middleware, exported hooks |
| [`src/common/`](../src/common/README.md) | Shared helpers, formatters, small utilities |
| [`src/hooks/`](../src/hooks/README.md) | Reusable hooks |
| [`tests/`](../tests/) | Integration-style tests and snapshots |
| [`guidelines/`](../guidelines/README.md) | Agent guidelines and skills (not runtime code) |

Tier-one `README.md` files under `src/*` are maintained alongside JSDoc; see CONTRIBUTING **Documentation**.

## Runtime flow (conceptual)

1. **Bootstrap** loads the app shell, auth, and locale ([`src/README.md`](../src/README.md)).
2. **Product routes** render product-specific views; configuration selects which products and capabilities appear ([`src/config/`](../src/config/README.md)).
3. **Views** use **contexts** and **hooks** with injectable defaults for tests; they dispatch Redux actions and read selectors via **`storeHooks.reactRedux`** (not ad hoc `react-redux` in new code).
4. **Services** perform HTTP calls; failures surface in UI patterns (e.g. graph/inventory debug tooling described in CONTRIBUTING).

## Global banners

Configurable, product-scoped alerts are defined in [`src/config/banners.js`](../src/config/banners.js) and wired through banner/message context and Redux (`messagesReducer`). Details and examples: [`src/config/README.md`](../src/config/README.md) (banner section).

## Related docs

- [development.md](./development.md) — MCP, optional agent tooling, git report script
- [CONTRIBUTING.md](../CONTRIBUTING.md) — Git workflow, releases, dependencies, testing, AI agent
- [README.md](../README.md) — Quick start for humans
