"use client"

import { useCallback, useEffect, useState } from "react"
import dayjs from "dayjs"

import {
  ServerTable,
  type ServerTablePaginatedRows,
  type TableColumn,
} from "@/components/Tables"
import { handleRequest } from "@/lib/handleRequest"
import type { ApiUser, UserRow, UsersApiResponse } from "./table-types"

const columns: TableColumn<UserRow>[] = [
  { id: "id", label: "ID", minWidth: 70, align: "left" },
  { id: "name", label: "Name", minWidth: 140, align: "left" },
  { id: "username", label: "User Name", minWidth: 140, align: "left" },
  { id: "email", label: "Email", minWidth: 220, align: "left" },
  {
    id: "createdAt",
    label: "Created At",
    minWidth: 140,
    align: "left",
    format: (value) => {
      return value ? dayjs(String(value)).format("DD-MM-YYYY, h:mm:ss A") : "-"
    },
  },
]

export default function TablesPage() {
  const [loading, setLoading] = useState(false)
  const [dataRows, setDataRows] = useState<ServerTablePaginatedRows<UserRow>>({
    totalCount: 0,
    pageNo: 1,
    pageSize: 10,
    result: [],
  })
  
  console.log("dataRows", dataRows)

  const requestUsers = useCallback(async (pageSize = 0, pageNo = 0) => {
    setLoading(true)

    try {
      const response = await handleRequest<UsersApiResponse | ApiUser[]>({
        endpoint: "/users",
        method: "GET",
        query: { pageSize, pageNo },
      })

      const isArrayResponse = Array.isArray(response)

      const users: ApiUser[] = isArrayResponse
        ? response
        : response.result ?? response.data ?? response.rows ?? [];


      const totalCount =
        (isArrayResponse ? response.length : response.totalCount ?? response.totalRows) ??
        users.length

      const resolvedPageNo = isArrayResponse ? pageNo : response.pageNo ?? response.page ?? pageNo
      const resolvedPageSize = isArrayResponse ? pageSize : response.pageSize ?? pageSize

      const mappedUsers: UserRow[] = users.map((user) => ({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        createdAt: user.created_at,
      }))

      setDataRows((prev) => ({
        totalCount,
        pageNo: resolvedPageNo,
        pageSize: resolvedPageSize,
        result: resolvedPageNo > 1 ? [...prev.result, ...mappedUsers] : mappedUsers,
      }))
    } catch {
      setDataRows({
        totalCount: 0,
        pageNo,
        pageSize,
        result: [],
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void requestUsers(10, 1)
  }, [requestUsers])

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Reusable Server Table Demo
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Demonstrates server-side pagination from <code>components/Tables</code>.
        </p>
      </div>

      <div className="bg-card rounded-xl border p-6">
        <ServerTable<UserRow>
          loading={loading}
          columns={columns}
          dataRows={dataRows}
          requestDataByPageNo={requestUsers}
          rowsPerPageOptions={[5, 10, 20, 50]}
          emptyMessage="No users were returned by the server."
        />
      </div>
    </div>
  )
}
