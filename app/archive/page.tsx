'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import StoryCard, { StoryAnonymizedNotice } from '@/components/archive/StoryCard';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/Select';
import { MainLoader } from '@/components/ui/MainLoader';
import { useStories } from '@/hooks/useStories';
import { useClientReady } from '@/hooks/useClientReady';
import { BookOpen } from 'lucide-react';

export default function ArchivePage() {
    const { t, i18n } = useTranslation('common');
    const ready = useClientReady();
    const [search, setSearch] = useState('');
    const [visaType, setVisaType] = useState<string>('all');
    const [tag, setTag] = useState<string>('all');
    const [complexOnly, setComplexOnly] = useState(false);

    const { stories, allVisaTypes, allTags, loading } = useStories({
        search,
        visaType: visaType === 'all' ? undefined : visaType,
        tag: tag === 'all' ? undefined : tag,
        complexOnly,
    });

    if (!ready) {
        return (
            <div className="flex-1">
                <main className="container mx-auto px-4 py-8">
                    <MainLoader />
                </main>
            </div>
        );
    }

    return (
        <div className="flex-1">
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8 flex items-start gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                        <BookOpen className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{t('archive_title')}</h1>
                        <p className="mt-1 max-w-2xl text-muted-foreground">{t('archive_desc')}</p>
                    </div>
                </div>

                <StoryAnonymizedNotice className="mb-6" />

                <div className="mb-6 grid gap-3 rounded-xl border bg-muted/30 p-3">
                    <div>
                        <Label htmlFor="archive-search">{t('archive_search')}</Label>
                        <Input
                            id="archive-search"
                            placeholder={t('archive_search_placeholder')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="mt-1.5"
                        />
                    </div>
                    <div>
                        <Label>{t('archive_filter_visa')}</Label>
                        <Select value={visaType} onValueChange={setVisaType}>
                            <SelectTrigger className="mt-1.5 w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('archive_filter_all')}</SelectItem>
                                {allVisaTypes.map((v) => (
                                    <SelectItem key={v} value={v}>{v}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>{t('archive_filter_tag')}</Label>
                        <Select value={tag} onValueChange={setTag}>
                            <SelectTrigger className="mt-1.5 w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('archive_filter_all')}</SelectItem>
                                {allTags.map((tg) => (
                                    <SelectItem key={tg} value={tg}>{tg}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch id="complex-only" checked={complexOnly} onCheckedChange={setComplexOnly} />
                        <Label htmlFor="complex-only" className="cursor-pointer">
                            {t('archive_complex_only')}
                        </Label>
                    </div>
                </div>

                {loading ? (
                    <MainLoader />
                ) : stories.length === 0 ? (
                    <p className="py-12 text-center text-muted-foreground">{t('archive_no_results')}</p>
                ) : (
                    <>
                        <p className="mb-4 text-sm text-muted-foreground">
                            {t('archive_results_count', { count: stories.length })}
                        </p>
                        <div className="flex flex-col gap-3">
                            {stories.map((story) => (
                                <StoryCard key={story.id} story={story} lang={i18n.language} />
                            ))}
                        </div>
                    </>
                )}

            </main>
        </div>
    );
}
