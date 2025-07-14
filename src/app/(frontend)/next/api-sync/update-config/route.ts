import { createLocalReq, getPayload } from 'payload'
import { headers } from 'next/headers'
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
    const { lastSync, lastSyncStatus, lastSyncError, syncStats } = body

    // Update the global config
    await payload.updateGlobal({
      slug: 'api-sync-config',
      data: {
        lastSync: lastSync ? new Date(lastSync).toISOString() : undefined,
        lastSyncStatus,
        lastSyncError,
        syncStats,
      },
    })

    return Response.json({
      success: true,
      message: 'Konfiguracja zaktualizowana',
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