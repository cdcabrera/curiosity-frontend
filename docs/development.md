# Development — MCP and local agent tooling

Optional setup for AI-assisted development. None of this is required to build or test the app.

**PatternFly MCP** — source of truth for CLI flags, plugins, isolation, and client formats: **[github.com/patternfly/patternfly-mcp](https://github.com/patternfly/patternfly-mcp)** ([usage](https://github.com/patternfly/patternfly-mcp/blob/main/docs/usage.md), [development](https://github.com/patternfly/patternfly-mcp/blob/main/docs/development.md)). Use that repo’s docs when anything here disagrees or ages.

We do **not** commit a default MCP config in this repository (editors and global vs project merge behavior differ; see upstream usage if you use Cursor or others).

## Basic `npx` setup

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

## Temporary tool plugin (until a real repo plugin exists)

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

## Repo history reports (terminal, not MCP)

Time-bounded commit reports: [**repo-history-reports**](../guidelines/skills/repo-history-reports/SKILL.md).

```bash
npm run report:git -- --as-of HEAD --report corpus
```

## Related

- [CONTRIBUTING.md](../CONTRIBUTING.md#ai-agent) — AI agent expectations
- [guidelines/README.md](../guidelines/README.md) — Agent guidelines index
- [README.md](../README.md) — Quick start and agent review order (HTML comment)
