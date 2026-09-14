#!/usr/bin/env node

import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import { verifyDocumentStructure } from './document-structure-verifier.mjs';
import { extractProseBlocks } from './markdown-structure.mjs';

function positiveInteger(value, name) {
  if (!/^\d+$/.test(value) || Number(value) < 1) throw new Error(`${name} must be a positive integer`);
  return Number(value);
}

function quantile(values, percentile) {
  const index = Math.ceil(values.length * percentile) - 1;
  return values[Math.max(0, index)];
}

function timed(runs, task) {
  const milliseconds = [];
  for (let index = 0; index < runs; index += 1) {
    const start = performance.now();
    task();
    milliseconds.push(performance.now() - start);
  }
  milliseconds.sort((a, b) => a - b);
  return {
    runs,
    minMilliseconds: milliseconds[0],
    p50Milliseconds: quantile(milliseconds, 0.5),
    p95Milliseconds: quantile(milliseconds, 0.95),
    meanMilliseconds: milliseconds.reduce((sum, value) => sum + value, 0) / milliseconds.length,
    maxMilliseconds: milliseconds.at(-1),
  };
}

/** Creates a deterministic corpus and its structural-verifier oracle. */
export function makeSyntheticCorpus({ documents = 100, paragraphs = 12, issues = Math.max(1, Math.floor(documents / 10)) } = {}) {
  if (!Number.isSafeInteger(documents) || documents < 4) throw new Error('documents must be at least 4');
  if (!Number.isSafeInteger(paragraphs) || paragraphs < 1) throw new Error('paragraphs must be positive');
  if (!Number.isSafeInteger(issues) || issues < 1 || issues * 2 > documents) {
    throw new Error('issues must be positive and fit within the document count');
  }

  const root = mkdtempSync(join(tmpdir(), 'verify-docs-benchmark-'));
  const docsDir = join(root, 'docs');
  mkdirSync(docsDir, { recursive: true });
  const normalDocuments = documents - issues;
  const links = [];

  for (let document = 0; document < normalDocuments; document += 1) {
    const path = `docs/document-${String(document).padStart(5, '0')}.md`;
    links.push(`[Document ${document}](${path})`);
    const body = [`# Document ${document}`, ''];
    for (let paragraph = 0; paragraph < paragraphs; paragraph += 1) {
      body.push(`Document ${document} paragraph ${paragraph} has deterministic unique content for benchmark coverage.`);
      body.push('');
    }
    const issue = Math.floor(document / 2);
    if (issue < issues) {
      body.push(`This paragraph is intentionally identical in duplicate pair ${issue}.`);
      body.push('');
    }
    if (document < issues) body.push(`[missing fragment](#does-not-exist-${document})\n`);
    writeFileSync(join(root, path), body.join('\n'));
  }

  for (let issue = 0; issue < issues; issue += 1) {
    writeFileSync(join(docsDir, `orphan-${String(issue).padStart(5, '0')}.md`), '# Orphan\n\nThis file is intentionally not linked from any document.\n');
  }
  writeFileSync(join(root, 'README.md'), [
    '# Synthetic documentation corpus',
    '',
    ...links,
    '',
    ...Array.from({ length: issues }, (_, index) => `[missing file ${index}](docs/missing-${index}.md)`),
    '',
  ].join('\n'));
  // The benchmark oracle concerns injected structural defects, not an index page's size budget.
  writeFileSync(join(root, 'verify-docs.config.json'), JSON.stringify({ maxDocBytes: 10_000_000 }, null, 2));

  return {
    root,
    documents,
    issues,
    expected: new Set(Array.from({ length: issues }, (_, index) => [
      `duplicate|docs/document-${String(index * 2).padStart(5, '0')}.md|docs/document-${String(index * 2 + 1).padStart(5, '0')}.md`,
      `fragment|docs/document-${String(index).padStart(5, '0')}.md|#does-not-exist-${index}`,
      `link|README.md|docs/missing-${index}.md`,
      `orphan|docs/orphan-${String(index).padStart(5, '0')}.md|docs/orphan-${String(index).padStart(5, '0')}.md`,
    ]).flat()),
  };
}

function violationKey(violation) {
  return `${violation.kind}|${violation.from}|${violation.target ?? ''}`;
}

/** Evaluates exact structural detections, not semantic dedupe/tighten judgments. */
export function evaluateSyntheticCorpus(corpus) {
  const actual = new Set(verifyDocumentStructure(corpus.root).violations.map(violationKey));
  const truePositives = [...actual].filter((key) => corpus.expected.has(key));
  const falsePositives = [...actual].filter((key) => !corpus.expected.has(key));
  const falseNegatives = [...corpus.expected].filter((key) => !actual.has(key));
  return {
    expected: corpus.expected.size,
    detected: actual.size,
    truePositives: truePositives.length,
    falsePositives,
    falseNegatives,
    precision: truePositives.length / actual.size,
    recall: truePositives.length / corpus.expected.size,
  };
}

export function runBenchmark({ documents = 100, paragraphs = 12, issues = Math.max(1, Math.floor(documents / 10)), runs = 7 } = {}) {
  const corpus = makeSyntheticCorpus({ documents, paragraphs, issues });
  try {
    const accuracy = evaluateSyntheticCorpus(corpus);
    const paths = ['README.md', ...Array.from({ length: documents - issues }, (_, index) =>
      `docs/document-${String(index).padStart(5, '0')}.md`), 'docs/orphan.md'];
    paths.splice(-1, 1, ...Array.from({ length: issues }, (_, index) =>
      `docs/orphan-${String(index).padStart(5, '0')}.md`));
    return {
      kind: 'DocumentStructureBenchmark',
      corpus: {
        markdownDocuments: paths.length,
        contentDocuments: documents,
        paragraphsPerDocument: paragraphs,
        injectedIssuesPerKind: issues,
        bytes: paths.reduce((sum, path) => sum + Buffer.byteLength(readFileSync(join(corpus.root, path), 'utf8')), 0),
      },
      accuracy,
      verification: timed(runs, () => verifyDocumentStructure(corpus.root)),
      extraction: timed(runs, () => paths.forEach((path) =>
        extractProseBlocks(readFileSync(join(corpus.root, path), 'utf8')),
      )),
    };
  } finally {
    rmSync(corpus.root, { recursive: true, force: true });
  }
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help')) {
    console.log('Usage: node scripts/benchmark-document-structure.mjs [--documents=N] [--paragraphs=N] [--issues=N] [--runs=N]');
    return;
  }
  const option = (name, fallback) => {
    const value = args.find((arg) => arg.startsWith(`--${name}=`));
    return value ? positiveInteger(value.slice(name.length + 3), name) : fallback;
  };
  const result = runBenchmark({
    documents: option('documents', 100),
    paragraphs: option('paragraphs', 12),
    issues: option('issues', Math.max(1, Math.floor(option('documents', 100) / 10))),
    runs: option('runs', 7),
  });
  console.log(JSON.stringify(result, null, 2));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
