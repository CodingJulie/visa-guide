import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../public/locales/en/common.json';
import ru from '../public/locales/ru/common.json';
import enQuestionnaire from '../public/locales/en/questionnaire.json';
import ruQuestionnaire from '../public/locales/ru/questionnaire.json';

// Always start with English so SSR HTML matches the first client render.
// I18nProvider applies the saved/browser language in useLayoutEffect after hydration.
function getInitialLanguage() {
    return 'en';
}

i18n.use(initReactI18next).init({
    resources: {
        en: { common: { ...en, questionnaire: enQuestionnaire } },
        ru: { common: { ...ru, questionnaire: ruQuestionnaire } },
    },
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
});

/** @param {'en' | 'ru'} lang */
export function applyI18nLanguage(lang) {
    if (lang !== 'en' && lang !== 'ru') return;
    if (i18n.language === lang && i18n.resolvedLanguage === lang) return;

    i18n.language = lang;
    i18n.resolvedLanguage = lang;
    const fallback = [].concat(i18n.options.fallbackLng ?? 'en').flat().filter(Boolean);
    i18n.languages = [lang, ...fallback.filter((l) => l !== lang)];
}

export default i18n;
