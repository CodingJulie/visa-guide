'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { localizedField } from '@/lib/utils';
import { canPublishContent } from '@/lib/profile';
import type { UserRole } from '@/lib/profile';

interface VisaType {
    id: string;
    code: string;
    name_en: string;
    name_ru: string;
    description_en: string | null;
    description_ru: string | null;
    lawyer_recommended: boolean;
    status: string;
}

export default function AdminVisaTypesPage() {
    const { t, i18n } = useTranslation('common');
    const [items, setItems] = useState<VisaType[]>([]);
    const [role, setRole] = useState<UserRole>('user');
    const [form, setForm] = useState({ code: '', name_en: '', name_ru: '', description_en: '', description_ru: '' });

    useEffect(() => {
        void load();
        void loadRole();
    }, []);

    async function loadRole() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
        if (data?.role) setRole(data.role as UserRole);
    }

    async function load() {
        const { data } = await supabase.from('visa_types').select('*').order('code');
        setItems((data ?? []) as VisaType[]);
    }

    async function handleCreate(e: React.SyntheticEvent) {
        e.preventDefault();
        await supabase.from('visa_types').insert({ ...form, status: 'draft' });
        setForm({ code: '', name_en: '', name_ru: '', description_en: '', description_ru: '' });
        void load();
    }

    async function publish(id: string, current: VisaType) {
        await supabase.from('visa_types').update({ status: 'published', updated_at: new Date().toISOString() }).eq('id', id);
        if (canPublishContent(role)) {
            await supabase.from('content_versions').insert({
                entity_type: 'visa_types',
                entity_id: id,
                version_number: Date.now(),
                content_json: current,
                change_summary: 'Published visa type',
            });
        }
        void load();
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">{t('admin_visa_types')}</h1>

            <Card>
                <CardHeader><CardTitle>{t('admin_add_new')}</CardTitle></CardHeader>
                <CardContent>
                    <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-2">
                        <div><Label>Code</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required /></div>
                        <div><Label>Name EN</Label><Input value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} required /></div>
                        <div><Label>Name RU</Label><Input value={form.name_ru} onChange={(e) => setForm({ ...form, name_ru: e.target.value })} required /></div>
                        <div><Label>Description EN</Label><Input value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} /></div>
                        <Button type="submit" className="md:col-span-2 bg-blue-600 hover:bg-blue-700">{t('admin_save_draft')}</Button>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-3">
                {items.map((item) => (
                    <Card key={item.id}>
                        <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">{item.code}</span>
                                    <Badge variant={item.status === 'published' ? 'default' : 'outline'}>{item.status}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{localizedField(item, 'name', i18n.language)}</p>
                            </div>
                            {item.status === 'draft' && canPublishContent(role) && (
                                <Button size="sm" onClick={() => void publish(item.id, item)}>{t('admin_publish')}</Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
