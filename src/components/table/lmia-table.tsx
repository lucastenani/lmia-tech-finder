import { CaretLeft, CaretRight } from "@phosphor-icons/react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  type Updater,
  useReactTable,
} from "@tanstack/react-table"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const PAGE_SIZE = 10

function readPageFromUrl(): number {
  const param = new URLSearchParams(window.location.search).get("page")
  const n = param ? Number.parseInt(param, 10) : 1
  return Number.isFinite(n) && n > 0 ? n - 1 : 0
}

function writePageToUrl(pageIndex: number) {
  const params = new URLSearchParams(window.location.search)
  if (pageIndex === 0) {
    params.delete("page")
  } else {
    params.set("page", String(pageIndex + 1))
  }
  const search = params.toString()
  history.replaceState(
    null,
    "",
    search ? `?${search}` : window.location.pathname
  )
}

interface Props<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  getRowClassName?: (row: TData) => string | undefined
}

export function LMIATable<TData>({
  columns,
  data,
  getRowClassName,
}: Props<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>(() => ({
    pageIndex: readPageFromUrl(),
    pageSize: PAGE_SIZE,
  }))

  useEffect(() => {
    const pageCount = Math.ceil(data.length / PAGE_SIZE)
    if (pagination.pageIndex >= pageCount && pageCount > 0) {
      setPagination((p) => ({ ...p, pageIndex: 0 }))
      writePageToUrl(0)
    }
  }, [data.length, pagination.pageIndex])

  function handlePaginationChange(updater: Updater<PaginationState>) {
    setPagination((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater
      writePageToUrl(next.pageIndex)
      return next
    })
  }

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
  })

  const { pageIndex, pageSize } = table.getState().pagination
  const total = table.getFilteredRowModel().rows.length
  const from = total === 0 ? 0 : pageIndex * pageSize + 1
  const to = Math.min((pageIndex + 1) * pageSize, total)

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  className="h-24 text-center text-muted-foreground"
                  colSpan={columns.length}
                >
                  No records to display.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className={getRowClassName?.(row.original)}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-muted-foreground text-sm">
        <div>
          Showing {from}–{to} of {total.toLocaleString()}
        </div>
        <div className="flex items-center gap-1">
          <Button
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            size="sm"
            variant="outline"
          >
            <CaretLeft className="size-4" />
          </Button>
          {(() => {
            const pageCount = table.getPageCount() || 1
            const windowSize = 5
            const half = Math.floor(windowSize / 2)
            const start = Math.max(
              0,
              Math.min(pageIndex - half, pageCount - windowSize)
            )
            const end = Math.min(pageCount, start + windowSize)
            return Array.from({ length: end - start }, (_, i) => {
              const page = start + i
              return (
                <Button
                  className="tabular-nums"
                  key={page}
                  onClick={() => table.setPageIndex(page)}
                  size="sm"
                  variant={page === pageIndex ? "default" : "outline"}
                >
                  {page + 1}
                </Button>
              )
            })
          })()}
          <Button
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            size="sm"
            variant="outline"
          >
            <CaretRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
