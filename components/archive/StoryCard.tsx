'use client';

import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';
import { Clock, MapPin, Scale, User } from 'lucide-react';
import { localizedField } from '@/lib/utils';
import type { CaseStory, StoryOutcome } from '@/lib/stories';
import { OUTCOME_VARIANT, STORY_OUTCOME_LABELS } from '@/lib/stories';
import { useTranslation } from 'react-i18next';

interface StoryCardProps {
    story: CaseStory;
    lang: string;
}

export default function StoryCard({ story, lang }: StoryCardProps) {
    const { t } = useTranslation('common');
    const outcome = story.outcome as StoryOutcome;
    const outcomeLabel = lang === 'ru'
        ? STORY_OUTCOME_LABELS[outcome].ru
        : STORY_OUTCOME_LABELS[outcome].en;

    return (
        <Link href={`/archive/${story.slug}`} className="block">
            <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="space-y-2 p-4 pb-0">
                    <div className="flex flex-wrap gap-1.5">
                        <Badge variant={OUTCOME_VARIANT[outcome]}>{outcomeLabel}</Badge>
                        {story.is_complex && (
                            <Badge variant="outline">{t('archive_complex_case')}</Badge>
                        )}
                        {story.lawyer_involved && (
                            <Badge variant="outline">{t('archive_lawyer_involved')}</Badge>
                        )}
                    </div>
                    <CardTitle className="line-clamp-2 text-base font-semibold leading-snug">
                        {localizedField(story, 'title', lang)}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 p-4 pt-2">
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                        {localizedField(story, 'summary', lang)}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <User className="size-3 shrink-0" />
                            {localizedField(story, 'person_alias', lang)}
                        </span>
                        <span className="flex items-center gap-1">
                            <MapPin className="size-3 shrink-0" />
                            {story.origin_country}
                        </span>
                        {story.duration_months && (
                            <span className="flex items-center gap-1">
                                <Clock className="size-3 shrink-0" />
                                {t('archive_duration_months', { count: story.duration_months })}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {story.visa_types.slice(0, 3).map((v) => (
                            <Badge key={v} variant="secondary" className="text-[10px]">{v}</Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

export function StoryAnonymizedNotice({ className }: { className?: string }) {
    const { t } = useTranslation('common');

    return (
        <div className={`flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100 ${className ?? ''}`}>
            <Scale className="mt-0.5 size-4 shrink-0" />
            <p>{t('archive_anonymized_notice')}</p>
        </div>
    );
}
