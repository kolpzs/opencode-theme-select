import type { Plugin } from "@opencode-ai/plugin"
import path from "node:path"
import { fileURLToPath } from "node:url"

const here = path.dirname(fileURLToPath(import.meta.url))
const script = path.join(here, "..", "bin", "theme-select.sh")

export const ThemeSelectPlugin: Plugin = async () => {
  return {
    config: (cfg) => {
      const commands = (cfg.command ??= {})
      commands["theme-select"] = {
        description:
          "List or apply an opencode theme (built-in or custom) to the project's tui.json",
        template: [
          "Relay the output below verbatim to the user. Do not add commentary.",
          "",
          `!\`bash "${script}" "$1"\``,
        ].join("\n"),
      }
    },
  }
}

export default ThemeSelectPlugin
