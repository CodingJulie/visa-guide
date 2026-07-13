'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Clock, Lightbulb } from 'lucide-react';
import { StoryAnonymizedNotice } from '@/components/archive/StoryCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { MainLoader } from '@/components/ui/MainLoader';
import { useStory } from '@/hooks/useStories';
import { localizedField } from '@/lib/utils';
import { OUTCOME_VARIANT, STORY_OUTCOME_LABELS, type StoryOutcome } from '@/lib/stories';

export default function StoryDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const { t, i18n } = useTranslation('common');
    const { story, loading } = useStory(slug);
    const lang = i18n.language;

    if (loading) {
        return (
            <div className="flex-1">
                <main className="container mx-auto px-4 py-16"><MainLoader /></main>
            </div>
        );
    }

    if (!story) {
        return (
            <div className="flex-1">
                <main className="container mx-auto px-4 py-16 text-center">
                    <p className="text-muted-foreground">{t('archive_not_found')}</p>
                    <Button asChild className="mt-4" variant="outline">
                        <Link href="/archive">{t('archive_back')}</Link>
                    </Button>
                </main>
            </div>
        );
    }

    const outcome = story.outcome as StoryOutcome;
    const takeaways = lang === 'ru' ? story.key_takeaways_ru : story.key_takeaways_en;

    return (
        <div className="flex-1">
            <main className="container mx-auto max-w-3xl px-4 py-8">
                <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
                    <Link href="/archive">
                        <ArrowLeft className="mr-1 size-4" />
                        {t('archive_back')}
                    </Link>
                </Button>

                <StoryAnonymizedNotice className="mb-6" />

                <div className="mb-4 flex flex-wrap gap-2">
                    <Badge variant={OUTCOME_VARIANT[outcome]}>
                        {lang === 'ru' ? STORY_OUTCOME_LABELS[outcome].ru : STORY_OUTCOME_LABELS[outcome].en}
                    </Badge>
                    {story.is_complex && <Badge variant="outline">{t('archive_complex_case')}</Badge>}
                    {story.lawyer_involved && <Badge variant="outline">{t('archive_lawyer_involved')}</Badge>}
                    {story.duration_months && (
                        <Badge variant="outline">
                            <Clock className="mr-1 size-3" />
                            {t('archive_duration_months', { count: story.duration_months })}
                        </Badge>
                    )}
                </div>

                <h1 className="text-3xl font-bold leading-tight">
                    {localizedField(story, 'title', lang)}
                </h1>

                <p className="mt-2 text-muted-foreground">
                    {localizedField(story, 'person_alias', lang)} · {story.origin_country}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                    {story.visa_types.map((v) => (
                        <Link key={v} href={`/guide/${encodeURIComponent(v)}`}>
                            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">{v}</Badge>
                        </Link>
                    ))}
                </div>

                <article className="prose prose-zinc dark:prose-invert mt-8 max-w-none">
                    <p className="whitespace-pre-wrap text-base leading-relaxed">
                        {localizedField(story, 'story', lang)}
                    </p>
                </article>

                {takeaways.length > 0 && (
                    <Card className="mt-8 border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Lightbulb className="size-5 text-blue-600" />
                                {t('archive_key_takeaways')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {takeaways.map((item, i) => (
                                    <li key={i} className="flex gap-2 text-sm">
                                        <span className="font-medium text-blue-600">{i + 1}.</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                {(story.lessons_learned_en || story.lessons_learned_ru) && (
                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle className="text-base">{t('archive_lessons')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {localizedField(story, 'lessons_learned', lang)}
                            </p>
                        </CardContent>
                    </Card>
                )}

                <div className="mt-4 flex flex-wrap gap-1">
                    {story.tags.map((tg) => (
                        <Badge key={tg} variant="outline" className="text-xs">{tg}</Badge>
                    ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                        <Link href="/questionnaire">{t('start_questionnaire')}</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/archive">{t('archive_browse_more')}</Link>
                    </Button>
                </div>

            </main>
        </div>
    );
}
