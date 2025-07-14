import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
import { MetaTags } from '@/components/MetaTags'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <MetaTags />
        <GoogleAnalytics />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  // Get favicon from global settings
  let faviconUrl: string | undefined
  try {
    const { getPayload } = await import('payload')
    const config = await import('@payload-config')
    const payload = await getPayload({ config: config.default })
    
    const globalSettings = await payload.find({
      collection: 'globalSettings',
      limit: 1,
      sort: '-createdAt',
    })

    console.log('Global settings found:', globalSettings.docs?.length || 0)

    if (globalSettings.docs && globalSettings.docs.length > 0) {
      const settings = globalSettings.docs[0]
      const favicon = settings.favicon

      console.log('Favicon from settings:', favicon)

      if (favicon && typeof favicon === 'object' && 'url' in favicon && favicon.url) {
        const filename = favicon.url.split('/').pop()
        console.log('Filename:', filename)
        if (filename) {
          const { getMediaUrl } = await import('@/utilities/getMediaUrl')
          faviconUrl = getMediaUrl(`/media/${filename}`, favicon.updatedAt)
          console.log('Generated favicon URL:', faviconUrl)
        }
      }
    }
  } catch (error) {
    console.error('Error fetching favicon:', error)
  }

  return {
    metadataBase: new URL(getServerSideURL()),
    openGraph: mergeOpenGraph(),
    twitter: {
      card: 'summary_large_image',
      creator: '@payloadcms',
    },
    icons: faviconUrl ? {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    } : undefined,
  }
}
