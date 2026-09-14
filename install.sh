#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: install.sh [--source SOURCE_DIR]

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
prepared_root=""
cleanup() {
  if [[ -n "$temp_root" ]]; then
    rm -rf "$temp_root"
  fi
  if [[ -n "$prepared_root" ]]; then
    rm -rf "$prepared_root"
  fi
}
trap cleanup EXIT

if ! command -v node >/dev/null 2>&1; then
  echo "verify-docs requires Node.js 22.23.2 (Node 22). Node.js was not found." >&2
  exit 1
fi
node_version="$(node --version)"
node_major="${node_version#v}"
node_major="${node_major%%.*}"
if [[ ! "$node_major" =~ ^[0-9]+$ ]] || (( node_major < 22 )); then
  echo "verify-docs requires Node.js 22.23.2 or later. Current version: $node_version" >&2
  exit 1
fi

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
    echo "Downloading verify-docs from MichinaoShimizu/claude-kit (main)..."
    curl -fsSL \
      https://github.com/MichinaoShimizu/claude-kit/archive/refs/heads/main.tar.gz \
      -o "$archive"
    tar -xzf "$archive" -C "$temp_root"
    source_file="$(find "$temp_root" -type f -path '*/scripts/document-structure-verifier.mjs' -print -quit)"
    if [[ -n "$source_file" ]]; then
      source_root="$(dirname "$(dirname "$source_file")")"
    fi
  fi
fi

if [[ ! -f "$source_root/scripts/document-structure-verifier.mjs" ]]; then
  echo "verify-docs source not found at: $source_root" >&2
  exit 1
fi

prepared_root="$(mktemp -d)"
echo "Preparing standalone skills..."
node "$source_root/scripts/prepare-skill-distribution.mjs" --output="$prepared_root" >/dev/null

files=(
  scripts/document-structure-verifier.mjs
  scripts/markdown-structure.mjs
  scripts/document-structure-extractor.mjs
  scripts/select-canonical.mjs
  scripts/vendor
  .agents/skills/verify-docs
  .agents/skills/dedupe-docs
  .agents/skills/tighten-docs
)
bundled_skills=(
  verify-docs
  dedupe-docs
  tighten-docs
)

work_record_ignore='.verify-docs/dist/*.work.md'

item_source_root() {
  if [[ "$1" == .agents/skills/* ]]; then
    printf '%s\n' "$prepared_root"
  else
    printf '%s\n' "$source_root"
  fi
}

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
  item_root="$(item_source_root "$item")"
  if [[ -d "$item_root/$item" ]]; then
    while IFS= read -r -d '' source_file; do
      relative_path="${source_file#"$item_root/"}"
      target_file="$target_root/$relative_path"
      if [[ -e "$target_file" ]] && ! cmp -s "$source_file" "$target_file"; then
        conflicts+=("$relative_path")
      fi
    done < <(find "$item_root/$item" -type f -print0)
  else
    target_file="$target_root/$item"
    if [[ -e "$target_file" ]] && ! cmp -s "$item_root/$item" "$target_file"; then
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

skill_alias_conflicts=()
for agent_dir in .claude .kiro; do
  skills_dir="$target_root/$agent_dir/skills"
  if [[ -L "$skills_dir" ]]; then
    if [[ "$(readlink "$skills_dir")" == "../.agents/skills" ]]; then
      continue
    fi
    skill_alias_conflicts+=("$agent_dir/skills (different symbolic link)")
    continue
  fi
  if [[ -e "$skills_dir" && ! -d "$skills_dir" ]]; then
    skill_alias_conflicts+=("$agent_dir/skills (not a directory)")
    continue
  fi
  for skill in "${bundled_skills[@]}"; do
    alias="$skills_dir/$skill"
    expected="../../.agents/skills/$skill"
    if [[ -L "$alias" && "$(readlink "$alias")" == "$expected" ]]; then
      continue
    fi
    if [[ -e "$alias" || -L "$alias" ]]; then
      skill_alias_conflicts+=("$agent_dir/skills/$skill")
    fi
  done
done

if ((${#skill_alias_conflicts[@]})); then
  echo "verify-docs installation stopped; these skill paths cannot be replaced with package links:" >&2
  printf '  %s\n' "${skill_alias_conflicts[@]}" >&2
  echo "Move the conflicting paths, then run the installer again." >&2
  exit 1
fi

echo "Installing verify-docs files..."
for item in "${files[@]}"; do
  item_root="$(item_source_root "$item")"
  if [[ -d "$item_root/$item" ]]; then
    while IFS= read -r -d '' source_file; do
      relative_path="${source_file#"$item_root/"}"
      target_file="$target_root/$relative_path"
      if [[ ! -e "$target_file" ]]; then
        mkdir -p "$(dirname "$target_file")"
        cp "$source_file" "$target_file"
      fi
    done < <(find "$item_root/$item" -type f -print0)
  else
    target_file="$target_root/$item"
    if [[ ! -e "$target_file" ]]; then
      mkdir -p "$(dirname "$target_file")"
      cp "$item_root/$item" "$target_file"
    fi
  fi
done

ensure_work_record_ignore

for agent_dir in .claude .kiro; do
  skills_dir="$target_root/$agent_dir/skills"
  if [[ -L "$skills_dir" && "$(readlink "$skills_dir")" == "../.agents/skills" ]]; then
    continue
  fi
  mkdir -p "$skills_dir"
  for skill in "${bundled_skills[@]}"; do
    if [[ -L "$skills_dir/$skill" ]] \
      && [[ "$(readlink "$skills_dir/$skill")" == "../../.agents/skills/$skill" ]]; then
      continue
    fi
    ln -s "../../.agents/skills/$skill" "$skills_dir/$skill"
  done
done

echo "Installed verify-docs into $target_root"
echo "Run: node scripts/document-structure-verifier.mjs"
