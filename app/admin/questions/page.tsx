'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { QUESTION_DEFINITIONS, QUESTION_SECTIONS } from '@/lib/questionnaire-schema';
import {
    optionLabelKey,
    questionLabelKey,
    sectionTitleKey,
} from '@/lib/questionnaire-i18n';
import i18nInstance from '@/lib/i18n';

export default function AdminQuestionsPage() {
    const { t, i18n } = useTranslation('common');
    const [dbQuestions, setDbQuestions] = useState<Array<{ id: string; key: string; label_en: string; status: string }>>([]);

    useEffect(() => {
        void supabase.from('questionnaire_questions').select('id, key, label_en, status').then(({ data }) => {
            if (data && data.length > 0) setDbQuestions(data);
        });
    }, []);

    async function syncFromSchema() {
        for (const section of QUESTION_SECTIONS) {
            await supabase.from('questionnaire_sections').upsert({
                key: section.key,
                title_en: i18nInstance.t(sectionTitleKey(section.key), { lng: 'en' }),
                title_ru: i18nInstance.t(sectionTitleKey(section.key), { lng: 'ru' }),
                sort_order: QUESTION_SECTIONS.indexOf(section),
            }, { onConflict: 'key' });
        }

        for (const q of QUESTION_DEFINITIONS) {
            const optionsWithLabels = q.options?.map((opt) => ({
                value: opt.value,
                label_en: i18nInstance.t(optionLabelKey(q.key, opt.value), { lng: 'en' }),
                label_ru: i18nInstance.t(optionLabelKey(q.key, opt.value), { lng: 'ru' }),
            })) ?? null;

            await supabase.from('questionnaire_questions').upsert({
                key: q.key,
                type: q.type,
                label_en: i18nInstance.t(questionLabelKey(q.key), { lng: 'en' }),
                label_ru: i18nInstance.t(questionLabelKey(q.key), { lng: 'ru' }),
                options_json: optionsWithLabels,
                conditions_json: q.conditions ?? [],
                required: q.required ?? false,
                sort_order: QUESTION_DEFINITIONS.indexOf(q),
                status: 'published',
            }, { onConflict: 'key' });
        }

        const { data } = await supabase.from('questionnaire_questions').select('id, key, label_en, status');
        setDbQuestions(data ?? []);
    }

    const displayQuestions = dbQuestions.length > 0
        ? dbQuestions
        : QUESTION_DEFINITIONS.map((q) => ({
            id: q.key,
            key: q.key,
            label_en: i18nInstance.t(questionLabelKey(q.key), { lng: 'en' }),
            status: 'schema',
        }));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{t('admin_questions')}</h1>
                <Button onClick={() => void syncFromSchema()} className="bg-blue-600 hover:bg-blue-700">
                    Sync from schema to DB
                </Button>
            </div>

            <p className="text-sm text-muted-foreground">
                {QUESTION_SECTIONS.length} sections, {QUESTION_DEFINITIONS.length} questions in code schema.
                {i18n.language === 'ru' ? ' Редактируйте через Supabase или синхронизируйте схему.' : ' Edit via Supabase or sync schema.'}
            </p>

            <div className="space-y-2">
                {displayQuestions.map((q) => (
                    <Card key={q.id}>
                        <CardContent className="flex items-center justify-between py-3">
                            <div>
                                <code className="text-xs text-muted-foreground">{q.key}</code>
                                <p className="text-sm">{q.label_en}</p>
                            </div>
                            <Badge variant="outline">{q.status}</Badge>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
