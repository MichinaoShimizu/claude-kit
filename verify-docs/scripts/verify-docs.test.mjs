import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
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
