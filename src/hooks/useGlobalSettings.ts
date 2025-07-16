import { useEffect, useState } from 'react'
import type { GlobalSetting } from '../payload-types'

let cachedSettings: GlobalSetting | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 30 * 1000 // 30 seconds instead of 5 minutes

export const useGlobalSettings = () => {
  const [settings, setSettings] = useState<GlobalSetting | null>(cachedSettings)
  const [loading, setLoading] = useState(!cachedSettings)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      // Check if we have valid cached data
      if (cachedSettings && Date.now() - cacheTimestamp < CACHE_DURATION) {
        setSettings(cachedSettings)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/globalSettings', {
          // Add cache busting
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        // Cache the settings
        cachedSettings = data
        cacheTimestamp = Date.now()

        setSettings(data)
      } catch (err) {
        console.error('Error fetching global settings:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  // Function to manually clear cache
  const clearCache = () => {
    cachedSettings = null
    cacheTimestamp = 0
  }

  // Function to refetch settings
  const refetch = async () => {
    clearCache()
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/globalSettings', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      cachedSettings = data
      cacheTimestamp = Date.now()
      setSettings(data)
    } catch (err) {
      console.error('Error refetching global settings:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return { settings, loading, error, refetch, clearCache }
} 