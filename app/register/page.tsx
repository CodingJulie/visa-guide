'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Scale } from 'lucide-react';
import { AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useTranslation } from 'react-i18next';
import { MainLoader } from '@/components/ui/MainLoader';

export default function RegisterPage() {
    const { t } = useTranslation('common');
    const [mounted, setMounted] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    async function handleRegister(e: React.SyntheticEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: fullName },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;

            if (data.user?.identities?.length === 0) {
                setError(t('register_email_exists'));
                return;
            }

            if (data.session) {
                router.refresh();
                router.push('/dashboard');
            } else {
                setSuccess(true);
            }
        } catch (err) {
            if (err instanceof AuthError) {
                const message = err.message.toLowerCase().includes('database error')
                    ? t('register_db_error')
                    : err.message;
                setError(message);
            } else {
                setError(err instanceof Error ? err.message : t('register_error'));
            }
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
                        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
                            <Scale className="size-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold">{t('register_to_app')}</h1>
                        <p className="text-muted-foreground">{t('register_desc')}</p>
                    </CardHeader>
                    <CardContent>
                        {success ? (
                            <div className="space-y-4 text-center">
                                <p className="text-sm text-muted-foreground">{t('register_success_confirm_email')}</p>
                                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                                    <Link href="/login">{t('login')}</Link>
                                </Button>
                            </div>
                        ) : (
                            <>
                                <form onSubmit={handleRegister} className="space-y-4">
                                    <div>
                                        <Label htmlFor="fullName">{t('full_name')}</Label>
                                        <Input
                                            id="fullName"
                                            type="text"
                                            autoComplete="name"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
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
                                            autoComplete="new-password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            minLength={6}
                                            disabled={loading}
                                        />
                                    </div>
                                    {error && <p className="text-sm text-destructive">{error}</p>}
                                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                                        {t('register')}
                                    </Button>
                                </form>
                                <p className="mt-4 text-center text-sm text-muted-foreground">
                                    {t('have_account')} <Link href="/login" className="text-blue-600 hover:underline">{t('login')}</Link>
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
