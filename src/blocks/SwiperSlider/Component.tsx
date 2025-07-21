'use client'

import React, { useRef } from 'react'
import { cn } from '@/utilities/ui'

// Import Swiper components and styles
// Note: You'll need to install swiper package: npm install swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// Define types for the SwiperSlider block
interface Slide {
  title?: string
  description?: string
  image?: {
    url: string
    alt?: string
  }
  link?: {
    url?: string
    text?: string
  }
}

interface SwiperSettings {
  autoplay?: boolean
  autoplayDelay?: number
  loop?: boolean
  navigation?: boolean
  pagination?: boolean
  slidesPerView?: string
  spaceBetween?: number
}

interface StylingOptions {
  height?: 'small' | 'medium' | 'large' | 'full'
  theme?: 'light' | 'dark'
}

interface SwiperSliderBlockProps {
  title?: string
  slides: Slide[]
  settings?: SwiperSettings
  styling?: StylingOptions
}

type Props = {
  className?: string
} & SwiperSliderBlockProps

export const SwiperSliderBlock: React.FC<Props> = ({ 
  className, 
  title, 
  slides, 
  settings, 
  styling 
}) => {
  const swiperRef = useRef<any>(null)

  if (!slides || slides.length === 0) {
    return null
  }

  const heightClasses: Record<string, string> = {
    small: 'h-64',
    medium: 'h-96',
    large: 'h-[500px]',
    full: 'h-screen',
  }

  const themeClasses: Record<string, string> = {
    light: 'bg-white text-gray-900',
    dark: 'bg-gray-900 text-white',
  }

  const swiperConfig = {
    modules: [Navigation, Pagination, Autoplay],
    spaceBetween: settings?.spaceBetween || 30,
    slidesPerView: parseInt(settings?.slidesPerView || '1'),
    loop: settings?.loop || true,
    autoplay: settings?.autoplay ? {
      delay: settings.autoplayDelay || 5000,
      disableOnInteraction: false,
    } : false,
    navigation: settings?.navigation ? {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    } : false,
    pagination: settings?.pagination ? {
      clickable: true,
      el: '.swiper-pagination',
    } : false,
    breakpoints: {
      640: {
        slidesPerView: Math.min(parseInt(settings?.slidesPerView || '1'), 2),
      },
      768: {
        slidesPerView: Math.min(parseInt(settings?.slidesPerView || '1'), 3),
      },
      1024: {
        slidesPerView: parseInt(settings?.slidesPerView || '1'),
      },
    },
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
        </div>
      )}
      
      <div className="relative">
        <Swiper
          ref={swiperRef}
          {...swiperConfig}
          className={cn(
            'w-full',
            heightClasses[styling?.height || 'medium']
          )}
        >
          {slides.map((slide: Slide, index: number) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full group">
                {/* Background Image */}
                {slide.image && typeof slide.image === 'object' && 'url' in slide.image && (
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(${slide.image.url})`,
                    }}
                  />
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40" />
                
                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-center h-full text-center text-white px-6">
                  {slide.title && (
                    <h3 className="text-2xl md:text-4xl font-bold mb-4 group-hover:scale-105 transition-transform duration-300">
                      {slide.title}
                    </h3>
                  )}
                  
                  {slide.description && (
                    <p className="text-lg md:text-xl mb-6 max-w-2xl group-hover:scale-105 transition-transform duration-300">
                      {slide.description}
                    </p>
                  )}
                  
                  {slide.link?.url && slide.link?.text && (
                    <a
                      href={slide.link.url}
                      className="inline-block bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 group-hover:scale-105"
                    >
                      {slide.link.text}
                    </a>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        {/* Custom Navigation Buttons */}
        {settings?.navigation && (
          <>
            <button className="swiper-button-prev absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 transition-all duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="swiper-button-next absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 transition-all duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        
        {/* Custom Pagination */}
        {settings?.pagination && (
          <div className="swiper-pagination absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20" />
        )}
      </div>
    </div>
  )
} 