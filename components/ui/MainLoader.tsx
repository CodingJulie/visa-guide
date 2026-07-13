'use client';

import { FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function MainLoader() {
    const { t } = useTranslation('common');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="text-center" aria-busy="true">
            <div className="relative">
                <div className={`mx-auto size-20 animate-pulse rounded-full border-4 ${
                    mounted ? 'border-blue-200 dark:border-blue-900' : 'border-blue-200'
                }`} />
                <div className="absolute inset-0 mx-auto size-20 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                <FileText className="absolute top-1/2 left-1/2 size-8 -translate-x-1/2 -translate-y-1/2 text-blue-600" />
            </div>
            {mounted && (
                <>
                    <p className="mt-6 text-lg font-medium">{t('main_loader_title')}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{t('main_loader_subtitle')}</p>
                </>
            )}
        </div>
    );
}
