import { getPayload } from 'payload'
import { SyncService } from '@/plugins/api-sync/sync-service'
import config from '@payload-config'

// Load configuration from admin global settings
async function loadConfigFromAdmin(payload: any, collectionName: string) {
  try {
    const globalSettings = await payload.findGlobal({
      slug: 'api-sync-config',
    })
    
    if (!globalSettings) {
      console.warn('API Sync Config global not found')
      return null
    }
    
    // Map global settings to plugin config
    return {
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
  } catch (error) {
    console.error('Failed to load config from admin:', error)
    return null
  }
}

export async function POST(): Promise<Response> {
  const payload = await getPayload({ config })
  
  // Load configuration from admin
  const adminConfig = await loadConfigFromAdmin(payload, 'bookings')
  
  if (!adminConfig) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to load configuration from admin' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Create sync service with admin configuration
  const syncService = new SyncService(payload, adminConfig)

  try {
    const result = await syncService.syncBookings()
    return Response.json({
      success: result.success,
      data: result,
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