import { getAccessToken, signOut } from './auth'

const BASE_URL = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL) ?? 'http://localhost:8000'

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

// FastAPI validation errors (422) send `detail` as a list of
// { loc: (string | number)[], msg: string, type: string }, not a string —
// stringify it into something readable instead of "[object Object]".
function formatErrorDetail(detail: unknown, fallback: string): string {
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    return detail
      .map((err) => {
        if (err && typeof err === 'object' && 'msg' in err) {
          const loc = Array.isArray((err as { loc?: unknown[] }).loc)
            ? (err as { loc: unknown[] }).loc.filter((p) => p !== 'body').join('.')
            : undefined
          const msg = String((err as { msg: unknown }).msg)
          return loc ? `${loc}: ${msg}` : msg
        }
        return String(err)
      })
      .join('; ')
  }
  return fallback
}

export function createClient() {
  async function request<T>(method: string, path: string, body?: any): Promise<T> {
    const token = await getAccessToken()

    const isFormData = body && (body instanceof FormData || body.constructor?.name === 'FormData' || body.append !== undefined)
    const headers: Record<string, string> = {}
    if (!isFormData) {
      headers['Content-Type'] = 'application/json'
    }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body != null ? (isFormData ? body : JSON.stringify(body)) : undefined,
    })

    if (res.status === 401) {
      await signOut()
      throw new ApiError(401, 'Session expired — signed out')
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({ detail: res.statusText }))
      const fallback = `${method} ${path} → ${res.status}`
      throw new ApiError(res.status, formatErrorDetail(body?.detail, fallback))
    }

    if (res.status === 204 || res.headers.get('content-length') === '0') {
      return undefined as T
    }

    return res.json() as Promise<T>
  }

  return {
    get: <T>(path: string) => request<T>('GET', path),
    post: <T>(path: string, body: unknown) => request<T>('POST', path, body),
    put: <T>(path: string, body: unknown) => request<T>('PUT', path, body),
    patch: <T>(path: string, body: unknown) => request<T>('PATCH', path, body),
    delete: <T>(path: string) => request<T>('DELETE', path),
  }
}
