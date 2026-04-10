# MCP plugin: git commit reports (`curiosityGitReport`)

PatternFly MCP **tool plugin** for this repository. It exposes one tool that runs **[`scripts/git-report.sh`](../../../scripts/git-report.sh)** (same behavior as **`npm run report:git`**).

## Requirements

- **Node.js 22+** for PatternFly MCP external `--tool` plugins ([upstream](https://github.com/patternfly/patternfly-mcp/blob/main/docs/development.md#mcp-tool-plugins)).
- **Bash** and **git** on `PATH`.
- **`npm install`** in the repo so `@patternfly/patternfly-mcp` resolves for `createMcpTool` (devDependency in root `package.json`).

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
| `report` | yes | `corpus` \| `churn` \| `patternfly` \| `subjects` |
| `asOf` | no | default `HEAD` (passed to `git-report.sh --as-of`) |
| `format` | no | `md` (default) or `json` (**corpus only**) |

## See also

- [docs/development.md](../../../docs/development.md) — CLI, npm script, and MCP overview
