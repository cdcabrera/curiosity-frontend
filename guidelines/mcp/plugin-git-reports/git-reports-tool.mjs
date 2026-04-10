/**
 * PatternFly MCP tool plugin: curiosity-frontend git commit-message reports.
 * Delegates to scripts/git-report.sh (same as npm run report:git).
 *
 * Implemented as a raw tool creator (no @patternfly/patternfly-mcp import), matching the
 * PatternFly MCP e2e fixture pattern (e.g. tool.echoBasic.js).
 *
 * @see https://github.com/patternfly/patternfly-mcp/blob/main/docs/development.md#mcp-tool-plugins
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../../..');
const GIT_REPORT_SCRIPT = path.join(REPO_ROOT, 'scripts', 'git-report.sh');

const toolDescription = [
  'Run curiosity-frontend time-bounded commit-message reports (corpus stats, fix churn,',
  'PatternFly-related subjects, subject samples). Wraps scripts/git-report.sh / npm run report:git.',
  'Repo root is resolved from this plugin path (guidelines/mcp/plugin-git-reports).'
].join(' ');

const inputSchema = {
  type: 'object',
  properties: {
    asOf: {
      type: 'string',
      description: 'Tip revision for the report (default HEAD). Branch, tag, SHA, or expressions git rev-parse accepts.'
    },
    report: {
      type: 'string',
      enum: ['corpus', 'churn', 'patternfly', 'subjects'],
      description:
        'corpus: convention counts; churn: fix-oriented heuristics; patternfly: subject grep; subjects: first/latest sample'
    },
    format: {
      type: 'string',
      enum: ['md', 'json'],
      description: 'markdown (default) or json (corpus only)'
    }
  },
  required: ['report']
};

/**
 * @param {{ asOf?: string, report: string, format?: string }} args
 * @returns {{ content: Array<{ type: string, text: string }> }}
 */
function runGitReport(args) {
  const asOf = args.asOf ?? 'HEAD';
  const { report } = args;
  const format = args.format ?? 'md';

  if (format === 'json' && report !== 'corpus') {
    return {
      content: [
        {
          type: 'text',
          text: 'Invalid: format "json" is only supported when report is "corpus".'
        }
      ]
    };
  }

  const bashArgs = [GIT_REPORT_SCRIPT, '--as-of', asOf, '--report', report];
  if (format === 'json') {
    bashArgs.push('--format', 'json');
  }

  const result = spawnSync('bash', bashArgs, {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024
  });

  if (result.error) {
    return {
      content: [{ type: 'text', text: `Failed to run git-report.sh: ${result.error.message}` }]
    };
  }

  const stderr = (result.stderr || '').trim();
  const stdout = (result.stdout || '').trim();

  if (result.status !== 0) {
    const parts = [`git-report.sh exited with code ${result.status}`];
    if (stderr) {
      parts.push(stderr);
    }
    if (stdout) {
      parts.push(stdout);
    }
    return {
      content: [{ type: 'text', text: parts.join('\n\n') }]
    };
  }

  return {
    content: [{ type: 'text', text: stdout || '(empty output)' }]
  };
}

const curiosityGitReportTool = () => [
  'curiosityGitReport',
  {
    description: toolDescription,
    inputSchema
  },
  async args => runGitReport(args)
];

curiosityGitReportTool.toolName = 'curiosityGitReport';

export default curiosityGitReportTool;
