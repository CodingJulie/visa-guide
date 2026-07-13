'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import QuestionField from '@/components/questionnaire/QuestionField';
import {
    questionnaireSchema,
    QUESTION_SECTIONS,
    QUESTION_DEFINITIONS,
    normalizeQuestionnaireAnswers,
    type QuestionnaireAnswers,
} from '@/lib/questionnaire-schema';
import { getVisibleQuestions } from '@/lib/conditions';
import { supabase } from '@/lib/supabase';
import { DEFAULT_ELIGIBILITY_RULES, evaluateEligibility } from '@/lib/eligibility-engine';
import { sectionSubtitleKey, sectionTitleKey } from '@/lib/questionnaire-i18n';

function getVisibleSectionIndices(answers: Record<string, unknown>): number[] {
    return QUESTION_SECTIONS.map((section, index) => {
        const sectionQuestions = QUESTION_DEFINITIONS.filter((q) => q.section === section.key);
        const visible = getVisibleQuestions(sectionQuestions, answers);
        return visible.length > 0 ? index : -1;
    }).filter((i) => i >= 0);
}

export default function QuestionnaireWizard() {
    const { t } = useTranslation('common');
    const router = useRouter();
    const [stepIndex, setStepIndex] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<QuestionnaireAnswers>({
        resolver: zodResolver(questionnaireSchema),
        defaultValues: {
            visa_goal: undefined,
            dual_citizenship: false,
            current_us_status: 'none',
            has_dependents: false,
            has_us_job_offer: false,
            has_university_degree: false,
            wants_to_study: false,
            chronic_conditions: false,
            disability: false,
            life_threat: false,
            persecution: false,
            gender_violence: false,
            deportation_risk: false,
            prior_visa_denial: false,
            prior_overstay: false,
            prior_deportation: false,
            financial_sponsor: 'self',
            travel_purpose: 'tourism',
        },
        mode: 'onChange',
    });

    const answers = form.watch();

    const visibleSectionIndices = useMemo(
        () => getVisibleSectionIndices(answers as Record<string, unknown>),
        [answers]
    );

    const currentSectionIndex = visibleSectionIndices[stepIndex] ?? visibleSectionIndices[0] ?? 0;
    const currentSection = QUESTION_SECTIONS[currentSectionIndex];

    const sectionQuestions = useMemo(
        () => QUESTION_DEFINITIONS.filter((q) => q.section === currentSection?.key),
        [currentSection]
    );

    const visibleQuestions = useMemo(
        () => getVisibleQuestions(sectionQuestions, answers as Record<string, unknown>),
        [sectionQuestions, answers]
    );

    const isLastSection = stepIndex >= visibleSectionIndices.length - 1;

    async function handleSubmitAll(data: QuestionnaireAnswers) {
        setSubmitting(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const normalized = normalizeQuestionnaireAnswers(data);
            const result = evaluateEligibility(normalized as Record<string, unknown>, DEFAULT_ELIGIBILITY_RULES);

            const { data: caseData, error: insertError } = await supabase
                .from('user_cases')
                .insert({
                    user_id: user.id,
                    answers_json: normalized,
                    recommended_visa_type: result.primary?.visaType ?? null,
                    recommendation_json: result,
                })
                .select('id')
                .single();

            if (insertError) throw insertError;

            router.push(`/results/${caseData.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Submission failed');
        } finally {
            setSubmitting(false);
        }
    }

    function handleNext() {
        if (isLastSection) {
            void form.handleSubmit(handleSubmitAll)();
        } else {
            setStepIndex((i) => i + 1);
        }
    }

    function handleBack() {
        setStepIndex((i) => Math.max(0, i - 1));
    }

    if (!currentSection || visibleSectionIndices.length === 0) return null;

    const sectionTitle = t(sectionTitleKey(currentSection.key));
    const sectionSubtitle = t(sectionSubtitleKey(currentSection.key), { defaultValue: '' });

    return (
        <div className="mx-auto w-full max-w-2xl space-y-5">
            <div className="space-y-1 text-center">
                <p className="text-base font-medium text-muted-foreground md:text-lg">
                    {t('questionnaire_section_of', { current: stepIndex + 1, total: visibleSectionIndices.length })}
                    {' — '}{sectionTitle}
                </p>
                {sectionSubtitle ? (
                    <p className="text-sm text-muted-foreground">{sectionSubtitle}</p>
                ) : null}
            </div>

            <Card className="border-white/60 bg-white/80 shadow-lg backdrop-blur-sm dark:border-blue-900/40 dark:bg-zinc-900/80">
                <CardContent className="space-y-8 p-8 pt-8">
                    {visibleQuestions.map((q) => (
                        <QuestionField
                            key={q.key}
                            question={q}
                            value={answers[q.key as keyof QuestionnaireAnswers]}
                            onChange={(val) => form.setValue(q.key as keyof QuestionnaireAnswers, val as never, { shouldValidate: true })}
                            error={form.formState.errors[q.key as keyof QuestionnaireAnswers]?.message as string | undefined}
                        />
                    ))}

                    {error && <p className="text-sm text-destructive">{error}</p>}

                    <div className="flex justify-between gap-4 border-t border-border/60 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleBack}
                            disabled={stepIndex === 0}
                            className="border-zinc-300 bg-white/95 text-zinc-900 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900/95 dark:text-zinc-100 dark:hover:bg-zinc-800"
                        >
                            {t('questionnaire_back')}
                        </Button>
                        <Button
                            type="button"
                            onClick={handleNext}
                            disabled={submitting}
                            className="bg-primary hover:bg-primary/90"
                        >
                            {isLastSection ? t('questionnaire_submit') : t('questionnaire_next')}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
