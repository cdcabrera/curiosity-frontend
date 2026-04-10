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
  'Use for curiosity-frontend git history and commit analytics (scopes, paths, subjects, churn)—not for PatternFly component/docs questions (use searchPatternFlyDocs / usePatternFlyDocs).',
  'Commit-subject reports only (not blame); tip at asOf (default HEAD).',
  'Modes: corpus | churn | patternfly | subjects | examples (filtered commits with body/stat snippets; example filters are ANDed).',
  'Same as npm run report:git / bash scripts/git-report.sh. See docs/development.md#git-commit-message-reports.'
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
      enum: ['corpus', 'churn', 'patternfly', 'subjects', 'examples'],
      description:
        'corpus: type/tracker token counts. churn: fix scopes + keyword hits. patternfly: subject mentions patternfly or @patternfly. subjects: oldest/newest subject sample. examples: filtered commits; set subjectGlob, commitType, scope, paths, since/until as needed (see each field).'
    },
    format: {
      type: 'string',
      enum: ['md', 'json'],
      description:
        'Output format. md default. json only valid for report=corpus or report=examples; churn/patternfly/subjects are md-only.'
    },
    since: {
      type: 'string',
      description: 'For report=examples: git log --since (optional ISO or relative date).'
    },
    until: {
      type: 'string',
      description: 'For report=examples: git log --until (optional).'
    },
    limit: {
      type: 'number',
      description: 'For report=examples: max commits (default 15, max 100).'
    },
    commitType: {
      type: 'string',
      description: 'For report=examples: conventional commit type prefix, e.g. fix, build, feat.'
    },
    scope: {
      type: 'string',
      description:
        'For report=examples: exact match against one scope in type(scope): or type(a,b): subjects (comma-separated scopes in commits each match independently).'
    },
    subjectGlob: {
      type: 'string',
      description:
        'For report=examples: case-insensitive glob on the subject line (* wildcard), e.g. *patternfly*'
    },
    paths: {
      type: 'array',
      items: { type: 'string' },
      description: 'For report=examples: pathspecs; only commits touching these paths.'
    },
    bodyLines: {
      type: 'number',
      description: 'For report=examples: max body lines per commit in output (default 12).'
    }
  },
  required: ['report']
};

/**
 * @param {Record<string, unknown>} args
 * @returns {{ content: Array<{ type: string, text: string }> }}
 */
function runGitReport(args) {
  const asOf = typeof args.asOf === 'string' ? args.asOf : 'HEAD';
  const { report } = args;
  const format = typeof args.format === 'string' ? args.format : 'md';

  if (format === 'json' && report !== 'corpus' && report !== 'examples') {
    return {
      content: [
        {
          type: 'text',
          text: 'Invalid: format "json" is only supported when report is "corpus" or "examples".'
        }
      ]
    };
  }

  const bashArgs = [GIT_REPORT_SCRIPT, '--as-of', asOf, '--report', String(report), '--format', format];

  if (report === 'examples') {
    if (typeof args.since === 'string' && args.since) {
      bashArgs.push('--since', args.since);
    }
    if (typeof args.until === 'string' && args.until) {
      bashArgs.push('--until', args.until);
    }
    if (typeof args.limit === 'number' && Number.isFinite(args.limit)) {
      bashArgs.push('--limit', String(Math.trunc(args.limit)));
    }
    if (typeof args.commitType === 'string' && args.commitType) {
      bashArgs.push('--type', args.commitType);
    }
    if (typeof args.scope === 'string' && args.scope) {
      bashArgs.push('--scope', args.scope);
    }
    if (typeof args.subjectGlob === 'string' && args.subjectGlob) {
      bashArgs.push('--subject-glob', args.subjectGlob);
    }
    if (Array.isArray(args.paths)) {
      for (const p of args.paths) {
        if (typeof p === 'string' && p) {
          bashArgs.push('--path', p);
        }
      }
    }
    if (typeof args.bodyLines === 'number' && Number.isFinite(args.bodyLines)) {
      bashArgs.push('--body-lines', String(Math.trunc(args.bodyLines)));
    }
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
