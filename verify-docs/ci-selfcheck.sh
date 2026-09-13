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
