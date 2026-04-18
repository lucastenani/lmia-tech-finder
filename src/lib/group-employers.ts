import { hash } from "@/lib/hash"
import type { EmployerGroup, LMIARecord } from "@/types"

function pushUnique(arr: string[], value: string): void {
  if (value && !arr.includes(value)) {
    arr.push(value)
  }
}

export function getEmployerKey(employer: string, city: string): string {
  return hash(`${employer.toLowerCase().trim()}|${city.toLowerCase().trim()}`)
}

export function groupByEmployer(records: LMIARecord[]): EmployerGroup[] {
  const groups = new Map<string, EmployerGroup>()

  for (const r of records) {
    const key = `${r.employer.toLowerCase().trim()}|${r.city.toLowerCase().trim()}`
    const period = `${r.year} Q${r.quarter}`
    const existing = groups.get(key)

    if (existing) {
      existing.recordIds.push(r.id)
      if (!existing.nocCodes.includes(r.nocCode)) {
        existing.nocCodes.push(r.nocCode)
        existing.occupationTitles.push(r.occupationTitle)
      }
      pushUnique(existing.programStreams, r.programStream)
      pushUnique(existing.periods, period)
      existing.totalPositions += r.approvedPositions
      existing.totalLmias += r.approvedLmias
      existing.recordCount += 1
    } else {
      groups.set(key, {
        id: hash(key),
        recordIds: [r.id],
        employer: r.employer,
        city: r.city,
        province: r.province,
        provinceCode: r.provinceCode,
        nocCodes: r.nocCode ? [r.nocCode] : [],
        occupationTitles: r.occupationTitle ? [r.occupationTitle] : [],
        programStreams: r.programStream ? [r.programStream] : [],
        periods: [period],
        totalPositions: r.approvedPositions,
        totalLmias: r.approvedLmias,
        recordCount: 1,
      })
    }
  }

  return Array.from(groups.values())
}
