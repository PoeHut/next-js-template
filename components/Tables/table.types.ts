import type { ReactNode } from "react"

export type TableColumnAlign = "left" | "center" | "right"

export type TableColumn<TData extends Record<string, unknown>> = {
  id: keyof TData | string
  label: ReactNode
  minWidth?: number
  align?: TableColumnAlign
  status?: keyof TData | string
  statusDesc?: keyof TData | string
  format?: (
    value: unknown,
    status?: unknown,
    statusDesc?: unknown,
    row?: TData,
    rowIndex?: number
  ) => ReactNode
}

export type ServerTablePaginatedRows<TData extends Record<string, unknown>> = {
  totalCount: number
  pageNo: number
  pageSize?: number
  result: TData[]
}

export type ServerTableDataRows<TData extends Record<string, unknown>> =
  | TData[]
  | ServerTablePaginatedRows<TData>

export type ServerTableProps<TData extends Record<string, unknown>> = {
  loading?: boolean
  columns: TableColumn<TData>[]
  dataRows?: ServerTableDataRows<TData> | null
  noPagination?: boolean
  requestDataByPageNo?: (pageSize: number, pageNo: number) => void
  errorHeader?: boolean
  defaultRowsPerPage?: number
  rowsPerPageOptions?: number[]
  emptyMessage?: string
  className?: string
  tableClassName?: string
}
