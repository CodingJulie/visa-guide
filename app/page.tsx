'use client';

import Link from 'next/link';
import { ClipboardList, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function LandingPage() {
    const { t } = useTranslation('common');

    return (
        <div className="relative flex flex-1 flex-col items-center justify-center px-6 pb-12">
            <main className="flex w-full max-w-lg flex-col items-center text-center">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white md:text-5xl">
                    {t('landing_hero_title')}
                </h1>

                <p className="mt-4 max-w-md text-base text-zinc-600 dark:text-zinc-300 md:text-lg">
                    {t('landing_hero_desc')}
                </p>

                <div className="mt-16 flex w-full flex-col gap-5">
                    <Link
                        href="/questionnaire"
                        className="group flex min-h-[88px] w-full items-center justify-center gap-4 rounded-2xl bg-blue-600 px-8 text-xl font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl active:scale-[0.98]"
                    >
                        <ClipboardList className="size-7 shrink-0" />
                        {t('landing_btn_questionnaire')}
                    </Link>
                    <Link
                        href="/archive"
                        className="group flex min-h-[88px] w-full items-center justify-center gap-4 rounded-2xl border-2 border-blue-200 bg-white px-8 text-xl font-semibold text-blue-700 shadow-md transition-all hover:border-blue-300 hover:bg-blue-50 hover:shadow-lg active:scale-[0.98] dark:border-blue-800 dark:bg-zinc-900 dark:text-blue-400 dark:hover:bg-zinc-800"
                    >
                        <BookOpen className="size-7 shrink-0" />
                        {t('landing_btn_cases')}
                    </Link>
                </div>
            </main>
        </div>
    );
}
