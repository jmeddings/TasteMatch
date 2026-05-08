import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest, setStoredSession } from '../auth'

type Errors = {
  email?: string
  username?: string
  password?: string
  form?: string
}

export function Signup() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)

  const canSubmit = useMemo(() => !submitting, [submitting])

  const validate = () => {
    const next: Errors = {}

    const e = email.trim()
    if (!e) next.email = 'Email is required.'
    else if (!/^\S+@\S+\.\S+$/.test(e)) next.email = 'Enter a valid email.'

    const u = username.trim()
    if (!u) next.username = 'Username is required.'
    else if (u.length < 3) next.username = 'Username must be at least 3 characters.'

    if (!password) next.password = 'Password is required.'
    else if (password.length < 8) next.password = 'Password must be at least 8 characters.'

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault()
    setErrors({})

    if (!validate()) return

    setSubmitting(true)
    try {
      await apiRequest('/api/auth/signup', {
        method: 'POST',
        body: { email: email.trim(), username: username.trim(), password }
      })

      const login = await apiRequest<{
        success: boolean
        data: { session: { access_token: string; refresh_token?: string; expires_at?: number | null } }
      }>('/api/auth/signin', {
        method: 'POST',
        body: { email: email.trim(), password }
      })

      setStoredSession({
        accessToken: login.data.session.access_token,
        refreshToken: login.data.session.refresh_token || null,
        expiresAt: login.data.session.expires_at || null
      })

      navigate('/onboarding')
    } catch (e) {
      setErrors({ form: (e as Error).message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Sign up</h1>

        {errors.form && <div className="text-sm text-red-600">{errors.form}</div>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setErrors((prev) => ({ ...prev, email: undefined }))
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            type="email"
            autoComplete="email"
          />
          {errors.email && <div className="mt-1 text-sm text-red-600">{errors.email}</div>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            value={username}
            onChange={(e) => {
              setUsername(e.target.value)
              setErrors((prev) => ({ ...prev, username: undefined }))
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            type="text"
            autoComplete="username"
          />
          {errors.username && <div className="mt-1 text-sm text-red-600">{errors.username}</div>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setErrors((prev) => ({ ...prev, password: undefined }))
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            type="password"
            autoComplete="new-password"
          />
          {errors.password && <div className="mt-1 text-sm text-red-600">{errors.password}</div>}
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting ? 'Creating account...' : 'Create account'}
        </button>

        <div className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700">
            Log in
          </Link>
        </div>
      </form>
    </div>
  )
}
