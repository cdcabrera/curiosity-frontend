# Development — MCP and local agent tooling

This document covers **optional** setup for AI-assisted development: **PatternFly MCP** in your editor and **repo-specific** scripts agents use. Tooling varies by person and product; nothing here is required to build or test the app.

## Why there is no committed MCP config

We do **not** ship a default `mcp.json` (or similar) in this repository because:

- Editors attach MCP in different ways (Cursor, VS Code, CLI, etc.).
- Cursor and other clients often **merge** project and user/global MCP settings; duplicate server names can list the same logical server twice or pin different package versions side by side.
- Some MCP entries need **machine-local** paths, tokens, or policies.

Keep MCP configuration **on your machine** (or in a private dotfiles repo), using the examples below as a template.

## PatternFly MCP (recommended)

[PatternFly MCP](https://github.com/patternfly/patternfly-mcp) exposes PatternFly documentation and rules to agents. Upstream docs: [usage](https://github.com/patternfly/patternfly-mcp/blob/main/docs/usage.md) (client shapes), [development / CLI](https://github.com/patternfly/patternfly-mcp/blob/main/docs/development.md) (flags, plugins).

### Cursor and VS Code–style project config

1. In the **workspace root** (this repo), create **`.cursor/mcp.json`** if your Cursor build expects that path (some versions also surface global config under **Cursor Settings → Tools & MCP**).
2. Prefer **one** definition per server name: if you already define PatternFly MCP in **`~/.cursor/mcp.json`**, either remove the duplicate or use a **different** `mcpServers` key in one of the files so you are not merging two servers with the same id.
3. Use a **pinned** package version if your team cares about reproducibility (replace `@latest` with a tag, e.g. `@0.8.0`).

Minimal **stdio** example (adjust the server key name if you like):

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

After saving, reload the window or restart MCP in your client so the server is picked up.

### Running the server from a terminal

Useful for debugging or pairing with [MCP Inspector](https://github.com/modelcontextprotocol/inspector):

```bash
npx -y @patternfly/patternfly-mcp@latest --log-stderr --verbose
```

Inspector (from upstream README):

```bash
npx -y @modelcontextprotocol/inspector npx @patternfly/patternfly-mcp@latest
```

## PatternFly MCP tool plugins (`--tool`)

You can load **external tool plugins** at startup. Upstream details: [MCP tool plugins](https://github.com/patternfly/patternfly-mcp/blob/main/docs/development.md#mcp-tool-plugins).

**Requirements (upstream):**

- **Node.js 22+** for external `--tool` plugins (core server runs on Node 20+).
- Plugins are **ESM**. Paths are passed with **`--tool`** (repeatable).

**CLI example:**

```bash
npx -y @patternfly/patternfly-mcp@latest --tool ./path/to/your-tool-plugin.mjs
```

**In `.cursor/mcp.json`**, add the same flags to the `args` array after the package specifier, for example:

```json
{
  "mcpServers": {
    "patternfly-docs": {
      "command": "npx",
      "args": [
        "-y",
        "@patternfly/patternfly-mcp@latest",
        "--tool",
        "./path/to/your-tool-plugin.mjs",
        "--plugin-isolation",
        "none"
      ],
      "description": "PatternFly MCP with a local tool plugin"
    }
  }
}
```

Use **`--plugin-isolation none`** only when a plugin truly needs broader host access (e.g. git, arbitrary files). Upstream warns this weakens isolation—prefer `strict` when possible.

For authoring plugins (`createMcpTool`, schemas, examples), follow the upstream [development](https://github.com/patternfly/patternfly-mcp/blob/main/docs/development.md) document.

## Repo history reports (terminal, not MCP)

For **time-bounded commit-message reports** (corpus, churn, PatternFly-related subjects), this repo ships a **bash** helper and npm script—see [**repo-history-reports**](../guidelines/skills/repo-history-reports/SKILL.md).

From the repository root:

```bash
npm run report:git -- --as-of HEAD --report corpus
# or
bash guidelines/skills/repo-history-reports/scripts/git-report.sh --as-of main --report patternfly
```

Run `npm run report:git -- --help` if the script’s usage changes. This is separate from PatternFly MCP; it does not require MCP to be configured.

## Related links

- [CONTRIBUTING.md](../CONTRIBUTING.md#ai-agent) — AI agent expectations and labels
- [guidelines/README.md](../guidelines/README.md) — Agent guidelines and skills index
- [README.md](../README.md) — Quick start and agent review order (HTML comment block)
