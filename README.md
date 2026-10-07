# opencode-theme-select

A tiny [opencode](https://opencode.ai) plugin that adds a `/theme-select` command to list and apply themes (built-in or custom) by writing directly to the project's `tui.json` — **no model round-trip needed**.

## Features

- `/theme-select` — list available themes (built-in + custom) and the current one.
- `/theme-select <name>` — apply a theme directly (e.g. `/theme-select matrix`).
- Discovers custom themes from `~/.config/opencode/themes/*.json` and `<project>/.opencode/themes/*.json`.
- Writes/updates the project's `tui.json` while preserving other keys and comments.
- Also ships as a standalone CLI (`theme-select`) for use outside opencode.

## How it works

The plugin injects the `/theme-select` command at startup. The command shells out to a bundled bash script via the `!`...`` command feature, so the theme is written deterministically and instantly — the model is only used to relay the result back to you.

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
2. Type `/theme-select` (list + current) or `/theme-select tokyonight` (apply).
3. Restart opencode once more for the TUI colors to update (the theme is read at startup).

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
