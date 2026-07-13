'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function AdminDashboardPage() {
    const { t } = useTranslation('common');

    const sections = [
        { href: '/admin/visa-types', title: t('admin_visa_types'), desc: 'Manage visa categories and types' },
        { href: '/admin/steps', title: t('admin_steps'), desc: 'Edit step-by-step guide content' },
        { href: '/admin/rules', title: t('admin_rules'), desc: 'Configure eligibility rules JSON' },
        { href: '/admin/documents', title: t('admin_documents'), desc: 'Document requirements per visa' },
        { href: '/admin/updates', title: t('admin_updates'), desc: 'Legal changes and banners' },
        { href: '/admin/questions', title: t('admin_questions'), desc: 'Questionnaire questions' },
        { href: '/admin/stories', title: t('admin_stories'), desc: 'Public archive of anonymized case stories' },
    ];

    return (
        <div>
            <h1 className="mb-6 text-2xl font-bold">{t('admin_title')}</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sections.map((s) => (
                    <Link key={s.href} href={s.href}>
                        <Card className="h-full transition-shadow hover:shadow-md">
                            <CardHeader>
                                <CardTitle className="text-base">{s.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{s.desc}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
