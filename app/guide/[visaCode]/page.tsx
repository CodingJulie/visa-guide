'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import ChangeBanner from '@/components/ui/ChangeBanner';
import StepCard, { VisaTimeline, type VisaStep } from '@/components/guide/StepCard';
import { MainLoader } from '@/components/ui/MainLoader';
import { supabase } from '@/lib/supabase';
import { evaluateStepCondition } from '@/lib/conditions';
import { useCaseProgress } from '@/hooks/useCaseProgress';
import type { RuleCondition } from '@/lib/eligibility-engine';
import { getFallbackGuideSteps, isFallbackStepId } from '@/lib/guide-fallback';
import {
    loadLocalCompletedSteps,
    toggleLocalCompletedStep,
} from '@/lib/local-case-progress';

export default function GuidePage() {
    const { visaCode } = useParams<{ visaCode: string }>();
    const searchParams = useSearchParams();
    const caseId = searchParams.get('caseId');
    const { t, i18n } = useTranslation('common');
    const [steps, setSteps] = useState<VisaStep[]>([]);
    const [answers, setAnswers] = useState<Record<string, unknown>>({});
    const [usingFallback, setUsingFallback] = useState(false);
    const [localCompletedStepIds, setLocalCompletedStepIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const { completedStepIds, toggleStep } = useCaseProgress(usingFallback ? null : caseId);

    const decodedCode = decodeURIComponent(visaCode);
    const progressScopeId = caseId ?? decodedCode;

    useEffect(() => {
        async function load() {
            const { data: visaType } = await supabase
                .from('visa_types')
                .select('id')
                .eq('code', decodedCode)
                .maybeSingle();

            let nextSteps: VisaStep[] = [];
            let isFallback = false;

            if (visaType) {
                const { data: stepsData } = await supabase
                    .from('visa_steps')
                    .select('*')
                    .eq('visa_type_id', visaType.id)
                    .eq('status', 'published')
                    .order('step_number');

                if (stepsData && stepsData.length > 0) {
                    nextSteps = stepsData as VisaStep[];
                } else {
                    nextSteps = getFallbackGuideSteps(decodedCode);
                    isFallback = nextSteps.length > 0;
                }
            } else {
                nextSteps = getFallbackGuideSteps(decodedCode);
                isFallback = nextSteps.length > 0;
            }

            setSteps(nextSteps);
            setUsingFallback(isFallback);

            if (isFallback) {
                setLocalCompletedStepIds(loadLocalCompletedSteps(progressScopeId));
            }

            if (caseId) {
                const { data: caseData } = await supabase
                    .from('user_cases')
                    .select('answers_json')
                    .eq('id', caseId)
                    .maybeSingle();
                if (caseData?.answers_json) {
                    setAnswers(caseData.answers_json as Record<string, unknown>);
                }
            }

            setLoading(false);
        }
        void load();
    }, [decodedCode, caseId, progressScopeId]);

    const visibleSteps = useMemo(
        () => steps.filter((s) =>
            evaluateStepCondition(answers, s.conditions_json as RuleCondition[] | undefined)
        ),
        [steps, answers]
    );

    const activeCompletedStepIds = usingFallback ? localCompletedStepIds : completedStepIds;

    function handleToggleStep(stepId: string) {
        if (usingFallback || isFallbackStepId(stepId)) {
            setLocalCompletedStepIds(toggleLocalCompletedStep(progressScopeId, stepId));
            return;
        }

        void toggleStep(stepId);
    }

    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto max-w-2xl px-4 py-8">
                <ChangeBanner visaCode={decodedCode} className="mb-6" />
                <h1 className="mb-2 text-2xl font-bold">{t('guide_title')}: {decodedCode}</h1>
                <p className="mb-6 text-sm text-muted-foreground">
                    {t('guide_progress', { completed: visibleSteps.filter((s) => activeCompletedStepIds.has(s.id)).length, total: visibleSteps.length })}
                </p>

                {loading ? <MainLoader /> : (
                    <>
                        <VisaTimeline steps={visibleSteps} completedIds={activeCompletedStepIds} />
                        <div className="space-y-4">
                            {visibleSteps.map((step) => (
                                <StepCard
                                    key={step.id}
                                    step={step}
                                    lang={i18n.language}
                                    completed={activeCompletedStepIds.has(step.id)}
                                    onToggle={() => handleToggleStep(step.id)}
                                />
                            ))}
                        </div>
                    </>
                )}

            </main>
        </div>
    );
}
