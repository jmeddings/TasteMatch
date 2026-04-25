import { Link } from 'react-router-dom'
import { Search, MapPin, Star, Phone, Globe, Clock, Filter } from 'lucide-react'

export function Restaurants() {
  // Mock data for restaurants
  const restaurants = [
    {
      id: 1,
      name: "Bangkok Kitchen",
      cuisine: ["Thai", "Asian"],
      rating: 4.5,
      priceRange: "$$",
      distance: "0.8 mi",
      address: "123 Main St, Downtown",
      phone: "(555) 123-4567",
      website: "bangkokkitchen.com",
      hours: "11:00 AM - 10:00 PM",
      popularDishes: ["Pad Thai", "Green Curry", "Tom Yum"],
      specialties: ["Spicy", "Vegetarian Options"]
    },
    {
      id: 2,
      name: "Seoul House",
      cuisine: ["Korean", "BBQ"],
      rating: 4.3,
      priceRange: "$$",
      distance: "1.2 mi",
      address: "456 Oak Ave, Midtown",
      phone: "(555) 234-5678",
      website: "seoulhouse.com",
      hours: "12:00 PM - 11:00 PM",
      popularDishes: ["Bibimbap", "Korean BBQ", "Kimchi"],
      specialties: ["BBQ", "Fermented Foods"]
    },
    {
      id: 3,
      name: "Tokyo Express",
      cuisine: ["Japanese", "Ramen"],
      rating: 4.7,
      priceRange: "$",
      distance: "2.1 mi",
      address: "789 Pine St, Uptown",
      phone: "(555) 345-6789",
      website: "tokyoexpress.com",
      hours: "11:30 AM - 9:30 PM",
      popularDishes: ["Ramen", "Sushi", "Tempura"],
      specialties: ["Ramen", "Fresh Fish"]
    },
    {
      id: 4,
      name: "Mediterranean Delights",
      cuisine: ["Mediterranean", "Greek"],
      rating: 4.4,
      priceRange: "$$$",
      distance: "3.5 mi",
      address: "321 Elm St, Westside",
      phone: "(555) 456-7890",
      website: "meddelights.com",
      hours: "5:00 PM - 11:00 PM",
      popularDishes: ["Gyros", "Falafel", "Hummus"],
      specialties: ["Healthy", "Vegetarian"]
    }
  ]

  const cuisineFilters = [
    "All", "Asian", "Italian", "Mexican", "American", "Indian", "Mediterranean", "Thai", "Japanese", "Korean"
  ]

  const priceFilters = ["All", "$", "$$", "$$$", "$$$$"]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Restaurants</h1>
          <p className="text-gray-600 mt-2">Discover new dining experiences near you</p>
        </div>
      </header>

      {/* Search and Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search restaurants, cuisines, or dishes..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>

          {/* Filter Tags */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Cuisine Type</h3>
              <div className="flex flex-wrap gap-2">
                {cuisineFilters.map((cuisine) => (
                  <button
                    key={cuisine}
                    className={`px-3 py-1 rounded-full text-sm ${
                      cuisine === "All"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } transition-colors`}
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
              <div className="flex flex-wrap gap-2">
                {priceFilters.map((price) => (
                  <button
                    key={price}
                    className={`px-3 py-1 rounded-full text-sm ${
                      price === "All"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } transition-colors`}
                  >
                    {price}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurant List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {restaurants.length} Restaurants Found
          </h2>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option>Sort by: Recommended</option>
            <option>Distance</option>
            <option>Rating</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        <div className="space-y-6">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{restaurant.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {restaurant.cuisine.map((c) => (
                      <span key={c} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        {c}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      {restaurant.rating}
                    </div>
                    <div>{restaurant.priceRange}</div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {restaurant.distance}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-green-600">Open</div>
                  <div className="text-sm text-gray-500">Closes {restaurant.hours.split(' - ')[1]}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {restaurant.address}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {restaurant.phone}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {restaurant.hours}
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Popular Dishes</h4>
                    <div className="flex flex-wrap gap-1">
                      {restaurant.popularDishes.map((dish) => (
                        <span key={dish} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                          {dish}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Specialties</h4>
                    <div className="flex flex-wrap gap-1">
                      {restaurant.specialties.map((specialty) => (
                        <span key={specialty} className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex gap-2">
                  <a
                    href={`tel:${restaurant.phone}`}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Call
                  </a>
                  <a
                    href={`https://${restaurant.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Website
                  </a>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/search?restaurant=${encodeURIComponent(restaurant.name)}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Menu
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
