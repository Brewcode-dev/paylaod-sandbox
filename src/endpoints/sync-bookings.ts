import { getPayload } from 'payload'
import { SyncService } from '../plugins/api-sync/sync-service'
import { ApiClient } from '../plugins/api-sync/api-client'
import config from '../payload.config'

export const syncBookingsEndpoint = {
  path: '/sync/bookings',
  method: 'post' as const,
  handler: async (req: any) => {
    try {
      // Create a local Payload instance
      const payload = await getPayload({ config })
      
      // Create sync config for bookings
      const syncConfig = {
        apiUrl: process.env.API_BASE_URL || 'https://api.example.com',
        endpoint: 'api/v1/Bookings/GetBookingsByContractor',
        collectionName: 'bookings',
        jwtToken: process.env.API_AUTH_TOKEN || '',
        headers: {},
        autoSync: false,
        syncInterval: 300000,
        retryAttempts: 3,
        retryDelay: 1000,
        onError: (error: Error) => {
          console.error('API Sync Error:', error)
        },
      }
      
      // Create sync service with local Payload instance
      const syncService = new SyncService(payload, syncConfig)
      
      const result = await syncService.syncBookings()
      
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
            processingTime: new Date().toISOString()
          }
        },
        message: result.success
          ? `Sync completed: ${result.recordsCreated} created, ${result.recordsUpdated} updated`
          : `Sync failed: ${result.errors.join(', ')}`
      }
      
      return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: {
          recordsProcessed: 0,
          recordsCreated: 0,
          recordsUpdated: 0,
          errors: [error instanceof Error ? error.message : 'Unknown error']
        }
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
} 