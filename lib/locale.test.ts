import { describe, it, expect } from 'vitest';
import {
    normalizeLanguageCode,
    resolveLanguageFromAcceptLanguage,
    resolveLanguageFromNavigator,
} from '@/lib/locale';

describe('normalizeLanguageCode', () => {
    it('normalizes locale tags', () => {
        expect(normalizeLanguageCode('ru-RU')).toBe('ru');
        expect(normalizeLanguageCode('en-US')).toBe('en');
    });

    it('returns null for unsupported languages', () => {
        expect(normalizeLanguageCode('de')).toBeNull();
        expect(normalizeLanguageCode(null)).toBeNull();
    });
});

describe('resolveLanguageFromAcceptLanguage', () => {
    it('prefers Russian when it appears first', () => {
        expect(resolveLanguageFromAcceptLanguage('ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7')).toBe('ru');
    });

    it('falls back to English when Russian is absent', () => {
        expect(resolveLanguageFromAcceptLanguage('de-DE,en-US;q=0.9,en;q=0.8')).toBe('en');
    });

    it('defaults to English for empty header', () => {
        expect(resolveLanguageFromAcceptLanguage(null)).toBe('en');
    });
});

describe('resolveLanguageFromNavigator', () => {
    it('uses the first supported language from the list', () => {
        expect(resolveLanguageFromNavigator(['de-DE', 'ru-RU', 'en-US'])).toBe('ru');
    });

    it('defaults to English when no supported language is found', () => {
        expect(resolveLanguageFromNavigator(['de-DE', 'fr-FR'])).toBe('en');
    });
});
