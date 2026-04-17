export interface NocCode {
  code: string
  title: string
}

export const TECH_NOC_CODES: NocCode[] = [
  { code: "20012", title: "Computer and information systems managers" },
  { code: "21211", title: "Data scientists" },
  { code: "21221", title: "Business systems specialists" },
  { code: "21222", title: "Information systems specialists" },
  { code: "21223", title: "Database analysts and data administrators" },
  { code: "21230", title: "Computer systems developers and programmers" },
  { code: "21231", title: "Software engineers and designers" },
  { code: "21232", title: "Software developers and programmers" },
  { code: "21233", title: "Web designers" },
  { code: "21234", title: "Web developers and programmers" },
  { code: "21311", title: "Computer engineers (except software)" },
  { code: "22220", title: "Computer network and web technicians" },
  { code: "22221", title: "User support technicians" },
  { code: "22222", title: "Information systems testing technicians" },
]

export const TECH_NOC_CODE_SET: ReadonlySet<string> = new Set(
  TECH_NOC_CODES.map((n) => n.code)
)

export function isTechNoc(code: string): boolean {
  return TECH_NOC_CODE_SET.has(code)
}
