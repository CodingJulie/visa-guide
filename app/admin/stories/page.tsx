'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Switch } from '@/components/ui/Switch';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/Select';
import type { StoryOutcome } from '@/lib/stories';
import Link from 'next/link';

function slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function AdminStoriesPage() {
    const { t } = useTranslation('common');
    const [stories, setStories] = useState<Array<{ id: string; slug: string; title_en: string; status: string; outcome: string }>>([]);
    const [form, setForm] = useState({
        title_en: '',
        title_ru: '',
        summary_en: '',
        summary_ru: '',
        story_en: '',
        story_ru: '',
        person_alias_en: '',
        person_alias_ru: '',
        origin_country: '',
        visa_types: '',
        tags: '',
        outcome: 'pending' as StoryOutcome,
        is_complex: false,
        lawyer_involved: false,
        duration_months: '',
        lessons_learned_en: '',
        lessons_learned_ru: '',
        key_takeaways_en: '',
        key_takeaways_ru: '',
    });

    useEffect(() => { void load(); }, []);

    async function load() {
        const { data } = await supabase.from('case_stories').select('id, slug, title_en, status, outcome').order('created_at', { ascending: false });
        setStories(data ?? []);
    }

    async function handleCreate(e: React.SyntheticEvent) {
        e.preventDefault();
        const slug = slugify(form.title_en);

        await supabase.from('case_stories').insert({
            slug,
            title_en: form.title_en,
            title_ru: form.title_ru,
            summary_en: form.summary_en,
            summary_ru: form.summary_ru,
            story_en: form.story_en,
            story_ru: form.story_ru,
            person_alias_en: form.person_alias_en,
            person_alias_ru: form.person_alias_ru,
            origin_country: form.origin_country,
            visa_types: form.visa_types.split(',').map((s) => s.trim()).filter(Boolean),
            tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
            outcome: form.outcome,
            is_complex: form.is_complex,
            lawyer_involved: form.lawyer_involved,
            duration_months: form.duration_months ? Number(form.duration_months) : null,
            lessons_learned_en: form.lessons_learned_en || null,
            lessons_learned_ru: form.lessons_learned_ru || null,
            key_takeaways_en: form.key_takeaways_en.split('\n').map((s) => s.trim()).filter(Boolean),
            key_takeaways_ru: form.key_takeaways_ru.split('\n').map((s) => s.trim()).filter(Boolean),
            status: 'draft',
        });

        setForm({
            title_en: '', title_ru: '', summary_en: '', summary_ru: '',
            story_en: '', story_ru: '', person_alias_en: '', person_alias_ru: '',
            origin_country: '', visa_types: '', tags: '', outcome: 'pending',
            is_complex: false, lawyer_involved: false, duration_months: '',
            lessons_learned_en: '', lessons_learned_ru: '',
            key_takeaways_en: '', key_takeaways_ru: '',
        });
        void load();
    }

    async function publish(id: string) {
        await supabase.from('case_stories').update({
            status: 'published',
            published_at: new Date().toISOString(),
        }).eq('id', id);

        await supabase.from('content_versions').insert({
            entity_type: 'case_stories',
            entity_id: id,
            version_number: Date.now(),
            content_json: { published: true },
            change_summary: 'Published case story',
        });

        void load();
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">{t('admin_stories')}</h1>
            <p className="text-sm text-muted-foreground">{t('admin_stories_desc')}</p>

            <Card>
                <CardHeader><CardTitle>{t('admin_add_new')}</CardTitle></CardHeader>
                <CardContent>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div><Label>Title EN *</Label><Input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} required /></div>
                            <div><Label>Title RU *</Label><Input value={form.title_ru} onChange={(e) => setForm({ ...form, title_ru: e.target.value })} required /></div>
                            <div><Label>Person alias EN</Label><Input value={form.person_alias_en} onChange={(e) => setForm({ ...form, person_alias_en: e.target.value })} placeholder="Maria K., Brazil" /></div>
                            <div><Label>Person alias RU</Label><Input value={form.person_alias_ru} onChange={(e) => setForm({ ...form, person_alias_ru: e.target.value })} /></div>
                            <div><Label>Origin country</Label><Input value={form.origin_country} onChange={(e) => setForm({ ...form, origin_country: e.target.value })} /></div>
                            <div><Label>Duration (months)</Label><Input type="number" value={form.duration_months} onChange={(e) => setForm({ ...form, duration_months: e.target.value })} /></div>
                            <div><Label>Visa types (comma-separated)</Label><Input value={form.visa_types} onChange={(e) => setForm({ ...form, visa_types: e.target.value })} placeholder="H-1B, F-1" /></div>
                            <div><Label>Tags (comma-separated)</Label><Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="RFE, overstay" /></div>
                            <div>
                                <Label>Outcome</Label>
                                <Select value={form.outcome} onValueChange={(v) => setForm({ ...form, outcome: v as StoryOutcome })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="approved">Approved</SelectItem>
                                        <SelectItem value="denied">Denied</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="mixed">Mixed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div><Label>Summary EN</Label><Textarea value={form.summary_en} onChange={(e) => setForm({ ...form, summary_en: e.target.value })} required /></div>
                        <div><Label>Summary RU</Label><Textarea value={form.summary_ru} onChange={(e) => setForm({ ...form, summary_ru: e.target.value })} required /></div>
                        <div><Label>Full story EN</Label><Textarea value={form.story_en} onChange={(e) => setForm({ ...form, story_en: e.target.value })} className="min-h-32" required /></div>
                        <div><Label>Full story RU</Label><Textarea value={form.story_ru} onChange={(e) => setForm({ ...form, story_ru: e.target.value })} className="min-h-32" required /></div>
                        <div><Label>Key takeaways EN (one per line)</Label><Textarea value={form.key_takeaways_en} onChange={(e) => setForm({ ...form, key_takeaways_en: e.target.value })} /></div>
                        <div><Label>Key takeaways RU (one per line)</Label><Textarea value={form.key_takeaways_ru} onChange={(e) => setForm({ ...form, key_takeaways_ru: e.target.value })} /></div>
                        <div className="flex flex-wrap gap-6">
                            <div className="flex items-center gap-2">
                                <Switch checked={form.is_complex} onCheckedChange={(v) => setForm({ ...form, is_complex: v })} />
                                <Label>{t('archive_complex_case')}</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch checked={form.lawyer_involved} onCheckedChange={(v) => setForm({ ...form, lawyer_involved: v })} />
                                <Label>{t('archive_lawyer_involved')}</Label>
                            </div>
                        </div>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">{t('admin_save_draft')}</Button>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-2">
                {stories.map((s) => (
                    <Card key={s.id}>
                        <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
                            <div>
                                <Link href={`/archive/${s.slug}`} className="font-medium hover:underline">
                                    {s.title_en}
                                </Link>
                                <div className="mt-1 flex gap-2">
                                    <Badge variant="outline">{s.status}</Badge>
                                    <Badge variant="outline">{s.outcome}</Badge>
                                </div>
                            </div>
                            {s.status === 'draft' && (
                                <Button size="sm" onClick={() => void publish(s.id)}>{t('admin_publish')}</Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
