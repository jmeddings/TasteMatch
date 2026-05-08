import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Star, Upload, X } from 'lucide-react'
import { ConfirmDialog } from '../components/ConfirmDialog'

type Errors = {
  rating?: string
  reviewText?: string
}

type SelectedPhoto = {
  file: File
  previewUrl: string
}

export function Review() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [rating, setRating] = useState<number | null>(null)
  const [reviewText, setReviewText] = useState('')
  const [photos, setPhotos] = useState<SelectedPhoto[]>([])
  const [errors, setErrors] = useState<Errors>({})
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const title = useMemo(() => {
    if (id) return `Write a Review (Dish ${id})`
    return 'Write a Review'
  }, [id])

  useEffect(() => {
    return () => {
      for (const p of photos) URL.revokeObjectURL(p.previewUrl)
    }
  }, [photos])

  const validate = () => {
    const next: Errors = {}

    if (!rating) next.rating = 'Rating is required.'

    const trimmed = reviewText.trim()
    if (trimmed.length < 10) next.reviewText = 'Review must be at least 10 characters.'

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const openConfirm = () => {
    if (!validate()) return
    setIsConfirmOpen(true)
  }

  const onSubmit = async () => {
    setIsSubmitting(true)

    try {
      await new Promise((r) => setTimeout(r, 400))
      setIsConfirmOpen(false)
      navigate(-1)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>

        <div className="w-16" />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 space-y-6">
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">Rating</div>
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, idx) => {
              const value = idx + 1
              const filled = (rating || 0) >= value

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setRating(value)
                    setErrors((prev) => ({ ...prev, rating: undefined }))
                  }}
                  className="p-1"
                  aria-label={`Set rating to ${value}`}
                >
                  <Star
                    className={filled ? 'w-7 h-7 text-yellow-500 fill-current' : 'w-7 h-7 text-gray-300'}
                  />
                </button>
              )
            })}
            {rating && (
              <button
                type="button"
                onClick={() => setRating(null)}
                className="ml-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Clear
              </button>
            )}
          </div>
          {errors.rating && <div className="mt-2 text-sm text-red-600">{errors.rating}</div>}
        </div>

        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">Review</div>
          <textarea
            value={reviewText}
            onChange={(e) => {
              setReviewText(e.target.value)
              setErrors((prev) => ({ ...prev, reviewText: undefined }))
            }}
            rows={6}
            placeholder="Share what you liked, what you ordered, and any tips for others..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.reviewText && <div className="mt-2 text-sm text-red-600">{errors.reviewText}</div>}
        </div>

        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">Photos (optional)</div>

          <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            Add photos
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || [])
                if (files.length === 0) return

                setPhotos((prev) => {
                  const next = [...prev]
                  for (const file of files) {
                    next.push({ file, previewUrl: URL.createObjectURL(file) })
                  }
                  return next
                })

                e.currentTarget.value = ''
              }}
            />
          </label>

          {photos.length > 0 && (
            <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
              {photos.map((p, idx) => (
                <div key={p.previewUrl} className="relative">
                  <img
                    src={p.previewUrl}
                    alt={p.file.name}
                    className="w-full aspect-square rounded-md bg-gray-200 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      URL.revokeObjectURL(p.previewUrl)
                      setPhotos((prev) => prev.filter((_, i) => i !== idx))
                    }}
                    className="absolute top-1 right-1 inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/90 hover:bg-white text-gray-700"
                    aria-label={`Remove ${p.file.name}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={openConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Publish
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={isConfirmOpen}
        title="Confirm publish"
        message="Are you sure you want to publish this review?"
        confirmLabel={isSubmitting ? 'Publishing...' : 'Confirm & Publish'}
        cancelLabel="Cancel"
        disabled={isSubmitting}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={onSubmit}
      >
        <div className="space-y-2 text-sm text-gray-700">
          <div>
            <span className="font-medium">Rating:</span> {rating}
          </div>
          <div className="line-clamp-4">
            <span className="font-medium">Review:</span> {reviewText.trim()}
          </div>
          {photos.length > 0 && (
            <div>
              <span className="font-medium">Photos:</span> {photos.length}
            </div>
          )}
        </div>
      </ConfirmDialog>
    </div>
  )
}
