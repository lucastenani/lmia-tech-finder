import { useMemo, useState } from "react"
import { groupByEmployer } from "@/lib/group-employers"
import type { EmployerGroup, LMIARecord } from "@/types"

export function useEmployerGrouping(records: LMIARecord[]) {
  const [enabled, setEnabled] = useState(false)

  const groups: EmployerGroup[] = useMemo(
    () => (enabled ? groupByEmployer(records) : []),
    [records, enabled]
  )

  return { enabled, setEnabled, groups }
}
