"use client"

import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

import type {
  ServerTablePaginatedRows,
  ServerTableProps,
} from "./table.types"

const DEFAULT_PAGE_SIZE = 10

function isPaginatedRows<TData extends Record<string, unknown>>(
  dataRows: unknown
): dataRows is ServerTablePaginatedRows<TData> {
  return (
    !!dataRows &&
    typeof dataRows === "object" &&
    "result" in dataRows &&
    "totalCount" in dataRows &&
    "pageNo" in dataRows
  )
}

function getRowValue<TData extends Record<string, unknown>>(
  row: TData,
  key: keyof TData | string | undefined
) {
  if (!key) {
    return undefined
  }

  return row[key as keyof TData]
}

function ServerTable<TData extends Record<string, unknown>>({
  loading = false,
  columns,
  dataRows,
  noPagination = false,
  requestDataByPageNo,
  errorHeader = false,
  defaultRowsPerPage = DEFAULT_PAGE_SIZE,
  rowsPerPageOptions = [DEFAULT_PAGE_SIZE, 50, 100, 500, 1000],
  emptyMessage = "No Data",
  className,
  tableClassName,
}: ServerTableProps<TData>) {
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage)
console.log("dataRows ServerTable", dataRows)
  useEffect(() => {
    if (isPaginatedRows<TData>(dataRows) && dataRows.pageSize) {
      setRowsPerPage(dataRows.pageSize)
      return
    }

    setRowsPerPage(defaultRowsPerPage)
  }, [dataRows, defaultRowsPerPage])

  const { rows, totalCount, pageNo } = useMemo(() => {
    if (noPagination) {
      return {
        rows: Array.isArray(dataRows) ? dataRows : [],
        totalCount: Array.isArray(dataRows) ? dataRows.length : 0,
        pageNo: 1,
      }
    }

    if (!isPaginatedRows<TData>(dataRows) || !dataRows.totalCount) {
      return { rows: [] as TData[], totalCount: 0, pageNo: 1 }
    }

    return {
      rows: dataRows.result ?? [],
      totalCount: dataRows.totalCount,
      pageNo: dataRows.pageNo ?? 1,
    }
  }, [dataRows, noPagination])

  const totalPages = Math.max(1, Math.ceil(totalCount / rowsPerPage))
  const currentPage = Math.max(1, Math.min(pageNo, totalPages))
  const isFirstPage = currentPage <= 1
  const isLastPage = currentPage >= totalPages

  function handleChangePage(newPage: number) {
    requestDataByPageNo?.(rowsPerPage, newPage)
  }

  function handleChangeRowsPerPage(value: string) {
    const perPage = Number(value)

    if (!Number.isFinite(perPage) || perPage <= 0) {
      return
    }

    setRowsPerPage(perPage)
    requestDataByPageNo?.(perPage, 1)
  }

  return (
    <div className={cn("relative space-y-4", className)}>
      <Table className={tableClassName}>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead
                key={`${String(column.id)}-${index}`}
                className={cn(errorHeader ? "text-red-600" : "", {
                  "text-left": column.align === "left" || !column.align,
                  "text-center": column.align === "center",
                  "text-right": column.align === "right",
                })}
                style={column.minWidth ? { minWidth: column.minWidth } : {}}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length > 0 ? (
            rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, columnIndex) => {
                  const value = getRowValue(row, column.id)
                  const status = getRowValue(row, column.status)
                  const statusDesc = getRowValue(row, column.statusDesc)

                  return (
                    <TableCell
                      key={`${String(column.id)}-${columnIndex}`}
                      className={cn({
                        "text-left": column.align === "left" || !column.align,
                        "text-center": column.align === "center",
                        "text-right": column.align === "right",
                      })}
                    >
                      {column.format
                        ? status || status === 0
                          ? column.format(value, status, statusDesc, row, rowIndex)
                          : column.format(value, undefined, undefined, row, rowIndex)
                        : (value as string | number | null)}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center text-red-600"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {loading && (
        <div className="bg-background/50 absolute inset-0 grid place-items-center text-sm">
          Loading...
        </div>
      )}

      {!noPagination && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground text-sm">
            Page {currentPage} of {totalPages} ({totalCount} total rows)
          </p>

          <div className="flex items-center gap-2">
            <label htmlFor="table-page-size" className="text-sm">
              Rows per page
            </label>
            <select
              id="table-page-size"
              className="border-input bg-background rounded-md border px-2 py-1 text-sm"
              value={rowsPerPage}
              onChange={(event) => handleChangeRowsPerPage(event.target.value)}
            >
              {rowsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleChangePage(Math.max(1, currentPage - 1))}
              disabled={loading || isFirstPage}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleChangePage(Math.min(totalPages, currentPage + 1))}
              disabled={loading || isLastPage}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export { ServerTable }
