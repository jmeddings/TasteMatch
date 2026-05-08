import { useEffect } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Globe, MapPin, Star } from 'lucide-react'

type RouteState = {
  from?: string
  restoreKey?: string
}

export function RestaurantDetail() {
  const navigate = useNavigate()
  const location = useLocation()
  const { slug } = useParams()

  const state = (location.state || {}) as RouteState

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleBack = () => {
    if (state.from) {
      navigate(state.from, { state: { restore: true, restoreKey: state.restoreKey } })
      return
    }

    navigate(-1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <Link
          to="/restaurants"
          className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Restaurants
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900">Restaurant Detail</h1>
        <p className="text-gray-600 mt-1">Restaurant: {slug}</p>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-600">
          <span className="inline-flex items-center">
            <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
            4.5
          </span>
          <span className="inline-flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            0.8 mi
          </span>
          <a
            href="#"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <Globe className="w-4 h-4 mr-1" />
            Website
          </a>
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-semibold text-gray-900">About</h2>
          <p className="text-gray-700 mt-1">This is a placeholder restaurant detail page used to validate routing and back-navigation context restoration.</p>
        </div>
      </div>
    </div>
  )
}
