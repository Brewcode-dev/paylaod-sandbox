import { getPayload } from 'payload'
import { SyncService } from '@/plugins/api-sync/sync-service'
import config from '@payload-config'

export async function POST(): Promise<Response> {
  const payload = await getPayload({ config })
  // Konfiguracja dla photos
  const syncService = new SyncService(payload, {
    apiUrl: 'https://jsonplaceholder.typicode.com',
    endpoint: 'photos',
    collectionName: 'photos',
    autoSync: false,
    syncInterval: 300000,
    retryAttempts: 3,
    retryDelay: 1000,
    onError: (error: Error) => {
      console.error('Photos API Sync Error:', error)
    },
  })

  try {
    const result = await syncService.syncPhotos()
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