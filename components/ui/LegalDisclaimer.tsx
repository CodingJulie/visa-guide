'use client';

import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export function LawyerRequiredBanner({ className }: { className?: string }) {
    const { t } = useTranslation('common');

    return (
        <div
            className={cn(
                'flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/40',
                className
            )}
        >
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
                <p className="font-medium text-amber-900 dark:text-amber-200">{t('lawyer_required_title')}</p>
                <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">{t('lawyer_required_text')}</p>
            </div>
        </div>
    );
}
