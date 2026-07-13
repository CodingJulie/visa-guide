'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { supabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/lib/supabase-env';
import { useTranslation } from 'react-i18next';

export default function SideControls() {
    const { t } = useTranslation('common');
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (!isSupabaseConfigured()) return;

        async function checkAuth() {
            const { data: { user } } = await supabase.auth.getUser();
            setIsLoggedIn(!!user);
        }
        void checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsLoggedIn(!!session?.user);
        });

        return () => subscription.unsubscribe();
    }, []);

    async function handleLogout() {
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    }

    return (
            <div className="fixed bottom-6 left-6 z-50 flex flex-col items-center gap-3">
            <LanguageSwitcher compact />
            <ThemeToggle />
            <Link
                href={isLoggedIn ? '/dashboard' : '/login'}
                className="flex size-11 items-center justify-center rounded-full bg-white/90 text-zinc-800 shadow-md transition-colors hover:bg-white hover:text-blue-700 dark:bg-zinc-800/90 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-blue-300"
                aria-label={t('side_lk')}
                title={t('side_lk')}
            >
                <User className="size-5" />
            </Link>
            <button
                type="button"
                onClick={() => void handleLogout()}
                className="flex size-11 items-center justify-center rounded-full bg-white/90 text-zinc-800 shadow-md transition-colors hover:bg-white hover:text-red-600 dark:bg-zinc-800/90 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-red-400"
                aria-label={t('logout')}
                title={t('logout')}
            >
                <LogOut className="size-5" />
            </button>
            </div>
    );
}
