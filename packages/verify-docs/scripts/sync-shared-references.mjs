#!/usr/bin/env node

import { cpSync, existsSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const packageRoot = join(import.meta.dirname, '..');
const canonicalRoot = join(packageRoot, 'shared-references');
const skillsRoot = join(packageRoot, '.agents', 'skills');
const skillNames = ['verify-docs', 'dedupe-docs', 'tighten-docs'];
const write = process.argv.slice(2).includes('--write');

if (process.argv.slice(2).some((arg) => arg !== '--write')) {
  console.error('Usage: node scripts/sync-shared-references.mjs [--write]');
  process.exit(2);
}

const referenceNames = readdirSync(canonicalRoot, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
  .map((entry) => entry.name)
  .sort();

if (referenceNames.length === 0) {
  console.error(`No shared references found: ${canonicalRoot}`);
  process.exit(1);
}

const mismatches = [];
for (const skillName of skillNames) {
  const referencesRoot = join(skillsRoot, skillName, 'references');
  for (const name of referenceNames) {
    const canonical = join(canonicalRoot, name);
    const copy = join(referencesRoot, name);
    if (!existsSync(copy) || readFileSync(copy, 'utf8') !== readFileSync(canonical, 'utf8')) {
      mismatches.push(`${skillName}/references/${name}`);
      if (write) cpSync(canonical, copy);
    }
  }
  const legacySharedRoot = join(referencesRoot, 'shared');
  if (existsSync(legacySharedRoot)) {
    mismatches.push(`${skillName}/references/shared/`);
    if (write) rmSync(legacySharedRoot, { recursive: true, force: true });
  }
}

if (mismatches.length && !write) {
  console.error('Shared-reference copies are out of sync:');
  for (const path of mismatches) console.error(`  ${path}`);
  console.error('Run: node scripts/sync-shared-references.mjs --write');
  process.exit(1);
}

console.log(write ? `Synchronized ${referenceNames.length} shared references.` : 'Shared-reference copies are in sync.');
