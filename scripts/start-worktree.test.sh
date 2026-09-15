#!/usr/bin/env bash
# start-worktree.sh のローカル Git リポジトリに対する統合検査。
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
subject="$script_dir/start-worktree.sh"
fixture_root="$(mktemp -d)"
trap 'rm -rf "$fixture_root"' EXIT

remote="$fixture_root/remote.git"
seed="$fixture_root/seed"
checkout="$fixture_root/checkout"
first_worktree="$fixture_root/first-worktree"
second_worktree="$fixture_root/second-worktree"

git init --bare -q "$remote"
git -C "$remote" symbolic-ref HEAD refs/heads/main
git init -q -b main "$seed"
git -C "$seed" config user.name 'Test User'
git -C "$seed" config user.email 'test@example.com'
git -C "$seed" config commit.gpgsign false
printf 'initial\n' > "$seed/README.md"
git -C "$seed" add README.md
git -C "$seed" commit -qm initial
git -C "$seed" remote add origin "$remote"
git -C "$seed" push -q -u origin main
git clone -q "$remote" "$checkout"

(cd "$checkout" && bash "$subject" first "$first_worktree") > "$fixture_root/first.log"
first_base="$(git -C "$checkout" rev-parse origin/main)"
test "$(git -C "$first_worktree" rev-parse HEAD)" = "$first_base"
grep -Fxq "origin/main: $first_base" "$fixture_root/first.log"
grep -Fxq "worktree HEAD: $first_base" "$fixture_root/first.log"

printf 'next\n' >> "$seed/README.md"
git -C "$seed" add README.md
git -C "$seed" commit -qm next
git -C "$seed" push -q

(cd "$checkout" && bash "$subject" second "$second_worktree") > "$fixture_root/second.log"
second_base="$(git -C "$checkout" rev-parse origin/main)"
test "$second_base" != "$first_base"
test "$(git -C "$second_worktree" rev-parse HEAD)" = "$second_base"
grep -Fxq "origin/main: $second_base" "$fixture_root/second.log"
grep -Fxq "worktree HEAD: $second_base" "$fixture_root/second.log"

if (cd "$checkout" && bash "$subject" first "$fixture_root/duplicate" >/dev/null 2>&1); then
  echo 'existing branch must be rejected' >&2
  exit 1
fi

echo 'start-worktree tests passed'
