"use client"

import React from 'react'

interface Photo {
  id: number
  externalId: number
  albumId: number
  title: string
  url: string
  thumbnailUrl: string
  lastSynced: string
}

interface PhotoCardProps {
  photo: Photo
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ photo }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YWFhYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg=='
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(photo.url)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
      {/* Thumbnail */}
      <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          src={photo.thumbnailUrl}
          alt={photo.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 line-clamp-2">
          {photo.title}
        </h3>
        
        <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex justify-between">
            <span>ID:</span>
            <span className="font-mono">{photo.externalId}</span>
          </div>
          <div className="flex justify-between">
            <span>Album:</span>
            <span>{photo.albumId}</span>
          </div>
          <div className="flex justify-between">
            <span>Synced:</span>
            <span>{new Date(photo.lastSynced).toLocaleDateString('pl-PL')}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <a
              href={photo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-center"
            >
              View Full
            </a>
            <button
              onClick={handleCopyUrl}
              className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              title="Copy URL"
            >
              📋
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 