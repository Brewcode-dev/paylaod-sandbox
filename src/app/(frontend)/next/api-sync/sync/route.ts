import { getPayload } from 'payload'
import { SyncService } from '@/plugins/api-sync/sync-service'
import config from '@payload-config'

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
    const config = {
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
      apiUrl: config.apiUrl,
      endpoint: config.endpoint,
      hasToken: !!config.jwtToken,
      tokenPreview: config.jwtToken ? config.jwtToken.substring(0, 50) + '...' : 'NO TOKEN',
      collectionName: config.collectionName,
    })

    return config
  } catch (error) {
    console.error('❌ Failed to load config from admin:', error)
    return null
  }
}

export async function POST(): Promise<Response> {
  console.log('🚀 Sync endpoint called')

  const payload = await getPayload({ config })

  // Load configuration from admin
  const adminConfig = await loadConfigFromAdmin(payload, 'bookings')

  if (!adminConfig) {
    console.error('❌ No admin config available')
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to load configuration from admin',
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

  try {
    console.log('🔄 Starting syncBookings...')
    const result = await syncService.syncBookings()

    console.log('✅ Sync completed:', {
      success: result.success,
      recordsProcessed: result.recordsProcessed,
      recordsCreated: result.recordsCreated,
      recordsUpdated: result.recordsUpdated,
      errors: result.errors,
    })

    return Response.json({
      success: result.success,
      data: result,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ Sync failed:', errorMessage)

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
