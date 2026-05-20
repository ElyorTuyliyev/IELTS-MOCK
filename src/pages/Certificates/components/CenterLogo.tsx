import { useEffect, useState } from 'react'

import defaultLogoUrl from '/certificates/center-logo-default.svg?url'

import { resolveCenterLogoUrl } from '../utils/resolveCenterLogoUrl'

type CenterLogoProps = {
  src?: string | null
  alt?: string
  variant?: 'stamp' | 'footer'
  className?: string
}

export function CenterLogo({
  src,
  alt = 'Test centre logo',
  variant = 'footer',
  className,
}: CenterLogoProps) {
  const resolved = resolveCenterLogoUrl(src) ?? defaultLogoUrl
  const [imgSrc, setImgSrc] = useState(resolved)
  const isStamp = variant === 'stamp'

  useEffect(() => {
    setImgSrc(resolved)
  }, [resolved])

  const handleError = () => {
    if (imgSrc !== defaultLogoUrl) {
      setImgSrc(defaultLogoUrl)
    }
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      width={isStamp ? 44 : 96}
      height={isStamp ? 44 : 48}
      draggable={false}
      onError={handleError}
    />
  )
}
