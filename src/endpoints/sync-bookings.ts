import { getPayload } from 'payload'
import { SyncService } from '../plugins/api-sync/sync-service'
import config from '../payload.config'

// Load configuration from admin global settings
async function loadConfigFromAdmin(payload: any, collectionName: string) {
  try {
    console.log('🔧 Loading API Sync Config from admin...')

    const globalSettings = await payload.findGlobal({
      slug: 'api-sync-config',
    })

    console.log('📋 Global settings found:', globalSettings ? 'YES' : 'NO')

    if (!globalSettings) {
      console.warn('❌ API Sync Config global not found')
      return null
    }

    // Map global settings to plugin config
    const syncConfig = {
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

    console.log('✅ Config loaded from admin:', {
      apiUrl: syncConfig.apiUrl,
      endpoint: syncConfig.endpoint,
      hasToken: !!syncConfig.jwtToken,
      tokenPreview: syncConfig.jwtToken ? syncConfig.jwtToken.substring(0, 50) + '...' : 'NO TOKEN',
      collectionName: syncConfig.collectionName,
    })

    return syncConfig
  } catch (error) {
    console.error('❌ Failed to load config from admin:', error)
    return null
  }
}

export const syncBookingsEndpoint = {
  path: '/sync/bookings',
  method: 'post' as const,
  handler: async (req: any) => {
    try {
      console.log('🚀 Sync bookings endpoint called')

      // Create a local Payload instance
      const payload = await getPayload({ config })

      // Load configuration from admin
      const adminConfig = await loadConfigFromAdmin(payload, 'bookings')

      if (!adminConfig) {
        console.error('❌ No admin config available')
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Failed to load configuration from admin',
            data: {
              recordsProcessed: 0,
              recordsCreated: 0,
              recordsUpdated: 0,
              errors: ['Failed to load configuration from admin'],
            },
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      console.log('🔧 Creating SyncService with admin config...')

      // Create sync service with admin configuration
      const syncService = new SyncService(payload, adminConfig)

      console.log('🔄 Starting syncBookings...')
      const result = await syncService.syncBookings()

      console.log('✅ Sync completed:', {
        success: result.success,
        recordsProcessed: result.recordsProcessed,
        recordsCreated: result.recordsCreated,
        recordsUpdated: result.recordsUpdated,
        errors: result.errors,
      })

      // Enhanced response with detailed progress information
      const responseData = {
        success: result.success,
        data: {
          ...result,
          recordsProcessed: (result.recordsCreated || 0) + (result.recordsUpdated || 0),
          processingDetails: {
            totalRecords: (result.recordsCreated || 0) + (result.recordsUpdated || 0),
            createdRecords: result.recordsCreated || 0,
            updatedRecords: result.recordsUpdated || 0,
            errors: result.errors || [],
            processingTime: new Date().toISOString(),
          },
        },
        message: result.success
          ? `Sync completed: ${result.recordsCreated} created, ${result.recordsUpdated} updated`
          : `Sync failed: ${result.errors.join(', ')}`,
      }

      return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('❌ Sync failed:', errorMessage)

      return new Response(
        JSON.stringify({
          success: false,
          error: errorMessage,
          data: {
            recordsProcessed: 0,
            recordsCreated: 0,
            recordsUpdated: 0,
            errors: [errorMessage],
          },
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
  },
}
