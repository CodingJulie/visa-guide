'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { CaseStory } from '@/lib/stories';
import { FALLBACK_STORIES } from '@/lib/story-fallback';

export function useStories(filters?: { visaType?: string; tag?: string; complexOnly?: boolean; search?: string }) {
    const [stories, setStories] = useState<CaseStory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setLoading(true);
            const { data, error } = await supabase
                .from('case_stories')
                .select('*')
                .eq('status', 'published')
                .order('published_at', { ascending: false });

            if (!error && data && data.length > 0) {
                setStories(data as CaseStory[]);
            } else {
                setStories(FALLBACK_STORIES);
            }
            setLoading(false);
        }
        void load();
    }, []);

    const filtered = useMemo(() => {
        let result = stories;

        if (filters?.visaType) {
            result = result.filter((s) => s.visa_types.includes(filters.visaType!));
        }
        if (filters?.tag) {
            result = result.filter((s) => s.tags.includes(filters.tag!));
        }
        if (filters?.complexOnly) {
            result = result.filter((s) => s.is_complex);
        }
        if (filters?.search?.trim()) {
            const q = filters.search.toLowerCase();
            result = result.filter(
                (s) =>
                    s.title_en.toLowerCase().includes(q) ||
                    s.title_ru.toLowerCase().includes(q) ||
                    s.summary_en.toLowerCase().includes(q) ||
                    s.summary_ru.toLowerCase().includes(q) ||
                    s.tags.some((t) => t.toLowerCase().includes(q))
            );
        }

        return result;
    }, [stories, filters]);

    const allVisaTypes = useMemo(
        () => [...new Set(stories.flatMap((s) => s.visa_types))].sort(),
        [stories]
    );

    const allTags = useMemo(
        () => [...new Set(stories.flatMap((s) => s.tags))].sort(),
        [stories]
    );

    return { stories: filtered, allStories: stories, allVisaTypes, allTags, loading };
}

export function useStory(slug: string) {
    const [story, setStory] = useState<CaseStory | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const { data } = await supabase
                .from('case_stories')
                .select('*')
                .eq('slug', slug)
                .eq('status', 'published')
                .maybeSingle();

            if (data) {
                setStory(data as CaseStory);
            } else {
                setStory(FALLBACK_STORIES.find((s) => s.slug === slug) ?? null);
            }
            setLoading(false);
        }
        void load();
    }, [slug]);

    return { story, loading };
}
