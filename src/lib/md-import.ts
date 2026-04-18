import type { ContactEntry } from "@/store/applied-store"

const TRAILER_RE = /<!--\s*(id:\S+(?:\s+[a-z]+:\S+)*)\s*-->/g

export type ImportResult = {
  entries: Record<string, ContactEntry>
  count: number
}

export function parseMarkdown(md: string): ImportResult {
  const entries: Record<string, ContactEntry> = {}
  TRAILER_RE.lastIndex = 0

  let match: RegExpExecArray | null
  while ((match = TRAILER_RE.exec(md)) !== null) {
    const tokens = match[1].split(/\s+/)
    let id: string | null = null
    const entry: ContactEntry = {}

    for (const token of tokens) {
      const [key, ...valueParts] = token.split(":")
      const value = valueParts.join(":")
      if (!value) {
        continue
      }
      if (key === "id") {
        id = value
      } else if (key === "emailed") {
        entry.emailedAt = value
      } else if (key === "linkedin") {
        entry.linkedInAt = value
      }
    }

    if (id && (entry.emailedAt || entry.linkedInAt)) {
      entries[id] = { ...entries[id], ...entry }
    }
  }

  return { entries, count: Object.keys(entries).length }
}
