/**
 * Commit examples for git-report.sh --report examples.
 * Reads git history from cwd (repo root). Used by MCP / npm run report:git.
 */
import { spawnSync } from 'node:child_process';
import { parseArgs } from 'node:util';

function runGit(args, cwd) {
  const r = spawnSync('git', args, {
    cwd,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024
  });
  if (r.status !== 0) {
    process.stderr.write(r.stderr || r.stdout || `git ${args.join(' ')} failed\n`);
    process.exit(r.status ?? 1);
  }
  return r.stdout;
}

function conventionalType(subject) {
  const m = subject.match(/^([a-z]+)(?:\([^)]*\))?:/);
  return m ? m[1] : null;
}

function conventionalScopes(subject) {
  const m = subject.match(/^[a-z]+\(([^)]*)\):/);
  if (!m) {
    return [];
  }
  return m[1]
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

function scopeMatches(subject, want) {
  const wantL = want.toLowerCase();
  return conventionalScopes(subject).some(s => s.toLowerCase() === wantL);
}

function typeMatches(subject, want) {
  if (!want) {
    return true;
  }
  const t = conventionalType(subject);
  return t ? t === want.toLowerCase() : false;
}

/** Case-insensitive glob with * wildcard (aligned with Python fnmatch for * segments). */
function subjectGlobMatch(subject, pattern) {
  const s = subject.toLowerCase();
  const p = pattern.toLowerCase();
  const segs = p.split('*').map(seg => seg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(`^${segs.join('.*')}$`).test(s);
}

function suggestedPatterns(subject) {
  const s = subject.toLowerCase();
  const out = [];
  if (s.startsWith('build(deps)') && s.includes('bump')) {
    out.push(
      'Grouped dependency bump: build(deps) subject, bullet body listing ' +
        'package from X to Y, lockfile + occasional snapshot updates.'
    );
  }
  if (s.includes('patternfly') || s.includes('@patternfly')) {
    out.push(
      'PatternFly-related change: often paired with @patternfly/* version lines ' +
        'in the commit body for bumps.'
    );
  }
  if (/^refactor\(deps\):/.test(subject) && s.includes('pf')) {
    out.push(
      'Major PF migration: refactor(deps) with tracker id, long bullet list of ' +
        'component-level adjustments.'
    );
  }
  if (/^fix(\([^)]*\))?:/.test(subject)) {
    out.push('Fix commit: fix(scope): or fix: with optional tracker/PR suffix.');
  }
  return out;
}

const { values } = parseArgs({
  args: process.argv.slice(2),
  options: {
    'as-of-commit': { type: 'string' },
    'as-of-date': { type: 'string' },
    since: { type: 'string' },
    until: { type: 'string' },
    limit: { type: 'string', default: '15' },
    type: { type: 'string' },
    scope: { type: 'string' },
    'subject-glob': { type: 'string' },
    path: { type: 'string', multiple: true },
    format: { type: 'string', default: 'json' },
    'body-lines': { type: 'string', default: '12' }
  },
  strict: true,
  allowPositionals: false
});

const asOfCommit = values['as-of-commit'];
const asOfDate = values['as-of-date'];
if (!asOfCommit || !asOfDate) {
  process.stderr.write('Missing --as-of-commit or --as-of-date\n');
  process.exit(1);
}

const cwd = process.cwd();
const rev = asOfCommit;
const limit = Math.min(100, Math.max(1, parseInt(values.limit, 10) || 15));
const bodyLines = Math.max(0, parseInt(values['body-lines'], 10) || 12);
const ctype = values.type ?? '';
const scope = values.scope ?? '';
const subjectGlob = values['subject-glob'] ?? '';
const since = values.since ?? '';
const until = values.until ?? '';
const paths = values.path ?? [];
const format = values.format === 'md' ? 'md' : 'json';

const logCmd = ['log', rev, '--no-merges', '--format=%H\t%s\t%aI'];
if (since) {
  logCmd.push('--since', since);
}
if (until) {
  logCmd.push('--until', until);
}
if (paths.length) {
  logCmd.push('--', ...paths);
}

const raw = runGit(logCmd, cwd).trim();
const rows = [];
for (const line of raw.split('\n')) {
  const t1 = line.indexOf('\t');
  const t2 = t1 === -1 ? -1 : line.indexOf('\t', t1 + 1);
  if (t1 === -1 || t2 === -1) {
    continue;
  }
  const h = line.slice(0, t1);
  const subj = line.slice(t1 + 1, t2);
  const adate = line.slice(t2 + 1);
  if (ctype && !typeMatches(subj, ctype)) {
    continue;
  }
  if (scope && !scopeMatches(subj, scope)) {
    continue;
  }
  if (subjectGlob && !subjectGlobMatch(subj, subjectGlob)) {
    continue;
  }
  rows.push([h, subj, adate]);
}

const totalMatches = rows.length;
const slice = rows.slice(0, limit);

const examples = [];
for (const [sha, subject, adate] of slice) {
  const body = runGit(['log', '-1', '--format=%b', sha], cwd).trim();
  const allBodyLines = body ? body.split('\n') : [];
  const bl = allBodyLines.slice(0, bodyLines);
  let bodyExcerpt = bl.join('\n');
  if (bodyExcerpt && allBodyLines.length > bl.length) {
    bodyExcerpt += '\n…';
  }

  const statOut = runGit(['show', '--no-patch', '--stat', sha], cwd);
  const statLines = statOut.trim().split('\n');
  const statSummary = statLines.length ? statLines[statLines.length - 1] : '';

  examples.push({
    sha,
    date: adate,
    subject,
    body_excerpt: bodyExcerpt,
    stat_summary: statSummary,
    suggested_patterns: suggestedPatterns(subject)
  });
}

const filters = {
  since: since || null,
  until: until || null,
  limit,
  type: ctype || null,
  scope: scope || null,
  subject_glob: subjectGlob || null,
  paths: paths.length ? paths : null
};

if (format === 'json') {
  process.stdout.write(
    JSON.stringify(
      {
        as_of_commit: asOfCommit,
        as_of_date: asOfDate,
        filters,
        match_count: totalMatches,
        returned: examples.length,
        examples
      },
      null,
      2
    ) + '\n'
  );
  process.exit(0);
}

const lines = [
  '# Commit examples',
  '',
  '| Field | Value |',
  '|-------|-------|',
  `| **as_of_commit** | \`${asOfCommit}\` |`,
  `| **as_of_date** | ${asOfDate} |`,
  `| **match_count** | ${totalMatches} |`,
  `| **returned** | ${examples.length} |`,
  '',
  '## Filters',
  '',
  '```json',
  JSON.stringify(filters, null, 2),
  '```',
  ''
];

for (const ex of examples) {
  lines.push(`### \`${ex.sha.slice(0, 7)}\` — ${ex.subject}`, '');
  lines.push(`- **date:** ${ex.date}`);
  lines.push(`- **stat:** ${ex.stat_summary}`);
  lines.push('');
  if (ex.suggested_patterns.length) {
    lines.push('**Patterns:**');
    for (const sp of ex.suggested_patterns) {
      lines.push(`- ${sp}`);
    }
    lines.push('');
  }
  if (ex.body_excerpt) {
    lines.push('```');
    lines.push(ex.body_excerpt);
    lines.push('```');
    lines.push('');
  }
}

process.stdout.write(lines.join('\n'));
