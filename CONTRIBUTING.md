# Contributing
Contributing encompasses repository specific requirements.

## Process
### Using Git

Curiosity makes use of
- GitHub's fork and pull workflow.
- A linear commit process and rebasing. GitHub merge commits, and squashing are discouraged in favor of smaller independent commits

> Working directly on the main repository is highly discouraged. Continuous Integration is dependent on branch structure.

#### Main repository branches and continuous integration
Curiosity makes use of the branches `main`, `stable`.
- `main` branch is a representation of development, `stage`.
   - When a branch push happens the `main` branch is automatically deployed for `https://console.stage.redhat.com/`
- `stable` branch is a representation of a single environment, `prod`.
   - Commits can be parked on `stable`. We no longer automatically deploy commits on the `stable` branch.
   - To release to `prod` a Git hash is submitted with a GitLab Merge Request within the `app-interface` repository. This will be deployed to `https://console.redhat.com`
      - It is preferable if releasing to `prod` that a tag is created for the latest commit. The commit message should use
        the form `chore(release): [version number]`

#### Branch syncing
Linear commit history for Curiosity makes syncing concise
- `main` is always rebased from `stable`
   - typically after a release
   - or in prep for a fast-forward of `stable`
- `stable` is fast-forwarded from `main`
   - typically when commits are prepared for release

### Pull request workflow, and testing

All development work should be handled through GitHub's fork and pull workflow.

#### Setting up a pull request
Development pull requests (PRs) should be opened against the `main` branch. Development PRs directly to `stable` are discouraged since branch structure
represents environment. However, exceptions are allowed, as long those updates are also rebased against the `stable` branch, for...
- bug fixes
- build updates

> If your pull request work contains any of the following warning signs 
>  - out of sync commits (is not rebased against the `main` branch)
>  - poorly structured commits and messages
>  - any one commit relies on other commits to work at all, in the same pull request
>  - dramatic file restructures that attempt complex behavior
>  - missing, relaxed, or removed unit tests
>  - dramatic unit test snapshot updates
>  - affects any file not directly associated with the associated issue being resolved
>  - affects "many" files
>
> You will be encouraged to restructure your commits to help in review.

#### Pull request commits, messaging

Your pull request should contain Git commit messaging that follows the use of [conventional commit types](https://www.conventionalcommits.org/)
to provide consistent history and help generate [CHANGELOG.md](./CHANGELOG.md) updates.

Commit messages follow three basic guidelines
- No more than `65` characters for the first line
- If your pull request has more than a single commit you should include the pull request number in your message using the below format. This additional copy is not counted towards the `65` character limit.
  ```
  [message] (#1234)
  ```

  You can also include the pull request number on a single commit, but
  GitHub will automatically apply the pull request number when the
  `squash` button is used on a pull request.

- Commit message formats follow the structure
  ```
  <type>(<scope>): <issue number><description>
  ```
  Where
  - Type = the type of work the commit resolves.
     - Basic types include `feat` (feature), `fix`, `chore`, `build`.
     - See [conventional commit types](https://www.conventionalcommits.org/) for additional types.
  - Scope = the area of code affected.
     - Can be a directory or filenames
     - Does not have to encompass all file names affected
  - Issue number = the Jira issue number
     - Currently, the prefix `sw-[issue number]` represents `SWATCH-[issue number]`
  - Description = what the commit work encompasses

  Example
  ```
  feat(config): sw-123 rhel, activate instance inventory
  ```
> Not all commits need an issue number. But it is encouraged you attempt to associate
> a commit with an issue for tracking. In a scenario where no issue is available
> exceptions are made for `fix`, `chore`, and `build`.

#### Pull request test failures
Creating a pull request activates the following checks through GitHub actions.
- Commit message linting, see [commit_lint.yml](./.github/workflows/commit_lint.yml)
- Code documentation linting, see [documentation_lint.yml](./.github/workflows/documentation_lint.yml)
- Pull request spelling, code linting, unit tests and repo-level integration tests, see [integration](./.github/workflows/integration.yml)
  - The spelling config dictionary is here [cspell.config.json](./config/cspell.config.json)
- Jenkins integration testing. Currently, Jenkins re-runs the same tests being used in [integration](./.github/workflows/integration.yml)

For additional information on failures for
- Commit messages, see [Pull request commits, messaging](#pull-request-commits-messaging)
- Code documentation, see [Documentation](./docs/development.md#documentation)
- Pull request code, see [Testing](./docs/development.md#testing)
<!-- Jenkins integration can be ignored until it actively runs integration testing. -->

> You can always attempt to restart Jenkins testing by placing a pull request comment
> with the copy `/retest`.

> To resolve failures for any GitHub actions make sure you first review the results of the test by
clicking the `checks` tab on the related pull request.

> Caching for GitHub actions and NPM packages is active. This caching allows subsequent pull request
> updates to avoid reinstalling npm dependencies. 
> 
> Occasionally test failures can occur after recent NPM package updates either in the pull request
> itself or in a prior commit to the pull request. The most common reason for this failure presents when
> a NPM package has changed its support for different versions of NodeJS and those packages are updated
> in the `main` branch. 
> 
> If test failures are happening shortly after a NPM package update you may need to clear the
> GitHub actions cache and restart the related tests.

### Releasing code for all environments

Curiosity releases code to the following environments
   - stage
   - production

> After pushing code, or tagging, a repository hook notifies continuous integration and starts the process of
> environment updates.

#### Release for stage
Merging code into stage is simplistic
1. Merge a pull request into `main`
   ```
   pull-request -> main -> stage
   ```

#### Release for production stable
To merge code into production stable a maintainer must run the release commit process locally.

   ```
   local main repo, stable branch -> create a release commit -> push/merge commit to stable -> release tag on commit -> `app-interface` merge request on commit hash -> production release
   ```

1. Clone the main repository, within the repo confirm you're on the `stable` branch and **SYNCED** with `origin` `stable`
1. Run
   1. `$ git checkout stable`
   1. `$ npm install`
   1. `$ npm run release --dry-run` to confirm the release output version and commits.
   1. `$ npm run release` to generate file changes, and then commit them.

      >If the version recommended should be different you can run the command with an override version following a semver format
      >  ```
      >  $ npm run release --override X.X.X
      >  ``` 
1. Confirm you now have a release commit with the format `chore(release): X.X.X` and there are updates to
   - [`package.json`](./package.json)
   - [`CHANGELOG.md`](./CHANGELOG.md)

   If there are issues with the file updates you can correct them and squish any fixes into the `chore(release): X.X.X` commit
1. Push the **SINGLE** commit to `origin` `stable`
1. Using the [Curiosity GitHub releases interface](https://github.com/RedHatInsights/curiosity-frontend/releases)
   1. Draft a new release from `stable` confirming you are aligned with the `chore(release): X.X.X` commit hash
   1. Create the new tag using the **SAME** semver version created by the release commit but add a `v` prefix to it, i.e. `vX.X.X`, for consistency.

   > To avoid issues with inconsistent Git tagging use it is recommended you use the GitHub releases interface.
1. Finally, submit a merge request to update the `app-interface` deployment yaml
   - Copy the tagged Git hash and update the `app-interface` configuration hash within `[app-interface-insights-rhsm]/deploy-clowder.yml`
### NPM dependency maintenance

#### Automated cycle for updating NPMs
Automation primarily makes use of `dependabot`.
> Configuration for `dependabot` is located under the [github directory](.github/).

Our current schedule for automated dependency updates
- dependabot running once a week on low-level dev packages that only require testing confirmation. Low-level is indicated by semver version `minor` and `patch` updates.

#### Manual cycle for updating NPMs
Our schedule for updating NPMs
- 1x a month: running our aggregated dependency update script for all low level packages that require only testing confirmation
   - `$ npm run build:deps`
- 1x a month: running updates on NPMs that require additional visual and build confirmation. **These packages' semver confidence is labeled as suspect. Breaking changes have been introduced as minor and patch versions. If a package consistently adheres to semver, subject to discussion, they'll be removed from this list.** This includes...
   - dependency-name: "@patternfly/*"
   - dependency-name: "@redhat-cloud-services/frontend*"
   - dependency-name: "victory*"

#### Process for manually updating NPMs
To update packages in bulk there are 2 pre-defined paths, "basic" and "core".

> For most users, it is **highly discouraged** that you rely on updating ANY `lock` file section ONLY. This potentially creates long-term issues when NPM references in `package.json` potentially require specific
> dependencies, or have built around specific package functionality that could be inadvertently altered by updating a dependencies' dependency.
> 
> For the knowledge, there is a parallel technique for forcing dependency updates based on the syntax leveraged inside of [`package.json`](./package.json). The `caret` character used in
> [`package.json`](./package.json), for example, indicates `minor` and `patch` versions are backwards compatible with a major package version. By deleting the entire `lock` file, and for simplicity the `node_modules`
> directory too, then running `$ npm install` you can effectively trigger NPM's install process for leveraging the syntax inside your [`package.json`](./package.json) along with subsequent dependencies.
> This is useful in scenarios where a dependency of a dependency spans multiple packages and is triggering an alert, or when debugging problematic packages becomes time intensive. However, this should be used sparingly,
> to avoid breaking changes, and tested thoroughly.

##### Basic NPM updates
> You can see a listing of all outdated packages by running `$ npm outdated` in the repo context.

1. Clone the repository locally, or bring your fork up-to-date with the development branch. [install tooling](./docs/development.md#install-tooling). 
1. Open a terminal instance in the repository context and run
    ```
    $ npm run build:deps
    ```
   This will cycle through ALL basic NPM dependencies, running both unit tests, build and local integration checks. If
   any errors are throw the package update is skipped.
1. After the updates have completed **YOU MUST VISUALLY CONFIRM** the updates were successful by running both local development start scripts.
   - Visually confirm that local development still functions and can be navigated with... 
      ```
      $ npm start
      ```
   - Visually confirm that proxy development still functions and can be navigated with...
      1. Start VPN
      1. Run
         ```
         $ npm run start:proxy
         ```
      > Proxy run is reserved for internal uses, if you do not have access you can skip this part of the process and provide a reviewer note in your pull request 
1. After you've confirmed everything is functioning correctly, check and commit the related changes to `package.json` and `package-lock.json`, then open a pull request towards the development branch.
> If any part of the "basic path" process fails you'll need to figure out which NPM is the offender and remove it from the update. OR resolve to fix the issue
> since future updates will be affected by skipping potentially any package update.
> A `dependency-update-log.txt" file is generated in the root of the repository after each run of `$ npm run build:deps` this should contain a listing of the skipped packages.

##### Core NPM updates
1. Clone the repository locally, or bring your fork up-to-date with the development branch. [install tooling](./docs/development.md#install-tooling). 
1. Open a terminal instance in the repository context and run
    ```
    $ npm run build:deps-core
    ```
   This will cycle through ALL core NPM dependencies, running both unit tests, build and local integration checks. If
   any errors are throw the package update is skipped.
1. After the updates have completed **YOU MUST VISUALLY CONFIRM** the updates were successful by running both local development start scripts.
   - Visually confirm that local development still functions and can be navigated with... 
      ```
      $ npm start
      ```
   - Visually confirm that proxy development still functions and can be navigated with...
      1. Start VPN
      1. Run
         ```
         $ npm run start:proxy
         ```
      > Proxy run is reserved for internal uses, if you do not have access you can skip this part of the process and provide a reviewer note in your pull request
1. After you've confirmed everything is functioning correctly, check and commit the related changes to `package.json` and `package-lock.json`, then open a pull request towards the development branch.
> If any part of the "core path" process fails you'll need to figure out which NPM is the offender and remove it from the update. OR resolve to fix the issue
> since future updates will be affected by skipping potentially any package update.
> A `dependency-update-log.txt" file is generated in the root of the repository after each run of `$ npm run build:deps-core` this should contain a listing of the skipped packages.

##### Manual fallback NPM updates
This is the slowest part of package updates. If any packages are skipped during the "basic" and "core" automation runs. Those packages will need to be updated manually.
1. Clone the repository locally, or bring your fork up-to-date with the development branch. [install tooling](./docs/development.md#install-tooling).
1. Remove/delete the `node_modules` directory (there may be differences between branches that create package alterations) 
1. Run
   ```
   $ npm install
   ```
   To re-install the baseline packages.
1. Start working your way down the list of `dependencies` and `devDependencies` in [`package.json`](./package.json). It is normal to start on the `dev-dependencies` since the related NPMs support build process. Build process updates at more consistent interval without breaking the application.
   > Some text editors fill in the next available NPM package version when you go to modify the package version. If this isn't available you can always use [NPM directly](https://www.npmjs.com/)... start searching =).
1. After each package version update in [`package.json`](./package.json) you'll run the follow scripts
   - `$ npm test`, if it fails you'll need to run `$ npm run test:dev` and update the related tests
   - `$ npm run build`, if it fails you'll need to run `$ npm run test:integration-dev` and update the related tests
   - `$ npm start`, confirm that local run is still accessible and that no design alterations have happened. Fix accordingly.
   - Make sure VPN is active, then type `$ npm run start:proxy`. Confirm that proxy run is still accessible and that no design alterations have happened. Fix accordingly.
1. If the package is now working commit the change and move on to the next package.
   - If the package fails, or you want to skip the update, take the minimally easy path and remove/delete `node_modules` then rollback `package-lock.json` **BEFORE** you run the next package update.
> There are alternatives to resetting `node_modules`, we're providing the most direct path.
>
> Not updating a package is not the end-of-the-world. A package is not going to randomly break because you haven't updated to the latest version.

> Security warnings on NPM packages should be reviewed on a "per-alert basis" since **they generally do not make a distinction between build resources and what is within the applications compiled output**. Blindly following a security
> update recommendation is not always the optimal path.

### Build maintenance

- Webpack configuration. The build uses an extended consoledot configuration combined with NPM scripts found in [`package.json`](./package.json).
   - Webpack build files
     - [`./config`](./config)
     - [`./scripts/post.sh`](./scripts/post.sh)
     - [`./scripts/pre.sh`](./scripts/pre.sh)
- Continuous Integration. The build currently has both old, and new, continuous integration running. Continuous integration makes use of Webpack build files.
   - Ephemeral build files
      - [`./deploy`](deploy) 
   - Konflux
- GitHub Actions
   - Action files
      - [`./.github/workflows`](.github/workflows)
   - Related script files
      - [`./.scripts/actions.commit.js`](./scripts/actions.commit.js)
      - [`./.scripts/actions.documentation.js`](./scripts/actions.documentation.js)

## Development

Install tooling, dotenv, local and proxy development, debugging, JSDoc and tier-one README workflow, and testing commands are documented in **[docs/development.md](./docs/development.md)**.

## AI Agent
### Guidelines

If you're using an AI assistant to help with development in this repository, please prompt it to `> review the repo guidelines` first to ensure it follows the project's conventions and best practices.

#### User Section

Current agent interaction can be triggered with the chat command

- **`review the repo guidelines`** - Your agent should attempt to scan common files like `README.md` and `CONTRIBUTING.md`

- For detailed information on agent interaction, see [guidelines/README.md](./guidelines/README.md).

- For **optional** IDE setup (PatternFly MCP, tool plugins, and repo commit-report scripts), see [docs/development.md](./docs/development.md). This repository does not commit a default MCP configuration; configure clients locally to avoid duplicate or conflicting servers across machines.

##### Customizing developer experience

As developers, we often have our own preferred workflows, and that includes working with AI agents. To that point, we've added agent guidance
to allow customization for your work environment through a tool-agnostic **git-ignored** directory **`./.agent`** in the root of the project. That directory is **not tracked by git**: contents stay **on your machine** and are **not** shared with other contributors when they clone or pull the repository (unless you copy files elsewhere deliberately). Canonical, team-shared agent material belongs under [`guidelines/`](./guidelines/README.md).

##### Noting AI Agent contributions

> This section will be updated as we explore agent/developer interactions. The current rules are based on openness. 

Asking the agent to review the repo and its git history should provide code-style references your agent can leverage based on this codebase's patterns. That
helps alleviate some concerns around where your agent is generating/pulling references from, but not all.

To help us minimally keep track of assisted contributions and pure generated work, we've created some base guidelines for users:

| Level of work | How to track                                                                                                                                                                                                                 |
|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Partial Bot   | Just use the `bot-assisted` PR/MR label.                                                                                                                                                                                     |
| Full Bot      | Use the `bot-created` PR/MR label. And make sure your PR/MR contains notes about the tooling used. The work will be blocked if this information is not included, vague, or appears to be coming from an unknown bot-account. |

> By contributing AI-assisted or AI-generated work, you accept liability for work that infringes or uses copyrighted material outside the scope of the related license.  

