import { useMemo, useState } from "react"
import type { LMIARecord } from "@/types"

function readQueryFromUrl(): string {
  return new URLSearchParams(window.location.search).get("q") ?? ""
}

function writeQueryToUrl(query: string) {
  const params = new URLSearchParams(window.location.search)
  if (query) {
    params.set("q", query)
  } else {
    params.delete("q")
  }
  const search = params.toString()
  history.replaceState(
    null,
    "",
    search ? `?${search}` : window.location.pathname
  )
}

export function useSearchFilter(records: LMIARecord[]) {
  const [query, setQuery] = useState(() => readQueryFromUrl())

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      return records
    }
    return records.filter(
      (r) =>
        r.employer.toLowerCase().includes(q) ||
        r.nocCode.toLowerCase().includes(q) ||
        r.occupationTitle.toLowerCase().includes(q)
    )
  }, [records, query])

  function update(value: string) {
    setQuery(value)
    writeQueryToUrl(value)
  }

  return { query, setQuery: update, filtered }
}
