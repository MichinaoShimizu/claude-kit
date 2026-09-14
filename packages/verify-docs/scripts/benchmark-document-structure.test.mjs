import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rmSync } from 'node:fs';
import { evaluateSyntheticCorpus, makeSyntheticCorpus } from './benchmark-document-structure.mjs';

test('synthetic corpus detects every injected structural violation without false positives', () => {
  const corpus = makeSyntheticCorpus({ documents: 12, paragraphs: 3, issues: 3 });
  try {
    const result = evaluateSyntheticCorpus(corpus);
    assert.equal(result.expected, 12);
    assert.equal(result.truePositives, 12);
    assert.deepEqual(result.falsePositives, []);
    assert.deepEqual(result.falseNegatives, []);
    assert.equal(result.precision, 1);
    assert.equal(result.recall, 1);
  } finally {
    rmSync(corpus.root, { recursive: true, force: true });
  }
});
