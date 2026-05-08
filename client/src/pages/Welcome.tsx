import { Link } from 'react-router-dom'

export function Welcome() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Welcome to TasteMatch</h1>
        <p className="text-gray-600">
          Create an account or sign in to start discovering dishes and restaurants you'll love.
        </p>

        <div className="space-y-2">
          <Link
            to="/signup"
            className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign up
          </Link>
          <Link
            to="/login"
            className="block text-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}
