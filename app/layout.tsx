import type { Metadata, Viewport } from 'next';
import { Inter, Geist } from 'next/font/google';
import { cookies } from 'next/headers';
import './globals.css';
import Providers from './providers';
import ServiceWorkerRegister from '@/components/workers/ServiceWorkerRegister';
import I18nProvider from '@/components/providers/I18nProvider';
import AppShell from '@/components/ui/AppShell';
import { getSiteUrl, ogImage } from '@/lib/site';
import { cn } from '@/lib/utils';
import { LOCALE_COOKIE, normalizeLanguageCode } from '@/lib/locale';
import { languageInitScript, themeInitScript } from '@/lib/initial-preferences-scripts';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });
const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
    metadataBase: new URL(getSiteUrl()),
    title: {
        default: 'VisaGuide — US Visa Step-by-Step Guide',
        template: '%s | VisaGuide',
    },
    description:
        'Personalized US visa guidance: questionnaire, recommendations, step-by-step guides, and document checklists.',
    keywords: [
        'US visa',
        'immigration',
        'H-1B',
        'F-1',
        'B-2',
        'visa guide',
        'виза США',
        'иммиграция',
    ],
    authors: [{ name: 'VisaGuide Team' }],
    creator: 'VisaGuide',
    publisher: 'VisaGuide',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        title: 'VisaGuide — US Visa Step-by-Step Guide',
        description: 'Personalized US visa guidance from questionnaire to checklist',
        url: getSiteUrl(),
        siteName: 'VisaGuide',
        type: 'website',
        locale: 'en_US',
        alternateLocale: ['ru_RU'],
        images: [ogImage],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'VisaGuide — US Visa Step-by-Step Guide',
        description: 'Personalized US visa guidance from questionnaire to checklist',
        images: [ogImage.url],
    },
    category: 'productivity',
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover',
    themeColor: '#2563eb',
    colorScheme: 'light dark',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const initialLang = normalizeLanguageCode(cookieStore.get(LOCALE_COOKIE)?.value) ?? 'en';

    return (
        <html lang={initialLang} suppressHydrationWarning className={cn('font-sans', geist.variable)}>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
                <script dangerouslySetInnerHTML={{ __html: languageInitScript }} />
                <meta charSet="UTF-8" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="apple-mobile-web-app-title" content="VisaGuide" />
                <meta name="format-detection" content="telephone=no" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="msapplication-TileColor" content="#2563eb" />
                <meta name="msapplication-tap-highlight" content="no" />
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="preload" as="image" href="/noun-usa-2554196.png" fetchPriority="high" />
                <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
                <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
                <link rel="manifest" href="/manifest.json" />
            </head>
            <body className={inter.className}>
                <I18nProvider initialLang={initialLang}>
                    <Providers>
                        <AppShell>{children}</AppShell>
                        <ServiceWorkerRegister />
                    </Providers>
                </I18nProvider>
            </body>
        </html>
    );
}
