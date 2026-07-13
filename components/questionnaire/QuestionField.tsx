'use client';

import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/Select';
import type { QuestionDefinition } from '@/lib/questionnaire-schema';
import {
    translateOptionLabel,
    translateQuestionHelp,
    translateQuestionLabel,
} from '@/lib/questionnaire-i18n';

interface QuestionFieldProps {
    question: QuestionDefinition;
    value: unknown;
    onChange: (value: unknown) => void;
    error?: string;
}

export default function QuestionField({ question, value, onChange, error }: QuestionFieldProps) {
    const { t } = useTranslation('common');
    const label = translateQuestionLabel(t, question.key);
    const help = translateQuestionHelp(t, question.key);
    const labelId = `${question.key}-label`;

    if (question.type === 'boolean') {
        return (
            <div className="space-y-2">
                <div className="flex items-start gap-3 rounded-lg border p-4">
                    <input
                        id={question.key}
                        type="checkbox"
                        checked={Boolean(value)}
                        onChange={(e) => onChange(e.target.checked)}
                        className="mt-1 size-4 rounded border-input"
                    />
                    <Label htmlFor={question.key} className="cursor-pointer leading-relaxed">{label}</Label>
                </div>
                {help && <p className="text-sm text-muted-foreground">{help}</p>}
                {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <Label id={labelId} htmlFor={question.key}>{label}{question.required && ' *'}</Label>
            {help && <p className="text-sm text-muted-foreground">{help}</p>}

            {question.type === 'select' && question.options && (
                <Select value={String(value ?? '')} onValueChange={onChange}>
                    <SelectTrigger id={question.key} aria-labelledby={labelId} className="w-full">
                        <SelectValue placeholder={t('questionnaire_select_placeholder')} />
                    </SelectTrigger>
                    <SelectContent position="popper" className="w-[var(--radix-select-trigger-width)]">
                        {question.options.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {translateOptionLabel(t, question.key, opt.value)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            {question.type === 'text' && (
                <Input
                    id={question.key}
                    value={String(value ?? '')}
                    onChange={(e) => onChange(e.target.value)}
                />
            )}

            {question.type === 'date' && (
                <Input
                    id={question.key}
                    type="date"
                    value={String(value ?? '')}
                    onChange={(e) => onChange(e.target.value)}
                />
            )}

            {question.type === 'number' && (
                <Input
                    id={question.key}
                    type="number"
                    value={value === undefined || value === null ? '' : String(value)}
                    onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                />
            )}

            {question.type === 'textarea' && (
                <Textarea
                    id={question.key}
                    value={String(value ?? '')}
                    onChange={(e) => onChange(e.target.value)}
                />
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
