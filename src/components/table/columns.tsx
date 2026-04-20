import { EnvelopeSimple, LinkedinLogo } from "@phosphor-icons/react"
import type { ColumnDef } from "@tanstack/react-table"
import { ContactCheckbox } from "@/components/table/contact-checkbox"
import { RowActions } from "@/components/table/row-actions"
import { getEmployerKey } from "@/lib/group-employers"
import type { LMIARecord } from "@/types"

export const columns: ColumnDef<LMIARecord>[] = [
  {
    id: "emailed",
    size: 36,
    enableSorting: false,
    header: () => <EnvelopeSimple aria-label="Emailed" className="size-4" />,
    cell: ({ row }) => (
      <ContactCheckbox
        channel="email"
        id={getEmployerKey(row.original.employer, row.original.city)}
      />
    ),
  },
  {
    id: "linkedin",
    size: 36,
    enableSorting: false,
    header: () => <LinkedinLogo aria-label="LinkedIn" className="size-4" />,
    cell: ({ row }) => (
      <ContactCheckbox
        channel="linkedin"
        id={getEmployerKey(row.original.employer, row.original.city)}
      />
    ),
  },
  {
    id: "actions",
    header: "",
    size: 36,
    enableSorting: false,
    cell: ({ row }) => <RowActions record={row.original} />,
  },
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
