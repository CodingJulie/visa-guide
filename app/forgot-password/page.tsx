'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { supabase } from '@/lib/supabase';
import { useTranslation } from 'react-i18next';

export default function ForgotPasswordPage() {
    const { t } = useTranslation('common');
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();
        setLoading(true);
        await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
        });
        setSent(true);
        setLoading(false);
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-6">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>{t('forgot_password')}</CardTitle>
                </CardHeader>
                <CardContent>
                    {sent ? (
                        <p className="text-sm text-muted-foreground">Check your email for reset instructions.</p>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="email">{t('email')}</Label>
                                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
                                Send reset link
                            </Button>
                        </form>
                    )}
                    <Link href="/login" className="mt-4 block text-center text-sm text-blue-600 hover:underline">
                        {t('login')}
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
