# Development

Local environment, testing, and documentation workflow for curiosity-frontend. **Git workflow, releases, dependency maintenance, and CI** remain in [CONTRIBUTING.md](../CONTRIBUTING.md). **Application architecture** is in [architecture.md](./architecture.md).

## Install tooling

Before developing you'll need to install:
 * [NodeJS and NPM](https://nodejs.org/)
    * Yarn install is now discouraged. There are dependency install issues with Yarn `1.x.x` versions.

#### OS support
The tooling for Curiosity is `Mac OS` centered.

While some aspects of the tooling have been expanded for Linux there may still be issues. It is encouraged that OS tooling
changes are contributed back while maintaining existing `Mac OS` functionality.

If you are unable to test additional OS support it is imperative that code reviews take place before integrating/merging build changes.

#### NodeJS and NPM
The Curiosity build attempts to align to the current NodeJS LTS version. It is possible to test future versions of NodeJS LTS. See CI Testing for more detail. 

#### NPM
NPM is automatically packaged with your NodeJS install.
## dotenv file setup

"dotenv" files contain shared configuration settings across the Curiosity code and build structure. These settings are imported through [helpers](../src/common/helpers.js), or through other various `process.env.[dotenv parameter names]` within the code or build.

#### Setup basic dotenv files
Before you can start any local development you need to relax permissions associated with the platform. This
affects various aspects of both `local` and `proxy` development.

1. Create a local dotenv file in the root of `curiosity-frontend` called `.env.local` and add the following contents
    ```
    REACT_APP_DEBUG_MIDDLEWARE=true
    REACT_APP_DEBUG_ORG_ADMIN=true
    REACT_APP_DEBUG_PERMISSION_APP_ONE=subscriptions:*:*
    REACT_APP_DEBUG_PERMISSION_APP_TWO=inventory:*:*
    ```

#### Advanced dotenv files
The dotenv files are structured to cascade each additional dotenv file settings from a root `.env` file.
```
 .env = base dotenv file settings
 .env.local = a gitignored file to allow local settings overrides
 .env -> .env.development = local run development settings that enhances the base .env settings file
 .env -> .env.proxy = local run proxy settings that enhances the base .env settings file
 .env -> .env.production = build modifications associated with all environments
 .env -> .env.production.local = a gitignored, dynamically generated build modifications associated with all environments
 .env -> .env.test = testing framework settings that enhances the base .env settings file
```

##### Current directly available _developer/debugging/test_ dotenv parameters

> Technically all dotenv parameters come across as strings when imported through `process.env`. It is important to cast them accordingly if "type" is required.

| dotenv parameter                   | definition                                                                                                                                                                     |
|------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| DEV_PORT                           | A local proxy build modification for running against a custom port                                                                                                             |
| DEV_BRANCH                         | A local proxy build modification for running against a custom environment branch. Available options include `stage*`, `prod*`                                                  |
| GENERATE_SOURCEMAP                 | A static boolean that disables local run source map generation only. May speed up local development re-compiles. May eventually be moved into `.env.development`.              | 
| REACT_APP_DEBUG_DEFAULT_DATETIME   | A static string associated with overriding the assumed UI/application date in the form of `YYYY-MM-DD`                                                                         |
| REACT_APP_DEBUG_MIDDLEWARE         | A static boolean that activates the console state debugging messages associated with Redux.                                                                                    |
| REACT_APP_DEBUG_ORG_ADMIN          | A static boolean associated with local development only that overrides the organization admin. Useful in determining UI/application behavior when permissions are missing.     |
| REACT_APP_DEBUG_PERMISSION_APP_ONE | A static string associated with local development only that overrides RBAC associated permissions. Useful in determining UI/application behavior when permissions are missing. |
| REACT_APP_DEBUG_PERMISSION_APP_TWO | A static string associated with local development only that overrides RBAC associated permissions. Useful in determining UI/application behavior when permissions are missing. |

##### Current directly available _build_ dotenv parameters

> Technically all dotenv parameters come across as strings when imported through `process.env`. It is important to cast them accordingly if "type" is required.

 | dotenv parameter                                  | definition                                                                                                                                                     |
 |---------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
 | REACT_APP_UI_VERSION                              | A dynamically build populated package.json version reference                                                                                                   |
 | REACT_APP_UI_NAME                                 | A static string populated reference similar to the consoledot application name                                                                                 |
 | REACT_APP_UI_DISPLAY_NAME                         | A static string populated reference to the display version of the application name                                                                             |
 | REACT_APP_UI_DISPLAY_CONFIG_NAME                  | A static string populated reference to the configuration version of the application name                                                                       |
 | REACT_APP_UI_DISPLAY_START_NAME                   | A static string populated reference to the "sentence start" application name                                                                                   |
 | ~~REACT_APP_UI_DEPLOY_PATH_PREFIX~~               | A legacy parameter. Originally, a dynamically build populated beta/preview environment path reference                                                                                          |                                                               
 | ~~REACT_APP_UI_DEPLOY_PATH_LINK_PREFIX~~          | A legacy parameter. Originally, a dynamically build populated beta/preview environment path reference that may or may not be equivalent to `REACT_APP_UI_DEPLOY_PATH_PREFIX`                   |
 | PUBLIC_URL                                        | A dynamically prefix populated reference to where the application lives on consoledot                                                                          |                                                                                                           
 | REACT_APP_UI_LINK_CONTACT_US                      | A static contact us link for populating a link reference NOT directly controlled by the application and subject to randomly changing.                          |
 | REACT_APP_UI_LINK_LEARN_MORE                      | A static learn more link for populating a link reference NOT directly controlled by the application and subject to randomly changing.                          |
 | REACT_APP_UI_LINK_REPORT_ACCURACY_RECOMMENDATIONS | A static mismatched content link for populating a link reference NOT directly controlled by the application and subject to randomly changing.                  |
 | REACT_APP_UI_DISABLED                             | A static boolean for disabling/hiding the entire UI/application                                                                                                |
 | REACT_APP_UI_DISABLED_NOTIFICATIONS               | A static boolean for disabling/hiding consoledot integrated notifications/toasts                                                                               |
 | REACT_APP_UI_DISABLED_TOOLBAR                     | A static boolean for disabling/hiding the UI/application product view primary toolbar                                                                          |
 | REACT_APP_UI_DISABLED_TOOLBAR_GROUP_VARIANT       | A static boolean for disabling/hiding the UI/application group variant toolbar and group variant select list                                                   |
 | REACT_APP_UI_DISABLED_GRAPH                       | A static boolean for disabling/hiding the UI/application graph card(s)                                                                                         |
 | REACT_APP_UI_DISABLED_TABLE                       | A static boolean for disabling/hiding ALL UI/application inventory displays                                                                                    |
 | REACT_APP_UI_DISABLED_TABLE_HOSTS                 | A static boolean for disabling/hiding ALL UI/application host inventory displays                                                                               |
 | REACT_APP_UI_DISABLED_TABLE_INSTANCES             | A static boolean for disabling/hiding ALL UI/application instances inventory displays                                                                          |
 | REACT_APP_UI_DISABLED_TABLE_SUBSCRIPTIONS         | A static boolean for disabling/hiding ALL UI/application subscription inventory displays                                                                       |
 | REACT_APP_UI_LOGGER_ID                            | A static string associated with the session storage name of debugger log files                                                                                 |
 | REACT_APP_UI_LOGGER_FILE                          | A static string associated with the session storage file name download of debugger log files.                                                                  |
 | REACT_APP_UI_WINDOW_ID                            | A static string associated with accessing browser console UI/application methods such as `$ curiosity.UI_VERSION`                                              |
 | REACT_APP_AJAX_TIMEOUT                            | A static number associated with the milliseconds ALL AJAX/XHR/Fetch calls timeout.                                                                             |
 | REACT_APP_AJAX_CACHE                              | A static number associated with the milliseconds ALL AJAX/XHR/Fetch calls have their response cache timeout.                                                   |
 | REACT_APP_AJAX_POLL_INTERVAL                      | A static number associated with the milliseconds ALL AJAX/XHR/Fetch export polling calls are called.                                                           |
 | REACT_APP_SELECTOR_CACHE                          | Currently NOT used, originally associated with the cache, similar to `REACT_APP_AJAX_CACHE` but for transformed Redux selectors.                               |
 | REACT_APP_CONFIG_EXPORT_EXPIRE                    | A static number used for the platform export data expiration.                                                                                                  |
 | REACT_APP_CONFIG_EXPORT_FILE_EXT                  | A static string used for the platform export download file extension.                                                                                          |
 | REACT_APP_CONFIG_EXPORT_FILE_TYPE                 | A static string used for the platform export download file MIME type.                                                                                          |
 | REACT_APP_CONFIG_EXPORT_FILENAME                  | A static tokenized string used for the platform export download filename.                                                                                      |
 | REACT_APP_CONFIG_EXPORT_SERVICE_NAME_PREFIX       | A static string used to prefix the platform export request name. Also used to filter and determine product identifiers combined with the export request name.  |
 | REACT_APP_CONFIG_SERVICE_LOCALES_COOKIE           | A static string associated with the platform cookie name used to store locale information                                                                      |
 | REACT_APP_CONFIG_SERVICE_LOCALES_DEFAULT_LNG      | A static string associated with the UI/application default locale language                                                                                     |
 | REACT_APP_CONFIG_SERVICE_LOCALES_DEFAULT_LNG_DESC | A static string describing the UI/application default locale language                                                                                          |
 | REACT_APP_CONFIG_SERVICE_LOCALES                  | A dynamically prefixed string referencing a JSON resource for available UI/application locales                                                                 |
 | REACT_APP_CONFIG_SERVICE_LOCALES_PATH             | A dynamically prefixed string referencing JSON resources for available UI/application locale strings                                                           |
 | REACT_APP_CONFIG_SERVICE_LOCALES_EXPIRE           | A dynamically prefixed string referencing the milliseconds the UI/application locale strings/files expire                                                      |
 | REACT_APP_SERVICES_RHSM_VERSION                   | A static string referencing the RHSM API spec                                                                                                                  |
 | REACT_APP_SERVICES_RHSM_REPORT                    | A static string referencing the RHSM API spec                                                                                                                  |
 | REACT_APP_SERVICES_RHSM_TALLY                     | A static tokenized string referencing the RHSM API spec                                                                                                        |
 | REACT_APP_SERVICES_RHSM_CAPACITY                  | A static tokenized string referencing the RHSM API spec                                                                                                        |
 | REACT_APP_SERVICES_RHSM_CAPACITY_DEPRECATED       | A static tokenized string referencing the RHSM API spec                                                                                                        |
 | REACT_APP_SERVICES_RHSM_INVENTORY                 | A static string referencing the RHSM API spec                                                                                                                  |
 | REACT_APP_SERVICES_RHSM_INVENTORY_GUESTS          | A static tokenized string referencing the RHSM API spec                                                                                                        |
 | REACT_APP_SERVICES_RHSM_INVENTORY_INSTANCES       | A static string referencing the RHSM API spec                                                                                                                  |
 | REACT_APP_SERVICES_RHSM_INVENTORY_SUBSCRIPTIONS   | A static string referencing the RHSM API spec                                                                                                                  |
 | REACT_APP_SERVICES_RHSM_OPTIN                     | A static tokenized string referencing the RHSM API spec                                                                                                        |

## Local and proxy development

#### Start writing code with local run
This is a non-networked local run designed to function with minimal resources and a mock API.

1. Confirm you've installed all recommended tooling
1. Confirm you've installed resources through npm
1. Create a local dotenv file called `.env.local` in the root of Curiosity, and add the following contents
    ```
    REACT_APP_DEBUG_MIDDLEWARE=true
    REACT_APP_DEBUG_ORG_ADMIN=true
    REACT_APP_DEBUG_PERMISSION_APP_ONE=subscriptions:*:*
    REACT_APP_DEBUG_PERMISSION_APP_TWO=inventory:*:*
    ```
1. Open a couple of instances of Terminal and run...
   ```
   $ npm start
   ```
   and, optionally,
   ```
   $ npm run test:dev
   ```
   > If issues happen with the mock server port of `3030` you can set a custom port by exporting a parameter when you run start-up
   > ie. `$ export MOCK_PORT=5000; npm start`    

1. Make sure your browser opened around the domain `https://localhost:3000/`
1. Start developing...

> The UI uses basic permissions in certain components to adjust the display. You can adjust permissions during development
> by adding in 3 dotenv params to a gitignored `.env.local` file in the root of the repository, similar to the `REACT_APP_DEBUG_MIDDLEWARE`
> mentioned above.
> 
> The 3 dotenv params below are... 
> - REACT_APP_DEBUG_ORG_ADMIN
> - REACT_APP_DEBUG_PERMISSION_APP_ONE 
> - REACT_APP_DEBUG_PERMISSION_APP_TWO
> 
> The `REACT_APP_DEBUG_ORG_ADMIN` was previously used as a convenience parameter for determining if a user is the organization admin used during the "opt-in" process.
> It may no longer be actively used.
> 
> The remaining 2 parameters are actively used during development. To apply development read-only permissions set the params as...
> ```
> REACT_APP_DEBUG_PERMISSION_APP_ONE=subscriptions:reports:read
> REACT_APP_DEBUG_PERMISSION_APP_TWO=inventory:reports:read
> ```
> 
> You will have to rerun the local run "start command" for the changes to be applied.

#### Start writing code on proxy
This is a networked run that has the ability to proxy prod and stage with a live API.

1. Confirm you've installed all recommended tooling
1. Confirm you've installed resources through npm
1. Create a local dotenv file called `.env.local` in the root of Curiosity, and add the following contents
    ```
    REACT_APP_DEBUG_MIDDLEWARE=true
    ```
1. **Confirm you are connected to the network**
1. Open a couple of instances of Terminal and run...
    ```
    $ npm run start:proxy
    ```
    and, optionally,
    ```
    $ npm run test:dev
    ```
1. Make sure you open your browser around the domain `https://*.foo.redhat.com/`
   > You may have to scroll, but the terminal output will have some available domains for you to pick from.
1. Start developing...

## Reserved CSS classNames, and attributes

#### Reserved CSS classNames

The code makes use of reserved CSS class prefixes used by external resources. 
> Updating elements with these classes should be done with the knowledge "you are affecting an external resource in a potentially unanticipated way".

1. Prefix `uxui-`

   CSS classes with the prefix `uxui-` are used by external resources to identify elements for use in 3rd party tooling. Changes to the class name or element should be broadcast towards our UI/UX team members. 

#### Reserved testing attributes
This project makes use of reserved DOM attributes and string identifiers used by the testing team.
> Updating elements with these attributes, or settings, should be done with the knowledge "you are affecting" the testing team's ability to test.
> And it is recommended you coordinate with the testing team before altering these attributes, settings.

1. Attribute `data-test`

   - DOM attributes with `data-test=""` are used by the testing team as a means to identify specific DOM elements.
   - To use simply place `data-test="[your-id-coordinated-with-testing-team]`" onto a DOM element.

2. `testId` used with i18next `translate` or `t`

   - The i18next `translate` or `t` function supports the use of a `testId` setting. This `testId` wraps a
   `<span data-test=[testId|locale string id]>[locale string]</span>` around copy content.
   - To use add the `testId` to your locale string function call use
      - `t('locale.string.id', { testId: true })`. In this example, this would populate `locale.string.id` as the testId.
      - or `t('locale.string.id', { testId: 'custom-id-coordinated-with-testing-team' })`
      - or `t('locale.string.id', { testId: <div data-test="custom-element-wrapper-and-id" /> })`
## Debugging

#### Debugging in environments
You can access basic dotenv config values via a global window object unique to the application. You'll need to access the GUI through a browser, open the development console and type
   ```
   curiosity
   ```
   or
   ```
   window.curiosity
   ```

This should expose a quick grouping of string values (along with a few superfluous helper functions) enabling you to identify things such as the `release version`.

The name of the window value can be found under the dotenv file `.env`
   ```
   REACT_APP_UI_LOGGER_ID=curiosity
   ```

#### Debugging development
You can apply overrides during local development by adding a `.env.local` (dotenv) file in the repository root directory.

Once you have made the dotenv file and/or changes, like the below "debug" flags, restart the project and the flags should be active.

*Any changes you make to the `.env.local` file should be ignored with `.gitignore`.*

#### Debugging Redux
This project makes use of React & Redux. To enable Redux browser console logging add the following line to your `.env.local` file.
  ```
  REACT_APP_DEBUG_MIDDLEWARE=true
  ```

#### Debugging in environment
Sporadically, an issue in the staging, or production, environment will cause the GUI to behave with a failure. The most common reasons for this failure relate to the GUI and API interaction.
This type of failure can result from a range of issues such as incorrect search/query parameters, and/or the API simply being unavailable.

GUI code architecture is structured around failing gracefully. This means a debugging feature is now conveniently presented in environment
to avoid having to dig into the GUI code, or open the browser console.

This feature is presented as a `gear icon` in the upper right corner of the...
- graph card(s)
- inventory card(s)
- and inventory guests (when available)

Clicking the `gear icon` will...
- Display the immediate service failure(s) in context to the GUI component, state, and service layers along with the API response within a selectable `textarea`.
## Documentation

#### Code documentation
The build, currently, makes use of JSDoc comments to autocorrect, potentially generate, lint, and build code markdown files.

##### Correcting comments
After you've added comments you can attempt to have the linting tools autocorrect any issues, such as comment line-lengths

To update these files after updating comments
  ```
  $ npm run test:lintfix
  ```

> Certain editors, if setup correctly, provide a convenience method to allow you to run similar repo level linting corrections by right-clicking on the file and running a general ESLint "fix" command.

##### Adding comments
You can attempt to autogenerate comments by running the same command as the `Correcting comments` above.

To update files with generated comments run
  ```
  $ npm run test:lintfix
  ```

This will provide a very **ROUGH** outline for you to **FURTHER** populate with more accurate information.

> It is encouraged you emulate existing JSDoc comments found within the repo, and/or read up on using [JSDoc](https://jsdoc.app). You may be asked to correct your
copy if it does not align to existing comments.
>
> Some Typescript shortcut syntax is not fully compatible with all JSDoc plugins, characters like the Array brackets `[]` or optional `?` question mark. In those cases more basic syntax may need to be used. For example, in the case of Array you would instead use
> `Array<TYPE GOES HERE>`.

> JSDoc comments, similar to Typescript typings, are for development reference. But while comments won't necessarily block development, the more accurate they are the more helpful.

##### Updating documentation
Adding or modifying existing JSDoc comments creates the requirement to update code level documentation. This requirement is represented by `README.md` files located underneath the first directory tier of the [source directory](../src).

To update these files after updating comments 
  ```
  $ npm run build:docs
  ```

> A PR/MR linting check currently runs to confirm you've updated documentation, so you'll need to add these files to your PR/MR.

Markdown under `docs/` and `guidelines/`, plus root `README.md`, `CONTRIBUTING.md`, and `config/README.md`, is spell-checked with `npm run test:spell-support` (dictionary in [`config/cspell.config.json`](../config/cspell.config.json)). That command runs as part of `npm run test:docs` and `npm run test:dev`.

## Testing

> Blindly updating unit test snapshots is not recommended. Within this code-base snapshots have been created
> to specifically call out when updates happen. If a snapshot is updating, and it is unexpected, this is our first 
> line of checks against bugs/issues.

#### Unit testing
To run the unit tests with a watch during development you'll need to open an additional terminal instance, then run
  ```
  $ npm run test:dev
  ```

##### Updating test snapshots
To update snapshots from the terminal run 
  ```
  $ npm run test:dev
  ```

From there you'll be presented with a few choices, one of them is "update", you can then hit the "u" key. Once the update script has run you should see additional changed files within Git, make sure to commit them along with your changes or continuous integration testing will fail.

##### Checking code coverage
To check the coverage report from the terminal run
  ```
  $ npm test
  ```

##### Code coverage failing to update?
If you're having trouble getting an accurate code coverage report, or it's failing to provide updated results (i.e. you renamed files) you can try running
  ```
  $ npm run test:clearCache
  ```

#### Integration-like testing
To run tests associated with checking build output run
   ```
   $ npm run build
   $ npm run test:integration
   ```

##### Updating integration-like test snapshots
To update snapshots from the terminal run 
  ```
  $ npm run test:integration-dev
  ```

## Spandx config

Local **proxy** development uses [`config/spandx.config.js`](../config/spandx.config.js). Treat that file as team-owned: see [config/README.md — Spandx config](../config/README.md#spandx-config) before moving or heavily refactoring it.

## Optional: PatternFly MCP and agent tooling

**Upstream reference:** [patternfly/patternfly-mcp](https://github.com/patternfly/patternfly-mcp) ([usage](https://github.com/patternfly/patternfly-mcp/blob/main/docs/usage.md), [development](https://github.com/patternfly/patternfly-mcp/blob/main/docs/development.md)).

We do not commit a default MCP config in this repository.

### Basic `npx` setup

Run the server locally:

```bash
npx -y @patternfly/patternfly-mcp@latest
```

**`.cursor/mcp.json`** (or your client’s equivalent) — minimal stdio server:

```json
{
  "mcpServers": {
    "patternfly-docs": {
      "command": "npx",
      "args": ["-y", "@patternfly/patternfly-mcp@latest"],
      "description": "PatternFly rules and documentation"
    }
  }
}
```

Reload MCP / the window after changes. Pin a version instead of `@latest` if you want a stable toolchain.

### Temporary tool plugin (until a real repo plugin exists)

Use this to verify **`--tool`** end-to-end. Requirements and security notes (Node 22+, `--plugin-isolation`, ESM): **[MCP tool plugins](https://github.com/patternfly/patternfly-mcp/blob/main/docs/development.md#mcp-tool-plugins)**.

1. Create a **local** file (e.g. under **`.agent/`**, which is gitignored), such as `.agent/patternfly-mcp-temp-tool.mjs`.
2. Paste a minimal plugin (same shape as upstream examples; `createMcpTool` is from `@patternfly/patternfly-mcp`):

```javascript
import { createMcpTool } from '@patternfly/patternfly-mcp';

export default createMcpTool({
  name: 'curiosityTempPing',
  description: 'Temporary placeholder tool until a real curiosity-frontend MCP plugin exists.',
  inputSchema: {
    type: 'object',
    properties: { message: { type: 'string' } },
    required: ['message']
  },
  async handler({ message }) {
    return {
      content: [{ type: 'text', text: `temp plugin ok: ${message}` }]
    };
  }
});
```

3. Point the server at it (paths relative to where the client starts the process—usually the repo root):

```bash
npx -y @patternfly/patternfly-mcp@latest --tool ./.agent/patternfly-mcp-temp-tool.mjs
```

4. In **`.cursor/mcp.json`**, extend `args` after the package args, for example:

```json
"args": [
  "-y",
  "@patternfly/patternfly-mcp@latest",
  "--tool",
  "./.agent/patternfly-mcp-temp-tool.mjs"
]
```

If the plugin cannot resolve `@patternfly/patternfly-mcp`, see **Dependency resolution** in the upstream development doc (e.g. local install or layout your client uses).

Replace this temp file with a proper plugin under version control when you add one; remove `--tool` from config if you stop using it.

## Git commit message reports

Time-bounded analysis of **commit subjects** (not line-level blame). Anchor every report with `as_of` (SHA, branch, tag, or `HEAD`).

From the repository root:

```bash
npm run report:git -- --as-of HEAD --report corpus
# or
bash scripts/git-report.sh --as-of main --report patternfly
```

| `--report` | Output |
|------------|--------|
| `corpus` | Conventions: type counts, `sw-` / `ent-` / `(#PR)` / `issues/` / `chore(release)` |
| `churn` | Heuristic recurring fixes: top `fix(` scopes, keyword hits in fix subjects |
| `patternfly` | Subjects matching `patternfly` or `@patternfly` |
| `subjects` | First and latest 50 commits (sampling) |

`--format json` is supported for **`corpus`** only.

**Conventions:** primary form `type(scope): sw-NNNN … (#PR)`; legacy **ent-NNNN**; older **issues/N** in text. **fix(build)** / npm churn is often maintenance, not app defects.

For blame or file history, use `git log`, `git blame`. Extra one-liners: `git log <REV> -i --grep='<token>' --no-merges --format='%h | %aI | %s'` (cap output).

### Future MCP tool (git reports)

**Canonical implementation** stays in **[`scripts/git-report.sh`](../scripts/git-report.sh)**. **`npm run report:git`** is the same script (pass flags after `--`, e.g. `npm run report:git -- --as-of HEAD --report corpus`).

A future **PatternFly MCP** `--tool` plugin should **delegate to one of those entry points** (spawn `npm run report:git` or `bash scripts/git-report.sh` from the repo root with the same arguments)—not reimplement the report logic in the plugin. That keeps humans, CI, agents, and MCP on one code path.

## Related docs

- [architecture.md](./architecture.md) — App structure, stack, and `src/` layout
- [CONTRIBUTING.md](../CONTRIBUTING.md#ai-agent) — AI agent expectations
- [guidelines/README.md](../guidelines/README.md) — Agent guidelines index
- [README.md](../README.md) — Quick start and agent review order (HTML comment)
