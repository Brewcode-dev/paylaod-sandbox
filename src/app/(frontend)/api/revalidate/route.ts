import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')
    const path = searchParams.get('path')

    // Check for secret to confirm this is a valid request
    if (secret !== 'globalSettings') {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    }

    if (!path) {
      return NextResponse.json({ message: 'Missing path' }, { status: 400 })
    }

    // Revalidate the path
    revalidatePath(path)
    
    console.log(`Revalidated path: ${path}`)
    
    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (err) {
    console.error('Error revalidating:', err)
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
} 