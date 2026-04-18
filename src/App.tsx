import { CircleNotch } from "@phosphor-icons/react"
import { ExportMdButton } from "@/components/export/export-md-button"
import { ImportMdDialog } from "@/components/export/import-md-dialog"
import { columns } from "@/components/table/columns"
import { employerColumns } from "@/components/table/employer-columns"
import { LMIATable } from "@/components/table/lmia-table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Toaster } from "@/components/ui/sonner"
import { Switch } from "@/components/ui/switch"
import { useEmployerGrouping } from "@/hooks/use-employer-grouping"
import { useLMIAData } from "@/hooks/use-lmia-data"
import { useLocationFilter } from "@/hooks/use-location-filter"
import { useSearchFilter } from "@/hooks/use-search-filter"
import { useTechFilter } from "@/hooks/use-tech-filter"
import { useAppliedStore } from "@/store/applied-store"
import type { LMIARecord } from "@/types"

export default function App() {
  const state = useLMIAData()
  const records = state.status === "ready" ? state.data.records : []
  const {
    enabled: techOnly,
    setEnabled: setTechOnly,
    filtered: techFiltered,
  } = useTechFilter(records)
  const {
    query,
    setQuery,
    filtered: searchFiltered,
  } = useSearchFilter(techFiltered)
  const { province, setProvince, provinces, filtered } = useLocationFilter(
    searchFiltered,
    records
  )
  const {
    enabled: grouped,
    setEnabled: setGrouped,
    groups,
  } = useEmployerGrouping(filtered)
  const applied = useAppliedStore((s) => s.applied)

  const emailedCount = Object.values(applied).filter((e) => e.emailedAt).length
  const linkedinCount = Object.values(applied).filter(
    (e) => e.linkedInAt
  ).length

  const dimContacted = (r: LMIARecord): string | undefined => {
    const entry = applied[r.id]
    if (!entry) {
      return
    }
    if (entry.emailedAt && entry.linkedInAt) {
      return "opacity-50"
    }
    return "opacity-70"
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="font-semibold text-2xl">LMIA Tech Finder</h1>
            <p className="text-muted-foreground text-sm">
              Canadian employers with positive LMIA — combined quarterly
              dataset.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ImportMdDialog />
            <ExportMdButton records={records} />
          </div>
        </header>

        {state.status === "loading" && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <CircleNotch className="size-4 animate-spin" />
            Loading data…
          </div>
        )}

        {state.status === "error" && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm">
            Failed to load data: {state.error.message}
          </div>
        )}

        {state.status === "ready" && (
          <>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <Input
                  className="w-72"
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search employer, NOC, occupation…"
                  value={query}
                />
                <Select onValueChange={setProvince} value={province}>
                  <SelectTrigger className="w-52">
                    <SelectValue placeholder="All locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All locations</SelectItem>
                    {provinces.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-muted-foreground text-sm">
                  {grouped
                    ? `${groups.length.toLocaleString()} employers`
                    : `${filtered.length.toLocaleString()} of ${records.length.toLocaleString()} records`}
                  {" — "}
                  {emailedCount.toLocaleString()} emailed ·{" "}
                  {linkedinCount.toLocaleString()} LinkedIn
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={techOnly}
                      id="tech-filter"
                      onCheckedChange={setTechOnly}
                    />
                    <Label className="cursor-pointer" htmlFor="tech-filter">
                      Tech roles only
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={grouped}
                      id="group-employer"
                      onCheckedChange={setGrouped}
                    />
                    <Label className="cursor-pointer" htmlFor="group-employer">
                      Group by employer
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {grouped ? (
              <LMIATable columns={employerColumns} data={groups} />
            ) : (
              <LMIATable
                columns={columns}
                data={filtered}
                getRowClassName={dimContacted}
              />
            )}
          </>
        )}
      </div>
      <Toaster position="bottom-right" />
    </main>
  )
}
