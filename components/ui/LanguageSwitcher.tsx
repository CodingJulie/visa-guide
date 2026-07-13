'use client';

import { useTranslation } from 'react-i18next';
import { persistLanguagePreference, type AppLanguage } from '@/lib/locale';

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
    const { t, i18n } = useTranslation('common');

    const changeLanguage = (lang: AppLanguage) => {
        i18n.changeLanguage(lang);
        document.documentElement.lang = lang;
        persistLanguagePreference(lang);
    };

    const buttonClass = (lang: string) =>
        compact
            ? `flex size-11 items-center justify-center rounded-full text-xs font-medium shadow-md transition-colors ${
                i18n.language === lang
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/90 text-zinc-800 hover:bg-white hover:text-blue-700 dark:bg-zinc-800/90 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-blue-300'
            }`
            : `min-h-11 min-w-11 rounded px-3 py-2 text-sm ${
                i18n.language === lang
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600'
            }`;

    return (
        <div
            className={compact ? 'flex flex-col gap-2' : 'flex gap-2'}
            role="group"
            aria-label={t('language_switcher_label')}
        >
            <button
                type="button"
                onClick={() => changeLanguage('en')}
                className={buttonClass('en')}
                aria-label={t('lang_switch_en')}
                aria-pressed={i18n.language === 'en'}
            >
                EN
            </button>
            <button
                type="button"
                onClick={() => changeLanguage('ru')}
                className={buttonClass('ru')}
                aria-label={t('lang_switch_ru')}
                aria-pressed={i18n.language === 'ru'}
            >
                RU
            </button>
        </div>
    );
}
