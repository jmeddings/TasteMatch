import { Link, useLocation } from 'react-router-dom'
import { Search, Heart, User } from 'lucide-react'

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary-600">TasteMatch</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 pb-20">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-around py-2">
            <Link
              to="/"
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActive('/') ? 'text-primary-600' : 'text-gray-600'
              }`}
            >
              <Search size={24} />
              <span className="text-xs mt-1">Search</span>
            </Link>
            <Link
              to="/favorites"
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActive('/favorites') ? 'text-primary-600' : 'text-gray-600'
              }`}
            >
              <Heart size={24} />
              <span className="text-xs mt-1">Favorites</span>
            </Link>
            <Link
              to="/profile"
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActive('/profile') ? 'text-primary-600' : 'text-gray-600'
              }`}
            >
              <User size={24} />
              <span className="text-xs mt-1">Profile</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}
