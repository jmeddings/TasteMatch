import { useMemo, useState } from 'react'
import { Heart, MapPin, Star, Trash2 } from 'lucide-react'
import { DishThumbnail } from '../components/DishThumbnail'
import { ConfirmDialog } from '../components/ConfirmDialog'

export function Favorites() {
  const [favorites, setFavorites] = useState(() => [
    {
      id: 1,
      name: 'Spicy Ramen',
      restaurant: 'Ramen House',
      location: 'Downtown',
      rating: 4.8,
      cuisine: 'Japanese',
      photo_url: '/api/placeholder/96/96',
      flavors: ['Spicy', 'Savory', 'Rich']
    },
    {
      id: 2,
      name: 'Margherita Pizza',
      restaurant: 'Pizza Palace',
      location: 'Midtown',
      rating: 4.6,
      cuisine: 'Italian',
      photo_url: '/api/placeholder/96/96',
      flavors: ['Savory', 'Cheesy', 'Herby']
    },
    {
      id: 3,
      name: 'Carnitas Tacos',
      restaurant: 'Taqueria Azul',
      location: 'Westside',
      rating: 4.7,
      cuisine: 'Mexican',
      photo_url: '/api/placeholder/96/96',
      flavors: ['Savory', 'Crispy']
    },
    {
      id: 4,
      name: 'Kung Pao Chicken',
      restaurant: 'Sichuan Garden',
      location: 'Chinatown',
      rating: 4.5,
      cuisine: 'Chinese',
      photo_url: '/api/placeholder/96/96',
      flavors: ['Spicy', 'Tangy']
    }
  ])

  const grouped = useMemo(() => {
    const map = new Map<string, typeof favorites>()

    for (const item of favorites) {
      const key = item.cuisine || 'Other'
      const arr = map.get(key)
      if (arr) {
        arr.push(item)
      } else {
        map.set(key, [item])
      }
    }

    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  }, [favorites])

  const [pendingRemove, setPendingRemove] = useState<{ id: number; name: string } | null>(null)

  const handleUnfavorite = (dishId: number) => {
    const item = favorites.find((x) => x.id === dishId)
    if (!item) return
    setPendingRemove({ id: item.id, name: item.name })
  }

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

      <div className="space-y-8">
        {grouped.map(([cuisine, items]) => (
          <section key={cuisine} className="space-y-3">
            <div className="flex items-center gap-3">
              <DishThumbnail
                photoUrl={items[0]?.photo_url}
                alt={cuisine}
                size="lg"
                className="w-12 h-12"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{cuisine}</h3>
                <p className="text-sm text-gray-600">{items.length} saved</p>
              </div>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="flex">
                    <div className="p-3">
                      <DishThumbnail photoUrl={item.photo_url} alt={item.name} size="lg" />
                    </div>

                    <div className="flex-1 p-4 pl-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">{item.restaurant}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin size={14} className="text-gray-400" />
                            <span className="text-sm text-gray-500">{item.location}</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-1">
                            <Star size={16} className="text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{item.rating}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleUnfavorite(item.id)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-700 hover:bg-red-50"
                            aria-label={`Remove ${item.name} from favorites`}
                          >
                            <Trash2 size={16} />
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
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
          </section>
        ))}
      </div>

      {favorites.length === 0 && (
        <div className="text-center py-12">
          <Heart className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
          <p className="text-gray-600">Start exploring and save your favorite dishes!</p>
        </div>
      )}

      <ConfirmDialog
        open={!!pendingRemove}
        title="Remove favorite"
        message={pendingRemove ? `Remove "${pendingRemove.name}" from your favorites?` : undefined}
        confirmLabel="Remove"
        cancelLabel="Cancel"
        isDanger
        onCancel={() => setPendingRemove(null)}
        onConfirm={() => {
          if (!pendingRemove) return
          setFavorites((prev) => prev.filter((x) => x.id !== pendingRemove.id))
          setPendingRemove(null)
        }}
      />
    </div>
  )
}
