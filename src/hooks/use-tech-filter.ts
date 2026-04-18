import { useMemo, useState } from "react"
import { isTechNoc } from "@/config/noc-codes"
import type { LMIARecord } from "@/types"

function readTechFromUrl(): boolean {
  const param = new URLSearchParams(window.location.search).get("tech")
  return param === null ? true : param === "1"
}

function writeTechToUrl(enabled: boolean) {
  const params = new URLSearchParams(window.location.search)
  if (enabled) {
    params.delete("tech")
  } else {
    params.set("tech", "0")
  }
  const search = params.toString()
  history.replaceState(
    null,
    "",
    search ? `?${search}` : window.location.pathname
  )
}

export function useTechFilter(records: LMIARecord[]) {
  const [enabled, setEnabled] = useState(() => readTechFromUrl())

  const filtered = useMemo(
    () => (enabled ? records.filter((r) => isTechNoc(r.nocCode)) : records),
    [records, enabled]
  )

  function toggle(value: boolean) {
    setEnabled(value)
    writeTechToUrl(value)
  }

  return { enabled, setEnabled: toggle, filtered }
}
