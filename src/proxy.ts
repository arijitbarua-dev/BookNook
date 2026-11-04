import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './lib/auth'
import { headers } from 'next/headers'

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    const user = session?.user

    if(!user){
        const loginUrl = new URL('/login', request.url)
        // Remember the private page the visitor tried to open so they can
        // be sent back there after signing in
        loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname + request.nextUrl.search)
        return NextResponse.redirect(loginUrl)
    }
  
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
  matcher: ['/add-book', '/my-books', '/my-borrows']
}