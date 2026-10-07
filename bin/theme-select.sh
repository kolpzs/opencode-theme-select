#!/usr/bin/env bash
set -euo pipefail

HOME_DIR="${HOME:-$HOME}"
GLOBAL_THEMES="$HOME_DIR/.config/opencode/themes"
PROJECT_THEMES=".opencode/themes"
TUI="tui.json"

BUILTIN="opencode system tokyonight everforest ayu catppuccin catppuccin-macchiato gruvbox kanagawa nord matrix one-dark"

list_custom_themes() {
  local d f
  for d in "$GLOBAL_THEMES" "$PROJECT_THEMES"; do
    [ -d "$d" ] || continue
    for f in "$d"/*.json "$d"/*.jsonc; do
      [ -e "$f" ] || continue
      basename "$f" | sed -E 's/\.(json|jsonc)$//I'
    done
  done
}

all_themes() {
  { printf '%s\n' $BUILTIN; list_custom_themes; } | sort -u
}

current_theme() {
  if [ -f "$TUI" ] && grep -qE '^[[:space:]]*"theme"[[:space:]]*:' "$TUI"; then
    grep -E '^[[:space:]]*"theme"[[:space:]]*:' "$TUI" | head -n1 | sed -E 's/.*:[[:space:]]*"([^"]*)".*/\1/'
  fi
}

do_list() {
  local cur
  cur="$(current_theme || true)"
  echo "Available themes (built-in + custom):"
  all_themes | sed 's/^/  - /'
  echo ""
  echo "Current theme: ${cur:-none}"
  echo "File: $PWD/$TUI"
}

do_set() {
  local theme="$1"
  if ! all_themes | grep -qxF "$theme"; then
    echo "Unknown theme: \"$theme\"" >&2
    echo "Available themes:" >&2
    all_themes | sed 's/^/  - /' >&2
    return 1
  fi

  if [ -f "$TUI" ]; then
    if grep -qE '^[[:space:]]*"theme"[[:space:]]*:' "$TUI"; then
      sed -i -E 's/("theme"[[:space:]]*:[[:space:]]*)"[^"]*"/\1"'"$theme"'"/' "$TUI"
    else
      sed -i -E '$ s/\}[[:space:]]*$/,\n  "theme": "'"$theme"'"\n}/' "$TUI"
    fi
  else
    printf '{\n  "$schema": "https://opencode.ai/tui.json",\n  "theme": "%s"\n}\n' "$theme" > "$TUI"
  fi

  echo "Theme set to \"$theme\"."
  echo "File: $PWD/$TUI"
  echo "Restart opencode to apply the change."
}

interactive_pick() {
  local -a themes
  mapfile -t themes < <(all_themes)
  echo "Select a theme:"
  local i=1
  for t in "${themes[@]}"; do
    printf '  %d) %s\n' "$i" "$t"
    i=$((i+1))
  done
  printf 'Choice [1-%d]: ' "${#themes[@]}"
  local choice
  read -r choice
  if ! [[ "$choice" =~ ^[0-9]+$ ]] || (( choice < 1 || choice > ${#themes[@]} )); then
    echo "Invalid choice." >&2
    return 1
  fi
  do_set "${themes[$((choice-1))]}"
}

case "${1:-}" in
  ""|list|ls)
    do_list
    ;;
  set)
    [ $# -ge 2 ] || { echo "Usage: theme-select set <theme>" >&2; exit 1; }
    do_set "$2"
    ;;
  current)
    echo "${current_theme:-none}"
    ;;
  pick|select|i)
    interactive_pick
    ;;
  -h|--help|help)
    cat <<'EOF'
Usage: theme-select [command] [theme]

Commands:
  (none)       list available themes and the current one
  list         same as above
  set <theme>  apply a theme to tui.json
  current      print the current theme
  pick         interactive menu
  <theme>      shorthand for set <theme>
EOF
    ;;
  *)
    do_set "$1"
    ;;
esac
