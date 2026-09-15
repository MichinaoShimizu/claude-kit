#!/usr/bin/env bash
# 最新の origin/main から、隔離したタスク用 worktree を作成する。
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: bash scripts/start-worktree.sh <task-name> [destination]

Fetch origin/main, create codex/<task-name> from the fetched commit, and
verify that the new worktree HEAD is exactly that commit.

destination defaults to /private/tmp/<repository>-<task-name>.
EOF
}

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  usage
  exit 0
fi

if [[ "$#" -lt 1 || "$#" -gt 2 ]]; then
  usage >&2
  exit 2
fi

task_name="$1"
if [[ ! "$task_name" =~ ^[a-z0-9][a-z0-9-]*$ ]]; then
  echo "task-name must use lowercase letters, digits, and hyphens: $task_name" >&2
  exit 2
fi

repo_root="$(git rev-parse --show-toplevel)"
repo_name="$(basename "$repo_root")"
branch_name="codex/$task_name"
destination="${2:-/private/tmp/$repo_name-$task_name}"

if [[ "$destination" != /* ]]; then
  echo "destination must be an absolute path: $destination" >&2
  exit 2
fi
if [[ -e "$destination" ]]; then
  echo "destination already exists: $destination" >&2
  exit 1
fi
if [[ ! -d "$(dirname "$destination")" ]]; then
  echo "destination parent does not exist: $(dirname "$destination")" >&2
  exit 1
fi
if git show-ref --verify --quiet "refs/heads/$branch_name"; then
  echo "branch already exists: $branch_name" >&2
  exit 1
fi

git fetch origin main
base_sha="$(git rev-parse --verify origin/main^{commit})"
git worktree add -b "$branch_name" "$destination" "$base_sha"

worktree_sha="$(git -C "$destination" rev-parse HEAD)"
if [[ "$worktree_sha" != "$base_sha" ]]; then
  echo "worktree HEAD does not match fetched origin/main" >&2
  echo "origin/main: $base_sha" >&2
  echo "worktree:   $worktree_sha" >&2
  exit 1
fi

printf 'Created worktree: %s\n' "$destination"
printf 'Branch: %s\n' "$branch_name"
printf 'origin/main: %s\n' "$base_sha"
printf 'worktree HEAD: %s\n' "$worktree_sha"
