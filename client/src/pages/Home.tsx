import { Link } from 'react-router-dom'
import { Search, Heart, Star, Users, Camera, MapPin } from 'lucide-react'

export function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">TasteMatch</h1>
            <p className="text-lg text-gray-600">Discover dishes and restaurants similar to foods you love</p>
          </div>
        </div>
      </header>

      {/* Quick Search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Search</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              to="/search?type=text"
              className="flex flex-col items-center p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Search className="w-12 h-12 text-blue-600 mb-3" />
              <h3 className="text-lg font-medium text-gray-900">Text Search</h3>
              <p className="text-sm text-gray-600 text-center mt-2">Search by dish name, restaurant, or cuisine</p>
            </Link>
            
            <Link 
              to="/search?type=flavor"
              className="flex flex-col items-center p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Star className="w-12 h-12 text-green-600 mb-3" />
              <h3 className="text-lg font-medium text-gray-900">Flavor Search</h3>
              <p className="text-sm text-gray-600 text-center mt-2">Find dishes by taste profiles</p>
            </Link>
            
            <Link 
              to="/search?type=photo"
              className="flex flex-col items-center p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <Camera className="w-12 h-12 text-purple-600 mb-3" />
              <h3 className="text-lg font-medium text-gray-900">Photo Search</h3>
              <p className="text-sm text-gray-600 text-center mt-2">Upload a photo to find similar dishes</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <MapPin className="w-8 h-8 text-red-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Local Discovery</h3>
            </div>
            <p className="text-gray-600">Find similar dishes and restaurants near your location</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Heart className="w-8 h-8 text-pink-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Save Favorites</h3>
            </div>
            <p className="text-gray-600">Build your personal collection of loved dishes</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Users className="w-8 h-8 text-indigo-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Community</h3>
            </div>
            <p className="text-gray-600">Share reviews and connect with food enthusiasts</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Star className="w-8 h-8 text-yellow-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Smart Recommendations</h3>
            </div>
            <p className="text-gray-600">AI-powered suggestions based on your taste preferences</p>
          </div>
        </div>
      </section>

      {/* Navigation Links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Explore</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              to="/recommendations"
              className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2">For You</h3>
              <p className="text-sm text-gray-600">Personalized recommendations based on your taste</p>
            </Link>
            
            <Link 
              to="/restaurants"
              className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2">Restaurants</h3>
              <p className="text-sm text-gray-600">Browse and discover new places to eat</p>
            </Link>
            
            <Link 
              to="/community"
              className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2">Community</h3>
              <p className="text-sm text-gray-600">Reviews, photos, and food experiences</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
