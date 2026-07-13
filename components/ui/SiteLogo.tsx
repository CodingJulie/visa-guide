'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface SiteLogoProps {
    className?: string;
    priority?: boolean;
}

export default function SiteLogo({ className, priority = false }: SiteLogoProps) {
    const { t } = useTranslation('common');

    return (
        <Link
            href="/"
            aria-label={t('back_home')}
            title={t('back_home')}
            className={cn(
                'inline-block transition-opacity hover:opacity-80 active:scale-[0.98]',
                className
            )}
        >
            <Image
                src="/noun-usa-2554196.png"
                alt={t('app_name')}
                width={160}
                height={160}
                priority={priority}
                fetchPriority={priority ? 'high' : undefined}
                sizes="(max-width: 768px) 144px, 160px"
                className="size-36 drop-shadow-md dark:invert md:size-40"
            />
        </Link>
    );
}
