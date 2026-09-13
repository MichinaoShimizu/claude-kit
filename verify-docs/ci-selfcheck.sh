#!/usr/bin/env bash
# 各パッケージが自分自身に対して自己検査を持つときの共通の呼び出し口。
# CI はリポジトリ直下から `*/ci-selfcheck.sh` を機械的に探して実行するだけで、
# 個々のパッケージの検査コマンドを知らなくていい（.github/workflows/ci.yml 参照）。
set -euo pipefail

dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$dir/.." && pwd)"
rel_dir="${dir#"$repo_root"/}"

node "$dir/scripts/verify-docs.mjs" --root="$rel_dir"
node --test "$dir/scripts/verify-docs.test.mjs"
node --test "$dir/scripts/extract-doc-blocks.test.mjs"
node --test "$dir/scripts/skill-contracts.test.mjs"
node --test "$dir/scripts/skill-evals.test.mjs"

install_target="$(mktemp -d)"
trap 'rm -rf "$install_target"' EXIT
(cd "$install_target" && bash "$dir/install.sh" --source "$dir")
(cd "$install_target" && bash "$dir/install.sh" --source "$dir")
test -f "$install_target/scripts/verify-docs.mjs"
test -f "$install_target/scripts/markdown-structure.mjs"
test -f "$install_target/scripts/extract-doc-blocks.mjs"
test -f "$install_target/scripts/vendor/commonmark.cjs"
test -f "$install_target/evals/skill-judgement-cases.json"
test -f "$install_target/evals/README.md"
node "$install_target/scripts/verify-docs.mjs" --root="$install_target/scripts"
node "$install_target/scripts/extract-doc-blocks.mjs" \
  --root="$install_target" .agents/skills/verify-docs/SKILL.md >/dev/null
test -f "$install_target/.agents/skills/verify-docs/SKILL.md"
test -f "$install_target/.agents/skills/dedupe-docs/SKILL.md"
test -f "$install_target/.agents/skills/tighten-docs/SKILL.md"
test "$(readlink "$install_target/.claude/skills")" = "../.agents/skills"
test "$(readlink "$install_target/.kiro/skills")" = "../.agents/skills"

printf 'conflict\n' > "$install_target/scripts/verify-docs.mjs"
if (cd "$install_target" && bash "$dir/install.sh" --source "$dir" >/dev/null 2>&1); then
  echo "installer must not overwrite a conflicting file" >&2
  exit 1
fi
