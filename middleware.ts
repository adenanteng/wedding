import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Exclude static assets and reserved paths explicitly just in case
  if (
    pathname === '/' ||
    pathname.startsWith('/unauthorized') ||
    pathname.startsWith('/rsvp') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/img') ||
    pathname.startsWith('/audio') ||
    pathname.includes('.') // for files like favicon.ico
  ) {
    return NextResponse.next()
  }

  // The first segment of the path is expected to be the short_id
  const segments = pathname.split('/').filter(Boolean)
  const shortId = segments[0]

  if (!shortId) {
    return NextResponse.next()
  }

  // Create a temporary client for this request
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    const { data, error } = await supabase
      .from('rsvps')
      .select('id')
      .eq('short_id', shortId)
      .single()

    if (error || !data) {
      console.log(`Middleware: Guest ${shortId} not found, redirecting...`)
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  } catch (err) {
    console.error('Middleware error:', err)
    // On core failure, maybe let them through or redirect to error?
    // Let's redirect to unauthorized for safety.
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - img (images)
     * - audio (audio files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|unauthorized|img|audio).*)',
  ],
}
