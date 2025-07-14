import clsx from 'clsx'
import React from 'react'
import Image from 'next/image'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  width?: number
  height?: number
  logoUrl?: string
  siteName?: string
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className, width = 193, height = 34, logoUrl, siteName } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  // If we have a custom logo URL, use it
  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        alt={siteName || 'Logo'}
        width={width}
        height={height}
        loading={loading}
        priority={priority === 'high'}
        className={clsx('max-w-[9.375rem] w-full h-[34px]', className)}
      />
    )
  }

  // Fallback to default Payload logo
  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="Payload Logo"
      width={width}
      height={height}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('max-w-[9.375rem] w-full h-[34px]', className)}
      src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-logo-light.svg"
    />
  )
}
