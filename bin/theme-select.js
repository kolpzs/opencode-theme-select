#!/usr/bin/env node
import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import path from "node:path"

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), "theme-select.sh")
const result = spawnSync("bash", [script, ...process.argv.slice(2)], { stdio: "inherit" })
process.exit(result.status ?? 1)
