# opencode-theme-select

A tiny [opencode](https://opencode.ai) plugin that adds a `/theme-select` command with an interactive picker: choose a theme from a menu and it is written straight to the project's `tui.json` — **no model round-trip needed**.

## Features

- `/theme-select` — opens an interactive menu listing available themes (built-in + custom) with the current one marked.
- Picking a theme writes it to the project's `tui.json` and applies it immediately.
- Discovers custom themes from `~/.config/opencode/themes/*.json` and `<project>/.opencode/themes/*.json`.
- Writes/updates `tui.json` while preserving other keys and comments.
- Also ships as a standalone CLI (`theme-select`) for use outside opencode.

## How it works

The plugin registers a TUI command (`api.command.register`) that opens a `DialogSelect` menu. On selection it writes the theme to the project's `tui.json` (git root, falling back to the current directory) and calls `api.theme.set` to apply it instantly — all deterministic, with no model involvement.

## Install

Add to your `opencode.json` (global `~/.config/opencode/opencode.json` or project):

```json
{
  "plugin": ["opencode-theme-select"]
}
```

opencode installs the package via Bun on startup.

### Optional: CLI

To use it directly in your terminal (no opencode needed):

```bash
npm install -g opencode-theme-select
theme-select pick
```

Or run it without installing:

```bash
npx opencode-theme-select pick
```

Or invoke the script directly:

```bash
bash bin/theme-select.sh pick
```

## Usage

1. Restart opencode.
2. Type `/theme-select`.
3. Pick a theme from the menu — it is written to `tui.json` and applied immediately.

> The theme is per opencode instance, not per tab/session.

## CLI reference

```
theme-select            # list themes + current
theme-select list       # same
theme-select <name>     # apply a theme
theme-select set <name> # same
theme-select current    # print current theme
theme-select pick       # interactive menu
```

## Fallback command

If the injected command doesn't appear in your setup, copy `command/theme-select.md` to `~/.config/opencode/commands/` (or `.opencode/commands/`) and make sure the `theme-select` CLI is on your `PATH`.

## Publishing to npm

```bash
npm login
npm publish
```

## License

MIT
