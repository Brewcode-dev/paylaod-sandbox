import { getPayload } from 'payload'
import { SyncService } from '@/plugins/api-sync/sync-service'
import config from '@payload-config'

export async function POST(
  request: Request,
  context: { params: Promise<{ contractorId: string }> }
): Promise<Response> {
  const payload = await getPayload({ config })
  // Konfiguracja dla bookings
  const syncService = new SyncService(payload, {
    apiUrl: process.env.API_BASE_URL || 'https://api.example.com',
    endpoint: 'api/v1/Bookings/GetBookingsByContractor',
    collectionName: 'bookings',
    autoSync: false,
    syncInterval: 300000,
    retryAttempts: 3,
    retryDelay: 1000,
    onError: (error: Error) => {
      console.error('Bookings API Sync Error:', error)
    },
  })

  try {
    const { contractorId } = await context.params
    
    if (!contractorId) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Contractor ID is required' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const result = await syncService.syncBookingsByContractor(contractorId)
    
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