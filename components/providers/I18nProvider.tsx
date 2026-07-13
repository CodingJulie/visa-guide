'use client';

import { useLayoutEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n, { applyI18nLanguage } from '@/lib/i18n';
import { resolveClientLanguage, type AppLanguage } from '@/lib/locale';

export default function I18nProvider({
    children,
    initialLang,
}: {
    children: React.ReactNode;
    initialLang: AppLanguage;
}) {
    applyI18nLanguage(initialLang);

    useLayoutEffect(() => {
        const lang = resolveClientLanguage();
        document.documentElement.lang = lang;

        if (i18n.language !== lang) {
            void i18n.changeLanguage(lang);
        }
    }, []);

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
