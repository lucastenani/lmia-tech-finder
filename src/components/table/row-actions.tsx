import { PaperPlaneTilt } from "@phosphor-icons/react"
import { useState } from "react"
import { MessageTemplateDialog } from "@/components/table/message-template-dialog"
import { Button } from "@/components/ui/button"
export function RowActions({ record }: { record: { employer: string } }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button
        aria-label="Open message templates"
        onClick={() => setOpen(true)}
        size="icon"
        title="Open message templates"
        variant="ghost"
      >
        <PaperPlaneTilt className="size-4" />
      </Button>
      <MessageTemplateDialog
        onOpenChange={setOpen}
        open={open}
        record={record}
      />
    </>
  )
}
