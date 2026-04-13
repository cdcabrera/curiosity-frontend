# Contributing
Interested in contributing to the project? Review the following guidelines and our [planned architecture](./docs/architecture.md) to make sure your contribution is aligned with the project's goals.

## Development

### Environment setup

#### Tools
- [Node.js](https://nodejs.org/en/download/package-manager)
- NPM (Yarn install is discouraged)
- Git configured with your GitHub account

#### Project setup
- Fork and clone the repository
- Install project dependencies
   ```sh
   $ npm install
   ```
- Create a local dotenv file in the root of the project called `.env.local` and add the following contents
   ```
   REACT_APP_DEBUG_MIDDLEWARE=true
   REACT_APP_DEBUG_ORG_ADMIN=true
   REACT_APP_DEBUG_PERMISSION_APP_ONE=subscriptions:*:*
   REACT_APP_DEBUG_PERMISSION_APP_TWO=inventory:*:*
   ```
- Start the local development server against mock API responses
   ```sh
   $ npm start
   ```
   Start developing against files in `./src`. Linting feedback will be automatically enabled through the terminal output
- Run unit tests while developing
   ```sh
   $ npm run test:dev
   ```
- Exit the process, `ctr + c` or OS specific key combination
- Run the build and related integration tests
   ```sh
   $ npm run build
   ```

For more detailed development guidance see [Development Guide](./docs/development.md)

##### Windows and repository symlinks
The repo uses **symlinks** so agent tools can find shared skills (for example `.agents/skills` points at `guidelines/skills`). On **Windows**, a plain clone can leave those as plain files instead of links, which breaks that layout.

- Prefer **Developer Mode** (Settings → Privacy & security → For developers) so Git can create symlinks without running as Administrator, **or** clone with symlink support enabled (for example `git clone -c core.symlinks=true …`).
- If symlinks were not created, enable `core.symlinks` and re-check out the affected paths, or work from **WSL** / **Git for Windows** with symlink support configured.

#### Development workflow
- Make changes to the codebase
- Run tests and build to verify your changes do not break existing functionality
- Commit your changes and push them to your fork
- Open a pull request

### Using Git

#### Workflow
Our process follows the standard GitHub fork and pull request workflow.

- Fork the repository
- Create a branch for your changes
- Submit a pull request towards the main repository default branch (`main`)

##### Main repository branches
- `main` branch is a representation of development and `stage`.
- `stable` branch is a representation of the `prod` environment.

> Note: The only PRs ever merged into the `stable` branch are those from `main` and a pull request to merge a release commit.

#### Pull requests
Development pull requests (PRs) should be opened against the `main` branch.

> If your pull request work contains any of the following warning signs:
>  - has no related issue (sw-XXXX)
>  - ignores existing code style (functional components, dependency injection, storeHooks)
>  - out-of-sync commits (not rebased against the `main` branch)
>  - poorly structured commits and messages
>  - any one commit relies on other commits to work
>  - dramatic file restructures that attempt complex behavior
>  - missing, relaxed, or removed linting and tests
>  - dramatic unit test snapshot updates
>  - affects any file not directly associated with the issue being resolved
>  - affects "many" files
>  - provides a bot-generated explanation that cannot be explained by the human counterpart
>
> You will be asked to either:
> - restructure your commits
> - break the work into multiple pull requests
> - close the PR

#### Pull request commits, messaging
Your pull request should contain Git commit messaging that follows [conventional commit types](https://www.conventionalcommits.org/) to provide consistent history and help generate [CHANGELOG.md](./CHANGELOG.md) updates.

Commit messages follow two basic guidelines:
- No more than `65` characters for the first line.
- Commit message formats follow the structure:
  ```
  <type>(<scope>): <issue number> <description> (#PR_NUMBER)
  ```
  Example: `feat(config): sw-123 rhel, activate instance inventory (#456)`

  Where:
  - **Type**: The type of work the commit resolves (e.g., `feat`, `fix`, `chore`, `docs`, `refactor`, `test`).
  - **Scope**: The optional area of code affected (directory, filename, or concept).
  - **Issue number**: The issue number typically from the current issue tracker (e.g., `ent-123`, `sw-123`).
  - **Description**: What the commit work encompasses.
  - **#PR_NUMBER**: The pull request number. Typically added automatically during merge/squash operations. Including it manually is optional. It can help with traceability during review.

> The codebase as of version `4.19.0` adheres to strict messaging guidelines specifically for seachability and [CHANGELOG generation](./CHANGELOG.md). It is encouraged this practice is maintained for the new benefit of having agents interact and search your git history.
>
> Helpful hints for searchable commit messages:
>   - Filler words are often unnecessary to relate to your work when leveraging conventional commit types (e.g. `for`, `the`, `add`, `updated`).
>   - Keep the subject line concise yet descriptive. If previous coding work was done on the same files, consider using the same commit message for searchability.
>   - Do not over describe, add unnecessary details.
>   - State facts, do not inject personal opinions. Facts help searchability. Opinions can be applied to issue/story comments and work great if there's a story number on the commit message.
>   - Include a body if affecting multiple files, be concise. Past messages list files and the changes applied to them instead of broad descriptions. This helps searchability.

> If your **pull request contains multiple commits**, they may be squashed into a single commit before merging, and the messaging altered to reflect current guidelines.

> Settings, like extending the allowed number of message characters, for pull request commit linting can be found in [scripts/actions.commit.js](./scripts/actions.commit.js).

#### Pull request test failures
Before any review takes place, all tests should pass. Creating a pull request activates GitHub actions for:
- commit linting
- documentation linting
- spelling
- unit tests
- build integration tests

> If you are unsure why your tests are failing, you should [review testing documentation](./docs/development.md#testing).

### Code style guidance and conventions
Basic code style guidelines are enforced by ESLint, but there are additional guidelines.

#### File Structure
- File names use lowerCamelCase reflective of the parent directory and functionality (e.g., authentication.ts, authenticationContext.ts).
- The directory structure is organized by React, Redux, and service layer. With all relevant application files maintained in the src directory.

#### Functionality, testing
- Functions should attempt to maintain a single responsibility.
- Function annotations follow a minimal JSDoc style; descriptions are encouraged.
- Functions leverage dependency injection to facilitate reusability and unit testing with mocks.
- Tests should focus on functionality.
- Tests should not be written for external packages. That is the responsibility of the external package, or it shouldn't be used.

#### TypeScript
- Typings are handled through JSDoc comments.
- TypeScript is currently not implemented.

> If a refactor towards TypeScript is started, it is highly recommended that unit tests and E2E tests are updated and working before that effort. The level of React context and complex Redux state being used in the application can be deceptive in its complexity and behavior, and without a baseline set of checks you risk functionality gaps.

#### React and Components
- Use **functional components** and React hooks.
- Leverage dependency injection for
   - separating React lifecycle and component logic
   - reusability of components
   - unit testing with mocks
- Align with PatternFly by wrapping PatternFly components that are
   - complex
   - experience failure
   - are prone to change or be deprecated between PatternFly versions
- Group external (PF/React) imports, then internal (`services/`, `redux/`), then relative.

#### Redux and State
- Use the custom Redux surface: import **`storeHooks`** from `src/redux`.
- Use `storeHooks.reactRedux` helpers (e.g., `useDispatch`, `useSelector`).
- Review `src/redux/index.js` before adding new state.

#### i18n and locale
- User-visible strings MUST use `public/locales/en-US.json` via i18n helpers.

> Locale strings are loaded using XHR and make heavy use of the internal methods provided by the i18n library to prevent duplication.

### Testing
Testing is based on Jest and **React Testing Library** (RTL).

#### Unit tests
Unit tests are located in `__tests__` directories parallel to the source files.

#### E2E tests
Integration, or E2E, tests are located in the root `./tests` directory and are currently focused on consistent and clean build output.

#### Snapshots
Update snapshots **only** for expected output changes!
- Update for unit tests, use `npm run test:dev` and press `u` for targeted updates.
- Update for E2E tests, use `npm run build`, if the build checks fail use `npm run test:integration-dev` and press `u` for targeted updates.

> Snapshots in this repository are leveraged as fast unit test implementations and are purposefully loud to alert development.
> If you're seeing updates, it's likely due to changes in the build output or configuration, sometimes caused by build updates, but not always.
> Please review your changes carefully and ensure they align with the expected behavior, failure to acknowledge these alerts may result in production issues.

## Maintenance: Node.js engine bumps

The `Node.js` engine requirements are updated on a predictable biannual schedule to ensure the server remains secure, leverages modern runtime features, and provides stability for consumers.

> Our engine requirements are intended to be the minimum to run the application. They are not intended to be a maximum, as newer versions may introduce breaking changes or require additional configuration.

### Schedule and process
- **Timing**: Bumps are generally targeted for **Spring (April/May)** and **Fall (October/November)**, aligned with the [Node.js release schedule](https://nodejs.org/en/about/previous-releases) as versions enter or exit LTS.
- **Security**: Out-of-band updates may be performed if critical security considerations arise.
- **Version Targets**:
  - Focus on the latest **even-numbered (LTS/Stable)** versions (e.g., bumping to 22, 24, or 26).
  - GitHub Workflows should be updated to include the latest available even version.

### Acceptance criteria for bumps
- Update `package.json` engine requirements.
- Update related GitHub Action workflows (CI/CD).
- Update "Environmental Requirements" in documentation, typically README.md and CONTRIBUTING.md
- Ensure all tests pass on the new target version.

## AI agent

### User section
Current agent interaction can be triggered with the chat command

- **`review the repo guidelines`** - Your agent should attempt to scan common Markdown files and the guidelines directory

For detailed information on agent interaction, see [guidelines/README.md](./guidelines/README.md).

#### Customizing developer experience
As developers, we often have our own preferred workflows, and that includes working with AI agents. To that point, we've added agent guidance
to allow customization for your work environment through a tool-agnostic git-ignored directory `./.agent` in the root of the project.

#### Noting AI agent contributions
Please reference RedHats AI-assisted development guidelines for guidance on how to acknowledge AI agent contributions.

### Agent only
Agents: This repository contains a hierarchical guideline system. Agents should review agent-only comment blocks.

<!--
Agents must analyze these files when asked for guidance:

**Guidelines review order:**
1. **`./README.md`** - Entry point and high-level overview
2. **`./CONTRIBUTING.md`** - Maintainer processes and AI policy (#ai-agent)
3. **`./guidelines/README.md`** - Core agent guidance and behavior standards
4. **`./guidelines/**/*.md`** - Specialized workflow and domain-specific instructions
5. **`./.agent/**/*.md`** - gitignored directory and local guidelines intended for agent-specific state and new agent-generated guidance, and user workflows that enhance the core guidelines

The guideline system should be processed in this order, with specialized guidelines taking precedence for their specific domains, and local guidelines overriding general guidelines when present.

**Next Steps:**
5. **Review guidance under the `./.agent/**/*.md` directory.** If the `./.agent` directory exists, the user may ask the agent about the guidance located here.
6. **If the `./.agent` directory does not exist, ask the user if they want to create it.** The agent should explain how it's going to be used.
-->
