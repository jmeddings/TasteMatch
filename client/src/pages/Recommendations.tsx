import { Link } from 'react-router-dom'
import { Star, MapPin, Clock, Heart, ArrowRight } from 'lucide-react'

export function Recommendations() {
  // Mock data for recommendations
  const recommendations = [
    {
      id: 1,
      dishName: "Spicy Thai Basil Chicken",
      restaurantName: "Bangkok Kitchen",
      cuisine: "Thai",
      matchScore: 95,
      distance: "0.8 mi",
      price: "$$",
      rating: 4.5,
      reason: "Based on your love for spicy dishes"
    },
    {
      id: 2,
      dishName: "Korean Bibimbap",
      restaurantName: "Seoul House",
      cuisine: "Korean",
      matchScore: 88,
      distance: "1.2 mi",
      price: "$$",
      rating: 4.3,
      reason: "Similar to your favorite Mixed Rice Bowl"
    },
    {
      id: 3,
      dishName: "Japanese Ramen",
      restaurantName: "Tokyo Express",
      cuisine: "Japanese",
      matchScore: 82,
      distance: "2.1 mi",
      price: "$",
      rating: 4.7,
      reason: "Rich umami flavors you enjoy"
    }
  ]

  const categories = [
    { name: "Spicy & Bold", count: 12, color: "bg-red-100 text-red-800" },
    { name: "Comfort Food", count: 8, color: "bg-yellow-100 text-yellow-800" },
    { name: "Light & Fresh", count: 6, color: "bg-green-100 text-green-800" },
    { name: "Sweet Desserts", count: 4, color: "bg-pink-100 text-pink-800" }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">For You</h1>
          <p className="text-gray-600 mt-2">Personalized recommendations based on your taste preferences</p>
        </div>
      </header>

      {/* Taste Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Taste Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div key={category.name} className={`${category.color} rounded-lg p-4 text-center`}>
              <h3 className="font-medium">{category.name}</h3>
              <p className="text-sm opacity-75">{category.count} dishes</p>
            </div>
          ))}
        </div>
      </section>

      {/* Personalized Recommendations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recommended for You</h2>
          <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
            Refresh
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        <div className="space-y-4">
          {recommendations.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{item.dishName}</h3>
                  <p className="text-gray-600">{item.restaurantName}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {item.distance}
                    </span>
                    <span>{item.price}</span>
                    <span className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      {item.rating}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{item.matchScore}%</div>
                  <div className="text-sm text-gray-500">Match</div>
                </div>
              </div>

              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {item.reason}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                    {item.cuisine}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <Link 
                    to={`/restaurants/${item.restaurantName}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Taste Profile Insights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Taste Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Flavor Preferences</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Spicy</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Savory</span>
                  <span className="font-medium">70%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Sweet</span>
                  <span className="font-medium">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-pink-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Recent Activity</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Searched for "spicy noodles" - 2 hours ago
                </div>
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-2" />
                  Saved Pad Thai - Yesterday
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  Reviewed Thai restaurant - 3 days ago
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Recommendation Tips</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Try more spicy Asian dishes</li>
                <li>• Explore Korean cuisine</li>
                <li>• Consider vegetarian options</li>
                <li>• Check out lunch specials</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
