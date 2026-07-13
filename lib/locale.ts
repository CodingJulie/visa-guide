export type AppLanguage = 'en' | 'ru';

export const LOCALE_COOKIE = 'i18nextLng';

export function normalizeLanguageCode(code: string | null | undefined): AppLanguage | null {
    if (!code) return null;
    const normalized = code.split('-')[0]?.toLowerCase();
    if (normalized === 'en' || normalized === 'ru') return normalized;
    return null;
}

export function resolveLanguageFromAcceptLanguage(header: string | null | undefined): AppLanguage {
    if (!header) return 'en';

    const languages = header.split(',').map((part) => part.trim().split(';')[0] ?? '');
    for (const lang of languages) {
        const code = normalizeLanguageCode(lang);
        if (code) return code;
    }

    return 'en';
}

export function resolveLanguageFromNavigator(languages: readonly string[] | null | undefined): AppLanguage {
    if (!languages?.length) return 'en';

    for (const lang of languages) {
        const code = normalizeLanguageCode(lang);
        if (code) return code;
    }

    return 'en';
}

export function getCookieValue(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}

export function resolveClientLanguage(): AppLanguage {
    if (typeof window === 'undefined') return 'en';

    const savedLang = normalizeLanguageCode(localStorage.getItem('i18nextLng'));
    if (savedLang) return savedLang;

    const cookieLang = normalizeLanguageCode(getCookieValue(LOCALE_COOKIE));
    if (cookieLang) return cookieLang;

    const navigatorLanguages = navigator.languages?.length
        ? navigator.languages
        : navigator.language
          ? [navigator.language]
          : [];

    return resolveLanguageFromNavigator(navigatorLanguages);
}

export function persistLanguagePreference(lang: AppLanguage): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem('i18nextLng', lang);
    document.cookie = `${LOCALE_COOKIE}=${encodeURIComponent(lang)}; path=/; max-age=31536000; samesite=lax`;
}
