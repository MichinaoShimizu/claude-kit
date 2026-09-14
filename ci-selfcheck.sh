#!/usr/bin/env bash
# verify-docs 自身に対する自己検査の呼び出し口。
set -euo pipefail

dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$dir"

test -d "$repo_root/.agents/skills"
for skill in verify-docs dedupe-docs tighten-docs; do
  test -f "$repo_root/.agents/skills/$skill/SKILL.md"
done

node "$dir/scripts/prepare-skill-distribution.mjs"
node "$dir/scripts/check-skill-local-links.mjs"
node "$dir/scripts/document-structure-verifier.mjs" --root="$repo_root" --config="$dir/selfcheck.config.json"
node --test "$dir/scripts/document-structure-verifier.test.mjs"
node --test "$dir/scripts/document-structure-extractor.test.mjs"
node --test "$dir/scripts/benchmark-document-structure.test.mjs"
node --test "$dir/scripts/select-canonical.test.mjs"
node --test "$dir/scripts/skill-contracts.test.mjs"
node --test "$dir/scripts/skill-evals.test.mjs"

install_target="$(mktemp -d)"
ignore_target="$(mktemp -d)"
existing_skills_target="$(mktemp -d)"
conflicting_skill_target="$(mktemp -d)"
distribution_root="$(mktemp -d)"
distribution_archive="$distribution_root/verify-docs.tar"
prepared_skills="$distribution_root/prepared"
install_log="$distribution_root/install.log"
trap 'rm -rf "$install_target" "$ignore_target" "$existing_skills_target" "$conflicting_skill_target" "$distribution_root"' EXIT
tar -cf "$distribution_archive" -C "$(dirname "$dir")" "$(basename "$dir")"
tar -xf "$distribution_archive" -C "$distribution_root"
distribution_dir="$distribution_root/$(basename "$dir")"
node "$distribution_dir/scripts/prepare-skill-distribution.mjs" --output="$prepared_skills"
node "$distribution_dir/scripts/check-skill-local-links.mjs" --skills-root="$prepared_skills/.agents/skills"
test ! -e "$distribution_dir/.agents/skills/verify-docs/references"
while IFS= read -r -d '' link; do
  if [[ ! -e "$link" ]]; then
    echo "distribution contains a broken symbolic link: $link -> $(readlink "$link")" >&2
    exit 1
  fi
done < <(find "$distribution_dir" -type l -print0)
git -C "$install_target" init -q
(cd "$install_target" && bash "$distribution_dir/install.sh" --source "$distribution_dir") >"$install_log"
grep -Fxq 'Preparing standalone skills...' "$install_log"
grep -Fxq 'Installing verify-docs files...' "$install_log"
grep -Fq "Installed verify-docs into $install_target" "$install_log"
if grep -Fq 'Prepared standalone skill distribution at ' "$install_log"; then
  echo "installer must not expose its temporary distribution directory" >&2
  exit 1
fi
(cd "$install_target" && bash "$distribution_dir/install.sh" --source "$distribution_dir")
test "$(grep -Fxc '.verify-docs/dist/*.work.md' "$install_target/.gitignore")" = "1"
git -C "$install_target" check-ignore -q --no-index -- .verify-docs/dist/verify-docs.work.md
if git -C "$install_target" check-ignore -q --no-index -- .verify-docs/dist/maintenance-report.md; then
  echo "installer must keep maintenance-report.md tracked" >&2
  exit 1
fi
test -f "$install_target/scripts/document-structure-verifier.mjs"
test -f "$install_target/scripts/markdown-structure.mjs"
test -f "$install_target/scripts/document-structure-extractor.mjs"
test -f "$install_target/scripts/select-canonical.mjs"
test -f "$install_target/scripts/vendor/commonmark.cjs"
test ! -e "$install_target/evals"
node "$install_target/scripts/document-structure-verifier.mjs" --root="$install_target/scripts"
node "$install_target/scripts/document-structure-extractor.mjs" \
  --root="$install_target" .agents/skills/verify-docs/SKILL.md >/dev/null
printf '%s\n' '{"left":{"id":"entry","path":"README.md","role":"entry","facts":{"purpose":"Install."}},"right":{"id":"guide","path":"docs/install.md","role":"detail","facts":{"purpose":"Install.","command":"bash install.sh"}}}' > "$install_target/candidate-pair.json"
selection="$(node "$install_target/scripts/select-canonical.mjs" "$install_target/candidate-pair.json")"
grep -Fq '"decision": "auto-canonical"' <<< "$selection"
rm "$install_target/candidate-pair.json"
node "$dir/scripts/check-skill-local-links.mjs" --skills-root="$install_target/.agents/skills"
test -f "$install_target/.agents/skills/verify-docs/SKILL.md"
test -f "$install_target/.agents/skills/dedupe-docs/SKILL.md"
test -f "$install_target/.agents/skills/tighten-docs/SKILL.md"
test -f "$install_target/.agents/skills/verify-docs/references/config.md"
test ! -e "$install_target/.agents/skills/verify-docs/references/canonical-selection.md"
test -f "$install_target/.agents/skills/dedupe-docs/references/canonical-selection.md"
test ! -e "$install_target/.agents/skills/dedupe-docs/references/object-naming.md"
test -f "$install_target/.agents/skills/tighten-docs/references/work-records-and-report.md"
test -f "$install_target/.agents/skills/tighten-docs/references/maintenance-report-format.md"
test -f "$install_target/.agents/skills/tighten-docs/references/work-record-lifecycle.md"
test ! -e "$install_target/.agents/skills/tighten-docs/references/config.md"
for agent_dir in .claude .kiro; do
  test "$(readlink "$install_target/$agent_dir/skills/verify-docs")" = "../../.agents/skills/verify-docs"
  test "$(readlink "$install_target/$agent_dir/skills/dedupe-docs")" = "../../.agents/skills/dedupe-docs"
  test "$(readlink "$install_target/$agent_dir/skills/tighten-docs")" = "../../.agents/skills/tighten-docs"
  test -f "$install_target/$agent_dir/skills/verify-docs/SKILL.md"
  test -f "$install_target/$agent_dir/skills/dedupe-docs/SKILL.md"
  test -f "$install_target/$agent_dir/skills/tighten-docs/SKILL.md"
done
mkdir -p "$existing_skills_target/.kiro/skills/repository-skill"
printf '# Repository skill\n' > "$existing_skills_target/.kiro/skills/repository-skill/SKILL.md"
(cd "$existing_skills_target" && bash "$dir/install.sh" --source "$dir")
test -f "$existing_skills_target/.kiro/skills/repository-skill/SKILL.md"
test "$(readlink "$existing_skills_target/.kiro/skills/verify-docs")" = "../../.agents/skills/verify-docs"

mkdir -p "$conflicting_skill_target/.kiro/skills/verify-docs"
printf '# User-owned skill\n' > "$conflicting_skill_target/.kiro/skills/verify-docs/SKILL.md"
if (cd "$conflicting_skill_target" && bash "$dir/install.sh" --source "$dir" >/dev/null 2>&1); then
  echo "installer must not overwrite a conflicting Kiro skill" >&2
  exit 1
fi
test -f "$conflicting_skill_target/.kiro/skills/verify-docs/SKILL.md"

printf '.verify-docs/\n' > "$ignore_target/.gitignore"
(cd "$ignore_target" && bash "$dir/install.sh" --source "$dir")
if grep -Fxq '.verify-docs/dist/*.work.md' "$ignore_target/.gitignore"; then
  echo "installer must not duplicate a broader ignore rule" >&2
  exit 1
fi

printf 'conflict\n' > "$install_target/scripts/document-structure-verifier.mjs"
if (cd "$install_target" && bash "$dir/install.sh" --source "$dir" >/dev/null 2>&1); then
  echo "installer must not overwrite a conflicting file" >&2
  exit 1
fi
