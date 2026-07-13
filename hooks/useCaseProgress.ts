'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { EligibilityResult } from '@/lib/eligibility-engine';

export interface UserCase {
    id: string;
    answers_json: Record<string, unknown>;
    recommended_visa_type: string | null;
    recommendation_json: EligibilityResult | null;
    status: string;
    created_at: string;
}

export function useUserCases() {
    const [cases, setCases] = useState<UserCase[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('user_cases')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (!error && data) setCases(data as UserCase[]);
            setLoading(false);
        }
        void load();
    }, []);

    const deleteCase = useCallback(async (caseId: string) => {
        const { error } = await supabase
            .from('user_cases')
            .delete()
            .eq('id', caseId);

        if (error) return false;

        setCases((prev) => prev.filter((c) => c.id !== caseId));
        return true;
    }, []);

    return { cases, loading, deleteCase };
}

export function useCaseProgress(caseId: string | null) {
    const [completedStepIds, setCompletedStepIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!caseId) return;

        async function load() {
            const { data } = await supabase
                .from('user_case_progress')
                .select('step_id')
                .eq('case_id', caseId);

            if (data) setCompletedStepIds(new Set(data.map((r) => r.step_id)));
        }
        void load();
    }, [caseId]);

    async function toggleStep(stepId: string) {
        if (!caseId) return;

        if (completedStepIds.has(stepId)) {
            await supabase.from('user_case_progress').delete().eq('case_id', caseId).eq('step_id', stepId);
            setCompletedStepIds((prev) => {
                const next = new Set(prev);
                next.delete(stepId);
                return next;
            });
        } else {
            await supabase.from('user_case_progress').insert({ case_id: caseId, step_id: stepId });
            setCompletedStepIds((prev) => new Set([...prev, stepId]));
        }
    }

    return { completedStepIds, toggleStep };
}
