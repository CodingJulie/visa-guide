import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from '@/lib/supabase-env';

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const nextParam = searchParams.get('next') ?? '/dashboard';
    // Only allow relative in-app paths (block open redirects).
    const next = nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/dashboard';

    if (!code || !isSupabaseConfigured()) {
        return NextResponse.redirect(new URL('/login?error=auth', origin));
    }

    const redirectUrl = new URL(next, origin);
    let response = NextResponse.redirect(redirectUrl);

    const supabase = createServerClient(
        getSupabaseUrl(),
        getSupabaseAnonKey(),
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.redirect(redirectUrl);
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
        return NextResponse.redirect(new URL('/login?error=auth', origin));
    }

    return response;
}
