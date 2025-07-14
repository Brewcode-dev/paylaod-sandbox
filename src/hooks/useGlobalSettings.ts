import { useEffect, useState } from 'react'
import type { GlobalSetting } from '../payload-types'

let cachedSettings: GlobalSetting | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

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

        const response = await fetch('/api/globalSettings')
        
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

  return { settings, loading, error }
} 