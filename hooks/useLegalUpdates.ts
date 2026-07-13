'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { LegalUpdate } from '@/components/ui/ChangeBanner';

export function useLegalUpdates(visaCode?: string) {
    const [updates, setUpdates] = useState<LegalUpdate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const now = new Date().toISOString();
            const { data } = await supabase
                .from('legal_updates')
                .select('*')
                .eq('status', 'published')
                .eq('banner_active', true)
                .or(`banner_expires_at.is.null,banner_expires_at.gt.${now}`);

            let filtered = (data ?? []) as LegalUpdate[];
            if (visaCode) {
                filtered = filtered.filter(
                    (u) => u.affected_visa_types.length === 0 || u.affected_visa_types.includes(visaCode)
                );
            }
            setUpdates(filtered);
            setLoading(false);
        }
        void load();
    }, [visaCode]);

    return { updates, loading };
}

export function useLegalArticles(search: string) {
    const [articles, setArticles] = useState<Array<{
        id: string;
        slug: string;
        title_en: string;
        title_ru: string;
        summary_en: string | null;
        summary_ru: string | null;
        source_url: string | null;
        last_verified_at: string | null;
    }>>([]);

    useEffect(() => {
        async function load() {
            const query = supabase
                .from('legal_articles')
                .select('id, slug, title_en, title_ru, summary_en, summary_ru, source_url, last_verified_at')
                .eq('status', 'published');

            const { data } = await query;
            let results = data ?? [];

            if (search.trim()) {
                const q = search.toLowerCase();
                results = results.filter(
                    (a) =>
                        a.title_en.toLowerCase().includes(q) ||
                        a.title_ru.toLowerCase().includes(q) ||
                        (a.summary_en?.toLowerCase().includes(q) ?? false)
                );
            }
            setArticles(results);
        }
        void load();
    }, [search]);

    return articles;
}
