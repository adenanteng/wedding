"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onRefresh?: () => void
  isLoading?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRefresh,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    meta: {
        refresh: onRefresh
    }
  })

  const uniqueSources = React.useMemo(() => {
    const sources = data
      .map((item: any) => item.source)
      .filter(Boolean)
    return Array.from(new Set(sources)) as string[]
  }, [data])

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-2 py-4 justify-between items-stretch md:items-center">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <Input
            placeholder="Cari nama..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="w-full md:w-64 text-sm"
          />
          <Combobox
            options={[
              { value: "all", label: "Semua Kehadiran" },
              { value: "hadir", label: "Hadir" },
              { value: "tidak_hadir", label: "Tidak Hadir" },
              { value: "belum_tahu", label: "Belum Tahu" },
            ]}
            value={(table.getColumn("presence")?.getFilterValue() as string) ?? "all"}
            onChange={(val) => table.getColumn("presence")?.setFilterValue(val || "all")}
            placeholder="Filter Kehadiran"
            searchPlaceholder="Cari..."
            className="w-full md:w-[160px]"
          />
          <Combobox
            options={[
              { value: "all", label: "Semua Status Undangan" },
              { value: "terundang", label: "Terundang" },
              { value: "belum", label: "Belum" },
              { value: "tidak_tahu", label: "Tidak Tahu" },
            ]}
            value={(table.getColumn("invited")?.getFilterValue() as string) ?? "all"}
            onChange={(val) => table.getColumn("invited")?.setFilterValue(val || "all")}
            placeholder="Filter Status"
            searchPlaceholder="Cari..."
            className="w-full md:w-[160px]"
          />
          <Combobox
            options={[
              { value: "all", label: "Semua Sumber" },
              ...uniqueSources.map(src => ({ value: src, label: src })),
            ]}
            value={(table.getColumn("source")?.getFilterValue() as string) ?? "all"}
            onChange={(val) => table.getColumn("source")?.setFilterValue(val || "all")}
            placeholder="Filter Sumber"
            searchPlaceholder="Cari..."
            className="w-full md:w-[160px]"
          />
        </div>
        <div className="flex items-center gap-2 justify-end">
            <Button
                variant="outline"
                size="icon"
                onClick={onRefresh}
                disabled={isLoading}
                className={isLoading ? "animate-spin" : ""}
            >
                <RefreshCw className="h-4 w-4" />
            </Button>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                    return (
                    <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                        }
                    >
                        {column.id}
                    </DropdownMenuCheckboxItem>
                    )
                })}
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
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
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {isLoading ? "Loading..." : "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
