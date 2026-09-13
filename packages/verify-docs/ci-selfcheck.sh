#!/usr/bin/env bash
# verify-docs パッケージの自己検査。
# 起動ディレクトリにかかわらず、パッケージの文書構造、Node.js テスト、
# 一時リポジトリへのインストールを検査する。
set -euo pipefail

dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# パッケージ自身を検査対象にするため、スクリプトの絶対パスを渡す。
node "$dir/scripts/verify-docs.mjs" --root="$dir" --config="$dir/config/verify-docs.config.json"
node --test "$dir/scripts/verify-docs.test.mjs"
node --test "$dir/scripts/extract-doc-blocks.test.mjs"
node --test "$dir/scripts/skill-contracts.test.mjs"
node --test "$dir/scripts/skill-evals.test.mjs"

install_target="$(mktemp -d)"
ignore_target="$(mktemp -d)"
existing_skills_target="$(mktemp -d)"
conflicting_skills_target="$(mktemp -d)"
trap 'rm -rf "$install_target" "$ignore_target" "$existing_skills_target" "$conflicting_skills_target"' EXIT
git -C "$install_target" init -q
(cd "$install_target" && bash "$dir/install.sh" --source "$dir")
(cd "$install_target" && bash "$dir/install.sh" --source "$dir")
test "$(grep -Fxc '.verify-docs/dist/*.work.md' "$install_target/.gitignore")" = "1"
git -C "$install_target" check-ignore -q --no-index -- .verify-docs/dist/verify-docs.work.md
if git -C "$install_target" check-ignore -q --no-index -- .verify-docs/dist/checklist.md; then
  echo "installer must keep checklist.md tracked" >&2
  exit 1
fi
test -f "$install_target/.verify-docs/scripts/verify-docs.mjs"
test -f "$install_target/.verify-docs/scripts/markdown-structure.mjs"
test -f "$install_target/.verify-docs/scripts/extract-doc-blocks.mjs"
test -f "$install_target/.verify-docs/scripts/vendor/commonmark.cjs"
test -f "$install_target/.verify-docs/config/verify-docs.config.json"
test -f "$install_target/.verify-docs/config/verify-docs.todo.json"
test ! -e "$install_target/scripts"
test ! -e "$install_target/evals"
node "$install_target/.verify-docs/scripts/verify-docs.mjs" --root="$install_target"
node "$install_target/.verify-docs/scripts/verify-docs.mjs" --root="$install_target" --init-todo >/dev/null
node "$install_target/.verify-docs/scripts/extract-doc-blocks.mjs" \
  --root="$install_target" .agents/skills/verify-docs/SKILL.md >/dev/null
test -f "$install_target/.agents/skills/verify-docs/SKILL.md"
test -f "$install_target/.agents/skills/dedupe-docs/SKILL.md"
test -f "$install_target/.agents/skills/tighten-docs/SKILL.md"
for agent_dir in .claude .kiro; do
  for skill_name in verify-docs dedupe-docs tighten-docs; do
    test "$(readlink "$install_target/$agent_dir/skills/$skill_name")" = "../../.agents/skills/$skill_name"
  done
done

mkdir -p "$existing_skills_target/.kiro/skills/review"
printf '# review\n' > "$existing_skills_target/.kiro/skills/review/SKILL.md"
(cd "$existing_skills_target" && bash "$dir/install.sh" --source "$dir")
test -f "$existing_skills_target/.kiro/skills/review/SKILL.md"
for skill_name in verify-docs dedupe-docs tighten-docs; do
  test "$(readlink "$existing_skills_target/.kiro/skills/$skill_name")" = "../../.agents/skills/$skill_name"
done

mkdir -p "$conflicting_skills_target/.kiro/skills/verify-docs"
printf '# different skill\n' > "$conflicting_skills_target/.kiro/skills/verify-docs/SKILL.md"
if (cd "$conflicting_skills_target" && bash "$dir/install.sh" --source "$dir" >/dev/null 2>&1); then
  echo "installer must not overwrite a conflicting Kiro skill" >&2
  exit 1
fi
test ! -e "$conflicting_skills_target/.verify-docs"

printf '.verify-docs/\n' > "$ignore_target/.gitignore"
(cd "$ignore_target" && bash "$dir/install.sh" --source "$dir")
if grep -Fxq '.verify-docs/dist/*.work.md' "$ignore_target/.gitignore"; then
  echo "installer must not duplicate a broader ignore rule" >&2
  exit 1
fi

printf 'conflict\n' > "$install_target/.verify-docs/scripts/verify-docs.mjs"
if (cd "$install_target" && bash "$dir/install.sh" --source "$dir" >/dev/null 2>&1); then
  echo "installer must not overwrite a conflicting file" >&2
  exit 1
fi
