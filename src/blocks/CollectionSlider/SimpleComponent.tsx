'use client'

import React, { useEffect, useState, useMemo, useRef } from 'react'
import { cn } from '@/utilities/ui'

// Define types for the CollectionSlider block
interface CollectionItem {
  id: string
  title?: string
  name?: string
  slug?: string
  publishedAt?: string
  createdAt?: string
  updatedAt?: string
  lastSynced?: string
  heroImage?: {
    url: string
    alt?: string
  }
  image?: {
    url: string
    alt?: string
  }
  url?: string
  thumbnailUrl?: string
  externalId?: string
  categories?: Array<{
    title: string
    slug: string
  }>
  content?: any
  description?: string
  excerpt?: string
  [key: string]: any
}

interface SimpleCollectionSliderProps {
  title?: string
  description?: string
  collection: 'posts' | 'categories' | 'media' | 'bookings' | 'photos'
  selectionMethod: 'manual' | 'latest' | 'category' | 'featured'
  items?: CollectionItem[]
  category?: {
    id: string
    title: string
    slug: string
  }
  itemsLimit?: number
}

type Props = {
  className?: string
} & SimpleCollectionSliderProps

export const SimpleCollectionSlider: React.FC<Props> = ({ 
  className, 
  title, 
  description,
  collection,
  selectionMethod,
  items: manualItems,
  category,
  itemsLimit = 6,
}) => {
  const [items, setItems] = useState<CollectionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const isMountedRef = useRef(false)

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true)
    isMountedRef.current = true
    
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Collection configuration
  const collectionConfig = {
    posts: {
      apiPath: '/api/posts',
      titleField: 'title',
      dateField: 'publishedAt',
      imageField: 'heroImage',
      slugField: 'slug',
      contentField: 'content',
    },
    categories: {
      apiPath: '/api/categories',
      titleField: 'title',
      dateField: 'createdAt',
      imageField: 'image',
      slugField: 'slug',
      contentField: 'description',
    },
    media: {
      apiPath: '/api/media',
      titleField: 'filename',
      dateField: 'createdAt',
      imageField: 'url',
      slugField: 'id',
      contentField: 'alt',
    },
    bookings: {
      apiPath: '/api/bookings',
      titleField: 'title',
      dateField: 'createdAt',
      imageField: 'image',
      slugField: 'id',
      contentField: 'description',
    },
    photos: {
      apiPath: '/api/photos',
      titleField: 'title',
      dateField: 'lastSynced',
      imageField: 'url',
      slugField: 'externalId',
      contentField: 'title',
    },
  }

  const config = useMemo(() => collectionConfig[collection], [collection])

  // Fetch items based on selection method
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true)
      
      try {
        let url = config.apiPath
        const params = new URLSearchParams()
        
        switch (selectionMethod) {
          case 'manual':
            if (manualItems && manualItems.length > 0) {
              setItems(manualItems)
              setLoading(false)
              return
            }
            break
            
          case 'latest':
            params.append('sort', `-${config.dateField}`)
            params.append('limit', itemsLimit.toString())
            break
            
          case 'category':
            if (category?.id) {
              params.append('where[categories][in]', category.id)
              params.append('sort', `-${config.dateField}`)
              params.append('limit', itemsLimit.toString())
            }
            break
            
          case 'featured':
            params.append('sort', `-${config.dateField}`)
            params.append('limit', itemsLimit.toString())
            break
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`
        }
        
        console.log('Fetching from:', url)
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          console.log(`Fetched ${collection} data:`, data)
          if (isMountedRef.current) {
            setItems(data.docs || [])
          }
        } else {
          console.error(`Failed to fetch ${collection}:`, response.status, response.statusText)
        }
      } catch (error) {
        console.error(`Error fetching ${collection}:`, error)
      } finally {
        if (isMountedRef.current) {
          setLoading(false)
        }
      }
    }
    
    fetchItems()
  }, [collection, selectionMethod, manualItems, category, itemsLimit, config.apiPath, config.dateField])

  if (!isClient) {
    return (
      <div className={cn('mx-auto my-8 w-full', className)}>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={cn('mx-auto my-8 w-full', className)}>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading {collection}...</p>
        </div>
      </div>
    )
  }

  if (!items || items.length === 0) {
    return (
      <div className={cn('mx-auto my-8 w-full', className)}>
        <div className="text-center py-12">
          <p className="text-gray-600">No {collection} found.</p>
          <p className="text-sm text-gray-500 mt-2">Selection method: {selectionMethod}</p>
          {category && <p className="text-sm text-gray-500">Category: {category.title}</p>}
        </div>
      </div>
    )
  }

  // Helper function to get item data
  const getItemData = (item: CollectionItem) => {
    const title = item[config.titleField] || item.title || item.name || 'Untitled'
    const date = item[config.dateField] || item.createdAt || item.updatedAt || item.lastSynced
    const image = item[config.imageField] || item.heroImage || item.image || item.url || item.thumbnailUrl
    const slug = item[config.slugField] || item.slug || item.id || item.externalId
    const content = item[config.contentField] || item.content || item.description || item.excerpt || title

    return { title, date, image, slug, content }
  }

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  console.log('SimpleCollectionSlider render:', { 
    isClient, 
    loading, 
    itemsCount: items?.length, 
    collection, 
    selectionMethod 
  })

  return (
    <div className={cn('mx-auto my-8 w-full bg-white', className)}>
      {title && (
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          {description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{description}</p>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const { title, date, image, content } = getItemData(item)
          
          return (
            <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Item Image */}
              {image && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={typeof image === 'string' ? image : image.url}
                    alt={typeof image === 'string' ? title : image.alt || title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              
              {/* Item Content */}
              <div className="p-4">
                {/* Title */}
                <h3 className="text-xl font-bold mb-2 hover:text-blue-600 transition-colors duration-300">
                  {title}
                </h3>
                
                {/* Date */}
                {date && (
                  <p className="text-sm text-gray-500 mb-2">
                    {formatDate(date)}
                  </p>
                )}
                
                {/* Content */}
                {content && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {typeof content === 'string' ? content.substring(0, 150) + '...' : 'Content available'}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 