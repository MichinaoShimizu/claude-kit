import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { extractProseBlocks } from './markdown-structure.mjs';

const SCRIPT = join(import.meta.dirname, 'extract-doc-blocks.mjs');

function withTempRepo(run) {
  const root = mkdtempSync(join(tmpdir(), 'extract-doc-blocks-'));
  try {
    run(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test('extracts CommonMark prose with heading context, source positions, and raw byte counts', () => {
  const source = '---\nname: sample\n---\n\n# はじめに\n\n説明 **重要** と `code`。\n\n## 詳細\n\n> 引用文\n\n- 箇条書き\n\n```md\nコード内の段落\n```\n';
  const result = extractProseBlocks(source);

  assert.deepEqual(result.headings.map(({ level, text }) => ({ level, text })), [
    { level: 1, text: 'はじめに' },
    { level: 2, text: '詳細' },
  ]);
  assert.deepEqual(result.blocks.map(({ headingPath, text }) => ({ headingPath, text })), [
    { headingPath: ['はじめに'], text: '説明 重要 と code。' },
    { headingPath: ['はじめに', '詳細'], text: '引用文' },
    { headingPath: ['はじめに', '詳細'], text: '箇条書き' },
  ]);
  assert.deepEqual(result.blocks.map(({ sourcepos }) => sourcepos.start.line), [7, 11, 13]);
  for (const block of result.blocks) {
    assert.equal(block.bytes, Buffer.byteLength(block.source, 'utf8'));
  }
  assert.ok(result.blocks.every(({ text }) => !text.includes('コード内')));
  assert.equal(result.bytes, Buffer.byteLength(source, 'utf8'));
});

test('CLI returns multiple requested documents as JSON with repository-relative paths', () => {
  withTempRepo((root) => {
    mkdirSync(join(root, 'docs'));
    writeFileSync(join(root, 'README.md'), '# Home\n\nWelcome.\n');
    writeFileSync(join(root, 'docs', 'guide.md'), '## Guide\n\nRead this.\n');
    const output = execFileSync('node', [SCRIPT, '--root=.', 'README.md', 'docs/guide.md'], {
      cwd: root,
      encoding: 'utf8',
    });
    const documents = JSON.parse(output);
    assert.deepEqual(documents.map(({ path }) => path), ['README.md', 'docs/guide.md']);
    assert.equal(documents[1].blocks[0].headingPath.join('/'), 'Guide');
  });
});

test('CLI rejects paths outside the selected root', () => {
  withTempRepo((root) => {
    assert.throws(
      () => execFileSync('node', [SCRIPT, '--root=.', '../outside.md'], {
        cwd: root,
        encoding: 'utf8',
        stdio: 'pipe',
      }),
      (error) => `${error.stderr}`.includes('リポジトリ外のパス'),
    );
  });
});

test('CLI rejects missing files and non-Markdown paths', () => {
  withTempRepo((root) => {
    for (const path of ['missing.md', 'notes.txt']) {
      assert.throws(
        () => execFileSync('node', [SCRIPT, '--root=.', path], {
          cwd: root,
          encoding: 'utf8',
          stdio: 'pipe',
        }),
      );
    }
  });
});
