import { describe, expect, it } from 'vitest';
import { cn, formatDate, localizedField } from './utils';

describe('utils', () => {
    it('cn merges class names', () => {
        expect(cn('a', 'b')).toBe('a b');
        expect(cn('a', { b: true, c: false })).toBe('a b');
    });

    it('formatDate formats dates correctly', () => {
        const date = new Date('2025-06-28T12:00:00');
        expect(formatDate(date, 'ru')).toBe('28.06.2025');
        expect(formatDate(date, 'en')).toBe('06/28/2025');
    });

    it('localizedField selects field by language with fallback', () => {
        const record = { title_en: 'Guide', title_ru: 'Гайд' };
        expect(localizedField(record, 'title', 'ru')).toBe('Гайд');
        expect(localizedField(record, 'title', 'en')).toBe('Guide');
        expect(localizedField({ title_en: 'Only EN' }, 'title', 'ru')).toBe('Only EN');
    });
});
