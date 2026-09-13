#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
node --test scripts/sync-agent-layout.test.mjs

dir="$PWD"
install_target="$(mktemp -d)"
trap 'rm -rf "$install_target"' EXIT
(cd "$install_target" && bash "$dir/install.sh" --source "$dir")
(cd "$install_target" && bash "$dir/install.sh" --source "$dir")
test -f "$install_target/scripts/sync-agent-layout.mjs"
(cd "$install_target" && node scripts/sync-agent-layout.mjs --init)
test -L "$install_target/.claude/skills"
test -L "$install_target/.kiro/skills"
test -f "$install_target/.github/workflows/agent-layout.yml"

printf 'conflict\n' > "$install_target/scripts/sync-agent-layout.mjs"
if (cd "$install_target" && bash "$dir/install.sh" --source "$dir" >/dev/null 2>&1); then
  echo "installer must not overwrite a conflicting file" >&2
  exit 1
fi
