type ScrollState = {
  scrollY: number
}

type RouteCache<T> = {
  data: T
  scroll: ScrollState
}

const prefix = 'tastematch:routeState:'

export function saveRouteState<T>(key: string, data: T, scrollY: number) {
  const value: RouteCache<T> = {
    data,
    scroll: { scrollY }
  }
  sessionStorage.setItem(prefix + key, JSON.stringify(value))
}

export function loadRouteState<T>(key: string): RouteCache<T> | null {
  const raw = sessionStorage.getItem(prefix + key)
  if (!raw) return null
  try {
    return JSON.parse(raw) as RouteCache<T>
  } catch {
    return null
  }
}

export function clearRouteState(key: string) {
  sessionStorage.removeItem(prefix + key)
}
