"use client"

import { useCallback } from "react"

import {
  ServerTable,
  type ServerPaginationState,
  type ServerTableFetchResult,
  type TableColumn,
} from "@/components/Tables"
import { handleRequest } from "@/lib/handleRequest"

type ApiUser = {
  id: number
  first_name: string
  last_name: string
  email: string
  created_at: string
}

type UserRow = {
  id: number
  fullName: string
  email: string
  createdAt: string
}

const columns: TableColumn<UserRow>[] = [
  {
    id: "id",
    header: "ID",
    className: "w-16",
    renderCell: (row) => row.id,
  },
  {
    id: "fullName",
    header: "Full Name",
    renderCell: (row) => row.fullName,
  },
  {
    id: "email",
    header: "Email",
    renderCell: (row) => row.email,
  },
  {
    id: "createdAt",
    header: "Created At",
    renderCell: (row) => row.createdAt,
  },
]

async function fetchUsersFromServer({
  page,
  pageSize,
}: ServerPaginationState): Promise<ServerTableFetchResult<ApiUser>> {
  return handleRequest<ServerTableFetchResult<ApiUser>>({
    endpoint: "/users",
    method: "GET",
    query: { page, pageSize },
  })
}

export default function TablesPage() {
  const transformUsers = useCallback((rows: ApiUser[]): UserRow[] => {
    return rows.map((row) => ({
      id: row.id,
      fullName: `${row.first_name} ${row.last_name}`,
      email: row.email,
      createdAt: new Date(row.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }),
    }))
  }, [])

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reusable Server Table Demo</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Demonstrates server-side pagination with a data transform method from <code>components/Tables</code>.
        </p>
      </div>

      <div className="bg-card rounded-xl border p-6">
        <ServerTable<ApiUser, UserRow>
          columns={columns}
          fetchData={fetchUsersFromServer}
          transformData={transformUsers}
          pageSize={10}
          pageSizeOptions={[5, 10, 20, 50]}
          emptyMessage="No users were returned by the server."
          loadingMessage="Fetching users from server..."
        />
      </div>
    </div>
  )
}
