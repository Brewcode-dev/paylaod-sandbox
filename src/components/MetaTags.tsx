'use client'

import React from 'react'
import { useGlobalSettings } from '../hooks/useGlobalSettings'

interface MetaTagsProps {
  title?: string
  description?: string
  image?: string
  url?: string
}

export const MetaTags: React.FC<MetaTagsProps> = ({
  title,
  description,
  image,
  url,
}) => {
  const { settings, loading, error } = useGlobalSettings()

  if (loading || error || !settings) {
    return null
  }

  const siteName = settings.siteName
  const siteDescription = settings.siteDescription

  // Use provided values or fall back to global settings
  const metaTitle = title || siteName
  const metaDescription = description || siteDescription
  const metaImage = image
  const metaUrl = url || (typeof window !== 'undefined' ? window.location.href : '')

  return (
    <>
      {/* Basic Meta Tags */}
      <title>{metaTitle}</title>
      {metaDescription && <meta name="description" content={metaDescription} />}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={metaTitle} />
      {metaDescription && <meta property="og:description" content={metaDescription} />}
      {metaImage && <meta property="og:image" content={metaImage} />}
      {metaUrl && <meta property="og:url" content={metaUrl} />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      {metaDescription && <meta name="twitter:description" content={metaDescription} />}
      {metaImage && <meta name="twitter:image" content={metaImage} />}
    </>
  )
} 