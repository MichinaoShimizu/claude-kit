import { test } from 'node:test';
import assert from 'node:assert/strict';
import { selectCanonical } from './select-canonical.mjs';

function candidate(id, role, facts, explicitCanonical = false) {
  return { id, path: `docs/${id}.md`, role, facts, explicitCanonical };
}

test('selects a detailed document that contains every entry-document fact', () => {
  const result = selectCanonical(
    candidate('entry', 'entry', { purpose: 'Install the package.' }),
    candidate('guide', 'detail', { purpose: 'Install the package.', command: 'bash install.sh', exception: 'Do not overwrite user files.' }),
  );
  assert.deepEqual(result, {
    decision: 'auto-canonical',
    canonical: { id: 'guide', path: 'docs/guide.md' },
    pointer: { id: 'entry', path: 'docs/entry.md' },
    evidence: { leftOnly: [], rightOnly: ['command', 'exception'], conflicts: [] },
  });
});

test('requires a decision when each candidate has a fact absent from the other', () => {
  const result = selectCanonical(
    candidate('operators', 'detail', { procedure: 'Run the check.', recovery: 'Restore the backup.' }),
    candidate('contributors', 'detail', { procedure: 'Run the check.', audience: 'Contributors only.' }),
  );
  assert.equal(result.decision, 'decision-required');
  assert.deepEqual(result.evidence, { leftOnly: ['recovery'], rightOnly: ['audience'], conflicts: [] });
});

test('returns conflict instead of choosing between different values', () => {
  const result = selectCanonical(
    candidate('old', 'detail', { default: '30 seconds' }),
    candidate('new', 'detail', { default: '60 seconds' }),
  );
  assert.deepEqual(result, {
    decision: 'conflict',
    evidence: { leftOnly: [], rightOnly: [], conflicts: ['default'] },
  });
});

test('never automatically selects decision-required or conflicting cases in a large fixture', () => {
  const cases = Array.from({ length: 300 }, (_, index) => {
    const shared = { purpose: `Purpose ${index}` };
    return [
      selectCanonical(candidate(`entry-${index}`, 'entry', shared), candidate(`detail-${index}`, 'detail', { ...shared, command: `command ${index}` })),
      selectCanonical(candidate(`left-${index}`, 'detail', { ...shared, exception: `exception ${index}` }), candidate(`right-${index}`, 'detail', { ...shared, audience: `audience ${index}` })),
      selectCanonical(candidate(`old-${index}`, 'detail', { ...shared, default: `old ${index}` }), candidate(`new-${index}`, 'detail', { ...shared, default: `new ${index}` })),
    ];
  }).flat();
  assert.equal(cases.filter(({ decision }) => decision === 'auto-canonical').length, 300);
  assert.equal(cases.filter(({ decision }) => decision === 'decision-required').length, 300);
  assert.equal(cases.filter(({ decision }) => decision === 'conflict').length, 300);
});
