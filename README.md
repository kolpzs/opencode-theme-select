# opencode-theme-select

A tiny [opencode](https://opencode.ai) **v2** plugin that adds a `/theme-select` command with an interactive picker: choose a theme from a menu and it is written straight to the project's `tui.json` — **no model round-trip needed**.

## Features

- `/theme-select` — opens an interactive menu listing available themes (built-in + custom) with the current one marked.
- Picking a theme writes it to the project's `tui.json` (the directory opencode was launched in).
- Discovers custom themes from `~/.config/opencode/themes/*.json` and `<project>/.opencode/themes/*.json`.
- Writes/updates `tui.json` while preserving other keys and comments.
- Also ships as a standalone CLI (`theme-select`) for use outside opencode.

## How it works

This is an OpenCode v2 TUI plugin (`@opencode/plugin/tui`). It registers a slash command through `context.keymap.layer` and shows the picker with `context.ui.dialog.select`. On selection it writes the theme to the project's `tui.json` and confirms with a toast — all deterministic, with no model involvement.

## Install

Add to your `opencode.json` (global `~/.config/opencode/opencode.json` or project):

```json
{
  "plugin": ["opencode-theme-select"]
}
```

Restart opencode — the package is installed automatically and the TUI entrypoint is loaded from its `./tui` export.

## Usage

1. Type `/theme-select`.
2. Pick a theme from the menu — it is written to `tui.json` and applied.

> The theme is per opencode instance, not per tab/session.

## Standalone CLI

The package also exposes a `theme-select` binary:

```bash
npx theme-select            # list themes + current
npx theme-select <name>     # set a theme
npx theme-select pick       # interactive picker in the terminal
```

## License

MIT
