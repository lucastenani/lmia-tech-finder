import { DownloadSimple } from "@phosphor-icons/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { downloadMarkdown, exportToMarkdown } from "@/lib/md-export"
import { useAppliedStore } from "@/store/applied-store"
import type { LMIARecord } from "@/types"

export function ExportMdButton({ records }: { records: LMIARecord[] }) {
  const count = useAppliedStore((s) => Object.keys(s.applied).length)

  const handleExport = () => {
    const applied = useAppliedStore.getState().applied
    const md = exportToMarkdown(applied, records)
    const filename = `applied-lmia-${new Date().toISOString().slice(0, 10)}.md`
    downloadMarkdown(md, filename)
    toast.success(`Exported ${count} ${count === 1 ? "entry" : "entries"}`)
  }

  return (
    <Button
      disabled={count === 0}
      onClick={handleExport}
      size="sm"
      variant="outline"
    >
      <DownloadSimple className="size-4" />
      Export ({count})
    </Button>
  )
}
