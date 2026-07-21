#!/usr/bin/env bash
set -euo pipefail

usage() {
  printf 'Usage: %s init\n' "$(basename "$0")" >&2
}

log() {
  printf 'workspace-setup: %s\n' "$*"
}

resolve_script_dir() {
  local source="${BASH_SOURCE[0]}"

  while [ -L "$source" ]; do
    local dir
    dir="$(cd -P "$(dirname "$source")" >/dev/null 2>&1 && pwd)"
    source="$(readlink "$source")"
    [[ "$source" != /* ]] && source="$dir/$source"
  done

  cd -P "$(dirname "$source")" >/dev/null 2>&1 && pwd
}

resolve_target_root() {
  if [ -n "${WORKSPACE_TARGET_PATH:-}" ]; then
    printf '%s\n' "$WORKSPACE_TARGET_PATH"
    return
  fi

  local git_root
  if git_root="$(git rev-parse --show-toplevel 2>/dev/null)"; then
    printf '%s\n' "$git_root"
    return
  fi

  resolve_script_dir
}

source_from_git_common_dir() {
  local target="$1"
  local common_dir
  common_dir="$(git -C "$target" rev-parse --git-common-dir 2>/dev/null || true)"
  [ -n "$common_dir" ] || return 0

  case "$common_dir" in
    /*) ;;
    *) common_dir="$target/$common_dir" ;;
  esac

  cd "$common_dir/.." >/dev/null 2>&1 && pwd -P
}

find_source_root() {
  local target="$1"
  local candidate

  for candidate in \
    "${WORKSPACE_SOURCE_PATH:-}" \
    "$(source_from_git_common_dir "$target")"; do
    [ -n "$candidate" ] || continue
    [ -d "$candidate" ] || continue
    candidate="$(cd "$candidate" >/dev/null 2>&1 && pwd -P)"
    [ "$candidate" != "$target" ] || continue
    git -C "$candidate" rev-parse --is-inside-work-tree >/dev/null 2>&1 || continue
    printf '%s\n' "$candidate"
    return
  done
}

copy_included_files() {
  local source="$1"
  local target="$2"
  local include_file="$target/.worktreeinclude"
  local copied=0

  # Managed tools normally perform this copy. The target's policy must win so
  # a source checkout cannot reintroduce credentials excluded by this branch.
  # Missing-only copies also preserve any per-worktree local values.
  while IFS= read -r -d '' relative_path; do
    [ -e "$source/$relative_path" ] || continue
    [ ! -e "$target/$relative_path" ] || continue
    [ ! -L "$source/$relative_path" ] || continue

    mkdir -p "$target/$(dirname "$relative_path")"
    cp -p "$source/$relative_path" "$target/$relative_path"
    copied=$((copied + 1))
  done < <(
    git -C "$source" ls-files \
      --others \
      --ignored \
      --exclude-from="$include_file" \
      -z
  )

  if [ "$copied" -gt 0 ]; then
    log "copied $copied ignored local file(s) from the source checkout"
  fi
}

install_dependencies() {
  if command -v pnpm >/dev/null 2>&1; then
    pnpm install --frozen-lockfile
    return
  fi

  if command -v corepack >/dev/null 2>&1; then
    corepack pnpm install --frozen-lockfile
    return
  fi

  printf 'workspace-setup: pnpm is required. Install pnpm or enable Corepack, then retry.\n' >&2
  return 1
}

init_workspace() {
  local target
  target="$(resolve_target_root)"

  if [ ! -d "$target" ]; then
    printf 'workspace-setup: target path does not exist: %s\n' "$target" >&2
    return 1
  fi

  target="$(cd "$target" >/dev/null 2>&1 && pwd -P)"
  cd "$target"

  if [ ! -f package.json ] || [ ! -f pnpm-lock.yaml ]; then
    printf 'workspace-setup: expected package.json and pnpm-lock.yaml in %s\n' "$target" >&2
    return 1
  fi

  local source
  source="$(find_source_root "$target" || true)"
  if [ -n "$source" ] && [ -f .worktreeinclude ]; then
    copy_included_files "$source" "$target"
  fi

  if [ ! -e .env.local ]; then
    log ".env.local is absent; development will use GitHub's anonymous API rate limit"
  fi

  if [ "${WORKSPACE_SETUP_SKIP_INSTALL:-0}" = "1" ]; then
    log "skipping dependency installation"
    return
  fi

  install_dependencies
}

case "${1:-}" in
  init)
    init_workspace
    ;;
  *)
    usage
    exit 64
    ;;
esac
