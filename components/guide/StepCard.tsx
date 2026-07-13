'use client';

import { CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { localizedField, cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export interface VisaStep {
    id: string;
    step_number: number;
    title_en: string;
    title_ru: string;
    content_en: string;
    content_ru: string;
    required_forms: string[];
    estimated_days: number | null;
    conditions_json?: unknown[];
}

interface StepCardProps {
    step: VisaStep;
    lang: string;
    completed: boolean;
    onToggle: () => void;
}

export default function StepCard({ step, lang, completed, onToggle }: StepCardProps) {
    const { t } = useTranslation('common');

    return (
        <Card className={cn(completed && 'border-green-300 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20')}>
            <CardHeader className="flex-row items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                    {completed ? (
                        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600" />
                    ) : (
                        <Circle className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                    )}
                    <div>
                        <Badge variant="outline" className="mb-2">Step {step.step_number}</Badge>
                        <CardTitle>{localizedField(step, 'title', lang)}</CardTitle>
                        {step.estimated_days && (
                            <p className="mt-1 text-xs text-muted-foreground">
                                {t('guide_estimated_days', { days: step.estimated_days })}
                            </p>
                        )}
                    </div>
                </div>
                <Button variant="ghost" size="sm" onClick={onToggle}>
                    {completed ? t('guide_mark_incomplete') : t('guide_mark_complete')}
                </Button>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {localizedField(step, 'content', lang)}
                </p>
                {step.required_forms.length > 0 && (
                    <div>
                        <p className="mb-1 text-xs font-medium text-muted-foreground">{t('guide_forms')}</p>
                        <div className="flex flex-wrap gap-2">
                            {step.required_forms.map((form) => (
                                <Badge key={form} variant="secondary">{form}</Badge>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export function VisaTimeline({ steps, completedIds }: { steps: VisaStep[]; completedIds: Set<string> }) {
    const completed = steps.filter((s) => completedIds.has(s.id)).length;

    return (
        <div className="mb-6">
            <div className="mb-2 flex justify-between text-sm">
                <span>{completed} / {steps.length}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                    className="h-full bg-blue-600 transition-all"
                    style={{ width: steps.length ? `${(completed / steps.length) * 100}%` : '0%' }}
                />
            </div>
        </div>
    );
}
