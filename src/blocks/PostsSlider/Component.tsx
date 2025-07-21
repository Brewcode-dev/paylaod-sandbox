'use client'

import React, { useRef, useEffect, useState } from 'react'
import { cn } from '@/utilities/ui'

// Import Swiper components and styles
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// Define types for the PostsSlider block
interface Post {
  id: string
  title: string
  slug: string
  publishedAt: string
  heroImage?: {
    url: string
    alt?: string
  }
  categories?: Array<{
    title: string
    slug: string
  }>
  content?: any // Rich text content for excerpt
}

interface DisplayOptions {
  showImage?: boolean
  showTitle?: boolean
  showExcerpt?: boolean
  showDate?: boolean
  showCategory?: boolean
  excerptLength?: number
}

interface SliderSettings {
  autoplay?: boolean
  delay?: number
  loop?: boolean
  nav?: boolean
  pagination?: boolean
  perView?: string
  space?: number
}

interface StylingOptions {
  cardStyle?: 'modern' | 'minimal' | 'classic'
  theme?: 'light' | 'dark'
  showReadMore?: boolean
}

interface PostsSliderBlockProps {
  title?: string
  description?: string
  selectionMethod: 'manual' | 'latest' | 'category' | 'featured'
  posts?: Post[]
  category?: {
    id: string
    title: string
    slug: string
  }
  postsLimit?: number
  display?: DisplayOptions
  slider?: SliderSettings
  styling?: StylingOptions
}

type Props = {
  className?: string
} & PostsSliderBlockProps

export const PostsSliderBlock: React.FC<Props> = ({ 
  className, 
  title, 
  description,
  selectionMethod,
  posts: manualPosts,
  category,
  postsLimit = 6,
  display = {},
  slider = {},
  styling = {}
}) => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const swiperRef = useRef<any>(null)

  // Fetch posts based on selection method
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      
      try {
        let url = '/api/posts'
        const params = new URLSearchParams()
        
        switch (selectionMethod) {
          case 'manual':
            if (manualPosts && manualPosts.length > 0) {
              setPosts(manualPosts)
              setLoading(false)
              return
            }
            break
            
          case 'latest':
            params.append('sort', '-publishedAt')
            params.append('limit', postsLimit.toString())
            break
            
          case 'category':
            if (category?.id) {
              params.append('where[categories][in]', category.id)
              params.append('sort', '-publishedAt')
              params.append('limit', postsLimit.toString())
            }
            break
            
          case 'featured':
            // Assuming there's a featured field - you might need to adjust this
            params.append('where[featured][equals]', 'true')
            params.append('sort', '-publishedAt')
            params.append('limit', postsLimit.toString())
            break
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`
        }
        
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          setPosts(data.docs || [])
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPosts()
  }, [selectionMethod, manualPosts, category, postsLimit])

  if (loading) {
    return (
      <div className={cn('mx-auto my-8 w-full', className)}>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading posts...</p>
        </div>
      </div>
    )
  }

  if (!posts || posts.length === 0) {
    return (
      <div className={cn('mx-auto my-8 w-full', className)}>
        <div className="text-center py-12">
          <p className="text-gray-600">No posts found.</p>
        </div>
      </div>
    )
  }

  const themeClasses: Record<string, string> = {
    light: 'bg-white text-gray-900',
    dark: 'bg-gray-900 text-white',
  }

  const cardStyleClasses: Record<string, string> = {
    modern: 'bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300',
    minimal: 'bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors duration-300',
    classic: 'bg-white rounded-lg border-2 border-gray-300 overflow-hidden hover:border-gray-400 transition-colors duration-300',
  }

  const swiperConfig = {
    modules: [Navigation, Pagination, Autoplay],
    spaceBetween: slider?.space || 30,
    slidesPerView: parseInt(slider?.perView || '3'),
    loop: slider?.loop || true,
    autoplay: slider?.autoplay ? {
      delay: slider.delay || 5000,
      disableOnInteraction: false,
    } : false,
    navigation: slider?.nav ? {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    } : false,
    pagination: slider?.pagination ? {
      clickable: true,
      el: '.swiper-pagination',
    } : false,
    breakpoints: {
      640: {
        slidesPerView: Math.min(parseInt(slider?.perView || '3'), 2),
      },
      768: {
        slidesPerView: Math.min(parseInt(slider?.perView || '3'), 3),
      },
      1024: {
        slidesPerView: parseInt(slider?.perView || '3'),
      },
    },
  }

  // Helper function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Helper function to extract plain text from rich text content
  const extractTextFromRichText = (content: any): string => {
    if (!content) return ''
    
    // If it's already a string, return it
    if (typeof content === 'string') return content
    
    // If it's a Lexical rich text object
    if (content.root && content.root.children) {
      return extractTextFromLexicalNodes(content.root.children)
    }
    
    // Fallback: try to stringify and extract text
    try {
      const contentStr = JSON.stringify(content)
      // Remove JSON syntax and extract text content
      return contentStr.replace(/[{}"\[\],:]/g, ' ').replace(/\s+/g, ' ').trim()
    } catch {
      return ''
    }
  }

  // Helper function to extract text from Lexical nodes
  const extractTextFromLexicalNodes = (nodes: any[]): string => {
    if (!Array.isArray(nodes)) return ''
    
    return nodes.map(node => {
      if (node.type === 'paragraph' || node.type === 'heading') {
        if (node.children) {
          return extractTextFromLexicalNodes(node.children)
        }
      }
      
      if (node.type === 'text' && node.text) {
        return node.text
      }
      
      if (node.children) {
        return extractTextFromLexicalNodes(node.children)
      }
      
      return ''
    }).join(' ').replace(/\s+/g, ' ').trim()
  }

  return (
    <div className={cn(
      'mx-auto my-8 w-full',
      themeClasses[styling?.theme || 'light'],
      className
    )}>
      {title && (
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          {description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{description}</p>
          )}
        </div>
      )}
      
      <div className="relative">
        <Swiper
          ref={swiperRef}
          {...swiperConfig}
          className="w-full"
        >
          {posts.map((post) => (
            <SwiperSlide key={post.id}>
              <div className={cn(
                'h-full p-4',
                cardStyleClasses[styling?.cardStyle || 'modern']
              )}>
                {/* Post Image */}
                {display?.showImage && post.heroImage && (
                  <div className="relative h-48 mb-4 overflow-hidden">
                    <img
                      src={post.heroImage.url}
                      alt={post.heroImage.alt || post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                {/* Post Content */}
                <div className="p-4">
                  {/* Category */}
                  {display?.showCategory && post.categories && post.categories.length > 0 && (
                    <div className="mb-2">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {post.categories[0].title}
                      </span>
                    </div>
                  )}
                  
                  {/* Title */}
                  {display?.showTitle && (
                    <h3 className="text-xl font-bold mb-2 hover:text-blue-600 transition-colors duration-300">
                      <a href={`/posts/${post.slug}`}>{post.title}</a>
                    </h3>
                  )}
                  
                  {/* Date */}
                  {display?.showDate && (
                    <p className="text-sm text-gray-500 mb-2">
                      {formatDate(post.publishedAt)}
                    </p>
                  )}
                  
                  {/* Excerpt */}
                  {display?.showExcerpt && post.content && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {truncateText(
                        // Extract plain text from rich text content
                        extractTextFromRichText(post.content),
                        display.excerptLength || 150
                      )}
                    </p>
                  )}
                  
                  {/* Read More Button */}
                  {styling?.showReadMore && (
                    <a
                      href={`/posts/${post.slug}`}
                      className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                    >
                      Read More
                    </a>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        {/* Custom Navigation Buttons */}
        {slider?.nav && (
          <>
            <button className="swiper-button-prev absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 transition-all duration-300 shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="swiper-button-next absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 transition-all duration-300 shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        
        {/* Custom Pagination */}
        {slider?.pagination && (
          <div className="swiper-pagination absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20" />
        )}
      </div>
    </div>
  )
} 