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
    if [[ -f "$script_dir/.verify-docs/scripts/verify-docs.mjs" ]]; then
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

runtime_root="$source_root/.verify-docs"

if [[ ! -f "$runtime_root/scripts/verify-docs.mjs" ]]; then
  echo "verify-docs package not found at: $source_root" >&2
  exit 1
fi

skill_names=(verify-docs dedupe-docs tighten-docs)

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

record_file_conflicts() {
  local source_path="$1" target_path="$2" relative_path source_file target_file
  while IFS= read -r -d '' source_file; do
    relative_path="${source_file#"$source_path/"}"
    target_file="$target_path/$relative_path"
    if [[ -e "$target_file" ]] && ! cmp -s "$source_file" "$target_file"; then
      conflicts+=("${target_file#"$target_root/"}")
    fi
  done < <(find "$source_path" -type f -print0)
}

copy_missing_files() {
  local source_path="$1" target_path="$2" relative_path source_file target_file
  while IFS= read -r -d '' source_file; do
    relative_path="${source_file#"$source_path/"}"
    target_file="$target_path/$relative_path"
    if [[ ! -e "$target_file" ]]; then
      mkdir -p "$(dirname "$target_file")"
      cp "$source_file" "$target_file"
    fi
  done < <(find "$source_path" -type f -print0)
}

record_file_conflicts "$runtime_root" "$target_root/.verify-docs"

for skill_name in "${skill_names[@]}"; do
  source_skill="$source_root/.agents/skills/$skill_name"
  target_skill="$target_root/.agents/skills/$skill_name"
  if [[ -e "$target_skill" ]] && ! diff -qr "$source_skill" "$target_skill" >/dev/null; then
    conflicts+=(".agents/skills/$skill_name")
  fi
done

for agent_dir in .claude .kiro; do
  skills_dir="$target_root/$agent_dir/skills"
  if [[ -L "$skills_dir" && "$(readlink "$skills_dir")" != "../.agents/skills" ]]; then
    conflicts+=("$agent_dir/skills (unsupported existing symlink)")
    continue
  fi
  if [[ -L "$skills_dir" ]]; then
    continue
  fi
  for skill_name in "${skill_names[@]}"; do
    source_skill="$source_root/.agents/skills/$skill_name"
    target_skill="$skills_dir/$skill_name"
    if [[ -L "$target_skill" && "$(readlink "$target_skill")" == "../../.agents/skills/$skill_name" ]]; then
      continue
    fi
    if [[ -e "$target_skill" || -L "$target_skill" ]]; then
      if [[ -d "$target_skill" ]] && diff -qr "$source_skill" "$target_skill" >/dev/null; then
        continue
      fi
      conflicts+=("$agent_dir/skills/$skill_name")
    fi
  done
done

if ((${#conflicts[@]})); then
  echo "verify-docs installation stopped; these files already exist with different contents:" >&2
  printf '  %s\n' "${conflicts[@]}" >&2
  echo "Review or move the conflicting files, then run the installer again." >&2
  exit 1
fi

copy_missing_files "$runtime_root" "$target_root/.verify-docs"

for skill_name in "${skill_names[@]}"; do
  copy_missing_files "$source_root/.agents/skills/$skill_name" "$target_root/.agents/skills/$skill_name"
done

ensure_work_record_ignore

for agent_dir in .claude .kiro; do
  skills_dir="$target_root/$agent_dir/skills"
  if [[ -L "$skills_dir" && "$(readlink "$skills_dir")" == "../.agents/skills" ]]; then
    continue
  fi
  mkdir -p "$skills_dir"
  for skill_name in "${skill_names[@]}"; do
    alias="$skills_dir/$skill_name"
    if [[ ! -e "$alias" && ! -L "$alias" ]]; then
      ln -s "../../.agents/skills/$skill_name" "$alias"
    fi
  done
done

echo "Installed verify-docs into $target_root"
echo "Run: node .verify-docs/scripts/verify-docs.mjs"
