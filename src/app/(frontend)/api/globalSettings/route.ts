import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(_request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    const globalSettings = (await payload.findGlobal({
      slug: 'globalSettings',
    })) as any

    if (!globalSettings) {
      return NextResponse.json({ error: 'No global settings found' }, { status: 404 })
    }

    // Populate media fields if they exist
    if (globalSettings.logo && typeof globalSettings.logo === 'object' && globalSettings.logo.id) {
      globalSettings.logo = await payload.findByID({
        collection: 'media',
        id: globalSettings.logo.id,
      })
    }

    if (
      globalSettings.favicon &&
      typeof globalSettings.favicon === 'object' &&
      globalSettings.favicon.id
    ) {
      globalSettings.favicon = await payload.findByID({
        collection: 'media',
        id: globalSettings.favicon.id,
      })
    }

    const response = NextResponse.json(globalSettings)
    
    // Add cache control headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')
    
    return response
  } catch (error) {
    console.error('Error fetching global settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 