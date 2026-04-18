export type Quarter = 1 | 2 | 3 | 4

export interface LMIARecord {
  address: string
  approvedLmias: number
  approvedPositions: number
  city: string
  employer: string
  id: string
  incorporateStatus: string
  nocCode: string
  occupationTitle: string
  postalCode: string
  programStream: string
  province: string
  provinceCode: string
  quarter: Quarter
  year: number
}

export interface DataSource {
  filename: string
  path: string
  quarter: Quarter
  year: number
}

export interface Manifest {
  files: DataSource[]
}

export interface ParseError {
  message: string
  row?: number
  source: string
}

export interface LoadResult {
  errors: ParseError[]
  records: LMIARecord[]
  sources: DataSource[]
}

export type EmployerGroup = {
  id: string
  recordIds: string[]
  employer: string
  city: string
  province: string
  provinceCode: string
  nocCodes: string[]
  occupationTitles: string[]
  programStreams: string[]
  periods: string[]
  totalPositions: number
  totalLmias: number
  recordCount: number
}
