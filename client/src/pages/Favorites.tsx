import { Heart, MapPin, Star } from 'lucide-react'

export function Favorites() {
  const favorites = [
    {
      id: 1,
      name: 'Spicy Ramen',
      restaurant: 'Ramen House',
      location: 'Downtown',
      rating: 4.8,
      image: '/api/placeholder/300/200',
      flavors: ['Spicy', 'Savory', 'Rich']
    },
    {
      id: 2,
      name: 'Margherita Pizza',
      restaurant: 'Pizza Palace',
      location: 'Midtown',
      rating: 4.6,
      image: '/api/placeholder/300/200',
      flavors: ['Savory', 'Cheesy', 'Herby']
    }
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Your Favorites
        </h2>
        <p className="text-gray-600">
          Dishes and restaurants you love
        </p>
      </div>

      <div className="grid gap-4">
        {favorites.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex">
              <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">
                <Heart className="text-gray-400" size={24} />
              </div>
              <div className="flex-1 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                    <p className="text-gray-600">{item.restaurant}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-500">{item.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{item.rating}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  {item.flavors.map((flavor) => (
                    <span
                      key={flavor}
                      className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                    >
                      {flavor}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {favorites.length === 0 && (
        <div className="text-center py-12">
          <Heart className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
          <p className="text-gray-600">Start exploring and save your favorite dishes!</p>
        </div>
      )}
    </div>
  )
}
