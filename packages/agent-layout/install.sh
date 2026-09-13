#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: install.sh [--source PACKAGE_DIR]

Install agent-layout into the current repository root. --source is intended for
local development and tests; normal use downloads the package from GitHub.
EOF
}

source_root=""
while (($#)); do
  case "$1" in
    --source)
      if (($# < 2)); then
        usage >&2
        exit 2
      fi
      source_root="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      usage >&2
      exit 2
      ;;
  esac
done

target_root="$PWD"
temp_root=""
cleanup() {
  if [[ -n "$temp_root" ]]; then
    rm -rf "$temp_root"
  fi
}
trap cleanup EXIT

if [[ -z "$source_root" ]]; then
  script_path="${BASH_SOURCE[0]:-}"
  if [[ -n "$script_path" && -f "$script_path" ]]; then
    script_dir="$(cd "$(dirname "$script_path")" && pwd)"
    if [[ -f "$script_dir/scripts/sync-agent-layout.mjs" ]]; then
      source_root="$script_dir"
    fi
  fi
  if [[ -z "$source_root" ]]; then
    temp_root="$(mktemp -d)"
    archive="$temp_root/claude-kit.tar.gz"
    curl -fsSL \
      https://github.com/MichinaoShimizu/claude-kit/archive/refs/heads/main.tar.gz \
      -o "$archive"
    tar -xzf "$archive" -C "$temp_root"
    source_root="$(find "$temp_root" -type d -path '*/packages/agent-layout' -print -quit)"
  fi
fi

source_file="$source_root/scripts/sync-agent-layout.mjs"
target_file="$target_root/scripts/sync-agent-layout.mjs"
if [[ ! -f "$source_file" ]]; then
  echo "agent-layout package not found at: $source_root" >&2
  exit 1
fi

if [[ -e "$target_file" ]] && ! cmp -s "$source_file" "$target_file"; then
  echo "agent-layout installation stopped; scripts/sync-agent-layout.mjs already exists with different contents." >&2
  echo "Review or move the conflicting file, then run the installer again." >&2
  exit 1
fi

if [[ ! -e "$target_file" ]]; then
  mkdir -p "$(dirname "$target_file")"
  cp "$source_file" "$target_file"
fi

echo "Installed agent-layout into $target_root"
echo "Run: node scripts/sync-agent-layout.mjs --init"
