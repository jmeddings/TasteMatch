import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search as SearchIcon, Camera, MapPin, SlidersHorizontal } from 'lucide-react'
import { loadRouteState, saveRouteState } from '../routeState'
import { DishThumbnail } from '../components/DishThumbnail'

export function Search() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null)
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All')
  const [selectedDistance, setSelectedDistance] = useState<string>('Any')
  const [selectedPhotoName, setSelectedPhotoName] = useState<string | null>(null)
  const location = useLocation()

  const restoreKey = useMemo(() => {
    const params = new URLSearchParams(location.search)
    const type = params.get('type') || 'text'
    const restaurant = params.get('restaurant') || ''
    return `search:${type}:${restaurant}`
  }, [location.search])

  const cuisineOptions = useMemo(
    () => ['All', 'Thai', 'Japanese', 'Korean', 'Mediterranean', 'Italian', 'Mexican', 'American', 'Indian'],
    []
  )

  const flavorOptions = useMemo(
    () => ['Spicy', 'Sweet', 'Savory', 'Creamy', 'Crispy', 'Tangy'],
    []
  )

  const distanceOptions = useMemo(() => ['Any', '1 mi', '5 mi', '10 mi'], [])

  const results = useMemo(() => {
    const base = [
      {
        id: '1',
        name: 'Spicy Ramen',
        restaurant: 'Tokyo Express',
        cuisine: 'Japanese',
        distanceMiles: 2.1,
        rating: 4.7,
        flavors: ['Spicy', 'Savory'],
        photo_url: '/api/placeholder/96/96'
      },
      {
        id: '2',
        name: 'Pad Thai',
        restaurant: 'Bangkok Kitchen',
        cuisine: 'Thai',
        distanceMiles: 0.8,
        rating: 4.6,
        flavors: ['Sweet', 'Savory'],
        photo_url: '/api/placeholder/96/96'
      },
      {
        id: '3',
        name: 'Bibimbap',
        restaurant: 'Seoul House',
        cuisine: 'Korean',
        distanceMiles: 1.2,
        rating: 4.3,
        flavors: ['Savory', 'Tangy'],
        photo_url: '/api/placeholder/96/96'
      }
    ]

    const maxDistance = (() => {
      if (selectedDistance === '1 mi') return 1
      if (selectedDistance === '5 mi') return 5
      if (selectedDistance === '10 mi') return 10
      return null
    })()

    return base.filter((item) => {
      const q = searchQuery.trim().toLowerCase()
      const matchesQuery =
        q.length === 0 ||
        item.name.toLowerCase().includes(q) ||
        item.restaurant.toLowerCase().includes(q)

      const matchesFlavor = !selectedFlavor || item.flavors.includes(selectedFlavor)
      const matchesCuisine = selectedCuisine === 'All' || item.cuisine === selectedCuisine
      const matchesDistance = maxDistance === null || item.distanceMiles <= maxDistance
      return matchesQuery && matchesFlavor
        && matchesCuisine && matchesDistance
    })
  }, [searchQuery, selectedCuisine, selectedDistance, selectedFlavor])

  const recentSearches = useMemo(
    () => [
      {
        id: 'r1',
        title: 'Pad Thai',
        subtitle: 'Sweet, savory, nutty',
        photo_url: '/api/placeholder/96/96',
        query: 'Pad Thai'
      },
      {
        id: 'r2',
        title: 'Margherita Pizza',
        subtitle: 'Savory, cheesy, herby',
        photo_url: '/api/placeholder/96/96',
        query: 'Margherita Pizza'
      }
    ],
    []
  )

  useEffect(() => {
    const state = (location.state || {}) as { restore?: boolean; restoreKey?: string }
    if (!state.restore || state.restoreKey !== restoreKey) return

    const cached = loadRouteState<{
      searchQuery: string
      selectedFlavor: string | null
      selectedCuisine: string
      selectedDistance: string
      selectedPhotoName: string | null
    }>(restoreKey)
    if (!cached) return

    setSearchQuery(cached.data.searchQuery)
    setSelectedFlavor(cached.data.selectedFlavor)
    setSelectedCuisine(cached.data.selectedCuisine)
    setSelectedDistance(cached.data.selectedDistance)
    setSelectedPhotoName(cached.data.selectedPhotoName)

    requestAnimationFrame(() => {
      window.scrollTo(0, cached.scroll.scrollY)
    })
  }, [location.state, restoreKey])

  useEffect(() => {
    const handleSave = () => {
      saveRouteState(
        restoreKey,
        { searchQuery, selectedFlavor, selectedCuisine, selectedDistance, selectedPhotoName },
        window.scrollY
      )
    }

    window.addEventListener('scroll', handleSave, { passive: true })
    return () => window.removeEventListener('scroll', handleSave)
  }, [restoreKey, searchQuery, selectedCuisine, selectedDistance, selectedFlavor, selectedPhotoName])

  useEffect(() => {
    saveRouteState(
      restoreKey,
      { searchQuery, selectedFlavor, selectedCuisine, selectedDistance, selectedPhotoName },
      window.scrollY
    )
  }, [restoreKey, searchQuery, selectedCuisine, selectedDistance, selectedFlavor, selectedPhotoName])

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Find Your Next Favorite Dish
        </h2>
        <p className="text-gray-600">
          Search by name, flavor, and photo — all in one place
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for dishes, flavors, or restaurants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <label className="flex items-center justify-center gap-2 p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <Camera size={20} />
            <span>{selectedPhotoName ? 'Photo Selected' : 'Add Photo'}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                setSelectedPhotoName(file ? file.name : null)
              }}
            />
          </label>
          <button className="flex items-center justify-center gap-2 p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <MapPin size={20} />
            <span>Nearby</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedFlavor(null)}
            className="flex items-center justify-center gap-2 p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal size={20} />
            <span>Clear Filters</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm font-medium text-gray-700 mb-1">Cuisine Type</div>
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
            >
              {cuisineOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-700 mb-1">Flavor Profile</div>
            <select
              value={selectedFlavor || 'Any'}
              onChange={(e) => setSelectedFlavor(e.target.value === 'Any' ? null : e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
            >
              <option value="Any">Any</option>
              {flavorOptions.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-700 mb-1">Distance</div>
            <select
              value={selectedDistance}
              onChange={(e) => setSelectedDistance(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
            >
              {distanceOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedPhotoName && (
          <div className="mt-3 text-sm text-gray-600">
            Photo selected: <span className="font-medium">{selectedPhotoName}</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Results</h3>
          <span className="text-sm text-gray-600">{results.length} found</span>
        </div>

        <div className="space-y-3">
          {results.map((item) => (
            <Link
              key={item.id}
              to={`/dishes/${item.id}`}
              state={{ from: location.pathname + location.search, restoreKey }}
              className="block bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              onClick={() =>
                saveRouteState(
                  restoreKey,
                  { searchQuery, selectedFlavor, selectedCuisine, selectedDistance, selectedPhotoName },
                  window.scrollY
                )
              }
            >
              <div className="flex items-start gap-4">
                <DishThumbnail photoUrl={item.photo_url} alt={item.name} size="md" />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-600">{item.restaurant} • {item.cuisine} • {item.distanceMiles} mi</div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">{item.rating}</div>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.flavors.map((f) => (
                      <span key={f} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {results.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-gray-600">
              No results match your search.
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Popular Searches</h3>
        <div className="flex flex-wrap gap-2">
          {flavorOptions.map((flavor) => (
            <button
              key={flavor}
              type="button"
              onClick={() => setSelectedFlavor(flavor)}
              className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full hover:bg-primary-200 transition-colors"
            >
              {flavor}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Searches</h3>
        <div className="space-y-2">
          {recentSearches.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSearchQuery(item.query)}
              className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <DishThumbnail photoUrl={item.photo_url} alt={item.title} size="sm" />
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.subtitle}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
