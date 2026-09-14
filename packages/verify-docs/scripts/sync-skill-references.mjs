#!/usr/bin/env node

import { cpSync, existsSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { basename, join, relative, resolve } from 'node:path';

const packageRoot = join(import.meta.dirname, '..');
const docsRoot = join(packageRoot, 'docs');
const skillsRoot = join(packageRoot, '.agents', 'skills');
const skillNames = ['verify-docs', 'dedupe-docs', 'tighten-docs'];
const write = process.argv.slice(2).includes('--write');

if (process.argv.slice(2).some((arg) => arg !== '--write')) {
  console.error('Usage: node scripts/sync-skill-references.mjs [--write]');
  process.exit(2);
}

function markdownDestinations(source) {
  return [...source.matchAll(/!?\[[^\]]*\]\(([^\s)]+)(?:\s+[^)]*)?\)/g)].map((match) => match[1]);
}

function isWithin(root, path) {
  const pathFromRoot = relative(root, path);
  return pathFromRoot && !pathFromRoot.startsWith('..') && !pathFromRoot.includes('../');
}

function docsPath(referenceName) {
  const canonical = resolve(docsRoot, referenceName);
  if (basename(canonical) !== referenceName || !canonical.endsWith('.md') || !isWithin(docsRoot, canonical)) {
    throw new Error(`Invalid skill reference: ${referenceName}`);
  }
  if (!existsSync(canonical)) throw new Error(`Missing canonical documentation: docs/${referenceName}`);
  return canonical;
}

function directReferenceNames(skillName) {
  const skillFile = join(skillsRoot, skillName, 'SKILL.md');
  const names = new Set();
  for (const destination of markdownDestinations(readFileSync(skillFile, 'utf8'))) {
    const target = destination.split('#', 1)[0];
    if (!target.startsWith('references/')) continue;
    names.add(target.slice('references/'.length));
  }
  return names;
}

function requiredReferenceNames(skillName) {
  const required = directReferenceNames(skillName);
  const queue = [...required];
  while (queue.length) {
    const name = queue.shift();
    const source = docsPath(name);
    for (const destination of markdownDestinations(readFileSync(source, 'utf8'))) {
      if (destination.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(destination)) continue;
      const target = destination.split('#', 1)[0];
      const resolved = resolve(source, '..', target);
      if (!target.endsWith('.md') || !isWithin(docsRoot, resolved)) continue;
      const nextName = relative(docsRoot, resolved);
      docsPath(nextName);
      if (!required.has(nextName)) {
        required.add(nextName);
        queue.push(nextName);
      }
    }
  }
  return [...required].sort();
}

const mismatches = [];
for (const skillName of skillNames) {
  const referencesRoot = join(skillsRoot, skillName, 'references');
  const requiredNames = requiredReferenceNames(skillName);
  const requiredSet = new Set(requiredNames);
  for (const name of requiredNames) {
    const canonical = docsPath(name);
    const copy = join(referencesRoot, name);
    if (!existsSync(copy) || readFileSync(copy, 'utf8') !== readFileSync(canonical, 'utf8')) {
      mismatches.push(`${skillName}/references/${name}`);
      if (write) cpSync(canonical, copy);
    }
  }

  for (const entry of readdirSync(referencesRoot, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.md') || requiredSet.has(entry.name)) continue;
    mismatches.push(`${skillName}/references/${entry.name} (not reachable from SKILL.md)`);
    if (write) rmSync(join(referencesRoot, entry.name));
  }
}

if (mismatches.length && !write) {
  console.error('Skill reference copies are out of sync:');
  for (const path of mismatches) console.error(`  ${path}`);
  console.error('Run: node scripts/sync-skill-references.mjs --write');
  process.exit(1);
}

console.log(write ? 'Synchronized skill reference copies.' : 'Skill reference copies are in sync.');
