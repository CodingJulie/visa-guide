'use client';

import QuestionnaireWizard from '@/components/questionnaire/QuestionnaireWizard';
import { useTranslation } from 'react-i18next';

export default function QuestionnairePage() {
    const { t } = useTranslation('common');

    return (
        <div className="flex flex-1 flex-col pb-12">
            <header className="shrink-0 px-4 pb-4 pt-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    {t('questionnaire_title')}
                </h1>
                <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
                    {t('questionnaire_desc')}
                </p>
            </header>

            <div className="flex flex-1 flex-col px-4">
                <QuestionnaireWizard />
            </div>
        </div>
    );
}
