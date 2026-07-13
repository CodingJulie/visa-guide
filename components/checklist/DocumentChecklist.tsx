'use client';

import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/Select';
import { localizedField } from '@/lib/utils';
import { pdf } from '@react-pdf/renderer';
import ChecklistPdfDocument from '@/components/checklist/ChecklistPdfDocument';
import { downloadPdfBlob } from '@/lib/download-pdf';
import { ensurePdfFontsRegistered } from '@/lib/pdf-fonts';

export type ChecklistItemStatus = 'not_started' | 'in_progress' | 'ready';

export interface DocumentRequirement {
    id: string;
    doc_name_en: string;
    doc_name_ru: string;
    description_en: string | null;
    description_ru: string | null;
    is_mandatory: boolean;
}

export interface ChecklistItemState {
    doc_requirement_id: string;
    status: ChecklistItemStatus;
    notes: string | null;
}

interface DocumentChecklistProps {
    documents: DocumentRequirement[];
    items: ChecklistItemState[];
    onStatusChange: (docId: string, status: ChecklistItemStatus) => void;
    visaType: string;
    lang: string;
}

export default function DocumentChecklist({
    documents,
    items,
    onStatusChange,
    visaType,
    lang,
}: DocumentChecklistProps) {
    const { t } = useTranslation('common');

    const getStatus = (docId: string): ChecklistItemStatus =>
        items.find((i) => i.doc_requirement_id === docId)?.status ?? 'not_started';

    async function exportPdf() {
        ensurePdfFontsRegistered();

        const docItems = documents.map((d) => ({
            name: localizedField(d, 'doc_name', lang),
            description: localizedField(d, 'description', lang),
            mandatory: d.is_mandatory,
            status: getStatus(d.id),
        }));

        const blob = await pdf(
            <ChecklistPdfDocument visaType={visaType} items={docItems} lang={lang} />
        ).toBlob();

        downloadPdfBlob(blob, `visaguide-checklist-${visaType.replace(/\//g, '-')}.pdf`);
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button onClick={() => void exportPdf()} variant="outline">
                    {t('checklist_export_pdf')}
                </Button>
            </div>

            {documents.map((doc) => {
                const status = getStatus(doc.id);
                return (
                    <Card key={doc.id}>
                        <CardHeader className="flex-row items-start justify-between gap-4">
                            <div>
                                <div className="mb-1 flex gap-2">
                                    <Badge variant={doc.is_mandatory ? 'default' : 'outline'}>
                                        {doc.is_mandatory ? t('checklist_mandatory') : t('checklist_optional')}
                                    </Badge>
                                </div>
                                <CardTitle className="text-base">{localizedField(doc, 'doc_name', lang)}</CardTitle>
                            </div>
                            <Select value={status} onValueChange={(v) => onStatusChange(doc.id, v as ChecklistItemStatus)}>
                                <SelectTrigger className="w-36">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="not_started">{t('checklist_status_not_started')}</SelectItem>
                                    <SelectItem value="in_progress">{t('checklist_status_in_progress')}</SelectItem>
                                    <SelectItem value="ready">{t('checklist_status_ready')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardHeader>
                        {(doc.description_en || doc.description_ru) && (
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    {localizedField(doc, 'description', lang)}
                                </p>
                            </CardContent>
                        )}
                    </Card>
                );
            })}
        </div>
    );
}
