import { useEffect, useState } from 'react'

type Props = {
  photoUrl?: string | null
  alt: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const placeholderSvg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' fill='%23e5e7eb'/%3E%3Cpath d='M26 64l12-16 10 12 8-10 14 14H26z' fill='%239ca3af'/%3E%3Ccircle cx='34' cy='36' r='6' fill='%239ca3af'/%3E%3C/svg%3E"

function sizeClass(size: Props['size']) {
  if (size === 'sm') return 'w-10 h-10'
  if (size === 'lg') return 'w-16 h-16'
  return 'w-12 h-12'
}

export function DishThumbnail({ photoUrl, alt, size = 'md', className }: Props) {
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
      className={`${sizeClass(size)} rounded-md bg-gray-200 object-cover flex-shrink-0 ${className || ''}`}
      onError={() => {
        if (src !== placeholderSvg) setSrc(placeholderSvg)
      }}
    />
  )
}
