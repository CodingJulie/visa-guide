import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: Date, locale: string = 'en'): string {
    return date.toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}

export function localizedField(
    record: Record<string, unknown> | object,
    field: string,
    lang: string
): string {
    const r = record as Record<string, unknown>;
    const key = lang === 'ru' ? `${field}_ru` : `${field}_en`;
    const fallback = lang === 'ru' ? `${field}_en` : `${field}_ru`;
    return (r[key] as string) || (r[fallback] as string) || '';
}
