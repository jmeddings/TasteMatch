import { Link } from 'react-router-dom'
import { Star, Heart, MessageCircle, User, Camera, TrendingUp, Clock, MapPin } from 'lucide-react'

export function Community() {
  // Mock data for community content
  const recentReviews = [
    {
      id: 1,
      user: {
        name: "Sarah Chen",
        avatar: "/avatars/sarah.jpg"
      },
      dish: "Spicy Thai Basil Chicken",
      restaurant: "Bangkok Kitchen",
      rating: 5,
      review: "Absolutely amazing! The perfect balance of spice and flavor. Reminds me of authentic street food in Bangkok.",
      images: ["/reviews/thai1.jpg", "/reviews/thai2.jpg"],
      likes: 24,
      comments: 8,
      timestamp: "2 hours ago",
      helpful: 15
    },
    {
      id: 2,
      user: {
        name: "Mike Johnson",
        avatar: "/avatars/mike.jpg"
      },
      dish: "Korean Bibimbap",
      restaurant: "Seoul House",
      rating: 4,
      review: "Great portion size and fresh ingredients. The gochujang sauce could be a bit spicier for my taste, but overall solid experience.",
      images: ["/reviews/bibimbap.jpg"],
      likes: 18,
      comments: 5,
      timestamp: "5 hours ago",
      helpful: 12
    }
  ]

  const topContributors = [
    { name: "FoodieExplorer", reviews: 156, likes: 892, specialty: "Asian Cuisine" },
    { name: "SpicyFoodLover", reviews: 98, likes: 567, specialty: "Spicy Dishes" },
    { name: "VeggieDelights", reviews: 87, likes: 445, specialty: "Vegetarian" },
    { name: "DessertQueen", reviews: 76, likes: 623, specialty: "Desserts" }
  ]

  const trendingDishes = [
    { name: "Spicy Ramen", mentions: 45, trend: "+12%" },
    { name: "Korean BBQ", mentions: 38, trend: "+8%" },
    { name: "Pad Thai", mentions: 32, trend: "+5%" },
    { name: "Bibimbap", mentions: 28, trend: "+15%" }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Community</h1>
          <p className="text-gray-600 mt-2">Share experiences and discover what food lovers are enjoying</p>
        </div>
      </header>

      {/* Community Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">2,847</div>
            <div className="text-gray-600">Active Members</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">15,234</div>
            <div className="text-gray-600">Reviews Shared</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">8,921</div>
            <div className="text-gray-600">Photos Uploaded</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">45,678</div>
            <div className="text-gray-600">Dishes Reviewed</div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Recent Reviews */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Reviews</h2>
                <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                  <option>Most Recent</option>
                  <option>Most Helpful</option>
                  <option>Most Liked</option>
                </select>
              </div>

              <div className="space-y-6">
                {recentReviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-b-0">
                    {/* User Info */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium text-gray-900">{review.user.name}</h3>
                          <p className="text-sm text-gray-500">{review.timestamp}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {review.dish} at {review.restaurant}
                      </h4>
                      <p className="text-gray-700">{review.review}</p>
                    </div>

                    {/* Images */}
                    {review.images.length > 0 && (
                      <div className="flex gap-2 mb-4">
                        {review.images.map((image, index) => (
                          <div
                            key={index}
                            className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center"
                          >
                            <Camera className="w-6 h-6 text-gray-400" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Engagement */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <button className="flex items-center hover:text-red-500 transition-colors">
                          <Heart className="w-4 h-4 mr-1" />
                          {review.likes}
                        </button>
                        <button className="flex items-center hover:text-blue-500 transition-colors">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {review.comments}
                        </button>
                        <button className="flex items-center hover:text-green-500 transition-colors">
                          👍 {review.helpful} Helpful
                        </button>
                      </div>
                      <Link
                        to={`/restaurants/${encodeURIComponent(review.restaurant)}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View Restaurant →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Load More Reviews
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Contributors */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Contributors</h3>
              <div className="space-y-3">
                {topContributors.map((contributor, index) => (
                  <div key={contributor.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                        {index + 1}
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium text-gray-900 text-sm">{contributor.name}</h4>
                        <p className="text-xs text-gray-500">{contributor.specialty}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{contributor.reviews}</div>
                      <div className="text-xs text-gray-500">reviews</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Dishes */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Dishes</h3>
              <div className="space-y-3">
                {trendingDishes.map((dish) => (
                  <div key={dish.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                      <span className="text-sm font-medium text-gray-900">{dish.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{dish.mentions}</div>
                      <div className="text-xs text-green-600">{dish.trend}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Guidelines */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Community Guidelines</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Be respectful and constructive</li>
                <li>• Share honest and detailed reviews</li>
                <li>• Upload high-quality photos</li>
                <li>• Help others with useful tips</li>
                <li>• Report inappropriate content</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
