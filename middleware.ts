import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { resolveLanguageFromAcceptLanguage, LOCALE_COOKIE } from '@/lib/locale';
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from '@/lib/supabase-env';

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function applyLocaleCookie(request: NextRequest, response: NextResponse): NextResponse {
    if (request.cookies.get(LOCALE_COOKIE)) {
        return response;
    }

    const lang = resolveLanguageFromAcceptLanguage(request.headers.get('accept-language'));
    response.cookies.set(LOCALE_COOKIE, lang, {
        path: '/',
        maxAge: LOCALE_COOKIE_MAX_AGE,
        sameSite: 'lax',
    });

    return response;
}

async function getProfileRole(
    supabase: ReturnType<typeof createServerClient>,
    userId: string
): Promise<string> {
    const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();
    return data?.role ?? 'user';
}

const STATIC_ASSET_PATTERN =
    /^\/(?:_next\/static|_next\/image|favicon\.ico|manifest\.json|sw\.js|offline\.html|.*\.(?:ico|png|jpg|jpeg|gif|webp|svg|woff2?|txt|json|js|css))$/;

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    if (STATIC_ASSET_PATTERN.test(pathname)) {
        return NextResponse.next();
    }

    const localePrefixRegex = /^\/(en|ru)(\/|$)/;
    if (localePrefixRegex.test(pathname)) {
        const newPath = pathname.replace(/^\/(en|ru)/, '') || '/';
        return applyLocaleCookie(
            request,
            NextResponse.redirect(new URL(newPath, request.url))
        );
    }

    let supabaseResponse = NextResponse.next({ request });
    let user: { id: string } | null = null;
    let authError = true;
    let supabase: ReturnType<typeof createServerClient> | null = null;

    if (isSupabaseConfigured()) {
        try {
            supabase = createServerClient(
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
                            supabaseResponse = NextResponse.next({ request });
                            cookiesToSet.forEach(({ name, value, options }) =>
                                supabaseResponse.cookies.set(name, value, options)
                            );
                        },
                    },
                }
            );

            const { data, error } = await supabase.auth.getUser();
            user = data.user;
            authError = !!error;
        } catch {
            user = null;
            authError = true;
            supabase = null;
        }
    }

    // Old password-reset emails pointed at /login?code=... — forward to the callback.
    if (pathname === '/login') {
        const code = request.nextUrl.searchParams.get('code');
        if (code) {
            const callbackUrl = new URL('/auth/callback', request.url);
            callbackUrl.searchParams.set('code', code);
            callbackUrl.searchParams.set('next', '/update-password');
            return applyLocaleCookie(request, NextResponse.redirect(callbackUrl));
        }
    }

    const protectedPaths = ['/dashboard', '/questionnaire', '/results', '/checklist', '/admin', '/update-password'];
    const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

    if (isProtected && (!user || authError)) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return applyLocaleCookie(request, NextResponse.redirect(loginUrl));
    }

    if (pathname.startsWith('/admin') && user && !authError && supabase) {
        try {
            const role = await getProfileRole(supabase, user.id);
            if (role !== 'editor' && role !== 'admin') {
                return applyLocaleCookie(
                    request,
                    NextResponse.redirect(new URL('/dashboard', request.url))
                );
            }
        } catch {
            return applyLocaleCookie(
                request,
                NextResponse.redirect(new URL('/dashboard', request.url))
            );
        }
    }

    if (user && !authError && (pathname === '/login' || pathname === '/register')) {
        return applyLocaleCookie(
            request,
            NextResponse.redirect(new URL('/dashboard', request.url))
        );
    }

    return applyLocaleCookie(request, supabaseResponse);
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|gif|webp|svg|woff2?|txt|json|js|css)$).*)',
    ],
};
