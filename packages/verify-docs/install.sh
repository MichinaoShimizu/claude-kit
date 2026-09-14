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
    if [[ -f "$script_dir/scripts/document-structure-verifier.mjs" ]]; then
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
    source_root="$(find "$temp_root" -type d -path '*/packages/verify-docs' -print -quit)"
  fi
fi

if [[ ! -f "$source_root/scripts/document-structure-verifier.mjs" ]]; then
  echo "verify-docs package not found at: $source_root" >&2
  exit 1
fi

files=(
  scripts/document-structure-verifier.mjs
  scripts/markdown-structure.mjs
  scripts/extract-doc-blocks.mjs
  scripts/vendor
  evals
  .agents/skills/verify-docs
  .agents/skills/dedupe-docs
  .agents/skills/tighten-docs
)

work_record_ignore='.verify-docs/dist/*.work.md'

has_work_record_ignore() {
  local gitignore="$1"
  local entry

  [[ -f "$gitignore" ]] || return 1
  while IFS= read -r entry || [[ -n "$entry" ]]; do
    case "$entry" in
      "$work_record_ignore"|"/$work_record_ignore"|'.verify-docs/'|'/.verify-docs/'|'.verify-docs/**'|'/.verify-docs/**'|'.verify-docs/dist/'|'/.verify-docs/dist/'|'.verify-docs/dist/*'|'/.verify-docs/dist/*'|'.verify-docs/dist/**'|'/.verify-docs/dist/**'|'*.work.md'|'**/*.work.md')
        return 0
        ;;
    esac
  done < "$gitignore"
  return 1
}

ensure_work_record_ignore() {
  local gitignore="$target_root/.gitignore"

  if has_work_record_ignore "$gitignore"; then
    echo "Kept existing ignore rule for verify-docs temporary work records"
    return
  fi

  if [[ -s "$gitignore" ]]; then
    printf '\n' >> "$gitignore"
  fi
  printf '# verify-docs: temporary work records\n%s\n' "$work_record_ignore" >> "$gitignore"
  echo "Added ignore rule for verify-docs temporary work records"
}

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

ensure_work_record_ignore

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
echo "Run: node scripts/document-structure-verifier.mjs"
