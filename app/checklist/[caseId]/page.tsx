'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import DocumentChecklist, {
    type ChecklistItemState,
    type ChecklistItemStatus,
    type DocumentRequirement,
} from '@/components/checklist/DocumentChecklist';
import { MainLoader } from '@/components/ui/MainLoader';
import { supabase } from '@/lib/supabase';
import { evaluateStepCondition } from '@/lib/conditions';
import type { RuleCondition } from '@/lib/eligibility-engine';
import {
    getChecklistDocumentRequirements,
    isFallbackDocumentId,
} from '@/lib/visa-recommendations';
import {
    loadLocalChecklistItems,
    saveLocalChecklistItem,
} from '@/lib/local-case-progress';

export default function ChecklistPage() {
    const { caseId } = useParams<{ caseId: string }>();
    const { t, i18n } = useTranslation('common');
    const [documents, setDocuments] = useState<DocumentRequirement[]>([]);
    const [items, setItems] = useState<ChecklistItemState[]>([]);
    const [visaType, setVisaType] = useState('');
    const [usingFallback, setUsingFallback] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const { data: caseData } = await supabase
                .from('user_cases')
                .select('recommended_visa_type, answers_json')
                .eq('id', caseId)
                .single();

            if (!caseData?.recommended_visa_type) {
                setLoading(false);
                return;
            }

            setVisaType(caseData.recommended_visa_type);
            const answers = caseData.answers_json as Record<string, unknown>;

            const { data: vt } = await supabase
                .from('visa_types')
                .select('id')
                .eq('code', caseData.recommended_visa_type)
                .maybeSingle();

            let nextDocuments: DocumentRequirement[] = [];
            let isFallback = false;

            if (vt) {
                const { data: docs } = await supabase
                    .from('visa_document_requirements')
                    .select('*')
                    .eq('visa_type_id', vt.id)
                    .eq('status', 'published')
                    .order('sort_order');

                const filtered = (docs ?? []).filter((d) =>
                    evaluateStepCondition(answers, d.conditions_json as RuleCondition[] | undefined)
                ) as DocumentRequirement[];

                if (filtered.length > 0) {
                    nextDocuments = filtered;
                } else {
                    nextDocuments = getChecklistDocumentRequirements(caseData.recommended_visa_type);
                    isFallback = nextDocuments.length > 0;
                }
            } else {
                nextDocuments = getChecklistDocumentRequirements(caseData.recommended_visa_type);
                isFallback = nextDocuments.length > 0;
            }

            setDocuments(nextDocuments);
            setUsingFallback(isFallback);

            if (isFallback) {
                const localItems = loadLocalChecklistItems(caseId);
                setItems(
                    Object.entries(localItems).map(([doc_requirement_id, status]) => ({
                        doc_requirement_id,
                        status,
                        notes: null,
                    })),
                );
            } else {
                const { data: checklistItems } = await supabase
                    .from('user_checklist_items')
                    .select('*')
                    .eq('case_id', caseId);

                setItems((checklistItems ?? []) as ChecklistItemState[]);
            }
            setLoading(false);
        }
        void load();
    }, [caseId]);

    async function handleStatusChange(docId: string, status: ChecklistItemStatus) {
        if (usingFallback || isFallbackDocumentId(docId)) {
            saveLocalChecklistItem(caseId, docId, status);
        } else {
            const existing = items.find((i) => i.doc_requirement_id === docId);

            if (existing) {
                await supabase
                    .from('user_checklist_items')
                    .update({ status, updated_at: new Date().toISOString() })
                    .eq('case_id', caseId)
                    .eq('doc_requirement_id', docId);
            } else {
                await supabase.from('user_checklist_items').insert({
                    case_id: caseId,
                    doc_requirement_id: docId,
                    status,
                });
            }
        }

        setItems((prev) => {
            const filtered = prev.filter((i) => i.doc_requirement_id !== docId);
            return [...filtered, { doc_requirement_id: docId, status, notes: null }];
        });
    }

    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto max-w-2xl px-4 py-8">
                <h1 className="mb-6 text-2xl font-bold">
                    {t('checklist_title')}{visaType ? `: ${visaType}` : ''}
                </h1>

                {loading ? <MainLoader /> : (
                    <DocumentChecklist
                        documents={documents}
                        items={items}
                        onStatusChange={(docId, status) => void handleStatusChange(docId, status)}
                        visaType={visaType}
                        lang={i18n.language}
                    />
                )}

            </main>
        </div>
    );
}
