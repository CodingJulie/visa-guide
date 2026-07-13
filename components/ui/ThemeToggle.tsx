'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';

export default function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme();
    const { t } = useTranslation('common');
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <div className="size-11 rounded-full bg-white/90 shadow-md dark:bg-zinc-800/90" aria-hidden />
        );
    }

    const isDark = resolvedTheme === 'dark';

    return (
        <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="flex size-11 items-center justify-center rounded-full bg-white/90 text-zinc-800 shadow-md transition-colors hover:bg-white hover:text-blue-700 dark:bg-zinc-800/90 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-blue-300"
            aria-label={isDark ? t('theme_light') : t('theme_dark')}
            title={isDark ? t('theme_light') : t('theme_dark')}
        >
            {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </button>
    );
}
