import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // 1. Protected Routes Check
    if (request.nextUrl.pathname.startsWith('/patient-dashboard')) {
        // If no user, redirect to login
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // If user exists but email is not confirmed, redirect to confirmation page
        if (!user.email_confirmed_at) {
            return NextResponse.redirect(new URL('/auth/confirm-email', request.url));
        }
    }

    // 2. Auth Page Check (Login/Signup)
    if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup') {
        // If user is already logged in and verified, redirect to dashboard
        if (user && user.email_confirmed_at) {
            // Optional: Check role here if you have different dashboards
            // For now default to patient dashboard
            return NextResponse.redirect(new URL('/patient-dashboard', request.url));
        }
    }

    return response
}

export const config = {
    matcher: ['/patient-dashboard/:path*', '/login', '/signup'],
};
