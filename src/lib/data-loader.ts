import { parseWorkbook } from "@/lib/xlsx-parser"
import type { DataSource, LoadResult, Manifest, ParseError } from "@/types"

async function fetchManifest(): Promise<Manifest> {
  const res = await fetch("/data/manifest.json", { cache: "no-cache" })
  if (!res.ok) {
    throw new Error(`Failed to fetch manifest: ${res.status} ${res.statusText}`)
  }
  return (await res.json()) as Manifest
}

async function loadSource(source: DataSource): Promise<LoadResult> {
  try {
    const res = await fetch(source.path, { cache: "force-cache" })
    if (!res.ok) {
      return {
        records: [],
        errors: [
          {
            source: source.filename,
            message: `Fetch failed: ${res.status} ${res.statusText}`,
          },
        ],
        sources: [],
      }
    }
    const buffer = await res.arrayBuffer()
    const { records, errors } = parseWorkbook(buffer, source)
    return { records, errors, sources: [source] }
  } catch (err) {
    return {
      records: [],
      errors: [{ source: source.filename, message: (err as Error).message }],
      sources: [],
    }
  }
}

export async function loadAllData(): Promise<LoadResult> {
  const manifest = await fetchManifest()
  const results = await Promise.all(manifest.files.map(loadSource))

  const records = results.flatMap((r) => r.records)
  const errors: ParseError[] = results.flatMap((r) => r.errors)
  const sources = results.flatMap((r) => r.sources)

  return { records, errors, sources }
}
