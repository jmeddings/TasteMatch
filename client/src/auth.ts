export type AuthSession = {
  accessToken: string
  refreshToken?: string | null
  expiresAt?: number | null
}

type StoredAuth = {
  session: AuthSession
}

const storageKey = 'tastematch:auth'

export function getStoredSession(): AuthSession | null {
  const raw = localStorage.getItem(storageKey)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as StoredAuth
    return parsed.session
  } catch {
    return null
  }
}

export function setStoredSession(session: AuthSession) {
  const value: StoredAuth = { session }
  localStorage.setItem(storageKey, JSON.stringify(value))
}

export function clearStoredSession() {
  localStorage.removeItem(storageKey)
}

export async function apiRequest<T>(
  path: string,
  opts: { method?: string; body?: unknown; accessToken?: string } = {}
): Promise<T> {
  const baseUrl = import.meta.env.VITE_API_URL
  if (!baseUrl) throw new Error('VITE_API_URL is not set')

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }

  if (opts.accessToken) headers.Authorization = `Bearer ${opts.accessToken}`

  const res = await fetch(`${baseUrl}${path}`, {
    method: opts.method || 'GET',
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined
  })

  const json = await res.json().catch(() => null)

  if (!res.ok) {
    const msg = json?.error || json?.message || 'Request failed'
    throw new Error(msg)
  }

  return json as T
}
