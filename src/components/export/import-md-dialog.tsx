import { UploadSimple } from "@phosphor-icons/react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { type ImportResult, parseMarkdown } from "@/lib/md-import"
import { useAppliedStore } from "@/store/applied-store"

export function ImportMdDialog() {
  const [open, setOpen] = useState(false)
  const [preview, setPreview] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const importBulk = useAppliedStore((s) => s.importBulk)

  const reset = () => {
    setPreview(null)
    setError(null)
  }

  const handleFile = async (file: File | null | undefined) => {
    if (!file) {
      return
    }
    try {
      const text = await file.text()
      const result = parseMarkdown(text)
      if (result.count === 0) {
        setError(
          "No entries found. Make sure this file was exported by LMIA Tech Finder."
        )
        setPreview(null)
        return
      }
      setError(null)
      setPreview(result)
    } catch (err) {
      setError((err as Error).message)
      setPreview(null)
    }
  }

  const apply = () => {
    if (!preview) {
      return
    }
    importBulk(preview.entries)
    toast.success(
      `Imported ${preview.count} ${preview.count === 1 ? "entry" : "entries"}`
    )
    setOpen(false)
    reset()
  }

  return (
    <Dialog
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) {
          reset()
        }
      }}
      open={open}
    >
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <UploadSimple className="size-4" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import applied companies</DialogTitle>
          <DialogDescription>
            Upload a Markdown file exported previously. Existing entries are
            merged; incoming timestamps overwrite stored ones per channel.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="md-file">Markdown file</Label>
          <Input
            accept=".md,text/markdown"
            id="md-file"
            onChange={(e) => handleFile(e.target.files?.[0])}
            type="file"
          />
        </div>
        {error && <p className="text-destructive text-sm">{error}</p>}
        {preview && (
          <p className="text-muted-foreground text-sm">
            Ready to import {preview.count}{" "}
            {preview.count === 1 ? "entry" : "entries"}.
          </p>
        )}
        <DialogFooter>
          <Button onClick={() => setOpen(false)} variant="ghost">
            Cancel
          </Button>
          <Button disabled={!preview || preview.count === 0} onClick={apply}>
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
