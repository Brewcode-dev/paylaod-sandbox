'use client'

import React from 'react'
import { useGlobalSettings } from '../hooks/useGlobalSettings'

export const GoogleAnalytics: React.FC = () => {
  const { settings, loading, error } = useGlobalSettings()

  if (loading || error || !settings) {
    return null
  }

  const { googleAnalytics } = settings

  if (!googleAnalytics?.enabled || !googleAnalytics?.trackingId) {
    return null
  }

  return (
    <>
      {/* Google Analytics 4 */}
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalytics.trackingId}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleAnalytics.trackingId}');
          `,
        }}
      />
    </>
  )
} 