import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { PhotoCard } from '@/components/PhotoCard'

interface Photo {
  id: number
  externalId: number
  albumId: number
  title: string
  url: string
  thumbnailUrl: string
  lastSynced: string
}

interface PhotosPageProps {
  searchParams: Promise<{
    page?: string
    limit?: string
    albumId?: string
  }>
}

export default async function PhotosPage({ searchParams }: PhotosPageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const limit = parseInt(params.limit || '10')
  const albumId = params.albumId

  try {
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

    const photos = result.docs as unknown as Photo[]
    const totalPages = result.totalPages
    const totalDocs = result.totalDocs

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Photos Collection
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Total photos: {totalDocs} • Page {page} of {totalPages}
            </p>
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {photos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <a
                href={`/photos?page=${page - 1}`}
                className={`px-4 py-2 text-sm rounded transition-colors ${
                  page === 1
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Previous
              </a>

              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1
                  return (
                    <a
                      key={pageNum}
                      href={`/photos?page=${pageNum}`}
                      className={`px-3 py-2 text-sm rounded transition-colors ${
                        page === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {pageNum}
                    </a>
                  )
                })}
              </div>

              <a
                href={`/photos?page=${page + 1}`}
                className={`px-4 py-2 text-sm rounded transition-colors ${
                  page === totalPages
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Next
              </a>
            </div>
          )}

          {/* Empty State */}
          {photos.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📷</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No photos found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try syncing photos from the API to see them here.
              </p>
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching photos:', error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Photos Collection
            </h1>
            <p className="text-lg text-red-600 dark:text-red-400">
              Error loading photos. Please try again later.
            </p>
          </div>
        </div>
      </div>
    )
  }
} 