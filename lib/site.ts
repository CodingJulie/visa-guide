const PRODUCTION_SITE_URL = 'https://visa-guide-liard.vercel.app';
const DEVELOPMENT_SITE_URL = 'http://localhost:3000';

function normalizePublicUrl(raw: string | undefined): string | null {
    const trimmed = raw?.trim().replace(/\/$/, '');
    if (!trimmed) return null;

    const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

    try {
        const parsed = new URL(candidate);
        if (
            process.env.NODE_ENV === 'production' &&
            (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1')
        ) {
            return null;
        }
        return parsed.origin;
    } catch {
        return null;
    }
}

/** Prefer Vercel's production domain so og:image URLs match the live deployment. */
function getVercelProductionUrl(): string | null {
    const raw = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
    if (!raw) return null;
    return normalizePublicUrl(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
}

export function getSiteUrl(): string {
    const fallback = process.env.NODE_ENV === 'production'
        ? PRODUCTION_SITE_URL
        : DEVELOPMENT_SITE_URL;

    return getVercelProductionUrl()
        ?? normalizePublicUrl(process.env.NEXT_PUBLIC_SITE_URL)
        ?? fallback;
}

export const ogImage = {
    url: '/og-preview.jpg',
    width: 1200,
    height: 627,
    alt: 'VisaGuide — US visa step-by-step guide',
    type: 'image/jpeg',
} as const;
