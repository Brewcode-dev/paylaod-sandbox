import { Plugin } from 'payload'
import { ApiSyncConfig } from './types'
import { SyncService } from './sync-service'

// Global sync service instances for different collections
const syncServices: Record<string, SyncService> = {}

export const apiSyncPlugin = (config: ApiSyncConfig): Plugin => {
  return (payloadConfig) => {
    // Initialize sync service for this specific collection
    if (!syncServices[config.collectionName]) {
      syncServices[config.collectionName] = new SyncService(payloadConfig as any, config)
      
      // Set up auto-sync if enabled
      if (config.autoSync && config.syncInterval) {
        setInterval(async () => {
          try {
            // Load fresh config from admin before each sync
            const freshConfig = await loadConfigFromAdmin(payloadConfig as any, config.collectionName)
            if (freshConfig) {
              syncServices[config.collectionName]?.updateConfig(freshConfig)
            }
            
            if (config.collectionName === 'bookings') {
              await syncServices[config.collectionName]?.syncBookings()
            } else if (config.collectionName === 'photos') {
              await syncServices[config.collectionName]?.syncPhotos()
            }
          } catch (error) {
            console.error('Auto-sync failed:', error)
            config.onError?.(error instanceof Error ? error : new Error('Auto-sync failed'))
          }
        }, config.syncInterval)
      }
    }
    
    // Plugin configuration - return the config unchanged
    return payloadConfig
  }
}

// Load configuration from admin global settings
async function loadConfigFromAdmin(payload: any, collectionName: string): Promise<ApiSyncConfig | null> {
  try {
    const globalSettings = await payload.findGlobal({
      slug: 'api-sync-config',
    })
    
    if (!globalSettings) {
      console.warn('API Sync Config global not found')
      return null
    }
    
    // Map global settings to plugin config
    const config: ApiSyncConfig = {
      apiUrl: globalSettings.apiUrl || 'https://api.example.com',
      endpoint: globalSettings.endpoint || 'api/v1/Bookings/GetBookingsByContractor',
      jwtToken: globalSettings.jwtToken,
      collectionName: collectionName,
      autoSync: globalSettings.autoSync || false,
      syncInterval: globalSettings.syncInterval || 300000,
      retryAttempts: globalSettings.retryAttempts || 3,
      retryDelay: globalSettings.retryDelay || 1000,
      onError: (error: Error) => {
        console.error('API Sync Error:', error)
      },
    }
    
    return config
  } catch (error) {
    console.error('Failed to load config from admin:', error)
    return null
  }
}

// Get sync service for specific collection
export const getSyncService = (collectionName: string): SyncService | null => {
  return syncServices[collectionName] || null
}

// Initialize sync service (for manual initialization if needed)
export const initializeSyncService = async (payload: any, config: ApiSyncConfig) => {
  // Load fresh config from admin
  const adminConfig = await loadConfigFromAdmin(payload, config.collectionName)
  const finalConfig = adminConfig || config
  
  syncServices[config.collectionName] = new SyncService(payload, finalConfig)
  
  // Set up auto-sync if enabled
  if (finalConfig.autoSync && finalConfig.syncInterval) {
    setInterval(async () => {
      try {
        // Reload config from admin before each sync
        const freshConfig = await loadConfigFromAdmin(payload, config.collectionName)
        if (freshConfig) {
          syncServices[config.collectionName]?.updateConfig(freshConfig)
        }
        
        if (config.collectionName === 'bookings') {
          await syncServices[config.collectionName]?.syncBookings()
        } else if (config.collectionName === 'photos') {
          await syncServices[config.collectionName]?.syncPhotos()
        }
      } catch (error) {
        console.error('Auto-sync failed:', error)
        config.onError?.(error instanceof Error ? error : new Error('Auto-sync failed'))
      }
    }, finalConfig.syncInterval)
  }
}

// Export sync services for use in API routes
export { syncServices } 