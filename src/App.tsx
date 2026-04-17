import { CircleNotch } from "@phosphor-icons/react"
import { columns } from "@/components/table/columns"
import { LMIATable } from "@/components/table/lmia-table"
import { Label } from "@/components/ui/label"
import { Toaster } from "@/components/ui/sonner"
import { Switch } from "@/components/ui/switch"
import { useLMIAData } from "@/hooks/use-lmia-data"
import { useTechFilter } from "@/hooks/use-tech-filter"

export default function App() {
  const state = useLMIAData()
  const records = state.status === "ready" ? state.data.records : []
  const { enabled, setEnabled, filtered } = useTechFilter(records)

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-8">
        <header className="flex flex-col gap-1">
          <h1 className="font-semibold text-2xl">LMIA Tech Finder</h1>
          <p className="text-muted-foreground text-sm">
            Canadian employers with positive LMIA — combined quarterly dataset.
          </p>
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
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-muted-foreground text-sm">
                {filtered.length.toLocaleString()} of{" "}
                {records.length.toLocaleString()} records —{" "}
                {state.data.sources.length} file
                {state.data.sources.length === 1 ? "" : "s"}
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={enabled}
                  id="tech-filter"
                  onCheckedChange={setEnabled}
                />
                <Label className="cursor-pointer" htmlFor="tech-filter">
                  Tech roles only
                </Label>
              </div>
            </div>
            <LMIATable columns={columns} data={filtered} />
          </>
        )}
      </div>
      <Toaster position="bottom-right" />
    </main>
  )
}
