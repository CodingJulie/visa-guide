'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Scale } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useTranslation } from 'react-i18next';
import { MainLoader } from '@/components/ui/MainLoader';
import { isSupabaseConfigured } from '@/lib/supabase-env';

function resolveRedirectPath(raw: string | null): string {
    if (raw?.startsWith('/') && !raw.startsWith('//')) return raw;
    return '/dashboard';
}

export default function LoginPage() {
    const { t } = useTranslation('common');
    const [mounted, setMounted] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [redirectTo, setRedirectTo] = useState('/dashboard');
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        const params = new URLSearchParams(window.location.search);
        setRedirectTo(resolveRedirectPath(params.get('redirect')));
        if (params.get('error') === 'auth') {
            setError(t('auth_callback_error'));
        }
        const saved = localStorage.getItem('remembered_email');
        if (saved) setEmail(saved);
    }, [t]);

    async function handleLogin(e: React.SyntheticEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!isSupabaseConfigured()) {
            setError(t('supabase_not_configured'));
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            if (data.session) {
                router.refresh();
                router.push(redirectTo);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : t('login_error'));
        } finally {
            setLoading(false);
        }
    }

    if (!mounted) {
        return (
            <div className="flex flex-1 items-center justify-center px-6 pb-12">
                <MainLoader />
            </div>
        );
    }

    return (
        <div className="flex flex-1 items-center justify-center px-6 pb-12">
            <div className="w-full max-w-md space-y-4">
                <Card className="shadow-2xl">
                    <CardHeader className="text-center">
                        <Link href="/" className="mx-auto mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
                            <Scale className="size-8 text-white" />
                        </Link>
                        <h1 className="text-2xl font-bold">{t('login_to_app')}</h1>
                        <p className="text-muted-foreground">{t('login_desc')}</p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <Label htmlFor="email">{t('email')}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <Label htmlFor="password">{t('password')}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            {error && <p className="text-sm text-destructive">{error}</p>}
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                                {t('login')}
                            </Button>
                        </form>
                        <p className="mt-4 text-center text-sm">
                            <Link href="/forgot-password" className="text-blue-600 hover:underline">{t('forgot_password')}</Link>
                        </p>
                        <p className="mt-2 text-center text-sm text-muted-foreground">
                            {t('no_account')} <Link href="/register" className="text-blue-600 hover:underline">{t('register')}</Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
