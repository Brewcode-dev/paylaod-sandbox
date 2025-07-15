'use client'

import React, { useEffect, useState } from 'react'
import { Accessibility } from 'lucide-react'
import './WcagToggle.css'

const WcagToggle: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [textSize, setTextSize] = useState<'normal' | 'plus' | 'plus-plus'>('normal')
  const [animationsDisabled, setAnimationsDisabled] = useState(false)
  const [spacingIncreased, setSpacingIncreased] = useState(false)
  const [imagesHidden, setImagesHidden] = useState(false)

  const toggleVisibility = () => {
    setIsVisible(prev => !prev)
  }

  const setCookie = (cname: string, cvalue: string, exdays: number) => {
    const d = new Date()
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
    const expires = "expires=" + d.toUTCString()
    document.cookie = `${cname}=${cvalue}; ${expires}; path=/`
  }

  const getCookie = (cname: string): string => {
    const name = cname + "="
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') {
        c = c.substring(1)
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length)
      }
    }
    return ""
  }

  const handleTextChange = (size: 'normal' | 'plus' | 'plus-plus') => {
    setTextSize(size)
    setCookie('wcagTextSize', size, 1)
  }

  const handleContrastToggle = () => {
    document.body.classList.toggle('wcag__contrast')
    const contrastCookie = getCookie('wcagContrast') === '1' ? '0' : '1'
    setCookie('wcagContrast', contrastCookie, 1)
  }

  const handleAccessibilityDeclaration = () => {
    window.open('/accessibility-declaration', '_blank')
  }

  const handleSitemap = () => {
    window.open('/sitemap.xml', '_blank')
  }

  const handleAnimationsToggle = () => {
    setAnimationsDisabled(!animationsDisabled)
    document.body.classList.toggle('wcag__no-animations')
    const animationsCookie = getCookie('wcagAnimations') === '1' ? '0' : '1'
    setCookie('wcagAnimations', animationsCookie, 1)
  }

  const handleSpacingToggle = () => {
    setSpacingIncreased(!spacingIncreased)
    document.body.classList.toggle('wcag__increased-spacing')
    const spacingCookie = getCookie('wcagSpacing') === '1' ? '0' : '1'
    setCookie('wcagSpacing', spacingCookie, 1)
  }

  const handleImagesToggle = () => {
    setImagesHidden(!imagesHidden)
    document.body.classList.toggle('wcag__hide-images')
    const imagesCookie = getCookie('wcagImages') === '1' ? '0' : '1'
    setCookie('wcagImages', imagesCookie, 1)
  }

  const handleReset = () => {
    // Reset text size to normal
    setTextSize('normal')
    document.body.classList.remove('wcag__text-normal', 'wcag__text-plus', 'wcag__text-plus-plus')
    document.body.classList.add('wcag__text-normal')
    
    // Remove contrast mode
    document.body.classList.remove('wcag__contrast')
    
    // Reset all other settings
    setAnimationsDisabled(false)
    setSpacingIncreased(false)
    setImagesHidden(false)
    document.body.classList.remove('wcag__no-animations', 'wcag__increased-spacing', 'wcag__hide-images')
    
    // Clear cookies by setting them to expire in the past
    const pastDate = new Date()
    pastDate.setTime(pastDate.getTime() - (24 * 60 * 60 * 1000)) // 1 day ago
    const expires = "expires=" + pastDate.toUTCString()
    
    document.cookie = `wcagTextSize=; ${expires}; path=/`
    document.cookie = `wcagContrast=; ${expires}; path=/`
    document.cookie = `wcagAnimations=; ${expires}; path=/`
    document.cookie = `wcagSpacing=; ${expires}; path=/`
    document.cookie = `wcagImages=; ${expires}; path=/`
    
    // Close the panel
    setIsVisible(false)
  }

  useEffect(() => {
    const savedTextSize = getCookie('wcagTextSize') as 'normal' | 'plus' | 'plus-plus'
    if (savedTextSize) {
      setTextSize(savedTextSize)
    }
    if (getCookie('wcagContrast') === '1') {
      document.body.classList.add('wcag__contrast')
    }
    if (getCookie('wcagAnimations') === '1') {
      setAnimationsDisabled(true)
      document.body.classList.add('wcag__no-animations')
    }
    if (getCookie('wcagSpacing') === '1') {
      setSpacingIncreased(true)
      document.body.classList.add('wcag__increased-spacing')
    }
    if (getCookie('wcagImages') === '1') {
      setImagesHidden(true)
      document.body.classList.add('wcag__hide-images')
    }
  }, [])

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      const wcagContainer = target.closest('.wcag-wcagbar')
      
      if (isVisible && !wcagContainer) {
        setIsVisible(false)
      }
    }

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isVisible])

  useEffect(() => {
    document.body.classList.remove('wcag__text-normal', 'wcag__text-plus', 'wcag__text-plus-plus')
    if (textSize === 'normal') {
      document.body.classList.add('wcag__text-normal')
    } else if (textSize === 'plus') {
      document.body.classList.add('wcag__text-plus')
    } else if (textSize === 'plus-plus') {
      document.body.classList.add('wcag__text-plus-plus')
    }
  }, [textSize])

  return (
    <div className={`wcag-wcagbar${isVisible ? ' wcag-wcagbar--open' : ''}`}> 
        <div className="wcag-btt">
          <div className="wcag-options">
            <button
              className="wcag-btt__text-normal"
              onClick={() => handleTextChange('normal')}
              aria-label="Normal text size"
            >
              Text
            </button>
            <button
              className="wcag-btt__text-plus"
              onClick={() => handleTextChange('plus')}
              aria-label="Large text size"
            >
              Text+
            </button>
            <button
              className="wcag-btt__text-plus-plus"
              onClick={() => handleTextChange('plus-plus')}
              aria-label="Extra large text size"
            >
              Text++
            </button>
            <button
              className="wcag-btt__wcag-hi"
              onClick={handleContrastToggle}
              aria-label="Toggle high contrast"
            >
              High Contrast
            </button>
            <button
              className="wcag-btt__wcag-lo"
              onClick={handleContrastToggle}
              aria-label="Toggle low contrast"
            >
              Low Contrast
            </button>
            <button
              className="wcag-btt__animations"
              onClick={handleAnimationsToggle}
              aria-label="Toggle animations"
            >
              {animationsDisabled ? 'Enable Animations' : 'Disable Animations'}
            </button>
            <button
              className="wcag-btt__spacing"
              onClick={handleSpacingToggle}
              aria-label="Toggle increased spacing"
            >
              {spacingIncreased ? 'Normal Spacing' : 'Increase Spacing'}
            </button>
            <button
              className="wcag-btt__images"
              onClick={handleImagesToggle}
              aria-label="Toggle images visibility"
            >
              {imagesHidden ? 'Show Images' : 'Hide Images'}
            </button>
            <button
              className="wcag-btt__link"
              onClick={handleAccessibilityDeclaration}
              aria-label="Accessibility declaration"
            >
              Accessibility declaration
            </button>
            <button
              className="wcag-btt__link"
              onClick={handleSitemap}
              aria-label="Sitemap"
            >
              Sitemap
            </button>
            <button
              className="wcag-btt__reset"
              onClick={handleReset}
              aria-label="Reset all accessibility settings"
            >
              Reset Settings
            </button>
          </div>
        </div>
        <button
        className="aside-wcag__toggle"
        onClick={toggleVisibility}
        aria-expanded={isVisible}
        aria-label="Toggle accessibility options"
      >
        <Accessibility size={24} />
      </button>
    </div>
  )
}

export default WcagToggle 