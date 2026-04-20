import { Copy } from "@phosphor-icons/react"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  buildEmailTemplate,
  buildLinkedInTemplate,
  LINKEDIN_CHAR_LIMIT,
} from "@/lib/templates"
import { cn } from "@/lib/utils"

interface Props {
  onOpenChange: (open: boolean) => void
  open: boolean
  record: { employer: string }
}

async function copyToClipboard(text: string, label: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(`${label} copied`)
  } catch {
    toast.error("Couldn't copy — clipboard access denied")
  }
}

export function MessageTemplateDialog({ record, open, onOpenChange }: Props) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-h-[90vh] w-[85vw] max-w-[800px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Message templates — {record.employer}</DialogTitle>
          <DialogDescription>
            Edit before sending. Changes are not persisted — closing resets the
            content.
          </DialogDescription>
        </DialogHeader>
        {open ? <TemplateTabs record={record} /> : null}
      </DialogContent>
    </Dialog>
  )
}

function TemplateTabs({ record }: { record: { employer: string } }) {
  const email = useMemo(() => buildEmailTemplate(record), [record])
  const linkedinInitial = useMemo(() => buildLinkedInTemplate(record), [record])

  const [subject, setSubject] = useState(email.subject)
  const [body, setBody] = useState(email.body)
  const [linkedin, setLinkedin] = useState(linkedinInitial)

  const overLimit = linkedin.length > LINKEDIN_CHAR_LIMIT

  return (
    <Tabs className="mt-2" defaultValue="email">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="email">Email</TabsTrigger>
        <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
      </TabsList>

      <TabsContent className="flex flex-col gap-4 pt-4" value="email">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="subject">Subject</Label>
            <Button
              onClick={() => copyToClipboard(subject, "Subject")}
              size="sm"
              type="button"
              variant="ghost"
            >
              <Copy className="size-4" />
              Copy
            </Button>
          </div>
          <Input
            id="subject"
            onChange={(e) => setSubject(e.target.value)}
            value={subject}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="body">Body</Label>
            <Button
              onClick={() => copyToClipboard(body, "Body")}
              size="sm"
              type="button"
              variant="ghost"
            >
              <Copy className="size-4" />
              Copy
            </Button>
          </div>
          <Textarea
            className="font-mono text-sm"
            id="body"
            onChange={(e) => setBody(e.target.value)}
            rows={14}
            value={body}
          />
        </div>

        <Button
          onClick={() =>
            copyToClipboard(`Subject: ${subject}\n\n${body}`, "Full email")
          }
          type="button"
          variant="secondary"
        >
          <Copy className="size-4" />
          Copy subject + body
        </Button>
      </TabsContent>

      <TabsContent className="flex flex-col gap-3 pt-4" value="linkedin">
        <div className="flex items-center justify-between">
          <Label htmlFor="linkedin-message">Message</Label>
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "text-xs tabular-nums",
                overLimit
                  ? "font-medium text-destructive"
                  : "text-muted-foreground"
              )}
            >
              {linkedin.length} / {LINKEDIN_CHAR_LIMIT}
            </span>
            <Button
              onClick={() => copyToClipboard(linkedin, "Message")}
              size="sm"
              type="button"
              variant="ghost"
            >
              <Copy className="size-4" />
              Copy
            </Button>
          </div>
        </div>
        <Textarea
          className={cn(
            "font-mono text-sm",
            overLimit && "border-destructive focus-visible:ring-destructive/50"
          )}
          id="linkedin-message"
          onChange={(e) => setLinkedin(e.target.value)}
          rows={8}
          value={linkedin}
        />
        <p className="text-muted-foreground text-xs">
          Replace <code>[recipient]</code> with the person's first name before
          sending.
        </p>
      </TabsContent>
    </Tabs>
  )
}
