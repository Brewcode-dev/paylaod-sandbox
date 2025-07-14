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

// Get sync service for specific collection
export const getSyncService = (collectionName: string): SyncService | null => {
  return syncServices[collectionName] || null
}

// Initialize sync service (for manual initialization if needed)
export const initializeSyncService = (payload: any, config: ApiSyncConfig) => {
  syncServices[config.collectionName] = new SyncService(payload, config)
  
  // Set up auto-sync if enabled
  if (config.autoSync && config.syncInterval) {
    setInterval(async () => {
      try {
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

// Export sync services for use in API routes
export { syncServices } 