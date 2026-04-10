# MCP plugin: git commit reports (`curiosityGitReport`)

PatternFly MCP **tool plugin** for this repository. It exposes one tool that runs **[`scripts/git-report.sh`](../../../scripts/git-report.sh)** (same behavior as **`npm run report:git`**).

## Requirements

- **Node.js 22+** for PatternFly MCP external `--tool` plugins ([upstream](https://github.com/patternfly/patternfly-mcp/blob/main/docs/development.md#mcp-tool-plugins)).
- **Bash** and **git** on `PATH`.
- No **`@patternfly/patternfly-mcp`** dependency in this repository: the plugin is a raw tool creator (same idea as upstream e2e **`tool.echoBasic.js`**), so only `npx @patternfly/patternfly-mcp` needs to resolve the server.

## Load with PatternFly MCP

From the **repository root** (paths relative to cwd):

```bash
npx -y @patternfly/patternfly-mcp@latest \
  --tool ./guidelines/mcp/plugin-git-reports/git-reports-tool.mjs \
  --plugin-isolation none
```

`--plugin-isolation none` is typical here because the tool spawns `bash` and reads the git repo ([upstream isolation notes](https://github.com/patternfly/patternfly-mcp/blob/main/docs/development.md#security--isolation)).

### `.cursor/mcp.json` example

```json
{
  "mcpServers": {
    "patternfly-docs": {
      "command": "npx",
      "args": [
        "-y",
        "@patternfly/patternfly-mcp@latest",
        "--tool",
        "./guidelines/mcp/plugin-git-reports/git-reports-tool.mjs",
        "--plugin-isolation",
        "none"
      ],
      "description": "PatternFly MCP + curiosity git reports"
    }
  }
}
```

## Tool: `curiosityGitReport`

| Argument | Required | Notes |
|----------|----------|--------|
| `report` | yes | `corpus` \| `churn` \| `patternfly` \| `subjects` \| `examples` |
| `asOf` | no | default `HEAD` (passed to `git-report.sh --as-of`) |
| `format` | no | `md` (default) or `json` (**corpus** and **examples**) |
| `since`, `until` | no | `report=examples` only — passed to `git log` |
| `limit` | no | `report=examples` only — default 15, max 100 |
| `commitType` | no | `report=examples` only — conventional type (`fix`, `build`, …) |
| `scope` | no | `report=examples` only — exact conventional scope |
| `subjectGlob` | no | `report=examples` only — case-insensitive glob on subject (`*` wildcard) |
| `paths` | no | `report=examples` only — pathspec strings |
| `bodyLines` | no | `report=examples` only — max body lines per commit (default 12) |

**`examples`** runs [`scripts/git-report-examples.mjs`](../../../scripts/git-report-examples.mjs) and needs **node** on `PATH`.

## See also

- [docs/development.md](../../../docs/development.md) — CLI, npm script, and MCP overview
