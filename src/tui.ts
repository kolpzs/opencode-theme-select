import type { Plugin } from "@opencode/plugin/tui"
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises"
import path from "node:path"
import os from "node:os"

const BUILTIN_THEMES = [
  "opencode",
  "system",
  "tokyonight",
  "everforest",
  "ayu",
  "catppuccin",
  "catppuccin-macchiato",
  "gruvbox",
  "kanagawa",
  "nord",
  "matrix",
  "one-dark",
]

async function discoverCustomThemes(targetDir: string): Promise<string[]> {
  const dirs = [
    path.join(os.homedir(), ".config", "opencode", "themes"),
    path.join(targetDir, ".opencode", "themes"),
  ]
  const names: string[] = []
  for (const dir of dirs) {
    try {
      for (const entry of await readdir(dir)) {
        if (entry.endsWith(".json") || entry.endsWith(".jsonc")) {
          names.push(entry.replace(/\.(json|jsonc)$/i, ""))
        }
      }
    } catch {
      // theme directory does not exist
    }
  }
  return names
}

async function listThemes(targetDir: string): Promise<string[]> {
  const custom = await discoverCustomThemes(targetDir)
  return Array.from(new Set([...BUILTIN_THEMES, ...custom])).sort()
}

async function readCurrent(file: string): Promise<string | undefined> {
  try {
    const text = await readFile(file, "utf8")
    return text.match(/"theme"\s*:\s*"([^"]*)"/)?.[1]
  } catch {
    return undefined
  }
}

function injectTheme(text: string, theme: string): string {
  const keyRe = /("theme"\s*:\s*)"[^"]*"/
  if (keyRe.test(text)) {
    return text.replace(keyRe, (_m, p1: string) => `${p1}"${theme}"`)
  }
  const trimmed = text.trimEnd()
  if (trimmed.endsWith("}")) {
    return `${trimmed.slice(0, -1)},\n  "theme": "${theme}"\n}\n`
  }
  return `{\n  "theme": "${theme}"\n}\n`
}

async function writeTheme(targetDir: string, theme: string): Promise<string> {
  await mkdir(targetDir, { recursive: true })
  const file = path.join(targetDir, "tui.json")
  let text = ""
  let exists = true
  try {
    text = await readFile(file, "utf8")
  } catch {
    exists = false
  }
  if (exists) {
    await writeFile(file, injectTheme(text, theme))
  } else {
    await writeFile(
      file,
      `{\n  "$schema": "https://opencode.ai/tui.json",\n  "theme": "${theme}"\n}\n`,
    )
  }
  return file
}

export default {
  id: "opencode-theme-select",
  setup(context: Plugin.Context) {
    context.keymap.layer(() => ({
      commands: [
        {
          id: "theme-select",
          title: "Select theme",
          description: "Apply a theme to this project's tui.json",
          slash: { name: "theme-select" },
          run: async () => {
            const dir = (context.location ?? context.data.location.default()).directory
            const themes = await listThemes(dir)
            const current = await readCurrent(path.join(dir, "tui.json"))

            const value = await context.ui.dialog.select<string>({
              title: "Select theme",
              options: themes.map((name) => ({
                title: name,
                value: name,
                description: name === current ? "current" : undefined,
              })),
              current,
            })
            if (!value) return

            try {
              const file = await writeTheme(dir, value)
              context.ui.toast.show({
                variant: "success",
                message: `Theme set to "${value}" (${file})`,
              })
            } catch (err) {
              context.ui.toast.show({
                variant: "error",
                message: `Failed to set theme: ${String(err)}`,
              })
            }
          },
        },
      ],
    }))
  },
}
