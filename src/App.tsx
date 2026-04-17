import { CircleNotch } from "@phosphor-icons/react"
import { columns } from "@/components/table/columns"
import { LMIATable } from "@/components/table/lmia-table"
import { Toaster } from "@/components/ui/sonner"
import { useLMIAData } from "@/hooks/use-lmia-data"

export default function App() {
  const state = useLMIAData()

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
            <div className="text-muted-foreground text-sm">
              {state.data.records.length.toLocaleString()} records from{" "}
              {state.data.sources.length} file
              {state.data.sources.length === 1 ? "" : "s"}
            </div>
            <LMIATable columns={columns} data={state.data.records} />
          </>
        )}
      </div>
      <Toaster position="bottom-right" />
    </main>
  )
}
