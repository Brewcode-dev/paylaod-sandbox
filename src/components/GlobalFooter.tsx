'use client'

import React from 'react'
import Link from 'next/link'
import { useGlobalSettings } from '../hooks/useGlobalSettings'
import { Logo } from './Logo/Logo'
import { GlobalLogo } from './GlobalLogo'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from './Link'
import { SocialMediaIcons } from './SocialMediaIcons'

interface GlobalFooterProps {
  navItems?: Array<{
    link: {
      type?: ('reference' | 'custom') | null
      newTab?: boolean | null
      reference?: any
      url?: string | null
      label: string
    }
    id?: string | null
  }>
}

export const GlobalFooter: React.FC<GlobalFooterProps> = ({ navItems = [] }) => {
  const { settings, loading, error } = useGlobalSettings()

  if (loading) {
    return (
      <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
        <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
          <div className="animate-pulse bg-gray-700 rounded" style={{ width: '193px', height: '34px' }} />
          <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
            <ThemeSelector />
            <nav className="flex flex-col md:flex-row gap-4">
              {navItems.map(({ link }, i) => (
                <CMSLink className="text-white" key={i} {...link} />
              ))}
            </nav>
          </div>
        </div>
      </footer>
    )
  }

  if (error) {
    console.error('Error loading global settings:', error)
  }

  const footerText = settings?.footer?.footerText
  const copyrightText = settings?.footer?.copyrightText
  const showSocialMedia = settings?.footer?.showSocialMedia
  const socialMedia = settings?.socialMedia

  return (
    <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <div className="flex flex-col gap-4">
          <Link className="flex items-center" href="/">
            <GlobalLogo />
          </Link>
          
          {footerText && (
            <p className="text-sm text-gray-300 max-w-md">
              {footerText}
            </p>
          )}
          
          {copyrightText && (
            <p className="text-xs text-gray-400">
              {copyrightText}
            </p>
          )}

          {/* Social Media Icons */}
          {showSocialMedia && socialMedia && (
            <div className="mt-4 text-gray-400">
              <SocialMediaIcons 
                socialMedia={socialMedia}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          <ThemeSelector />
          <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map(({ link }, i) => (
              <CMSLink className="text-white" key={i} {...link} />
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
} 