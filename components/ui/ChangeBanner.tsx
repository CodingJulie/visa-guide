'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Info, X, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/lib/supabase-env';
import { localizedField, cn } from '@/lib/utils';
import Link from 'next/link';

export interface LegalUpdate {
    id: string;
    title_en: string;
    title_ru: string;
    summary_en: string;
    summary_ru: string;
    severity: 'info' | 'warning' | 'critical';
    affected_visa_types: string[];
    source_url: string | null;
    banner_expires_at: string | null;
}

interface ChangeBannerProps {
    visaCode?: string;
    className?: string;
}

const DISMISS_KEY = 'visaguide_dismissed_banners';

function getDismissed(): string[] {
    if (typeof window === 'undefined') return [];
    try {
        return JSON.parse(localStorage.getItem(DISMISS_KEY) || '[]');
    } catch {
        return [];
    }
}

function dismissBanner(id: string) {
    const dismissed = getDismissed();
    if (!dismissed.includes(id)) {
        localStorage.setItem(DISMISS_KEY, JSON.stringify([...dismissed, id]));
    }
}

const severityStyles = {
    info: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-100',
    warning: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100',
    critical: 'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/40 dark:text-red-100',
};

const severityIcons = {
    info: Info,
    warning: AlertTriangle,
    critical: XCircle,
};

export default function ChangeBanner({ visaCode, className }: ChangeBannerProps) {
    const { t, i18n } = useTranslation('common');
    const [updates, setUpdates] = useState<LegalUpdate[]>([]);
    const [dismissed, setDismissed] = useState<string[]>([]);

    useEffect(() => {
        setDismissed(getDismissed());
    }, []);

    useEffect(() => {
        if (!isSupabaseConfigured()) return;

        async function load() {
            const now = new Date().toISOString();
            const query = supabase
                .from('legal_updates')
                .select('*')
                .eq('banner_active', true)
                .eq('status', 'published')
                .or(`banner_expires_at.is.null,banner_expires_at.gt.${now}`);

            const { data, error } = await query;
            if (error) {
                console.error('Failed to load legal updates', error);
                return;
            }

            let filtered = data ?? [];
            if (visaCode) {
                filtered = filtered.filter(
                    (u) => u.affected_visa_types.length === 0 || u.affected_visa_types.includes(visaCode)
                );
            }
            setUpdates(filtered as LegalUpdate[]);
        }
        void load();
    }, [visaCode]);

    const visible = updates.filter((u) => !dismissed.includes(u.id) || u.severity === 'critical');
    if (visible.length === 0) return null;

    return (
        <div className={cn('space-y-2', className)}>
            {visible.map((update) => {
                const Icon = severityIcons[update.severity];
                const canDismiss = update.severity !== 'critical';

                return (
                    <div
                        key={update.id}
                        className={cn(
                            'relative flex gap-3 rounded-lg border p-4 text-sm',
                            severityStyles[update.severity]
                        )}
                        role="alert"
                    >
                        <Icon className="mt-0.5 size-4 shrink-0" />
                        <div className="flex-1 pr-8">
                            <p className="font-medium">
                                {localizedField(update, 'title', i18n.language)}
                            </p>
                            <p className="mt-1 opacity-90">
                                {localizedField(update, 'summary', i18n.language)}
                            </p>
                            {update.source_url && (
                                <Link
                                    href={update.source_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 inline-block underline underline-offset-2"
                                >
                                    {t('library_source')}
                                </Link>
                            )}
                        </div>
                        {canDismiss && (
                            <button
                                type="button"
                                onClick={() => {
                                    dismissBanner(update.id);
                                    setDismissed((d) => [...d, update.id]);
                                }}
                                className="absolute top-3 right-3 rounded p-1 opacity-70 hover:opacity-100"
                                aria-label={t('change_banner_dismiss')}
                            >
                                <X className="size-4" />
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
