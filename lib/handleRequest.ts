type HttpMethod = "GET" | "POST"
type QueryValue = string | number | boolean | null | undefined

type JsonBody = Record<string, unknown>

export type HandleRequestOptions = {
  endpoint: string
  method?: HttpMethod
  baseUrl?: string
  query?: Record<string, QueryValue>
  headers?: HeadersInit
  authToken?: string
  body?: JsonBody | FormData
  multipart?: boolean
  signal?: AbortSignal
}

export class RequestError extends Error {
  status: number
  details: unknown

  constructor(message: string, status: number, details: unknown = null) {
    super(message)
    this.name = "RequestError"
    this.status = status
    this.details = details
  }
}

function buildUrl(
  endpoint: string,
  query?: Record<string, QueryValue>,
  baseUrl?: string
) {
  const isAbsolute = /^https?:\/\//i.test(endpoint)
  const url = isAbsolute ? new URL(endpoint) : new URL(endpoint, baseUrl)

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value))
      }
    }
  }

  return url.toString()
}

function createRequestBody(
  method: HttpMethod,
  body: HandleRequestOptions["body"],
  multipart: boolean | undefined,
  headers: Headers
) {
  if (method !== "POST" || body == null) {
    return undefined
  }

  if (body instanceof FormData) {
    return body
  }

  if (multipart) {
    const formData = new FormData()
    for (const [key, value] of Object.entries(body)) {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value))
      }
    }
    return formData
  }

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  return JSON.stringify(body)
}

async function parseResponse(response: Response) {
  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get("content-type") ?? ""

  if (contentType.includes("application/json")) {
    return response.json()
  }

  return response.text()
}

export async function handleRequest<TResponse>({
  endpoint,
  method = "GET",
  baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL,
  query,
  headers,
  authToken,
  body,
  multipart = false,
  signal,
}: HandleRequestOptions): Promise<TResponse> {
  if (!endpoint) {
    throw new RequestError("Endpoint is required.", 0)
  }

  if (!/^https?:\/\//i.test(endpoint) && !baseUrl) {
    throw new RequestError(
      "Missing API base URL. Set NEXT_PUBLIC_API_BASE_URL or pass baseUrl.",
      0
    )
  }

  const requestHeaders = new Headers(headers)

  if (authToken && !requestHeaders.has("Authorization")) {
    requestHeaders.set("Authorization", `Bearer ${authToken}`)
  }

  const url = buildUrl(endpoint, query, baseUrl)
  const requestBody = createRequestBody(method, body, multipart, requestHeaders)

  let response: Response
  try {
    response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: requestBody,
      signal,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Network request failed."
    throw new RequestError(message, 0)
  }

  const payload = await parseResponse(response)

  if (!response.ok) {
    let message = `Request failed with status ${response.status}.`

    if (typeof payload === "string" && payload.trim().length > 0) {
      message = payload
    } else if (
      payload &&
      typeof payload === "object" &&
      "message" in payload &&
      typeof (payload as { message: unknown }).message === "string"
    ) {
      message = (payload as { message: string }).message
    }

    throw new RequestError(message, response.status, payload)
  }

  return payload as TResponse
}
