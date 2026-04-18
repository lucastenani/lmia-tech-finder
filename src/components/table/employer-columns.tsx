import type { ColumnDef } from "@tanstack/react-table"
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
