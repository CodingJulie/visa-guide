'use client';

import { useEffect, useState } from 'react';
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

export default function UpdatePasswordPage() {
    const { t } = useTranslation('common');
    const [mounted, setMounted] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    async function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();
        setError(null);

        if (password.length < 6) {
            setError(t('update_password_too_short'));
            return;
        }
        if (password !== confirmPassword) {
            setError(t('update_password_mismatch'));
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;
            setSuccess(true);
            setTimeout(() => router.push('/dashboard'), 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : t('update_password_error'));
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
                        <h1 className="text-2xl font-bold">{t('update_password_title')}</h1>
                        <p className="text-muted-foreground">{t('update_password_desc')}</p>
                    </CardHeader>
                    <CardContent>
                        {success ? (
                            <p className="text-center text-sm text-muted-foreground">{t('update_password_success')}</p>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
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
                                <div>
                                    <Label htmlFor="confirmPassword">{t('confirm_password')}</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        disabled={loading}
                                    />
                                </div>
                                {error && <p className="text-sm text-destructive">{error}</p>}
                                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                                    {t('update_password_submit')}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
