import { useEffect, useState } from 'react'

type Props = {
  photoUrl?: string | null
  alt: string
  className?: string
}

const placeholderSvg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%23e5e7eb'/%3E%3Cpath d='M150 260l90-120 75 90 60-75 105 105H150z' fill='%239ca3af'/%3E%3Ccircle cx='200' cy='140' r='28' fill='%239ca3af'/%3E%3C/svg%3E"

export function RestaurantThumbnail({ photoUrl, alt, className }: Props) {
  const [src, setSrc] = useState<string>(photoUrl || placeholderSvg)

  useEffect(() => {
    setSrc(photoUrl || placeholderSvg)
  }, [photoUrl])

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`w-full h-40 sm:h-44 md:h-48 bg-gray-200 object-cover ${className || ''}`}
      onError={() => {
        if (src !== placeholderSvg) setSrc(placeholderSvg)
      }}
    />
  )
}
