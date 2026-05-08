import { useEffect } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Heart, Star, MessageSquarePlus } from 'lucide-react'

type RouteState = {
  from?: string
  restoreKey?: string
}

export function DishDetail() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()

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

        <div className="flex items-center gap-2">
          <Link
            to={`/dishes/${id}/review`}
            className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <MessageSquarePlus className="w-4 h-4 mr-2" />
            Write Review
          </Link>

          <Link
            to="/favorites"
            className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Heart className="w-4 h-4 mr-2" />
            Favorites
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900">Dish Detail</h1>
        <p className="text-gray-600 mt-1">Dish ID: {id}</p>

        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span>4.6</span>
          <span className="text-gray-300">|</span>
          <span>Mock dish details page</span>
        </div>

        <div className="mt-6 space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Description</h2>
            <p className="text-gray-700">This is a placeholder dish detail page used to validate routing and back-navigation context restoration.</p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-900">Actions</h2>
            <div className="mt-2 flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Save
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
