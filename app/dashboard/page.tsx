'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/Dialog';
import { MainLoader } from '@/components/ui/MainLoader';
import { useUserCases, type UserCase } from '@/hooks/useCaseProgress';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardPage() {
    const { t, i18n } = useTranslation('common');
    const { cases, loading, deleteCase } = useUserCases();
    const [caseToDelete, setCaseToDelete] = useState<UserCase | null>(null);
    const [deleting, setDeleting] = useState(false);

    async function handleDeleteConfirm() {
        if (!caseToDelete) return;

        setDeleting(true);
        const ok = await deleteCase(caseToDelete.id);
        setDeleting(false);

        if (ok) setCaseToDelete(null);
    }

    return (
        <div className="flex-1">
            <main className="container mx-auto px-4 py-8">
                <h1 className="mb-6 text-2xl font-bold">{t('dashboard_title')}</h1>

                {loading ? <MainLoader /> : cases.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="mb-4 text-muted-foreground">{t('dashboard_no_cases')}</p>
                            <Button asChild className="bg-blue-600 hover:bg-blue-700">
                                <Link href="/questionnaire">{t('start_questionnaire')}</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-2">
                        {cases.map((c) => (
                            <Card key={c.id}>
                                <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="font-semibold">{c.recommended_visa_type ?? 'Pending'}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {t('dashboard_created')}: {formatDate(new Date(c.created_at), i18n.language)}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Button asChild size="sm" variant="outline">
                                            <Link href={`/results/${c.id}`}>{t('dashboard_view_case')}</Link>
                                        </Button>
                                        {c.recommended_visa_type && (
                                            <>
                                                <Button asChild size="sm" variant="outline">
                                                    <Link href={`/guide/${encodeURIComponent(c.recommended_visa_type)}?caseId=${c.id}`}>
                                                        {t('results_view_guide')}
                                                    </Link>
                                                </Button>
                                                <Button asChild size="sm" variant="outline">
                                                    <Link href={`/checklist/${c.id}`}>{t('results_view_checklist')}</Link>
                                                </Button>
                                            </>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => setCaseToDelete(c)}
                                        >
                                            <Trash2 />
                                            {t('dashboard_delete_case')}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                <Dialog open={caseToDelete !== null} onOpenChange={(open) => !open && !deleting && setCaseToDelete(null)}>
                    <DialogContent showCloseButton={!deleting}>
                        <DialogHeader>
                            <DialogTitle>{t('dashboard_delete_confirm_title')}</DialogTitle>
                            <DialogDescription>
                                {t('dashboard_delete_confirm_description')}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                disabled={deleting}
                                onClick={() => setCaseToDelete(null)}
                            >
                                {t('action_cancel')}
                            </Button>
                            <Button
                                variant="destructive"
                                disabled={deleting}
                                onClick={() => void handleDeleteConfirm()}
                            >
                                {t('dashboard_delete_case')}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}
