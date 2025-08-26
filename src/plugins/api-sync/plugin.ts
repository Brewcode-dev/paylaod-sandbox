import { Plugin } from 'payload'
import { ApiSyncConfig } from './types'
import { SyncService } from './sync-service'

// Global sync service instances for different collections
const syncServices: Record<string, SyncService> = {}

// Function to update global config with sync status
async function updateGlobalSyncStatus(
  payload: any,
  status: 'success' | 'error',
  error?: string,
  stats?: any,
) {
  try {
    const globalSettings = await payload.findGlobal({
      slug: 'api-sync-config',
    })

    if (globalSettings) {
      const updateData: any = {
        lastSync: new Date(),
        lastSyncStatus: status,
      }

      if (error) {
        updateData.lastSyncError = error
      } else {
        updateData.lastSyncError = null
      }

      if (stats) {
        updateData.syncStats = {
          totalRecords:
            (globalSettings.syncStats?.totalRecords || 0) +
            (stats.recordsCreated || 0) +
            (stats.recordsUpdated || 0),
          lastRecordsProcessed: stats.recordsProcessed || 0,
          lastRecordsCreated: stats.recordsCreated || 0,
          lastRecordsUpdated: stats.recordsUpdated || 0,
        }
      }

      await payload.updateGlobal({
        slug: 'api-sync-config',
        data: updateData,
      })

      console.log('✅ Global sync status updated:', status)
    }
  } catch (error) {
    console.error('❌ Failed to update global sync status:', error)
  }
}

export const apiSyncPlugin = (config: ApiSyncConfig): Plugin => {
  return (payloadConfig) => {
    // Initialize sync service for this specific collection
    if (!syncServices[config.collectionName]) {
      syncServices[config.collectionName] = new SyncService(payloadConfig as any, config)

      // Set up auto-sync if enabled
      if (config.autoSync && config.syncInterval) {
        setInterval(async () => {
          try {
            console.log('🔄 Auto sync triggered for', config.collectionName)

            // Load fresh config from admin before each sync
            const freshConfig = await loadConfigFromAdmin(
              payloadConfig as any,
              config.collectionName,
            )
            if (freshConfig) {
              syncServices[config.collectionName]?.updateConfig(freshConfig)
            }

            let result
            if (config.collectionName === 'bookings') {
              result = await syncServices[config.collectionName]?.syncBookings()
            } else if (config.collectionName === 'photos') {
              result = await syncServices[config.collectionName]?.syncPhotos()
            }

            // Update global config with sync status
            if (result) {
              await updateGlobalSyncStatus(
                payloadConfig as any,
                result.success ? 'success' : 'error',
                result.success ? undefined : result.errors.join(', '),
                result,
              )
            }
          } catch (error) {
            console.error('Auto-sync failed:', error)
            await updateGlobalSyncStatus(
              payloadConfig as any,
              'error',
              error instanceof Error ? error.message : 'Auto-sync failed',
            )
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
async function loadConfigFromAdmin(
  payload: any,
  collectionName: string,
): Promise<ApiSyncConfig | null> {
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
        console.log('🔄 Auto sync triggered for', config.collectionName)

        // Reload config from admin before each sync
        const freshConfig = await loadConfigFromAdmin(payload, config.collectionName)
        if (freshConfig) {
          syncServices[config.collectionName]?.updateConfig(freshConfig)
        }

        let result
        if (config.collectionName === 'bookings') {
          result = await syncServices[config.collectionName]?.syncBookings()
        } else if (config.collectionName === 'photos') {
          result = await syncServices[config.collectionName]?.syncPhotos()
        }

        // Update global config with sync status
        if (result) {
          await updateGlobalSyncStatus(
            payload,
            result.success ? 'success' : 'error',
            result.success ? undefined : result.errors.join(', '),
            result,
          )
        }
      } catch (error) {
        console.error('Auto-sync failed:', error)
        await updateGlobalSyncStatus(
          payload,
          'error',
          error instanceof Error ? error.message : 'Auto-sync failed',
        )
        config.onError?.(error instanceof Error ? error : new Error('Auto-sync failed'))
      }
    }, finalConfig.syncInterval)
  }
}

// Export sync services for use in API routes
export { syncServices }
