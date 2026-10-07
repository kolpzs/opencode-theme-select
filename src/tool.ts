import { tool } from "@opencode-ai/plugin"
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

async function discoverCustomThemes(dirs: string[]): Promise<string[]> {
  const names: string[] = []
  for (const dir of dirs) {
    try {
      const entries = await readdir(dir)
      for (const entry of entries) {
        if (entry.endsWith(".json") || entry.endsWith(".jsonc")) {
          names.push(entry.replace(/\.(json|jsonc)$/i, ""))
        }
      }
    } catch {
      // diretório de temas não existe: ignora
    }
  }
  return names
}

async function readTui(file: string): Promise<{ text: string; exists: boolean }> {
  try {
    return { text: await readFile(file, "utf8"), exists: true }
  } catch {
    return { text: "", exists: false }
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

async function applyTheme(dir: string, theme: string) {
  await mkdir(dir, { recursive: true })
  const file = path.join(dir, "tui.json")
  const { text, exists } = await readTui(file)
  if (exists) {
    await writeFile(file, injectTheme(text, theme))
    return { file, created: false }
  }
  const content = `{\n  "$schema": "https://opencode.ai/tui.json",\n  "theme": "${theme}"\n}\n`
  await writeFile(file, content)
  return { file, created: true }
}

export const themeSelect = tool({
  description:
    "Lista ou aplica temas do opencode no projeto atual, gravando o tui.json. Sem o argumento `theme`, lista os temas disponíveis (built-in + custom) e o tema atual. Com `theme`, grava o tema no tui.json do projeto.",
  args: {
    theme: tool.schema
      .string()
      .optional()
      .describe("Nome do tema a aplicar. Omita para listar os temas disponíveis."),
  },
  async execute(args, context) {
    const targetDir = context.worktree || context.directory
    const home = os.homedir()
    const customDirs = [
      path.join(home, ".config", "opencode", "themes"),
      path.join(targetDir, ".opencode", "themes"),
    ]
    const custom = await discoverCustomThemes(customDirs)
    const all = Array.from(new Set([...BUILTIN_THEMES, ...custom])).sort()

    if (args.theme) {
      if (!all.includes(args.theme)) {
        return `Tema "${args.theme}" não encontrado.\n\nTemas disponíveis:\n${all.map((t) => `- ${t}`).join("\n")}`
      }
      const { file, created } = await applyTheme(targetDir, args.theme)
      return `Tema "${args.theme}" aplicado em ${file}${created ? " (arquivo criado)" : ""}.\nReinicie o opencode para ver a mudança.`
    }

    const { text, exists } = await readTui(path.join(targetDir, "tui.json"))
    let current = "(nenhum definido)"
    if (exists) {
      const m = text.match(/"theme"\s*:\s*"([^"]*)"/)
      if (m) current = m[1]
    }

    return [
      "Temas disponíveis (built-in + custom):",
      ...all.map((t) => `- ${t}`),
      "",
      `Tema atual: ${current}`,
      `Arquivo: ${path.join(targetDir, "tui.json")}`,
    ].join("\n")
  },
})
