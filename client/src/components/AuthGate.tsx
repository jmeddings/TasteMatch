import { ReactNode, useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { apiRequest, getStoredSession } from '../auth'

type Props = {
  children: ReactNode
}

export function AuthGate({ children }: Props) {
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)
  const [onboardingComplete, setOnboardingComplete] = useState(false)

  useEffect(() => {
    const run = async () => {
      const session = getStoredSession()
      if (!session?.accessToken) {
        setIsAuthed(false)
        setLoading(false)
        return
      }

      setIsAuthed(true)

      try {
        const json = await apiRequest<{ success: boolean; data: { onboarding_complete: boolean } }>(
          '/api/auth/taste-profile',
          {
            accessToken: session.accessToken
          }
        )

        setOnboardingComplete(!!json.data.onboarding_complete)
      } catch {
        setOnboardingComplete(false)
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [])

  if (loading) return null

  const publicPaths = new Set(['/welcome', '/login', '/signup'])
  const isOnboardingPath = location.pathname === '/onboarding'

  if (!isAuthed && !publicPaths.has(location.pathname)) {
    return <Navigate to="/welcome" replace />
  }

  if (isAuthed && !onboardingComplete && !isOnboardingPath && !publicPaths.has(location.pathname)) {
    return <Navigate to="/onboarding" replace />
  }

  if (isAuthed && onboardingComplete && isOnboardingPath) {
    return <Navigate to="/search" replace />
  }

  return <>{children}</>
}
