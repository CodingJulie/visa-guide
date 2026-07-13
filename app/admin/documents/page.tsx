'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { localizedField } from '@/lib/utils';

export default function AdminDocumentsPage() {
    const { t, i18n } = useTranslation('common');
    const [visaTypes, setVisaTypes] = useState<Array<{ id: string; code: string }>>([]);
    const [visaTypeId, setVisaTypeId] = useState('');
    const [docs, setDocs] = useState<Array<{ id: string; doc_name_en: string; doc_name_ru: string; is_mandatory: boolean; status: string }>>([]);
    const [form, setForm] = useState({ doc_name_en: '', doc_name_ru: '', description_en: '', description_ru: '', is_mandatory: true });

    useEffect(() => {
        void supabase.from('visa_types').select('id, code').then(({ data }) => setVisaTypes(data ?? []));
    }, []);

    const loadDocs = useCallback(async () => {
        const { data } = await supabase.from('visa_document_requirements').select('*').eq('visa_type_id', visaTypeId).order('sort_order');
        setDocs(data ?? []);
    }, [visaTypeId]);

    useEffect(() => {
        if (!visaTypeId) return;
        void loadDocs();
    }, [visaTypeId, loadDocs]);

    async function handleCreate(e: React.SyntheticEvent) {
        e.preventDefault();
        await supabase.from('visa_document_requirements').insert({
            visa_type_id: visaTypeId,
            ...form,
            sort_order: docs.length + 1,
            status: 'draft',
        });
        setForm({ doc_name_en: '', doc_name_ru: '', description_en: '', description_ru: '', is_mandatory: true });
        void loadDocs();
    }

    async function publish(id: string) {
        await supabase.from('visa_document_requirements').update({ status: 'published' }).eq('id', id);
        void loadDocs();
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">{t('admin_documents')}</h1>

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
                            <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-2">
                                <div><Label>Name EN</Label><Input value={form.doc_name_en} onChange={(e) => setForm({ ...form, doc_name_en: e.target.value })} required /></div>
                                <div><Label>Name RU</Label><Input value={form.doc_name_ru} onChange={(e) => setForm({ ...form, doc_name_ru: e.target.value })} required /></div>
                                <div><Label>Description EN</Label><Input value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} /></div>
                                <div><Label>Description RU</Label><Input value={form.description_ru} onChange={(e) => setForm({ ...form, description_ru: e.target.value })} /></div>
                                <Button type="submit" className="md:col-span-2 bg-blue-600 hover:bg-blue-700">{t('admin_save_draft')}</Button>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="space-y-2">
                        {docs.map((doc) => (
                            <Card key={doc.id}>
                                <CardContent className="flex items-center justify-between py-4">
                                    <div>
                                        {localizedField(doc, 'doc_name', i18n.language)}
                                        <Badge className="ml-2" variant="outline">{doc.status}</Badge>
                                    </div>
                                    {doc.status === 'draft' && (
                                        <Button size="sm" onClick={() => void publish(doc.id)}>{t('admin_publish')}</Button>
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
