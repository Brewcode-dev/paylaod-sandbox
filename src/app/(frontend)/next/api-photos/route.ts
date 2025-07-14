import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '../../../../payload.config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const albumId = searchParams.get('albumId')

    const payload = await getPayload({ config })

    // Build query
    const query: any = {}
    if (albumId) {
      query.albumId = {
        equals: parseInt(albumId)
      }
    }

    // Fetch photos with pagination
    const result = await payload.find({
      collection: 'photos',
      where: query,
      page,
      limit,
      sort: '-lastSynced', // Sort by most recent sync
    })

    return NextResponse.json({
      success: true,
      docs: result.docs,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
    })
  } catch (error) {
    console.error('Error fetching photos:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 