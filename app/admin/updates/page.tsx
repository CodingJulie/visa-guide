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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { localizedField } from '@/lib/utils';

export default function AdminUpdatesPage() {
    const { t, i18n } = useTranslation('common');
    const [updates, setUpdates] = useState<Array<{ id: string; title_en: string; title_ru: string; severity: string; banner_active: boolean; status: string }>>([]);
    const [form, setForm] = useState({
        title_en: '', title_ru: '', summary_en: '', summary_ru: '',
        severity: 'info', affected_visa_types: '', source_url: '', banner_active: false,
    });

    useEffect(() => { void load(); }, []);

    async function load() {
        const { data } = await supabase.from('legal_updates').select('*').order('created_at', { ascending: false });
        setUpdates(data ?? []);
    }

    async function handleCreate(e: React.SyntheticEvent) {
        e.preventDefault();
        await supabase.from('legal_updates').insert({
            title_en: form.title_en,
            title_ru: form.title_ru,
            summary_en: form.summary_en,
            summary_ru: form.summary_ru,
            severity: form.severity,
            affected_visa_types: form.affected_visa_types.split(',').map((s) => s.trim()).filter(Boolean),
            source_url: form.source_url || null,
            banner_active: form.banner_active,
            status: 'draft',
        });
        setForm({ title_en: '', title_ru: '', summary_en: '', summary_ru: '', severity: 'info', affected_visa_types: '', source_url: '', banner_active: false });
        void load();
    }

    async function publish(id: string) {
        await supabase.from('legal_updates').update({
            status: 'published',
            published_at: new Date().toISOString(),
        }).eq('id', id);
        void load();
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">{t('admin_updates')}</h1>

            <Card>
                <CardHeader><CardTitle>{t('admin_add_new')}</CardTitle></CardHeader>
                <CardContent>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div><Label>Title EN</Label><Input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} required /></div>
                            <div><Label>Title RU</Label><Input value={form.title_ru} onChange={(e) => setForm({ ...form, title_ru: e.target.value })} required /></div>
                        </div>
                        <div><Label>Summary EN</Label><Textarea value={form.summary_en} onChange={(e) => setForm({ ...form, summary_en: e.target.value })} required /></div>
                        <div><Label>Summary RU</Label><Textarea value={form.summary_ru} onChange={(e) => setForm({ ...form, summary_ru: e.target.value })} required /></div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <Label>Severity</Label>
                                <Select value={form.severity} onValueChange={(v) => setForm({ ...form, severity: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="info">{t('severity_info')}</SelectItem>
                                        <SelectItem value="warning">{t('severity_warning')}</SelectItem>
                                        <SelectItem value="critical">{t('severity_critical')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div><Label>Affected visas (comma-separated)</Label><Input value={form.affected_visa_types} onChange={(e) => setForm({ ...form, affected_visa_types: e.target.value })} placeholder="H-1B, F-1" /></div>
                        </div>
                        <div><Label>Source URL</Label><Input value={form.source_url} onChange={(e) => setForm({ ...form, source_url: e.target.value })} /></div>
                        <div className="flex items-center gap-2">
                            <Switch checked={form.banner_active} onCheckedChange={(v) => setForm({ ...form, banner_active: v })} />
                            <Label>{t('admin_banner_active')}</Label>
                        </div>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">{t('admin_save_draft')}</Button>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-2">
                {updates.map((u) => (
                    <Card key={u.id}>
                        <CardContent className="flex items-center justify-between py-4">
                            <div>
                                {localizedField(u, 'title', i18n.language)}
                                <Badge className="ml-2" variant="outline">{u.severity}</Badge>
                                <Badge className="ml-1" variant="outline">{u.status}</Badge>
                                {u.banner_active && <Badge className="ml-1">Banner</Badge>}
                            </div>
                            {u.status === 'draft' && (
                                <Button size="sm" onClick={() => void publish(u.id)}>{t('admin_publish')}</Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
