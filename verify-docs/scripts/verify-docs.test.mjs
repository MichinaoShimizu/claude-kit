import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  rmSync,
  symlinkSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SCRIPT = join(import.meta.dirname, 'verify-docs.mjs');

function makeRepo(files) {
  const root = mkdtempSync(join(tmpdir(), 'verify-docs-test-'));
  for (const [path, content] of Object.entries(files)) {
    const full = join(root, path);
    mkdirSync(join(full, '..'), { recursive: true });
    writeFileSync(full, content);
  }
  return root;
}

function run(root, extraArgs = []) {
  try {
    const out = execFileSync('node', [SCRIPT, `--root=${root}`, '--json', ...extraArgs], {
      encoding: 'utf8',
    });
    return JSON.parse(out);
  } catch (err) {
    return JSON.parse(err.stdout);
  }
}

function runError(root) {
  try {
    execFileSync('node', [SCRIPT, `--root=${root}`], { encoding: 'utf8' });
    assert.fail('expected verify-docs to fail');
  } catch (error) {
    return `${error.stderr ?? ''}${error.stdout ?? ''}`;
  }
}

test('clean repo passes', () => {
  const root = makeRepo({
    'README.md': '# Repo\n\n[docs](docs/guide.md)\n',
    'docs/guide.md': '# Guide\n\nSome content.\n',
  });
  assert.deepEqual(run(root).failures, []);
  rmSync(root, { recursive: true, force: true });
});

test('detects broken link', () => {
  const root = makeRepo({ 'README.md': '# Repo\n\n[missing](docs/missing.md)\n' });
  assert.ok(run(root).failures.some((f) => f.kind === 'link'));
  rmSync(root, { recursive: true, force: true });
});

test('ignores link syntax inside inline code and HTML comments', () => {
  const root = makeRepo({
    'README.md': '# Repo\n\n`[example](missing.md)`\n\n<!-- [example](also-missing.md) -->\n',
  });
  assert.deepEqual(run(root).failures, []);
  rmSync(root, { recursive: true, force: true });
});

test('supports balanced parentheses in inline link destinations', () => {
  const root = makeRepo({
    'README.md': '# Repo\n\n[guide](docs/guide_(draft).md)\n',
    'docs/guide_(draft).md': '# Guide\n',
  });
  assert.deepEqual(run(root).failures, []);
  rmSync(root, { recursive: true, force: true });
});

test('supports angle-bracket destinations with spaces and an optional title', () => {
  const root = makeRepo({
    'README.md': '# Repo\n\n[guide](<docs/guide draft.md> "Guide")\n',
    'docs/guide draft.md': '# Guide\n',
  });
  assert.deepEqual(run(root).failures, []);
  rmSync(root, { recursive: true, force: true });
});

test('detects missing fragment', () => {
  const root = makeRepo({ 'README.md': '# Repo\n\n[section](#nope)\n' });
  assert.ok(run(root).failures.some((f) => f.kind === 'fragment'));
  rmSync(root, { recursive: true, force: true });
});

test('detects bad backtick path', () => {
  const root = makeRepo({ 'README.md': '# Repo\n\nSee `scripts/missing.mjs`.\n' });
  assert.ok(run(root).failures.some((f) => f.kind === 'path'));
  rmSync(root, { recursive: true, force: true });
});

test('detects orphan doc under docsDir', () => {
  const root = makeRepo({
    'README.md': '# Repo\n',
    'docs/orphan.md': '# Orphan\n',
  });
  const result = run(root);
  assert.ok(result.failures.some((f) => f.kind === 'orphan' && f.from === 'docs/orphan.md'));
  rmSync(root, { recursive: true, force: true });
});

test('scans the whole repo, not just entryPoints/docsDir/skillsDir (detects orphan elsewhere)', () => {
  const root = makeRepo({
    'README.md': '# Repo\n',
    'CONTRIBUTING.md': '# Contributing\n',
  });
  const result = run(root);
  assert.ok(result.failures.some((f) => f.kind === 'orphan' && f.from === 'CONTRIBUTING.md'));
  rmSync(root, { recursive: true, force: true });
});

test('excludePaths keeps excluded directories out of the scan entirely', () => {
  const root = makeRepo({
    'README.md': '# Repo\n',
    'node_modules/some-lib/README.md': '# Some lib\n[missing](missing.md)\n',
  });
  assert.deepEqual(run(root).failures, []);
  rmSync(root, { recursive: true, force: true });
});

test('uses legacy .claude/skills when .agents/skills is absent', () => {
  const root = makeRepo({
    'README.md': '# Repo\n',
    '.claude/skills/example/SKILL.md': '# Example\n\n[reference](references/guide.md)\n',
    '.claude/skills/example/references/guide.md': '# Guide\n',
  });
  assert.deepEqual(run(root).failures, []);
  rmSync(root, { recursive: true, force: true });
});

test('uses .kiro/skills when other skill directories are absent', () => {
  const root = makeRepo({
    'README.md': '# Repo\n',
    '.kiro/skills/example/SKILL.md': '# Example\n\n[reference](references/guide.md)\n',
    '.kiro/skills/example/references/guide.md': '# Guide\n',
  });
  assert.deepEqual(run(root).failures, []);
  rmSync(root, { recursive: true, force: true });
});

test('does not scan a symlinked compatibility skill directory twice', () => {
  const root = makeRepo({
    'README.md': '# Repo\n',
    '.agents/skills/example/SKILL.md': '# Example\n\n[reference](references/guide.md)\n',
    '.agents/skills/example/references/guide.md': '# Guide\n',
  });
  mkdirSync(join(root, '.claude'), { recursive: true });
  symlinkSync('../.agents/skills', join(root, '.claude/skills'), 'dir');
  mkdirSync(join(root, '.kiro'), { recursive: true });
  symlinkSync('../.agents/skills', join(root, '.kiro/skills'), 'dir');
  assert.deepEqual(run(root).failures, []);
  rmSync(root, { recursive: true, force: true });
});

test('agent configuration docs are exempt from orphan checks', () => {
  const root = makeRepo({
    'README.md': '# Repo\n',
    '.agents/rules/local.md': '# Local agent rule\n',
    '.claude/rules/local.md': '# Local Claude rule\n',
    '.kiro/steering/local.md': '# Local Kiro rule\n',
  });
  assert.deepEqual(run(root).failures, []);
  rmSync(root, { recursive: true, force: true });
});

test('flags oversized doc and honors todo exemption', () => {
  const big = '# Big\n\n' + 'x'.repeat(40000) + '\n';
  const root = makeRepo({
    'README.md': '# Repo\n\n[big](docs/big.md)\n',
    'docs/big.md': big,
  });
  assert.ok(run(root).failures.some((f) => f.kind === 'size'));

  writeFileSync(
    join(root, 'verify-docs.todo.json'),
    JSON.stringify([{ path: 'docs/big.md', reason: 'test' }]),
  );
  assert.ok(!run(root).failures.some((f) => f.kind === 'size'));
  rmSync(root, { recursive: true, force: true });
});

test('flags stale todo entries', () => {
  const root = makeRepo({
    'README.md': '# Repo\n\n[small](docs/small.md)\n',
    'docs/small.md': '# Small\n',
    'verify-docs.todo.json': JSON.stringify([{ path: 'docs/small.md', reason: 'stale' }]),
  });
  assert.ok(run(root).failures.some((f) => f.kind === 'stale-todo'));
  rmSync(root, { recursive: true, force: true });
});

test('reports invalid config values without a stack trace', () => {
  const root = makeRepo({
    'README.md': '# Repo\n',
    'verify-docs.config.json': JSON.stringify({ unexpected: true }),
  });
  const output = runError(root);
  assert.match(output, /設定エラー: 未対応の設定キー: unexpected/);
  assert.doesNotMatch(output, /at .*verify-docs\.mjs/);
  rmSync(root, { recursive: true, force: true });

  const wrongType = makeRepo({
    'README.md': '# Repo\n',
    'verify-docs.config.json': JSON.stringify({ maxDocBytes: '7000' }),
  });
  assert.match(runError(wrongType), /maxDocBytes は正の整数/);
  rmSync(wrongType, { recursive: true, force: true });

  const malformed = makeRepo({
    'README.md': '# Repo\n',
    'verify-docs.config.json': '{ not valid json',
  });
  assert.match(runError(malformed), /設定エラー: verify-docs.config.json を読み込めない/);
  rmSync(malformed, { recursive: true, force: true });
});

test('validates TODO fields and duplicate paths', () => {
  const root = makeRepo({
    'README.md': '# Repo\n',
    'verify-docs.todo.json': JSON.stringify([
      { path: 'docs/large.md', reason: 'legacy' },
      { path: 'docs/large.md', reason: 'duplicate' },
    ]),
  });
  assert.match(runError(root), /重複した path/);
  rmSync(root, { recursive: true, force: true });

  const invalid = makeRepo({
    'README.md': '# Repo\n',
    'verify-docs.todo.json': JSON.stringify([{ path: '../outside.md', reason: 'unsafe' }]),
  });
  assert.match(runError(invalid), /相対パス/);
  rmSync(invalid, { recursive: true, force: true });

  const missingReason = makeRepo({
    'README.md': '# Repo\n',
    'verify-docs.todo.json': JSON.stringify([{ path: 'docs/large.md' }]),
  });
  assert.match(runError(missingReason), /reason は空でない文字列/);
  rmSync(missingReason, { recursive: true, force: true });
});

test('detects duplicate paragraphs across docs', () => {
  const shared =
    'This paragraph is intentionally long enough to trigger duplicate detection logic here.';
  const root = makeRepo({
    'README.md': '# Repo\n\n[a](docs/a.md)\n[b](docs/b.md)\n',
    'docs/a.md': `# A\n\n${shared}\n`,
    'docs/b.md': `# B\n\n${shared}\n`,
  });
  assert.ok(run(root).failures.some((f) => f.kind === 'duplicate'));
  rmSync(root, { recursive: true, force: true });
});

test('allow-duplicate marker suppresses duplicate check', () => {
  const shared =
    'This paragraph is intentionally long enough to trigger duplicate detection logic here.';
  const root = makeRepo({
    'README.md': '# Repo\n\n[a](docs/a.md)\n[b](docs/b.md)\n',
    'docs/a.md': `# A\n\n${shared}\n`,
    'docs/b.md': `# B\n\n<!-- verify-docs:allow-duplicate -->\n\n${shared}\n`,
  });
  assert.ok(!run(root).failures.some((f) => f.kind === 'duplicate'));
  rmSync(root, { recursive: true, force: true });
});

test('near-duplicate check is opt-in and off by default', () => {
  const root = makeRepo({
    'README.md': '# Repo\n\n[a](docs/a.md)\n[b](docs/b.md)\n',
    'docs/a.md': '# A\n\nこのツールは文書の構造を検査します。参照切れとサイズ超過を見ます。\n',
    'docs/b.md': '# B\n\nこのツールは文書の構造を検査する。参照切れとサイズ超過を見る。\n',
  });
  assert.ok(!run(root).failures.some((f) => f.kind === 'near-duplicate'));
  rmSync(root, { recursive: true, force: true });
});

test('near-duplicate check catches punctuation and register (敬体/常体) variants when enabled', () => {
  const root = makeRepo({
    'README.md': '# Repo\n\n[a](docs/a.md)\n[b](docs/b.md)\n',
    'docs/a.md': '# A\n\nこのツールは文書の構造を検査します。参照切れとサイズ超過を見ます。\n',
    'docs/b.md': '# B\n\nこのツールは文書の構造を検査する。参照切れとサイズ超過を見る。\n',
    'verify-docs.config.json': JSON.stringify({ checkNearDuplicates: true, minDuplicateChars: 10 }),
  });
  assert.ok(run(root).failures.some((f) => f.kind === 'near-duplicate'));
  rmSync(root, { recursive: true, force: true });
});

test('near-duplicate check does not double-report exact duplicates', () => {
  const shared =
    'This paragraph is intentionally long enough to trigger duplicate detection logic here.';
  const root = makeRepo({
    'README.md': '# Repo\n\n[a](docs/a.md)\n[b](docs/b.md)\n',
    'docs/a.md': `# A\n\n${shared}\n`,
    'docs/b.md': `# B\n\n${shared}\n`,
    'verify-docs.config.json': JSON.stringify({ checkNearDuplicates: true }),
  });
  const failures = run(root).failures;
  assert.ok(failures.some((f) => f.kind === 'duplicate'));
  assert.ok(!failures.some((f) => f.kind === 'near-duplicate'));
  rmSync(root, { recursive: true, force: true });
});

test('near-duplicate check respects allow-duplicate marker', () => {
  const root = makeRepo({
    'README.md': '# Repo\n\n[a](docs/a.md)\n[b](docs/b.md)\n',
    'docs/a.md': '# A\n\nこのツールは文書の構造を検査します。参照切れとサイズ超過を見ます。\n',
    'docs/b.md':
      '# B\n\n<!-- verify-docs:allow-duplicate -->\n\nこのツールは文書の構造を検査する。参照切れとサイズ超過を見る。\n',
    'verify-docs.config.json': JSON.stringify({ checkNearDuplicates: true, minDuplicateChars: 10 }),
  });
  assert.ok(!run(root).failures.some((f) => f.kind === 'near-duplicate'));
  rmSync(root, { recursive: true, force: true });
});

test('every DEFAULTS key is documented in config.md (prevents doc drift when a key is added)', () => {
  const script = readFileSync(SCRIPT, 'utf8');
  const defaultsBlock = script.match(/const DEFAULTS = \{([\s\S]*?)\n\};/)[1];
  const keys = [...defaultsBlock.matchAll(/^\s*(\w+):/gm)].map((m) => m[1]);
  assert.ok(keys.length > 0, 'failed to extract DEFAULTS keys from verify-docs.mjs');

  const configMd = readFileSync(
    join(import.meta.dirname, '../.agents/skills/verify-docs/references/config.md'),
    'utf8',
  );
  for (const key of keys) {
    assert.ok(configMd.includes(`\`${key}\``), `config.md is missing documentation for "${key}"`);
  }
});

test('--init-todo writes todo file for oversized docs and refuses to overwrite', () => {
  const big = '# Big\n\n' + 'x'.repeat(40000) + '\n';
  const root = makeRepo({
    'README.md': '# Repo\n\n[big](docs/big.md)\n',
    'docs/big.md': big,
  });
  execFileSync('node', [SCRIPT, `--root=${root}`, '--init-todo']);
  const written = JSON.parse(readFileSync(join(root, 'verify-docs.todo.json'), 'utf8'));
  assert.equal(written.length, 1);
  assert.equal(written[0].path, 'docs/big.md');

  assert.throws(() =>
    execFileSync('node', [SCRIPT, `--root=${root}`, '--init-todo'], { stdio: 'pipe' }),
  );
  rmSync(root, { recursive: true, force: true });
});
