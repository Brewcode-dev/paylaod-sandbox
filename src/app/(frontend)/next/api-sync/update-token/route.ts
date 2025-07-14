import { createLocalReq, getPayload } from 'payload'
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
    const { token } = body
    
    if (!token) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'JWT token is required' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const syncService = getSyncService('bookings')
    if (syncService) {
      syncService.updateJwtToken(token)
    }

    return Response.json({
      success: true,
      message: 'JWT token updated successfully',
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