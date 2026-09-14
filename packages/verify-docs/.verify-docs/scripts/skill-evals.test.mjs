import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const evalPath = join(import.meta.dirname, '../../evals/skill-judgement-cases.json');

test('skill judgement evaluation cases are complete, reviewable, and outside CI pass/fail', () => {
  const suite = JSON.parse(readFileSync(evalPath, 'utf8'));
  assert.equal(suite.version, 1);
  assert.match(suite.scope, /CI/);
  assert.ok(Array.isArray(suite.cases) && suite.cases.length >= 3);
  const ids = new Set();
  const skills = new Set();
  for (const entry of suite.cases) {
    assert.equal(typeof entry.id, 'string');
    assert.ok(!ids.has(entry.id), `duplicate id: ${entry.id}`);
    ids.add(entry.id);
    assert.ok(['dedupe-docs', 'tighten-docs'].includes(entry.skill));
    skills.add(entry.skill);
    assert.ok(['consolidate', 'ask-human', 'tighten', 'leave-unchanged'].includes(entry.expectedDecision));
    assert.ok(Array.isArray(entry.documents) && entry.documents.length > 0);
    assert.ok(entry.documents.every((document) => typeof document.path === 'string' && typeof document.content === 'string'));
    assert.ok(Array.isArray(entry.mustPreserve) && entry.mustPreserve.length > 0);
    assert.ok(Array.isArray(entry.reviewQuestions) && entry.reviewQuestions.length > 0);
  }
  assert.deepEqual(skills, new Set(['dedupe-docs', 'tighten-docs']));
});
