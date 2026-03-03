import type { ReactNode } from "react"

export type TableColumn<TData> = {
  id: string
  header: string
  className?: string
  cellClassName?: string
  renderCell: (row: TData, rowIndex: number) => ReactNode
}

export type ServerPaginationState = {
  page: number
  pageSize: number
}

export type ServerTableFetchResult<TRawData> = {
  rows: TRawData[]
  totalRows: number
}

export type ServerTableTransformContext = {
  page: number
  pageSize: number
}

export type ServerTableProps<TRawData, TData = TRawData> = {
  columns: TableColumn<TData>[]
  fetchData: (
    pagination: ServerPaginationState
  ) => Promise<ServerTableFetchResult<TRawData>>
  transformData?: (
    rows: TRawData[],
    context: ServerTableTransformContext
  ) => TData[]
  initialPage?: number
  pageSize?: number
  pageSizeOptions?: number[]
  emptyMessage?: string
  loadingMessage?: string
  className?: string
  tableClassName?: string
}
