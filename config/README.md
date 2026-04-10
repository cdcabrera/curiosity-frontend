# Configuration
## Build
Build support scripts.

## cspell config
The cspell config file(s) contain spelling configuration and include project specific terms.

Support and top-level markdown (`./docs/**/*.md`, `./guidelines/**/*.md`, `README.md`, `CONTRIBUTING.md`, this file) are checked with `npm run test:spell-support` from the repository root. Application sources and locale JSON use `npm run test:spell`. Both run during `npm test` (and `test:spell-support` is included in `npm run test:dev` and `npm run build:docs` via `test:docs`).

## Spandx config
The Spandx config file has multiple team and build dependencies. **Before relocating/moving this file the appropriate teams should be informed.**

[See docs/development.md — Spandx config](../docs/development.md#spandx-config)

## Testing
Jest configuration setup and transform scripts.

## Webpack
Webpack for local development and proxy run, and build output.
