'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import EligibilityResultCard from '@/components/results/EligibilityResult';
import { MainLoader } from '@/components/ui/MainLoader';
import { supabase } from '@/lib/supabase';
import type { EligibilityResult } from '@/lib/eligibility-engine';
import type { QuestionnaireAnswers } from '@/lib/questionnaire-schema';

export default function ResultsPage() {
    const { caseId } = useParams<{ caseId: string }>();
    const { t } = useTranslation('common');
    const [result, setResult] = useState<EligibilityResult | null>(null);
    const [answers, setAnswers] = useState<QuestionnaireAnswers | undefined>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const { data, error } = await supabase
                .from('user_cases')
                .select('recommendation_json, answers_json')
                .eq('id', caseId)
                .single();

            if (!error && data) {
                if (data.recommendation_json) {
                    setResult(data.recommendation_json as EligibilityResult);
                }
                if (data.answers_json) {
                    setAnswers(data.answers_json as QuestionnaireAnswers);
                }
            }
            setLoading(false);
        }
        void load();
    }, [caseId]);

    return (
        <main className="container mx-auto max-w-2xl px-4 py-8">
            <h1 className="mb-6 text-2xl font-bold">{t('results_title')}</h1>
            {loading ? <MainLoader /> : result && (
                <EligibilityResultCard result={result} answers={answers} />
            )}
        </main>
    );
}
