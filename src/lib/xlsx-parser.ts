import { read, utils, type WorkBook } from "xlsx"
import { hash } from "@/lib/hash"
import type { DataSource, LMIARecord, ParseError, Quarter } from "@/types"

const EXPECTED_HEADERS = [
  "Province/Territory",
  "Program Stream",
  "Employer",
  "Address",
  "Occupation",
  "Incorporate Status",
  "Approved LMIAs",
  "Approved Positions",
] as const

const ADDRESS_RE = /^(.+?),\s*([A-Z]{2})\s+([A-Z]\d[A-Z]\s?\d[A-Z]\d)\s*$/
const NOC_RE = /^\s*(\d{4,5})\s*-\s*(.+?)\s*$/

function norm(value: unknown): string {
  if (typeof value === "string") {
    return value.trim()
  }
  if (value == null) {
    return ""
  }
  return String(value).trim()
}

function toInt(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value)
  return Number.isFinite(n) ? Math.round(n) : 0
}

function parseOccupation(raw: string): {
  nocCode: string
  occupationTitle: string
} {
  const match = NOC_RE.exec(raw)
  if (!match) {
    return { nocCode: "", occupationTitle: raw }
  }
  return { nocCode: match[1], occupationTitle: match[2] }
}

function parseAddress(raw: string): {
  city: string
  provinceCode: string
  postalCode: string
} {
  const match = ADDRESS_RE.exec(raw)
  if (!match) {
    return { city: raw, provinceCode: "", postalCode: "" }
  }
  return {
    city: match[1].trim(),
    provinceCode: match[2],
    postalCode: match[3].replace(/\s+/g, " "),
  }
}

export interface ParseResult {
  errors: ParseError[]
  records: LMIARecord[]
}

export function parseWorkbook(
  buffer: ArrayBuffer,
  source: DataSource
): ParseResult {
  const errors: ParseError[] = []
  const records: LMIARecord[] = []

  let wb: WorkBook
  try {
    wb = read(buffer, { type: "array" })
  } catch (err) {
    errors.push({
      source: source.filename,
      message: `Failed to read workbook: ${(err as Error).message}`,
    })
    return { records, errors }
  }

  const sheetName = wb.SheetNames.includes("Positive")
    ? "Positive"
    : wb.SheetNames[0]
  if (!sheetName) {
    errors.push({ source: source.filename, message: "Workbook has no sheets" })
    return { records, errors }
  }

  const rows = utils.sheet_to_json<unknown[]>(wb.Sheets[sheetName], {
    header: 1,
    raw: true,
    blankrows: false,
  })

  const headerIndex = rows.findIndex(
    (row) => Array.isArray(row) && norm(row[0]) === "Province/Territory"
  )
  if (headerIndex < 0) {
    errors.push({
      source: source.filename,
      message:
        "Header row not found (expected 'Province/Territory' in column A)",
    })
    return { records, errors }
  }

  const headers = (rows[headerIndex] as unknown[]).map((h) => norm(h))
  const idx = Object.fromEntries(
    EXPECTED_HEADERS.map((h) => [h, headers.indexOf(h)])
  ) as Record<(typeof EXPECTED_HEADERS)[number], number>

  const missing = EXPECTED_HEADERS.filter((h) => idx[h] < 0)
  if (missing.length > 0) {
    errors.push({
      source: source.filename,
      message: `Missing expected columns: ${missing.join(", ")}`,
    })
    return { records, errors }
  }

  for (let r = headerIndex + 1; r < rows.length; r++) {
    const row = rows[r] as unknown[]
    if (!row || (row as unknown[]).every((c) => c == null || norm(c) === "")) {
      continue
    }

    try {
      const employer = norm(row[idx.Employer])
      if (!employer) {
        continue
      }

      const rawAddress = norm(row[idx.Address])
      const rawOccupation = norm(row[idx.Occupation])
      const { nocCode, occupationTitle } = parseOccupation(rawOccupation)
      const { city, provinceCode, postalCode } = parseAddress(rawAddress)

      records.push({
        id: hash(
          `${source.year}|${source.quarter}|${employer}|${rawAddress}|${nocCode}`
        ),
        year: source.year,
        quarter: source.quarter as Quarter,
        province: norm(row[idx["Province/Territory"]]),
        provinceCode,
        city,
        postalCode,
        address: rawAddress,
        employer,
        nocCode,
        occupationTitle,
        programStream: norm(row[idx["Program Stream"]]),
        incorporateStatus: norm(row[idx["Incorporate Status"]]),
        approvedLmias: toInt(row[idx["Approved LMIAs"]]),
        approvedPositions: toInt(row[idx["Approved Positions"]]),
      })
    } catch (err) {
      errors.push({
        source: source.filename,
        message: `Row ${r + 1}: ${(err as Error).message}`,
        row: r + 1,
      })
    }
  }

  return { records, errors }
}
