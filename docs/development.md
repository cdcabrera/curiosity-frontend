# Developer reference

Guide to Curiosity's development process and reference documentation.

- [Getting started](#getting-started)
- [Build](#build)
- [Development methodology and team members](#development-methodology-and-team-members)
- [Debugging](#debugging)
- [React components](#react-components)
- [Redux and state management](#redux-and-state-management)
- [Services](#services)
- [AI tools](#ai-tools)

## Getting started

### Running local development
This is a non-networked local run designed to function with minimal resources, a mock API, and a standalone Webpack dev server that leverages the same production configurations using [`Weldable`](https://github.com/cdcabrera/weldable).

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

### Running proxy development
This is a networked run that has the ability to proxy production, stage, and ephemeral with a live API.

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

## Build

### Webpack and Consoledot configuration
Webpack configuration leverages the NPM package [`Weldable`](https://github.com/cdcabrera/weldable) to integrate with Consoledot Webpack configuration.

Weldable is used to
- Provide a single NPM install point for most Webpack NPM packages. Without Weldable we would potentially have to include a few more dependency packages in our `package.json`
- Enable local non-network runs of the UI with API mocks. Since Weldable helps install and leverage the same Webpack configurations, we're able to use to run without Consoledot branding and influence to see base application display behavior.

For details on mocking APIs see [Mocking service responses](#mocking-service-responses)

### NPM scripts
Updated NPM scripts can be found in [package.json](../package.json) 

| script | description |
|--------|-------------|
|        |             |

### Environment variables (dotenv)
dotenv files within this repository are leveraged for application configuration only and contain no secrets or sensitive information.

#### Structure
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

#### Available _developer/debugging/test_ dotenv parameters

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

#### Available _build_ dotenv parameters

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

## Development methodology and teams

### Dependency injection
A primary focus for components in this application is about amplifying unit testing, dependency injection is key to this.

Dependency injection within this codebase allows for lighter components focused on
- display logic
- being closer to single responsibility
- ease of mocks for unit testing.

### Where does business logic live?
Not in the UI. Early in the project's history, an architecture decision was made to avoid business logic in the user interface and focus on display logic.

This is still true and is key to debugging and keeping the application display configurable. The user interface simply displays what the API gives it offsetting the responsibility of business logic onto languages more capable than JavaScript.

### Design and user experience coordination
Design and user experience are key to the stability of the Curiosity application. It is important to ensure that the user interface is intuitive and easy to use.

Application development typically coordinates design efforts with a dedicated designer and team. If there is a design alteration required, it's important to reach out to the design team since they generally coordinate multiple application displays to ensure a consistent user experience for the Consoledot platform.

**Make sure to reach out to the design team before attempting user experience alterations and refactors.**

### Copy design and writing
Copy design and writing, similar to design and user experience coordination, is crucial for maintaining a consistent brand and user experience across all applications.

Application development typically coordinates locale string updates with the technical writing team to ensure that the content and visual elements align with the overall brand guidelines and user interface standards.

**Make sure to reach out to the technical writing team before attempting content and visual element alterations and refactors.**

### Quality assurance and E2E
Quality assurance and end-to-end (E2E) testing are vital to making sure regressions, and those one-off off-hours issues do not become the norm.

In addition to the integration checks the repository uses on its build output, E2E is leveraged at the continuous integration (CI) level to ensure that the application is functioning as expected before deployment.

**Make sure to reach out to the related team members if you are unfamiliar with what mechanisms are currently being used to perform E2E.**

> There are future plans to integrate Playwright for E2E testing. Any future code rewrites should consider any level of testing integration a priority over general rewrites/refactors to avoid losing known and unknown functionality.

## Debugging

### Testing

### Local

### Staging and production

## React components

### Separating component display from logic and lifecycle events.

### React context

### PatternFly components

## Redux and state management

### Simplifying state management for services

#### Middleware

#### Promise handling

#### Reducer helpers

## Services

### Normalizing service data for state management

#### Joi service response validation

#### Transforming service responses

#### Caching service responses

### Mocking service responses

## AI tools

### Agent skills

### PatternFly MCP
