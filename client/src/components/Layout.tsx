import { Link, NavLink, useLocation } from 'react-router-dom'
import { Home, Search, Heart, Star, Store, Users, User } from 'lucide-react'

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/recommendations', icon: Star, label: 'For You' },
    { path: '/favorites', icon: Heart, label: 'Favorites' },
    { path: '/restaurants', icon: Store, label: 'Restaurants' },
    { path: '/community', icon: Users, label: 'Community' },
    { path: '/profile', icon: User, label: 'Profile' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="text-2xl font-bold text-blue-600 whitespace-nowrap">
              TasteMatch
            </Link>

            <nav className="flex-1 overflow-x-auto">
              <div className="flex gap-2 min-w-max justify-end">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive: navIsActive }) =>
                      `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                        navIsActive
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                      }`
                    }
                    aria-current={isActive(item.path) ? 'page' : undefined}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
