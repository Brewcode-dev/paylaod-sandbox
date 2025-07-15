import { createLocalReq, getPayload } from 'payload'
import { headers } from 'next/headers'
import { getSyncService } from '@/plugins/api-sync/plugin'
import config from '@payload-config'

export async function GET(): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()

  // Authenticate by passing request headers
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return new Response('Action forbidden.', { status: 403 })
  }

  try {
    const bookingsService = getSyncService('bookings')
    const photosService = getSyncService('photos')
    
    // Load configuration from admin
    let adminConfig = null
    try {
      adminConfig = await payload.findGlobal({
        slug: 'api-sync-config',
      })
    } catch (error) {
      console.error('Failed to load admin config:', error)
    }
    
    return Response.json({
      success: true,
      data: {
        initialized: bookingsService !== null && photosService !== null,
        services: {
          bookings: bookingsService !== null,
          photos: photosService !== null,
        },
        adminConfig: adminConfig ? {
          apiUrl: adminConfig.apiUrl,
          endpoint: adminConfig.endpoint,
          autoSync: adminConfig.autoSync,
          syncInterval: adminConfig.syncInterval,
          retryAttempts: adminConfig.retryAttempts,
          retryDelay: adminConfig.retryDelay,
          lastSync: adminConfig.lastSync,
          lastSyncStatus: adminConfig.lastSyncStatus,
          lastSyncError: adminConfig.lastSyncError,
          syncStats: adminConfig.syncStats,
          // Don't expose JWT token for security
        } : null,
        serviceAvailable: bookingsService !== null && photosService !== null,
      },
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 