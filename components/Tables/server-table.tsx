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

import type { ServerTableProps } from "./table.types"

function ServerTable<TRawData, TData = TRawData>({
  columns,
  fetchData,
  transformData,
  initialPage = 1,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50, 100, 500, 1000],
  emptyMessage = "No data found.",
  loadingMessage = "Loading data...",
  className,
  tableClassName,
}: ServerTableProps<TRawData, TData>) {
  const [page, setPage] = useState(initialPage)
  const [currentPageSize, setCurrentPageSize] = useState(pageSize)
  const [rawRows, setRawRows] = useState<TRawData[]>([])
  const [totalRows, setTotalRows] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      setIsLoading(true)
      setError(null)

      try {
        const result = await fetchData({ page, pageSize: currentPageSize })

        if (!isMounted) {
          return
        }

        setRawRows(result.rows)
        setTotalRows(result.totalRows)
      } catch (requestError) {
        if (!isMounted) {
          return
        }

        const message =
          requestError instanceof Error
            ? requestError.message
            : "Failed to load table data."
        setError(message)
        setRawRows([])
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadData()

    return () => {
      isMounted = false
    }
  }, [fetchData, page, currentPageSize])

  const rows = useMemo(
    () =>
      transformData
        ? transformData(rawRows, { page, pageSize: currentPageSize })
        : (rawRows as unknown as TData[]),
    [transformData, rawRows, page, currentPageSize]
  )

  const totalPages = Math.max(1, Math.ceil(totalRows / currentPageSize))
  const isFirstPage = page <= 1
  const isLastPage = page >= totalPages
  const hasRows = rows.length > 0

  function goToPreviousPage() {
    setPage((prev) => Math.max(1, prev - 1))
  }

  function goToNextPage() {
    setPage((prev) => Math.min(totalPages, prev + 1))
  }

  function handlePageSizeChange(value: string) {
    const nextPageSize = Number(value)

    if (!Number.isFinite(nextPageSize) || nextPageSize <= 0) {
      return
    }

    setCurrentPageSize(nextPageSize)
    setPage(1)
  }

  return (
    <div className={cn("space-y-4", className)}>
      <Table className={tableClassName}>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.id} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                {loadingMessage}
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-destructive text-center"
              >
                {error}
              </TableCell>
            </TableRow>
          ) : hasRows ? (
            rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column) => (
                  <TableCell key={column.id} className={column.cellClassName}>
                    {column.renderCell(row, rowIndex)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-sm">
          Page {page} of {totalPages} ({totalRows} total rows)
        </p>

        <div className="flex items-center gap-2">
          <label htmlFor="table-page-size" className="text-sm">
            Rows per page
          </label>
          <select
            id="table-page-size"
            className="border-input bg-background rounded-md border px-2 py-1 text-sm"
            value={currentPageSize}
            onChange={(event) => handlePageSizeChange(event.target.value)}
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={isLoading || isFirstPage}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={isLoading || isLastPage}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export { ServerTable }
