import { describe, it, expect, afterEach } from 'vitest';
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from '@/lib/supabase-env';

describe('supabase-env', () => {
    const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const originalKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    afterEach(() => {
        process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = originalKey;
    });

    it('returns placeholder values when env is missing', () => {
        delete process.env.NEXT_PUBLIC_SUPABASE_URL;
        delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

        expect(getSupabaseUrl()).toBe('https://placeholder.supabase.co');
        expect(getSupabaseAnonKey()).toBe('placeholder-key');
        expect(isSupabaseConfigured()).toBe(false);
    });

    it('reads configured env values', () => {
        process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'anon-key';

        expect(getSupabaseUrl()).toBe('https://example.supabase.co');
        expect(getSupabaseAnonKey()).toBe('anon-key');
        expect(isSupabaseConfigured()).toBe(true);
    });

    it('rejects invalid supabase url', () => {
        process.env.NEXT_PUBLIC_SUPABASE_URL = 'not-a-url';
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'anon-key';

        expect(getSupabaseUrl()).toBe('https://placeholder.supabase.co');
        expect(isSupabaseConfigured()).toBe(false);
    });
});
