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
import { localizedField } from '@/lib/utils';

export default function AdminStepsPage() {
    const { t, i18n } = useTranslation('common');
    const [visaTypes, setVisaTypes] = useState<Array<{ id: string; code: string }>>([]);
    const [visaTypeId, setVisaTypeId] = useState('');
    const [steps, setSteps] = useState<Array<{ id: string; step_number: number; title_en: string; title_ru: string; status: string }>>([]);
    const [form, setForm] = useState({ step_number: 1, title_en: '', title_ru: '', content_en: '', content_ru: '', required_forms: '' });

    useEffect(() => {
        void supabase.from('visa_types').select('id, code').then(({ data }) => setVisaTypes(data ?? []));
    }, []);

    useEffect(() => {
        if (!visaTypeId) return;
        void supabase.from('visa_steps').select('id, step_number, title_en, title_ru, status')
            .eq('visa_type_id', visaTypeId).order('step_number')
            .then(({ data }) => setSteps(data ?? []));
    }, [visaTypeId]);

    async function handleCreate(e: React.SyntheticEvent) {
        e.preventDefault();
        await supabase.from('visa_steps').insert({
            visa_type_id: visaTypeId,
            step_number: form.step_number,
            title_en: form.title_en,
            title_ru: form.title_ru,
            content_en: form.content_en,
            content_ru: form.content_ru,
            required_forms: form.required_forms.split(',').map((s) => s.trim()).filter(Boolean),
            status: 'draft',
        });
        setForm({ step_number: form.step_number + 1, title_en: '', title_ru: '', content_en: '', content_ru: '', required_forms: '' });
        const { data } = await supabase.from('visa_steps').select('id, step_number, title_en, title_ru, status').eq('visa_type_id', visaTypeId).order('step_number');
        setSteps(data ?? []);
    }

    async function publish(id: string) {
        await supabase.from('visa_steps').update({ status: 'published' }).eq('id', id);
        const { data } = await supabase.from('visa_steps').select('id, step_number, title_en, title_ru, status').eq('visa_type_id', visaTypeId).order('step_number');
        setSteps(data ?? []);
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">{t('admin_steps')}</h1>

            <Select value={visaTypeId} onValueChange={setVisaTypeId}>
                <SelectTrigger className="w-64"><SelectValue placeholder="Select visa type" /></SelectTrigger>
                <SelectContent>
                    {visaTypes.map((vt) => <SelectItem key={vt.id} value={vt.id}>{vt.code}</SelectItem>)}
                </SelectContent>
            </Select>

            {visaTypeId && (
                <>
                    <Card>
                        <CardHeader><CardTitle>{t('admin_add_new')}</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div><Label>Step #</Label><Input type="number" value={form.step_number} onChange={(e) => setForm({ ...form, step_number: Number(e.target.value) })} /></div>
                                    <div><Label>Forms (comma-separated)</Label><Input value={form.required_forms} onChange={(e) => setForm({ ...form, required_forms: e.target.value })} placeholder="DS-160, I-20" /></div>
                                    <div><Label>Title EN</Label><Input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} required /></div>
                                    <div><Label>Title RU</Label><Input value={form.title_ru} onChange={(e) => setForm({ ...form, title_ru: e.target.value })} required /></div>
                                </div>
                                <div><Label>Content EN</Label><Textarea value={form.content_en} onChange={(e) => setForm({ ...form, content_en: e.target.value })} required /></div>
                                <div><Label>Content RU</Label><Textarea value={form.content_ru} onChange={(e) => setForm({ ...form, content_ru: e.target.value })} required /></div>
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">{t('admin_save_draft')}</Button>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="space-y-2">
                        {steps.map((step) => (
                            <Card key={step.id}>
                                <CardContent className="flex items-center justify-between py-4">
                                    <div>
                                        <span className="font-medium">#{step.step_number} </span>
                                        {localizedField(step, 'title', i18n.language)}
                                        <Badge className="ml-2" variant="outline">{step.status}</Badge>
                                    </div>
                                    {step.status === 'draft' && (
                                        <Button size="sm" onClick={() => void publish(step.id)}>{t('admin_publish')}</Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
