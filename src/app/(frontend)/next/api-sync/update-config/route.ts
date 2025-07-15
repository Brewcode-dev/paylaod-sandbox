import { getPayload } from 'payload'
import { headers } from 'next/headers'
import { getSyncService } from '@/plugins/api-sync/plugin'
import config from '@payload-config'

export async function POST(request: Request): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()

  // Authenticate by passing request headers
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return new Response('Action forbidden.', { status: 403 })
  }

  try {
    const body = await request.json()
    const { 
      apiUrl, 
      endpoint, 
      jwtToken, 
      autoSync, 
      syncInterval, 
      retryAttempts, 
      retryDelay 
    } = body

    // Update global settings in admin
    const globalSettings = await payload.findGlobal({
      slug: 'api-sync-config',
    })

    if (globalSettings) {
      const updatedSettings = {
        ...globalSettings,
        ...(apiUrl && { apiUrl }),
        ...(endpoint && { endpoint }),
        ...(jwtToken && { jwtToken }),
        ...(autoSync !== undefined && { autoSync }),
        ...(syncInterval && { syncInterval }),
        ...(retryAttempts && { retryAttempts }),
        ...(retryDelay && { retryDelay }),
      }

      await payload.updateGlobal({
        slug: 'api-sync-config',
        data: updatedSettings,
      })

      // Update sync service configuration
      const syncService = getSyncService('bookings')
      if (syncService) {
        syncService.updateConfig({
          apiUrl: updatedSettings.apiUrl,
          endpoint: updatedSettings.endpoint,
          jwtToken: updatedSettings.jwtToken,
          collectionName: 'bookings',
          autoSync: updatedSettings.autoSync,
          syncInterval: updatedSettings.syncInterval,
          retryAttempts: updatedSettings.retryAttempts,
          retryDelay: updatedSettings.retryDelay,
          onError: (error: Error) => {
            console.error('API Sync Error:', error)
          },
        })
      }

      return Response.json({
        success: true,
        message: 'Configuration updated successfully in both admin and sync service',
        data: {
          apiUrl: updatedSettings.apiUrl,
          endpoint: updatedSettings.endpoint,
          autoSync: updatedSettings.autoSync,
          syncInterval: updatedSettings.syncInterval,
          retryAttempts: updatedSettings.retryAttempts,
          retryDelay: updatedSettings.retryDelay,
          // Don't expose JWT token for security
        },
      })
    } else {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Global settings not found' 
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }
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