'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const ADMIN_LINKS = [
    { href: '/admin', key: 'admin_title' },
    { href: '/admin/visa-types', key: 'admin_visa_types' },
    { href: '/admin/steps', key: 'admin_steps' },
    { href: '/admin/rules', key: 'admin_rules' },
    { href: '/admin/documents', key: 'admin_documents' },
    { href: '/admin/updates', key: 'admin_updates' },
    { href: '/admin/questions', key: 'admin_questions' },
    { href: '/admin/stories', key: 'admin_stories' },
];

export default function AdminNav() {
    const { t } = useTranslation('common');
    const pathname = usePathname();

    return (
        <nav className="mb-6 flex flex-wrap gap-2 border-b pb-4">
            {ADMIN_LINKS.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                        'rounded-lg px-3 py-1.5 text-sm transition-colors hover:bg-muted',
                        pathname === link.href && 'bg-blue-100 font-medium text-blue-800 dark:bg-blue-950 dark:text-blue-200'
                    )}
                >
                    {t(link.key)}
                </Link>
            ))}
        </nav>
    );
}
