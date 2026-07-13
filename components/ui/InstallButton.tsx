'use client';

import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { usePwaInstall } from '@/hooks/use-pwa-install';

export default function InstallButton({ iconOnly = false }: { iconOnly?: boolean }) {
    const { t } = useTranslation('common');
    const { visible, install } = usePwaInstall();

    if (!visible) return null;

    return (
        <Button
            onClick={() => void install()}
            variant="outline"
            size={iconOnly ? 'icon' : 'default'}
            aria-label={t('install.installButton')}
            className={cn(
                'border-blue-300 bg-white/95 text-blue-900 hover:bg-blue-50 dark:border-blue-700 dark:bg-zinc-900/95 dark:text-blue-200 dark:hover:bg-blue-950/40',
                !iconOnly && 'gap-2',
            )}
        >
            <Download className="size-4" />
            {!iconOnly && t('install.installButton')}
        </Button>
    );
}
