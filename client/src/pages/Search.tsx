import { useState } from 'react'
import { Search as SearchIcon, Camera, MapPin } from 'lucide-react'

export function Search() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Find Your Next Favorite Dish
        </h2>
        <p className="text-gray-600">
          Search by name, flavor, or take a photo
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

        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Camera size={20} />
            <span>Search by Photo</span>
          </button>
          <button className="flex items-center justify-center gap-2 p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <MapPin size={20} />
            <span>Nearby</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Popular Searches</h3>
        <div className="flex flex-wrap gap-2">
          {['Spicy', 'Sweet', 'Savory', 'Creamy', 'Crispy', 'Tangy'].map((flavor) => (
            <button
              key={flavor}
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
          <div className="p-3 bg-white border border-gray-200 rounded-lg">
            <p className="font-medium">Pad Thai</p>
            <p className="text-sm text-gray-600">Sweet, savory, nutty</p>
          </div>
          <div className="p-3 bg-white border border-gray-200 rounded-lg">
            <p className="font-medium">Margherita Pizza</p>
            <p className="text-sm text-gray-600">Savory, cheesy, herby</p>
          </div>
        </div>
      </div>
    </div>
  )
}
