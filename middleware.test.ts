import { describe, it, expect, vi, beforeEach } from 'vitest';
import { middleware } from './middleware';
import { NextRequest } from 'next/server';

vi.mock('@supabase/ssr', () => ({
    createServerClient: vi.fn(),
}));

function mockSupabase(user: { id: string } | null, role = 'user') {
    const query = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: user ? { role } : null }),
    };
    return {
        auth: {
            getUser: vi.fn().mockResolvedValue({ data: { user }, error: null }),
        },
        from: vi.fn(() => query),
    };
}

describe('middleware', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://test.supabase.co';
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'test-key';
    });

    it('redirects locale prefix /en to root', async () => {
        const { createServerClient } = await import('@supabase/ssr');
        (createServerClient as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase(null));
        const req = new NextRequest('http://localhost/en/dashboard');
        const res = await middleware(req);
        expect(res.status).toBe(307);
        expect(res.headers.get('location')).toBe('http://localhost/dashboard');
    });

    it('redirects to /login when user is missing on /dashboard', async () => {
        const { createServerClient } = await import('@supabase/ssr');
        (createServerClient as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase(null));
        const req = new NextRequest('http://localhost/dashboard');
        const res = await middleware(req);
        expect(res.status).toBe(307);
        expect(res.headers.get('location')).toBe('http://localhost/login?redirect=%2Fdashboard');
    });

    it('allows /dashboard for authenticated user', async () => {
        const { createServerClient } = await import('@supabase/ssr');
        (createServerClient as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase({ id: '1' }));
        const req = new NextRequest('http://localhost/dashboard');
        const res = await middleware(req);
        expect(res.status).toBe(200);
    });

    it('redirects from /login to /dashboard for authenticated user', async () => {
        const { createServerClient } = await import('@supabase/ssr');
        (createServerClient as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase({ id: '1' }));
        const req = new NextRequest('http://localhost/login');
        const res = await middleware(req);
        expect(res.status).toBe(307);
        expect(res.headers.get('location')).toBe('http://localhost/dashboard');
    });

    it('redirects /admin for user without editor/admin role', async () => {
        const { createServerClient } = await import('@supabase/ssr');
        (createServerClient as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase({ id: '1' }, 'user'));
        const req = new NextRequest('http://localhost/admin');
        const res = await middleware(req);
        expect(res.status).toBe(307);
        expect(res.headers.get('location')).toBe('http://localhost/dashboard');
    });

    it('redirects /login?code= to /auth/callback', async () => {
        const { createServerClient } = await import('@supabase/ssr');
        (createServerClient as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase(null));
        const req = new NextRequest('http://localhost/login?code=abc123');
        const res = await middleware(req);
        expect(res.status).toBe(307);
        expect(res.headers.get('location')).toBe(
            'http://localhost/auth/callback?code=abc123&next=%2Fupdate-password'
        );
    });

    it('sets language cookie from Accept-Language on first visit', async () => {
        const { createServerClient } = await import('@supabase/ssr');
        (createServerClient as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase({ id: '1' }));
        const req = new NextRequest('http://localhost/dashboard', {
            headers: { 'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8' },
        });
        const res = await middleware(req);
        expect(res.cookies.get('i18nextLng')?.value).toBe('ru');
    });

    it('passes static assets without Supabase', async () => {
        const { createServerClient } = await import('@supabase/ssr');
        const req = new NextRequest('http://localhost/favicon.ico');
        const res = await middleware(req);
        expect(res.status).toBe(200);
        expect(createServerClient).not.toHaveBeenCalled();
    });

    it('does not crash without Supabase env and redirects protected routes to /login', async () => {
        delete process.env.NEXT_PUBLIC_SUPABASE_URL;
        delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

        const { createServerClient } = await import('@supabase/ssr');
        const req = new NextRequest('http://localhost/dashboard');
        const res = await middleware(req);

        expect(res.status).toBe(307);
        expect(res.headers.get('location')).toBe('http://localhost/login?redirect=%2Fdashboard');
        expect(createServerClient).not.toHaveBeenCalled();
    });

    it('opens public routes without Supabase env', async () => {
        delete process.env.NEXT_PUBLIC_SUPABASE_URL;
        delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

        const req = new NextRequest('http://localhost/');
        const res = await middleware(req);
        expect(res.status).toBe(200);
    });
});
