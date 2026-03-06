export type ApiUser = {
    id: number
    name: string
    username: string
    email: string
    created_at?: string
  }
  
  export type UserRow = {
    id: number
    name: string
    username: string
    email: string
    createdAt?: string
  }
  
  export type UsersApiResponse = {
    result?: ApiUser[]
    data?: ApiUser[]
    rows?: ApiUser[]
    totalCount?: number
    totalRows?: number
    pageNo?: number
    page?: number
    pageSize?: number
  }