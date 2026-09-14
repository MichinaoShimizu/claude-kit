#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const packageRoot = join(import.meta.dirname, '..');
const argument = process.argv.slice(2).find((arg) => arg.startsWith('--skills-root='));
const sourceMode = !argument;
const skillsRoot = resolve(argument?.slice('--skills-root='.length) ?? join(packageRoot, '.agents', 'skills'));
const docsRoot = join(packageRoot, 'docs');
const skillNames = ['verify-docs', 'dedupe-docs', 'tighten-docs'];
const exampleTargets = new Set(['../../AGENTS.md', '../../docs/deploy.md', '../../docs/deploy-domain.md']);

if (process.argv.slice(2).some((arg) => !arg.startsWith('--skills-root='))) {
  console.error('Usage: node scripts/check-skill-local-links.mjs [--skills-root=DIR]');
  process.exit(2);
}

function markdownDestinations(source) {
  return [...source.matchAll(/!?\[[^\]]*\]\(([^\s)]+)(?:\s+[^)]*)?\)/g)].map((match) => match[1]);
}

function markdownFiles(root) {
  const files = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) files.push(...markdownFiles(path));
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(path);
  }
  return files;
}

function isWithin(root, path) {
  const pathFromRoot = relative(root, path);
  return pathFromRoot && !pathFromRoot.startsWith('..') && !pathFromRoot.includes('../');
}

const failures = [];
for (const skillName of skillNames) {
  const skillRoot = join(skillsRoot, skillName);
  const skillFile = join(skillRoot, 'SKILL.md');
  if (!existsSync(skillFile)) {
    failures.push(`${skillName}: SKILL.md is missing`);
    continue;
  }

  const files = sourceMode ? [skillFile] : markdownFiles(skillRoot);
  for (const file of files) {
    for (const destination of markdownDestinations(readFileSync(file, 'utf8'))) {
      if (destination.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(destination)) continue;
      const target = destination.split('#', 1)[0];
      if (exampleTargets.has(target)) continue;
      const resolved = resolve(file, '..', target);
      if (!existsSync(resolved)) {
        failures.push(`${relative(skillsRoot, file)}: missing local link ${destination}`);
        continue;
      }
      const permittedRoot = sourceMode ? docsRoot : skillRoot;
      if (!isWithin(permittedRoot, resolved)) {
        failures.push(`${relative(skillsRoot, file)}: link leaves its ${sourceMode ? 'docs/' : 'skill'} boundary ${destination}`);
      }
    }
  }

  for (const destination of markdownDestinations(readFileSync(skillFile, 'utf8'))) {
    if (destination.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(destination)) continue;
    const target = destination.split('#', 1)[0];
    const resolved = resolve(skillFile, '..', target);
    const valid = sourceMode ? isWithin(docsRoot, resolved) : target.startsWith('references/');
    if (!valid) {
      failures.push(`${skillName}/SKILL.md: must use ${sourceMode ? 'docs/' : 'its own references/'} only (${destination})`);
    }
  }
}

if (failures.length) {
  console.error('Skill-link check failed:');
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}

console.log(sourceMode ? 'Source skills resolve their documentation through docs/.' : 'Standalone skills resolve their local links independently.');
