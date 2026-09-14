#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, join, relative, resolve } from 'node:path';

const packageRoot = join(import.meta.dirname, '..');
const docsRoot = join(packageRoot, 'docs');
const skillsRoot = join(packageRoot, '.agents', 'skills');
const skillNames = ['verify-docs', 'dedupe-docs', 'tighten-docs'];
const outputArgument = process.argv.slice(2).find((arg) => arg.startsWith('--output='));

if (process.argv.slice(2).some((arg) => !arg.startsWith('--output='))) {
  console.error('Usage: node scripts/prepare-skill-distribution.mjs [--output=DIR]');
  process.exit(2);
}

function markdownLinks(source) {
  return [...source.matchAll(/(!?\[[^\]]*\]\()([^\s)]+)((?:\s+[^)]*)?\))/g)]
    .map((match) => ({ destination: match[2] }));
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

function docsDestination(file, destination) {
  if (destination.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(destination)) return null;
  const [path] = destination.split('#', 1);
  if (!path) return null;
  const resolved = resolve(file, '..', path);
  if (!isWithin(docsRoot, resolved)) return null;
  if (!path.endsWith('.md')) throw new Error(`Skill documentation link must target Markdown: ${destination}`);
  return relative(docsRoot, resolved);
}

function directReferenceNames(skillName) {
  const skillFile = join(skillsRoot, skillName, 'SKILL.md');
  const names = new Set();
  for (const { destination } of markdownLinks(readFileSync(skillFile, 'utf8'))) {
    const name = docsDestination(skillFile, destination);
    if (name) {
      docsPath(name);
      names.add(name);
      continue;
    }
    const [path] = destination.split('#', 1);
    if (path?.startsWith('references/')) {
      throw new Error(`${skillName}/SKILL.md must reference docs/ in the source tree, not references/: ${destination}`);
    }
  }
  return names;
}

function requiredReferenceNames(skillName) {
  const required = directReferenceNames(skillName);
  const queue = [...required];
  while (queue.length) {
    const name = queue.shift();
    const source = docsPath(name);
    for (const { destination } of markdownLinks(readFileSync(source, 'utf8'))) {
      const nextName = docsDestination(source, destination);
      if (!nextName) continue;
      docsPath(nextName);
      if (!required.has(nextName)) {
        required.add(nextName);
        queue.push(nextName);
      }
    }
  }
  return [...required].sort();
}

function rewriteSkill(source, skillFile) {
  return source.replace(/(!?\[[^\]]*\]\()([^\s)]+)((?:\s+[^)]*)?\))/g, (match, prefix, destination, suffix) => {
    const name = docsDestination(skillFile, destination);
    if (!name) return match;
    const fragmentIndex = destination.indexOf('#');
    const fragment = fragmentIndex === -1 ? '' : destination.slice(fragmentIndex);
    return `${prefix}references/${name}${fragment}${suffix}`;
  });
}

const requiredBySkill = new Map(skillNames.map((skillName) => [skillName, requiredReferenceNames(skillName)]));

if (!outputArgument) {
  console.log('Source skill documentation links are valid.');
  process.exit(0);
}

const outputRoot = resolve(outputArgument.slice('--output='.length));
rmSync(outputRoot, { recursive: true, force: true });
for (const skillName of skillNames) {
  const sourceSkillRoot = join(skillsRoot, skillName);
  const destinationSkillRoot = join(outputRoot, '.agents', 'skills', skillName);
  cpSync(sourceSkillRoot, destinationSkillRoot, { recursive: true });

  const skillFile = join(sourceSkillRoot, 'SKILL.md');
  writeFileSync(join(destinationSkillRoot, 'SKILL.md'), rewriteSkill(readFileSync(skillFile, 'utf8'), skillFile));

  for (const name of requiredBySkill.get(skillName)) {
    const destination = join(destinationSkillRoot, 'references', name);
    mkdirSync(join(destination, '..'), { recursive: true });
    cpSync(docsPath(name), destination);
  }
}

console.log(`Prepared standalone skill distribution at ${outputRoot}.`);
