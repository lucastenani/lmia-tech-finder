import { EnvelopeSimple, LinkedinLogo } from "@phosphor-icons/react"
import type { ColumnDef } from "@tanstack/react-table"
import { ContactCheckbox } from "@/components/table/contact-checkbox"
import { Badge } from "@/components/ui/badge"
import type { EmployerGroup } from "@/types"

export const employerColumns: ColumnDef<EmployerGroup>[] = [
  {
    accessorKey: "employer",
    header: "Employer",
  },
  {
    id: "location",
    header: "Location",
    accessorFn: (row) =>
      [row.city, row.provinceCode || row.province].filter(Boolean).join(", "),
  },
  {
    id: "nocs",
    header: "NOCs",
    accessorFn: (row) => row.nocCodes.length,
    cell: ({ row }) => {
      const { nocCodes } = row.original
      const shown = nocCodes.slice(0, 3)
      const extra = nocCodes.length - shown.length
      return (
        <div
          className="flex flex-wrap items-center gap-1"
          title={nocCodes.join(", ")}
        >
          {shown.map((c) => (
            <Badge className="font-mono" key={c} variant="secondary">
              {c}
            </Badge>
          ))}
          {extra > 0 && (
            <Badge className="text-muted-foreground" variant="outline">
              +{extra}
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    id: "emailed",
    enableSorting: false,
    header: () => (
      <div className="flex items-center gap-1">
        <EnvelopeSimple className="size-4" /> Emailed
      </div>
    ),
    accessorFn: () => 0,
    cell: ({ row }) => <ContactCheckbox channel="email" id={row.original.id} />,
  },
  {
    id: "linkedin",
    enableSorting: false,
    header: () => (
      <div className="flex items-center gap-1">
        <LinkedinLogo className="size-4" /> LinkedIn
      </div>
    ),
    accessorFn: () => 0,
    cell: ({ row }) => (
      <ContactCheckbox channel="linkedin" id={row.original.id} />
    ),
  },
  {
    accessorKey: "totalPositions",
    header: "Positions",
    cell: ({ row }) => (
      <span className="font-semibold tabular-nums">
        {row.original.totalPositions.toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "totalLmias",
    header: "LMIAs",
    cell: ({ row }) => (
      <span className="tabular-nums">
        {row.original.totalLmias.toLocaleString()}
      </span>
    ),
  },
  {
    id: "periods",
    header: "Quarters",
    accessorFn: (row) => row.periods.length,
    cell: ({ row }) => {
      const { periods } = row.original
      return (
        <span className="tabular-nums" title={periods.join(", ")}>
          {periods.length}
        </span>
      )
    },
  },
  {
    accessorKey: "recordCount",
    header: "Rows",
    cell: ({ row }) => (
      <span className="text-muted-foreground tabular-nums">
        {row.original.recordCount}
      </span>
    ),
  },
]
