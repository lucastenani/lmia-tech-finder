import { useMemo, useState } from "react"
import type { LMIARecord } from "@/types"

function readLocationFromUrl(): string {
  return new URLSearchParams(window.location.search).get("location") ?? ""
}

function writeLocationToUrl(province: string) {
  const params = new URLSearchParams(window.location.search)
  if (province) {
    params.set("location", province)
  } else {
    params.delete("location")
  }
  const search = params.toString()
  history.replaceState(
    null,
    "",
    search ? `?${search}` : window.location.pathname
  )
}

export function useLocationFilter(
  records: LMIARecord[],
  allRecords: LMIARecord[]
) {
  const [province, setProvince] = useState(() => readLocationFromUrl())

  const provinces = useMemo(() => {
    const set = new Set(allRecords.map((r) => r.province))
    return Array.from(set).sort()
  }, [allRecords])

  const filtered = useMemo(() => {
    if (!province) {
      return records
    }
    return records.filter((r) => r.province === province)
  }, [records, province])

  function update(value: string) {
    setProvince(value)
    writeLocationToUrl(value)
  }

  return { province, setProvince: update, provinces, filtered }
}
