#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: install.sh [--source PACKAGE_DIR]

Install verify-docs into the current repository root. --source is intended for
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
    if [[ -f "$script_dir/scripts/verify-docs.mjs" ]]; then
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
    source_root="$(find "$temp_root" -mindepth 2 -maxdepth 2 -type d -name verify-docs -print -quit)"
  fi
fi

if [[ ! -f "$source_root/scripts/verify-docs.mjs" ]]; then
  echo "verify-docs package not found at: $source_root" >&2
  exit 1
fi

files=(
  scripts/verify-docs.mjs
  scripts/markdown-structure.mjs
  scripts/extract-doc-blocks.mjs
  scripts/vendor
  evals
  .agents/skills/verify-docs
  .agents/skills/dedupe-docs
  .agents/skills/tighten-docs
)

conflicts=()
for item in "${files[@]}"; do
  if [[ -d "$source_root/$item" ]]; then
    while IFS= read -r -d '' source_file; do
      relative_path="${source_file#"$source_root/"}"
      target_file="$target_root/$relative_path"
      if [[ -e "$target_file" ]] && ! cmp -s "$source_file" "$target_file"; then
        conflicts+=("$relative_path")
      fi
    done < <(find "$source_root/$item" -type f -print0)
  else
    target_file="$target_root/$item"
    if [[ -e "$target_file" ]] && ! cmp -s "$source_root/$item" "$target_file"; then
      conflicts+=("$item")
    fi
  fi
done

if ((${#conflicts[@]})); then
  echo "verify-docs installation stopped; these files already exist with different contents:" >&2
  printf '  %s\n' "${conflicts[@]}" >&2
  echo "Review or move the conflicting files, then run the installer again." >&2
  exit 1
fi

for item in "${files[@]}"; do
  if [[ -d "$source_root/$item" ]]; then
    while IFS= read -r -d '' source_file; do
      relative_path="${source_file#"$source_root/"}"
      target_file="$target_root/$relative_path"
      if [[ ! -e "$target_file" ]]; then
        mkdir -p "$(dirname "$target_file")"
        cp "$source_file" "$target_file"
      fi
    done < <(find "$source_root/$item" -type f -print0)
  else
    target_file="$target_root/$item"
    if [[ ! -e "$target_file" ]]; then
      mkdir -p "$(dirname "$target_file")"
      cp "$source_root/$item" "$target_file"
    fi
  fi
done

for agent_dir in .claude .kiro; do
  alias="$target_root/$agent_dir/skills"
  if [[ -L "$alias" && "$(readlink "$alias")" == "../.agents/skills" ]]; then
    continue
  fi
  if [[ -e "$alias" || -L "$alias" ]]; then
    echo "Kept existing $agent_dir/skills; sync it with .agents/skills if needed." >&2
    continue
  fi
  mkdir -p "$target_root/$agent_dir"
  ln -s ../.agents/skills "$alias"
done

echo "Installed verify-docs into $target_root"
echo "Run: node scripts/verify-docs.mjs"
