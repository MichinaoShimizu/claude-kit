import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { extractProseBlocks } from './markdown-structure.mjs';
import { verifyDocs } from './verify-docs.mjs';

const packageRoot = join(import.meta.dirname, '..');
const skillPath = (name) => join(packageRoot, '.agents', 'skills', name, 'SKILL.md');

function makeRepo(files) {
  const root = mkdtempSync(join(tmpdir(), 'skill-contract-'));
  for (const [path, content] of Object.entries(files)) {
    const full = join(root, path);
    mkdirSync(join(full, '..'), { recursive: true });
    writeFileSync(full, content);
  }
  return root;
}

function checklist(section, details) {
  return `# verify-docs-checklist\n\n## verify-docs\n\n（未実施）\n\n## dedupe-docs\n\n${section === 'dedupe-docs' ? details : '（未実施）'}\n\n## tighten-docs\n\n${section === 'tighten-docs' ? details : '（未実施）'}\n`;
}

function assertCompletedSection(source, section) {
  const sectionMatch = source.match(new RegExp(`## ${section}\\n\\n([\\s\\S]*?)(?=\\n## |$)`));
  assert.ok(sectionMatch, `${section} section is missing`);
  assert.doesNotMatch(sectionMatch[1], /- \[ \]/, `${section} has unchecked items`);
  assert.match(sectionMatch[1], /### 最終検査結果/, `${section} has no execution result`);
}

function assertRequiredFacts(source, facts) {
  for (const fact of facts) assert.match(source, fact, `required fact is missing: ${fact}`);
}

function compressionRecord(before, after) {
  const beforeBytes = Buffer.byteLength(before, 'utf8');
  const afterBytes = Buffer.byteLength(after, 'utf8');
  const reduction = ((1 - afterBytes / beforeBytes) * 100).toFixed(1);
  return `${beforeBytes}B → ${afterBytes}B（${reduction}%減）`;
}

test('dedupe-docs contract keeps one canonical explanation, a pointer, and an execution result', () => {
  const root = makeRepo({
    'README.md': '# Home\n\n[guide](docs/guide.md)\n',
    'docs/guide.md': '# Guide\n\nThe canonical setup procedure is in [setup](setup.md).\n',
    'docs/setup.md': '# Setup\n\nInstall the package, then run the checker from the repository root.\n',
    '.verify-docs/dist/checklist.md': checklist('dedupe-docs', [
      '- [x] README.md — 2026-09-13 / 内容なし',
      '- [x] docs/guide.md — 2026-09-13 / docs/setup.mdへポインタ化',
      '',
      '### 最終検査結果',
      '',
      '- node .verify-docs/scripts/verify-docs.mjs: 文書構造: すべて通過',
    ].join('\n')),
  });
  try {
    const report = verifyDocs(root);
    assert.deepEqual(report.failures, []);
    const canonical = readFileSync(join(root, 'docs/setup.md'), 'utf8');
    const pointer = readFileSync(join(root, 'docs/guide.md'), 'utf8');
    assertRequiredFacts(canonical, [/Install the package, then run the checker/]);
    assert.match(pointer, /\[setup\]\(setup\.md\)/);
    assert.doesNotMatch(pointer, /Install the package, then run the checker/);
    assertCompletedSection(readFileSync(join(root, '.verify-docs/dist/checklist.md'), 'utf8'), 'dedupe-docs');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('dedupe-docs contract rejects a broken canonical pointer and incomplete checklist', () => {
  const root = makeRepo({
    'README.md': '# Home\n\n[guide](docs/guide.md)\n',
    'docs/guide.md': '# Guide\n\nThe canonical setup procedure is in [setup](missing.md).\n',
    '.verify-docs/dist/checklist.md': checklist('dedupe-docs', '- [ ] docs/guide.md'),
  });
  try {
    assert.ok(verifyDocs(root).failures.some((failure) => failure.kind === 'link'));
    assert.throws(() => assertCompletedSection(
      readFileSync(join(root, '.verify-docs/dist/checklist.md'), 'utf8'),
      'dedupe-docs',
    ));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('tighten-docs contract reduces bytes while preserving required facts and an execution result', () => {
  const before = '# Deploy\n\nBefore deploying, you must use production mode. The timeout is 30 seconds. Do not change the retry order.\n';
  const after = '# Deploy\n\nUse production mode. Timeout: 30 seconds. Do not change the retry order.\n';
  const root = makeRepo({
    'README.md': '# Home\n\n[deploy](docs/deploy.md)\n',
    'docs/deploy.md': after,
    '.verify-docs/dist/checklist.md': checklist('tighten-docs', [
      `- [x] docs/deploy.md — 2026-09-13 / ${compressionRecord(before, after)}`,
      '',
      '### 最終検査結果',
      '',
      '- node .verify-docs/scripts/verify-docs.mjs: 文書構造: すべて通過',
    ].join('\n')),
  });
  try {
    const report = verifyDocs(root);
    assert.deepEqual(report.failures, []);
    assert.ok(Buffer.byteLength(after, 'utf8') < Buffer.byteLength(before, 'utf8'));
    assertRequiredFacts(after, [/production mode/, /30 seconds/, /Do not change the retry order\./]);
    const structure = extractProseBlocks(after);
    assert.equal(structure.headings[0].text, 'Deploy');
    const checklistSource = readFileSync(join(root, '.verify-docs/dist/checklist.md'), 'utf8');
    assert.match(checklistSource, new RegExp(compressionRecord(before, after)));
    assertCompletedSection(checklistSource, 'tighten-docs');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('tighten-docs contract rejects lost facts and inaccurate compression records', () => {
  const before = '# Deploy\n\nUse production mode. Timeout: 30 seconds. Do not change the retry order.\n';
  const unsafeAfter = '# Deploy\n\nUse production mode.\n';
  assert.throws(() => assertRequiredFacts(unsafeAfter, [/30 seconds/, /Do not change the retry order\./]));
  assert.notEqual(compressionRecord(before, unsafeAfter), '111B → 83B（25.2%減）');
});

test('skill instructions keep deterministic contracts separate from semantic judgement', () => {
  const dedupe = readFileSync(skillPath('dedupe-docs'), 'utf8');
  const tighten = readFileSync(skillPath('tighten-docs'), 'utf8');
  for (const skill of [dedupe, tighten]) {
    assert.match(skill, /node \.verify-docs\/scripts\/verify-docs\.mjs/);
    assert.match(skill, /### 最終検査結果/);
    assert.match(skill, /checklist/);
  }
  assert.match(dedupe, /CI の pass\/fail には使わない/);
  assert.match(tighten, /数値・条件・手順の順序・免責文言は一字一句変更しない/);
});
