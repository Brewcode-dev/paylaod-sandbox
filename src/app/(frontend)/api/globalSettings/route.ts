import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(_request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    const globalSettings = await payload.find({
      collection: 'globalSettings',
      limit: 1,
      sort: '-createdAt',
    })

    if (!globalSettings.docs || globalSettings.docs.length === 0) {
      return NextResponse.json(
        { error: 'No global settings found' },
        { status: 404 }
      )
    }

    const settings = globalSettings.docs[0]

    // Populate media fields if they exist
    if (settings.logo && typeof settings.logo === 'object') {
      settings.logo = await payload.findByID({
        collection: 'media',
        id: settings.logo.id,
      })
    }

    if (settings.favicon && typeof settings.favicon === 'object') {
      settings.favicon = await payload.findByID({
        collection: 'media',
        id: settings.favicon.id,
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching global settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 