'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { DEFAULT_ELIGIBILITY_RULES } from '@/lib/eligibility-engine';

export default function AdminRulesPage() {
    const { t } = useTranslation('common');
    const [visaTypes, setVisaTypes] = useState<Array<{ id: string; code: string }>>([]);
    const [visaTypeId, setVisaTypeId] = useState('');
    const [rulesJson, setRulesJson] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        void supabase.from('visa_types').select('id, code').then(({ data }) => setVisaTypes(data ?? []));
    }, []);

    useEffect(() => {
        if (!visaTypeId) return;
        void supabase.from('visa_eligibility_rules')
            .select('rules_json')
            .eq('visa_type_id', visaTypeId)
            .order('version', { ascending: false })
            .limit(1)
            .maybeSingle()
            .then(({ data }) => {
                if (data?.rules_json) {
                    setRulesJson(JSON.stringify(data.rules_json, null, 2));
                } else {
                    const vt = visaTypes.find((v) => v.id === visaTypeId);
                    const defaultRule = DEFAULT_ELIGIBILITY_RULES.find((r) => r.visaType === vt?.code);
                    setRulesJson(JSON.stringify(defaultRule ?? { conditions: [], weight: 80 }, null, 2));
                }
            });
    }, [visaTypeId, visaTypes]);

    async function handleSave(status: 'draft' | 'published') {
        setError(null);
        try {
            const parsed = JSON.parse(rulesJson);
            const { data: existing } = await supabase.from('visa_eligibility_rules')
                .select('version').eq('visa_type_id', visaTypeId).order('version', { ascending: false }).limit(1).maybeSingle();

            await supabase.from('visa_eligibility_rules').insert({
                visa_type_id: visaTypeId,
                rules_json: parsed,
                version: (existing?.version ?? 0) + 1,
                status,
            });

            if (status === 'published') {
                await supabase.from('content_versions').insert({
                    entity_type: 'visa_eligibility_rules',
                    entity_id: visaTypeId,
                    version_number: (existing?.version ?? 0) + 1,
                    content_json: parsed,
                    change_summary: 'Published eligibility rules',
                });
            }
        } catch {
            setError('Invalid JSON');
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">{t('admin_rules')}</h1>

            <Select value={visaTypeId} onValueChange={setVisaTypeId}>
                <SelectTrigger className="w-64"><SelectValue placeholder="Select visa type" /></SelectTrigger>
                <SelectContent>
                    {visaTypes.map((vt) => <SelectItem key={vt.id} value={vt.id}>{vt.code}</SelectItem>)}
                </SelectContent>
            </Select>

            {visaTypeId && (
                <Card>
                    <CardHeader><CardTitle>Rules JSON</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>Eligibility rules (JSON)</Label>
                            <Textarea
                                value={rulesJson}
                                onChange={(e) => setRulesJson(e.target.value)}
                                className="min-h-64 font-mono text-xs"
                            />
                        </div>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => void handleSave('draft')}>{t('admin_save_draft')}</Button>
                            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => void handleSave('published')}>{t('admin_publish')}</Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
