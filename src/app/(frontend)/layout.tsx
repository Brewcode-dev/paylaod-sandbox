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
import WcagToggle from '@/components/WcagToggle'
import { getGlobalSettings } from '@/utilities/getGlobalSettings'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
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
          <WcagToggle />
        </Providers>
      </body>
    </html>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const globalSettings = await getGlobalSettings()
  
  // Get favicon from global settings
  let faviconUrl: string | undefined

  if (globalSettings) {
    const favicon = globalSettings.favicon

    if (favicon && typeof favicon === 'object') {
      if ('url' in favicon && favicon.url) {
        // If favicon has direct URL (from API)
        const { getMediaUrl } = await import('@/utilities/getMediaUrl')
        faviconUrl = getMediaUrl(favicon.url, favicon.updatedAt)
      } else if ('id' in favicon && favicon.id) {
        // If favicon has ID, populate it
        try {
          const { getPayload } = await import('payload')
          const config = await import('@payload-config')
          const payload = await getPayload({ config: config.default })
          
          const populatedFavicon = await payload.findByID({
            collection: 'media',
            id: favicon.id,
          })
          if (populatedFavicon && 'url' in populatedFavicon && populatedFavicon.url) {
            const { getMediaUrl } = await import('@/utilities/getMediaUrl')
            faviconUrl = getMediaUrl(populatedFavicon.url, populatedFavicon.updatedAt)
          }
        } catch (error) {
          console.error('Error populating favicon:', error)
        }
      }
    }

    // Fallback to static favicon if not found in global settings
    if (!faviconUrl) {
      faviconUrl = '/favicon.ico'
    }
  }
  
  return {
    title: globalSettings?.siteName || 'Payload Website Template',
    description: globalSettings?.siteDescription || 'An open-source website built with Payload and Next.js.',
    metadataBase: new URL(getServerSideURL()),
    openGraph: await mergeOpenGraph(),
    twitter: {
      card: 'summary_large_image',
      creator: '@payloadcms',
    },
    icons: faviconUrl
      ? {
          icon: faviconUrl,
          shortcut: faviconUrl,
          apple: faviconUrl,
        }
      : undefined,
  }
}

