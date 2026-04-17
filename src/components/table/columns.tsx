import type { ColumnDef } from "@tanstack/react-table"
import type { LMIARecord } from "@/types"

export const columns: ColumnDef<LMIARecord>[] = [
  {
    id: "period",
    header: "Period",
    accessorFn: (row) => `${row.year} Q${row.quarter}`,
  },
  {
    accessorKey: "employer",
    header: "Employer",
  },
  {
    accessorKey: "nocCode",
    header: "NOC",
  },
  {
    accessorKey: "occupationTitle",
    header: "Occupation",
  },
  {
    accessorKey: "programStream",
    header: "Stream",
  },
  {
    id: "location",
    header: "Location",
    accessorFn: (row) =>
      [row.city, row.provinceCode || row.province].filter(Boolean).join(", "),
  },
  {
    accessorKey: "approvedPositions",
    header: "Positions",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.approvedPositions}</span>
    ),
  },
]
