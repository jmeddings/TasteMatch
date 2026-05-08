import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest, getStoredSession } from '../auth'

type Errors = {
  preferences?: string
  form?: string
}

export function Onboarding() {
  const navigate = useNavigate()
  const session = getStoredSession()

  const options = useMemo(
    () => [
      'Spicy',
      'Sweet',
      'Savory',
      'Tangy',
      'Crispy',
      'Creamy',
      'Umami',
      'Smoky'
    ],
    []
  )

  const [selected, setSelected] = useState<string[]>([])
  const [errors, setErrors] = useState<Errors>({})
  const [saving, setSaving] = useState(false)

  const toggle = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
    )
    setErrors((prev) => ({ ...prev, preferences: undefined }))
  }

  const validate = () => {
    const next: Errors = {}
    if (selected.length === 0) next.preferences = 'Select at least one taste preference.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onContinue = async () => {
    setErrors({})
    if (!validate()) return

    if (!session?.accessToken) {
      navigate('/welcome')
      return
    }

    setSaving(true)
    try {
      await apiRequest('/api/auth/taste-profile', {
        method: 'PUT',
        accessToken: session.accessToken,
        body: {
          preferences: { tastes: selected },
          onboarding_complete: true
        }
      })

      navigate('/search')
    } catch (e) {
      setErrors({ form: (e as Error).message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Onboarding</h1>
          <p className="text-gray-600 mt-1">Select your taste preferences to personalize recommendations.</p>
        </div>

        {errors.form && <div className="text-sm text-red-600">{errors.form}</div>}

        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">Taste preferences</div>
          <div className="flex flex-wrap gap-2">
            {options.map((o) => {
              const active = selected.includes(o)
              return (
                <button
                  key={o}
                  type="button"
                  onClick={() => toggle(o)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {o}
                </button>
              )
            })}
          </div>
          {errors.preferences && <div className="mt-2 text-sm text-red-600">{errors.preferences}</div>}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onContinue}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}
