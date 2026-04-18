import { mkdir, readdir, writeFile } from "node:fs/promises"
import path from "node:path"

const DATA_DIR = path.join(process.cwd(), "public", "data")
const MANIFEST_PATH = path.join(DATA_DIR, "manifest.json")
const PATTERN = /^(\d{4})_Q([1-4])\.xlsx$/i

async function main() {
  await mkdir(DATA_DIR, { recursive: true })

  const entries = await readdir(DATA_DIR)
  const files = entries
    .map((name) => {
      const match = name.match(PATTERN)
      if (!match) {
        return null
      }
      return {
        filename: name,
        path: `/data/${name}`,
        year: Number(match[1]),
        quarter: Number(match[2]),
      }
    })
    .filter(Boolean)
    .sort((a, b) => b.year - a.year || b.quarter - a.quarter)

  await writeFile(MANIFEST_PATH, `${JSON.stringify({ files }, null, 2)}\n`)
  console.log(`[manifest] wrote ${files.length} entries to ${MANIFEST_PATH}`)
}

main().catch((err) => {
  console.error("[manifest] failed:", err)
  process.exit(1)
})
