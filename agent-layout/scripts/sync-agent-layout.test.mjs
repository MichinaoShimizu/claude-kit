import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, lstatSync, mkdtempSync, mkdirSync, readFileSync, readlinkSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SCRIPT = join(import.meta.dirname, 'sync-agent-layout.mjs');

function repo(files = {}) {
  const root = mkdtempSync(join(tmpdir(), 'agent-layout-'));
  for (const [path, content] of Object.entries(files)) {
    const full = join(root, path);
    mkdirSync(join(full, '..'), { recursive: true });
    writeFileSync(full, content);
  }
  return root;
}

function run(root, write = false) {
  return execFileSync('node', [SCRIPT, `--root=${root}`, ...(write ? ['--write'] : [])], { encoding: 'utf8' });
}

test('moves Claude skills to the canonical directory and creates aliases', () => {
  const root = repo({ '.claude/skills/review/SKILL.md': '# Review\n' });
  run(root, true);
  assert.equal(readFileSync(join(root, '.agents/skills/review/SKILL.md'), 'utf8'), '# Review\n');
  assert.ok(lstatSync(join(root, '.claude/skills')).isSymbolicLink());
  assert.equal(readlinkSync(join(root, '.kiro/skills')), '../.agents/skills');
  assert.match(run(root), /同期済み/);
  rmSync(root, { recursive: true, force: true });
});

test('refuses conflicting skill files', () => {
  const root = repo({
    '.agents/skills/review/SKILL.md': '# Canonical\n',
    '.claude/skills/review/SKILL.md': '# Claude\n',
  });
  assert.throws(() => run(root, true));
  assert.equal(readFileSync(join(root, '.claude/skills/review/SKILL.md'), 'utf8'), '# Claude\n');
  rmSync(root, { recursive: true, force: true });
});

test('refuses conflicts between Claude and Kiro skill directories', () => {
  const root = repo({
    '.claude/skills/review/SKILL.md': '# Claude\n',
    '.kiro/skills/review/SKILL.md': '# Kiro\n',
  });
  assert.throws(() => run(root, true));
  assert.equal(readFileSync(join(root, '.kiro/skills/review/SKILL.md'), 'utf8'), '# Kiro\n');
  rmSync(root, { recursive: true, force: true });
});

test('imports a Claude agent and generates all provider formats', () => {
  const root = repo({
    '.claude/agents/reviewer.md': [
      '---',
      'name: reviewer',
      'description: Reviews code',
      'tools: Read, Grep, Glob, Bash',
      'model: sonnet',
      '---',
      '',
      'Review changes and report concrete findings.',
      '',
    ].join('\n'),
  });
  run(root, true);
  const spec = JSON.parse(readFileSync(join(root, '.agents/agents/reviewer.json'), 'utf8'));
  assert.deepEqual(spec.capabilities, ['read', 'shell']);
  assert.equal(spec.providers.claude.model, 'sonnet');
  assert.match(readFileSync(join(root, '.kiro/agents/reviewer.md'), 'utf8'), /tools: \[read, shell\]/);
  assert.match(readFileSync(join(root, '.codex/agents/reviewer.toml'), 'utf8'), /sandbox_mode = "read-only"/);
  assert.match(run(root), /同期済み/);
  rmSync(root, { recursive: true, force: true });
});

test('check mode detects generated agent drift', () => {
  const root = repo({
    '.agents/agents/writer.json': JSON.stringify({
      version: 1,
      name: 'writer',
      description: 'Writes code',
      instructions: 'Implement focused changes.\n',
      capabilities: ['read', 'write'],
    }),
  });
  run(root, true);
  const codexPath = join(root, '.codex/agents/writer.toml');
  writeFileSync(
    codexPath,
    readFileSync(codexPath, 'utf8').replace('workspace-write', 'read-only'),
  );
  assert.throws(() => run(root));
  run(root, true);
  assert.match(readFileSync(codexPath, 'utf8'), /workspace-write/);
  rmSync(root, { recursive: true, force: true });
});

test('does not overwrite an unmanaged agent with an existing canonical name', () => {
  const root = repo({
    '.agents/agents/reviewer.json': JSON.stringify({
      version: 1,
      name: 'reviewer',
      description: 'Canonical review agent',
      instructions: 'Use the canonical instructions.\n',
      capabilities: ['read'],
    }),
    '.claude/agents/reviewer.md': [
      '---',
      'name: reviewer',
      'description: Unmanaged review agent',
      '---',
      '',
      'Do not overwrite this file.',
      '',
    ].join('\n'),
  });
  assert.throws(() => run(root, true));
  assert.match(readFileSync(join(root, '.claude/agents/reviewer.md'), 'utf8'), /Do not overwrite/);
  rmSync(root, { recursive: true, force: true });
});

test('does not silently discard unsupported Claude fields', () => {
  const root = repo({
    '.claude/agents/reviewer.md': [
      '---',
      'name: reviewer',
      'description: Reviews code',
      'permissionMode: plan',
      '---',
      '',
      'Review changes.',
    ].join('\n'),
  });
  assert.throws(() => run(root, true));
  assert.equal(existsSync(join(root, '.agents/agents/reviewer.json')), false);
  rmSync(root, { recursive: true, force: true });
});

test('does not migrate skills when an agent source is invalid', () => {
  const root = repo({
    '.claude/skills/review/SKILL.md': '# Review\n',
    '.claude/agents/reviewer.md': [
      '---',
      'name: reviewer',
      'description: Reviews code',
      'permissionMode: plan',
      '---',
      '',
      'Review changes.',
    ].join('\n'),
  });
  assert.throws(() => run(root, true));
  assert.equal(existsSync(join(root, '.claude/skills/review/SKILL.md')), true);
  assert.equal(existsSync(join(root, '.agents/skills')), false);
  assert.equal(existsSync(join(root, '.kiro/skills')), false);
  rmSync(root, { recursive: true, force: true });
});

test('does not migrate skills when a generated target conflicts', () => {
  const root = repo({
    '.claude/skills/review/SKILL.md': '# Review\n',
    '.agents/agents/writer.json': JSON.stringify({
      version: 1,
      name: 'writer',
      description: 'Writes code',
      instructions: 'Implement focused changes.\n',
      capabilities: ['read'],
    }),
    '.claude/agents/writer.md': 'User-owned agent content.\n',
  });
  assert.throws(() => run(root, true));
  assert.equal(existsSync(join(root, '.claude/skills/review/SKILL.md')), true);
  assert.equal(existsSync(join(root, '.agents/skills')), false);
  assert.equal(readFileSync(join(root, '.claude/agents/writer.md'), 'utf8'), 'User-owned agent content.\n');
  assert.equal(existsSync(join(root, '.codex/agents/writer.toml')), false);
  rmSync(root, { recursive: true, force: true });
});

test('repairs a broken skill alias', () => {
  const root = repo();
  mkdirSync(join(root, '.claude'), { recursive: true });
  symlinkSync('../missing/skills', join(root, '.claude/skills'), 'dir');
  run(root, true);
  assert.equal(readlinkSync(join(root, '.claude/skills')), '../.agents/skills');
  rmSync(root, { recursive: true, force: true });
});
