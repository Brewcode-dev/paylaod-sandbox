'use client'

import React from 'react'
import { useGlobalSettings } from '../hooks/useGlobalSettings'
import { Logo } from './Logo/Logo'
import { getMediaUrl } from '../utilities/getMediaUrl'

interface GlobalLogoProps {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  width?: number
  height?: number
}

export const GlobalLogo: React.FC<GlobalLogoProps> = ({
  className,
  loading,
  priority,
  width = 193,
  height = 34,
}) => {
  const { settings, loading: settingsLoading, error } = useGlobalSettings()

  if (settingsLoading) {
    return (
      <div 
        className={`animate-pulse bg-gray-200 rounded ${className}`}
        style={{ width: `${width}px`, height: `${height}px` }}
      />
    )
  }

  if (error) {
    console.error('Error loading global settings:', error)
  }

  // Get logo URL from settings
  let logoUrl: string | undefined
  let siteName: string | undefined

  if (settings) {
    siteName = settings.siteName
    
    // Check if logo exists and has URL
    if (settings.logo && typeof settings.logo === 'object' && 'url' in settings.logo) {
      const rawUrl = settings.logo.url
      if (rawUrl) {
        // Convert API URL to proper media URL
        const filename = rawUrl.split('/').pop() // Get filename from URL
        if (filename) {
          logoUrl = getMediaUrl(`/media/${filename}`, settings.logo.updatedAt)
        }
      }
    }
  }

  return (
    <Logo
      className={className}
      loading={loading}
      priority={priority}
      width={width}
      height={height}
      logoUrl={logoUrl}
      siteName={siteName}
    />
  )
} 