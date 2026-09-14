#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { isAbsolute, relative, resolve } from 'node:path';
import { extractProseBlocks } from './markdown-structure.mjs';

const args = process.argv.slice(2);
const rootOption = args.find((arg) => arg.startsWith('--root='));
const ROOT = resolve(process.cwd(), rootOption?.slice('--root='.length) ?? '.');
const paths = args.filter((arg) => !arg.startsWith('--'));

if (args.includes('--help') || args.includes('-h')) {
  console.log('Usage: node scripts/document-structure-extractor.mjs [--root=<dir>] <file.md>...');
  console.log('Extract CommonMark headings and prose paragraphs as JSON with source lines and byte counts.');
  process.exit(0);
}

if (paths.length === 0) {
  console.error('少なくとも1つのMarkdownファイルを指定してください（--help を参照）。');
  process.exit(2);
}

const documents = [];
for (const path of paths) {
  const absolute = resolve(ROOT, path);
  const relativePath = relative(ROOT, absolute);
  if (relativePath === '..' || relativePath.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`) || isAbsolute(relativePath)) {
    console.error(`リポジトリ外のパスは指定できません: ${path}`);
    process.exit(2);
  }
  if (!absolute.toLowerCase().endsWith('.md')) {
    console.error(`Markdownファイルを指定してください: ${path}`);
    process.exit(2);
  }
  if (!existsSync(absolute)) {
    console.error(`ファイルがありません: ${path}`);
    process.exit(2);
  }

  const source = readFileSync(absolute, 'utf8');
  documents.push({
    kind: 'DocumentStructureSnapshot',
    path: relativePath,
    ...extractProseBlocks(source),
  });
}

console.log(JSON.stringify(documents, null, 2));
