import { useState } from 'react'
import { User, Settings, LogOut, Share2, UserMinus, Trash2 } from 'lucide-react'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { apiRequest, clearStoredSession, getStoredSession } from '../auth'
import { useNavigate } from 'react-router-dom'

export function Profile() {
  const navigate = useNavigate()
  const session = getStoredSession()
  const [confirmUnfollowOpen, setConfirmUnfollowOpen] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

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

          <button
            type="button"
            onClick={() => setConfirmUnfollowOpen(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-t border-gray-200"
          >
            <div className="flex items-center gap-3">
              <UserMinus size={20} className="text-gray-600" />
              <span className="font-medium">Unfollow User</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>

          <button
            type="button"
            onClick={() => setConfirmDeleteOpen(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-t border-gray-200"
          >
            <div className="flex items-center gap-3">
              <Trash2 size={20} className="text-red-600" />
              <span className="font-medium text-red-600">Delete Account</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>

          <button
            type="button"
            onClick={() => {
              clearStoredSession()
              navigate('/welcome')
            }}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-t border-gray-200"
          >
            <div className="flex items-center gap-3">
              <LogOut size={20} className="text-red-600" />
              <span className="font-medium text-red-600">Log Out</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmUnfollowOpen}
        title="Unfollow user"
        message="Are you sure you want to unfollow this user?"
        confirmLabel="Unfollow"
        cancelLabel="Cancel"
        isDanger
        onCancel={() => setConfirmUnfollowOpen(false)}
        onConfirm={() => {
          setConfirmUnfollowOpen(false)
        }}
      />

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete account"
        message="This action cannot be undone. Are you sure you want to delete your account?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isDanger
        disabled={deleting}
        onCancel={() => (deleting ? null : setConfirmDeleteOpen(false))}
        onConfirm={async () => {
          if (!session?.accessToken) {
            clearStoredSession()
            setConfirmDeleteOpen(false)
            navigate('/welcome')
            return
          }

          setDeleting(true)
          try {
            await apiRequest('/api/auth/account', {
              method: 'DELETE',
              accessToken: session.accessToken
            })
          } finally {
            clearStoredSession()
            setDeleting(false)
            setConfirmDeleteOpen(false)
            navigate('/welcome')
          }
        }}
      />
    </div>
  )
}
