import { useMemo, useState } from "react"
import { isTechNoc } from "@/config/noc-codes"
import type { LMIARecord } from "@/types"

export function useTechFilter(records: LMIARecord[]) {
  const [enabled, setEnabled] = useState(true)

  const filtered = useMemo(
    () => (enabled ? records.filter((r) => isTechNoc(r.nocCode)) : records),
    [records, enabled]
  )

  return { enabled, setEnabled, filtered }
}
