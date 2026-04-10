# Contributing
Interested in contributing to the project? Review the following guidelines and our [planned architecture](./docs/architecture.md) to make sure your contribution is aligned with the project's goals.

## Development

### Environment setup

#### Tools
- [Node.js 20+](https://nodejs.org/)
- NPM (Yarn install is discouraged)
- Git configured with your GitHub account

#### Project setup
- Fork and clone the repository
- Open your terminal in the codebase context and run the following commands:
   ```bash
   npm install
   npm start
   npm test
   npm run test:dev
   ```
  All tests should pass, and the application should start successfully.

##### Windows and repository symlinks
The repo uses **symlinks** so agent tools can find shared skills (for example `.agents/skills` points at `guidelines/skills`). On **Windows**, a plain clone can leave those as plain files instead of links, which breaks that layout.

- Prefer **Developer Mode** (Settings → Privacy & security → For developers) so Git can create symlinks without running as Administrator, **or** clone with symlink support enabled (for example `git clone -c core.symlinks=true …`).
- If symlinks were not created, enable `core.symlinks` and re-check out the affected paths, or work from **WSL** / **Git for Windows** with symlink support configured.

#### Development workflow
- Make changes to the codebase
- Run tests to verify your changes do not break existing functionality
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

#### Pull requests
Development pull requests (PRs) should be opened against the `main` branch.

> If your pull request work contains any of the following warning signs:
>  - has no related issue (sw-XXXX)
>  - ignores existing code style (functional components, storeHooks)
>  - out-of-sync commits (not rebased against the `main` branch)
>  - poorly structured commits and messages
>  - any one commit relies on other commits to work
>  - dramatic file restructures that attempt complex behavior
>  - missing, relaxed, or removed linting and tests
>  - dramatic unit test snapshot updates
>  - affects any file not directly associated with the issue being resolved
>  - affects "many" files
>
> You will be asked to restructure your commits or break the work into multiple pull requests.

#### Pull request commits, messaging
Your pull request should contain Git commit messaging that follows [conventional commit types](https://www.conventionalcommits.org/) to provide consistent history and help generate [CHANGELOG.md](./CHANGELOG.md) updates.

Commit messages follow two basic guidelines:
- No more than `65` characters for the first line.
- Commit message formats follow the structure:
  ```
  <type>(<scope>): <issue number> <description> (#PR_NUMBER)
  ```
  Example: `feat(config): sw-123 rhel, activate instance inventory (#456)`

> Settings, like the allowed number of message characters, for pull request commit linting can be found in [scripts/actions.commit.js](./scripts/actions.commit.js).

#### Pull request test failures
Before any review takes place, all tests should pass. Creating a pull request activates GitHub actions for commit linting, documentation linting, spelling, unit tests, and integration tests.

> If you are unsure why your tests are failing, you should [review testing documentation](./docs/development.md#testing).

### Code style guidance and conventions
Basic code style guidelines are enforced by ESLint.

#### React and Components
- Use **functional components** and React hooks.
- Align with PatternFly 5/6 tokens and existing shared components.
- Group external (PF/React) imports, then internal (`services/`, `redux/`), then relative.

#### Redux and State
- Use the custom Redux surface: import **`storeHooks`** from `src/redux`.
- Use `storeHooks.reactRedux` helpers (e.g., `useDispatch`, `useSelector`).
- Review `src/redux/index.js` before adding new state.

#### i18n
- User-visible strings MUST use `public/locales/en-US.json` via i18n helpers.

### Testing
Testing is based on Jest and **React Testing Library** (RTL).

#### Unit tests
Unit tests are located in `__tests__` directories parallel to the source files. Integration tests are in the root `./tests` directory.

#### Snapshots
Update snapshots **only** for expected output changes. Use `npm run test:dev` and press `u` for targeted updates.

## Maintenance: Node.js engine bumps

The `Node.js` engine requirements are updated on a predictable biannual schedule to ensure the server remains secure, leverages modern runtime features, and provides stability for consumers.

> Our engine requirements are intended to be the minimum to run the MCP server. They are not intended to be a maximum, as newer versions may introduce breaking changes or require additional configuration.

### Schedule and process
- **Timing**: Bumps are generally targeted for **Spring (April/May)** and **Fall (October/November)**, aligned with the [Node.js release schedule](https://nodejs.org/en/about/previous-releases) as versions enter or exit LTS.
- **Security**: Out-of-band updates may be performed if critical security considerations arise.
- **Version Targets**:
  - Focus on the latest **even-numbered (LTS/Stable)** versions (e.g., bumping to 22, 24, or 26).
  - GitHub Workflows should be updated to include the latest available even version.

### Acceptance criteria for bumps
- Update `package.json` engine requirements.
- Update related GitHub Action workflows (CI/CD).
- Update "Environmental Requirements" in documentation.
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
