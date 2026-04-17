export interface LMIARecord {
  id: string
}

export type ApplicationState = Record<string, { emailedAt: string }>
