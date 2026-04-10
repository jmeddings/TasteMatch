import { User, Settings, LogOut, Share2 } from 'lucide-react'

export function Profile() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
          <User className="text-gray-400" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">John Doe</h2>
        <p className="text-gray-600">Food enthusiast</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Profile Stats</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary-600">24</p>
              <p className="text-sm text-gray-600">Favorites</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-600">156</p>
              <p className="text-sm text-gray-600">Reviews</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-600">89</p>
              <p className="text-sm text-gray-600">Photos</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Settings size={20} className="text-gray-600" />
              <span className="font-medium">Settings</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>
          <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-t border-gray-200">
            <div className="flex items-center gap-3">
              <Share2 size={20} className="text-gray-600" />
              <span className="font-medium">Share Profile</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>
          <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-t border-gray-200">
            <div className="flex items-center gap-3">
              <LogOut size={20} className="text-red-600" />
              <span className="font-medium text-red-600">Log Out</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>
        </div>
      </div>
    </div>
  )
}
