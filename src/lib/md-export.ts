import type { ContactEntry } from "@/store/applied-store"
import type { LMIARecord } from "@/types"

function escape(text: string): string {
  return text.replace(/([*_`[\]])/g, "\\$1")
}

function mostRecent(entry: ContactEntry): string {
  return (
    [entry.emailedAt, entry.linkedInAt]
      .filter((v): v is string => Boolean(v))
      .sort()
      .at(-1) ?? ""
  )
}

function channelLabels(entry: ContactEntry): string {
  const parts: string[] = []
  if (entry.emailedAt) {
    parts.push("Email")
  }
  if (entry.linkedInAt) {
    parts.push("LinkedIn")
  }
  return parts.join(", ")
}

export function exportToMarkdown(
  applied: Record<string, ContactEntry>,
  records: LMIARecord[]
): string {
  const recordById = new Map(records.map((r) => [r.id, r]))
  const rows = Object.entries(applied)
    .map(([id, entry]) => ({ id, entry, record: recordById.get(id) }))
    .filter(
      (x): x is { id: string; entry: ContactEntry; record: LMIARecord } =>
        !!x.record
    )

  const byDate = new Map<string, typeof rows>()
  for (const row of rows) {
    const date = mostRecent(row.entry).slice(0, 10) || "undated"
    const bucket = byDate.get(date) ?? []
    bucket.push(row)
    byDate.set(date, bucket)
  }

  const dates = Array.from(byDate.keys()).sort().reverse()
  const today = new Date().toISOString().slice(0, 10)
  const emailed = rows.filter((r) => r.entry.emailedAt).length
  const linkedin = rows.filter((r) => r.entry.linkedInAt).length

  const header = [
    "# Applied Companies — LMIA Tech Finder",
    "",
    `_Exported: ${today}_`,
    "",
    `Totals: ${rows.length} ${rows.length === 1 ? "company" : "companies"} · ${emailed} emailed · ${linkedin} LinkedIn`,
    "",
    "<!-- This file is the source of truth for your tracking. Keep it safe and re-import to restore state. -->",
    "",
  ].join("\n")

  const body = dates
    .map((date) => {
      const bucket = byDate.get(date) ?? []
      const lines = bucket
        .map(({ id, entry, record: r }) => {
          const location = [r.city, r.provinceCode || r.province]
            .filter(Boolean)
            .join(", ")
          const noc = r.nocCode
            ? `\`${r.nocCode}\` ${escape(r.occupationTitle)}`
            : escape(r.occupationTitle)
          const positions = `${r.approvedPositions} position${r.approvedPositions === 1 ? "" : "s"}`
          const channels = channelLabels(entry)
          const trailer = [
            `id:${id}`,
            entry.emailedAt ? `emailed:${entry.emailedAt}` : null,
            entry.linkedInAt ? `linkedin:${entry.linkedInAt}` : null,
          ]
            .filter(Boolean)
            .join(" ")
          return `- **${escape(r.employer)}** — ${noc} (${escape(location)}) — ${escape(r.programStream)}, ${positions} — _${channels}_ <!-- ${trailer} -->`
        })
        .join("\n")
      return `## ${date}\n\n${lines}\n`
    })
    .join("\n")

  return `${header}\n${body}`
}

export function downloadMarkdown(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
