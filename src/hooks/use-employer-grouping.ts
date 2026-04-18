import { useMemo, useState } from "react"
import { groupByEmployer } from "@/lib/group-employers"
import type { EmployerGroup, LMIARecord } from "@/types"

function readGroupedFromUrl(): boolean {
  return new URLSearchParams(window.location.search).get("grouped") === "1"
}

function writeGroupedToUrl(enabled: boolean) {
  const params = new URLSearchParams(window.location.search)
  if (enabled) {
    params.set("grouped", "1")
  } else {
    params.delete("grouped")
  }
  const search = params.toString()
  history.replaceState(
    null,
    "",
    search ? `?${search}` : window.location.pathname
  )
}

export function useEmployerGrouping(records: LMIARecord[]) {
  const [enabled, setEnabled] = useState(() => readGroupedFromUrl())

  const groups: EmployerGroup[] = useMemo(
    () => (enabled ? groupByEmployer(records) : []),
    [records, enabled]
  )

  function toggle(value: boolean) {
    setEnabled(value)
    writeGroupedToUrl(value)
  }

  return { enabled, setEnabled: toggle, groups }
}
