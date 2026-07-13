'use client';

import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { LawyerRequiredBanner } from '@/components/ui/LegalDisclaimer';
import type { EligibilityResult } from '@/lib/eligibility-engine';
import type { QuestionnaireAnswers } from '@/lib/questionnaire-schema';
import { isWorkVisaNoOfferGoal } from '@/lib/questionnaire-schema';
import {
    getPreparationDocuments,
    getVisaDocuments,
    getVisaRecommendations,
} from '@/lib/visa-recommendations';
import { formatVisaDisplayName, getPrerequisiteNote } from '@/lib/visa-official-reference';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { pdf } from '@react-pdf/renderer';
import ResultsPdfDocument from '@/components/results/ResultsPdfDocument';
import { downloadPdfBlob } from '@/lib/download-pdf';
import { ensurePdfFontsRegistered } from '@/lib/pdf-fonts';
import { AlertCircle } from 'lucide-react';

interface EligibilityResultProps {
    result: EligibilityResult;
    answers?: QuestionnaireAnswers;
}

const confidenceVariant = {
    high: 'default' as const,
    medium: 'secondary' as const,
    low: 'outline' as const,
};

export default function EligibilityResultCard({ result, answers }: EligibilityResultProps) {
    const { t, i18n } = useTranslation('common');
    const primary = result.primary;
    const isPreparationStage = isWorkVisaNoOfferGoal(answers?.visa_goal);

    if (!primary) {
        return (
            <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                    {t('results_no_match')}
                </CardContent>
            </Card>
        );
    }

    const confidenceLabel = {
        high: t('results_confidence_high'),
        medium: t('results_confidence_medium'),
        low: t('results_confidence_low'),
    }[primary.confidence];

    const documents = answers
        ? [
            ...getPreparationDocuments(answers, i18n.language),
            ...getVisaDocuments(primary.visaType, i18n.language),
        ]
        : getVisaDocuments(primary.visaType, i18n.language);

    const uniqueDocuments = documents.filter(
        (doc, index, arr) => arr.findIndex((d) => d.name === doc.name) === index
    );

    const recommendations = answers
        ? getVisaRecommendations(primary.visaType, answers, i18n.language)
        : [];

    const prerequisiteNote = getPrerequisiteNote(primary.visaType, i18n.language);
    const displayVisaName = formatVisaDisplayName(primary.visaType, i18n.language);

    async function exportPdf() {
        const currentPrimary = result.primary;
        if (!currentPrimary) return;

        ensurePdfFontsRegistered();

        const blob = await pdf(
            <ResultsPdfDocument
                visaType={displayVisaName}
                documents={uniqueDocuments}
                recommendations={recommendations}
                lang={i18n.language}
            />
        ).toBlob();

        downloadPdfBlob(blob, `visaguide-${currentPrimary.visaType.replace(/\//g, '-')}.pdf`);
    }

    return (
        <div className="space-y-4">
            {primary.lawyerRequired && <LawyerRequiredBanner />}

            {isPreparationStage && (
                <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/40">
                    <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <div>
                        <p className="font-medium text-amber-900 dark:text-amber-200">{t('results_preparation_title')}</p>
                        <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">{t('results_preparation_desc')}</p>
                    </div>
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>{t('results_primary')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-3xl font-bold text-blue-700 dark:text-blue-400">{displayVisaName}</span>
                        <Badge variant={confidenceVariant[primary.confidence]}>{confidenceLabel}</Badge>
                    </div>

                    {prerequisiteNote && (
                        <p className="text-sm text-muted-foreground">{prerequisiteNote}</p>
                    )}

                    {primary.alternatives.length > 0 && (
                        <div>
                            <p className="mb-2 text-sm font-medium text-muted-foreground">{t('results_alternatives')}</p>
                            <div className="flex flex-wrap gap-2">
                                {primary.alternatives.map((alt) => (
                                    <Badge key={alt} variant="outline">{formatVisaDisplayName(alt, i18n.language)}</Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {primary.blockers.length > 0 && (
                        <div>
                            <p className="mb-2 text-sm font-medium text-destructive">{t('results_blockers')}</p>
                            <ul className="list-inside list-disc text-sm">
                                {primary.blockers.map((b) => <li key={b}>{b}</li>)}
                            </ul>
                        </div>
                    )}

                    {(uniqueDocuments.length > 0 || recommendations.length > 0) && (
                        <div className="pt-2">
                            <Button
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => void exportPdf()}
                            >
                                {t('results_export_pdf')}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
