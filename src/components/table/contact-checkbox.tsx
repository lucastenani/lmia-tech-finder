import { Checkbox } from "@/components/ui/checkbox"
import { type ContactChannel, useAppliedStore } from "@/store/applied-store"

type Props = {
  id: string
  channel: ContactChannel
}

export function ContactCheckbox({ id, channel }: Props) {
  const timestamp = useAppliedStore((s) => {
    const entry = s.applied[id]
    if (!entry) {
      return
    }
    return channel === "email" ? entry.emailedAt : entry.linkedInAt
  })
  const toggle = useAppliedStore((s) => s.toggle)

  const verb = channel === "email" ? "emailed" : "messaged on LinkedIn"
  const title = timestamp
    ? `Marked as ${verb} on ${timestamp.slice(0, 10)}`
    : `Mark as ${verb}`

  return (
    <Checkbox
      aria-label={title}
      checked={Boolean(timestamp)}
      onCheckedChange={() => toggle(id, channel)}
      title={title}
    />
  )
}
