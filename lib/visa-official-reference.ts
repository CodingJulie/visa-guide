/**
 * Official US visa categories per travel.state.gov
 * @see https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/all-visa-categories.html
 */

export const STATE_DEPT_VISA_CATEGORIES_URL =
    'https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/all-visa-categories.html';

export type VisaCategoryType = 'nonimmigrant' | 'immigrant' | 'humanitarian' | 'status';

export interface OfficialVisaCategory {
    code: string;
    purpose_en: string;
    purpose_ru: string;
    type: VisaCategoryType;
    /** DOL, USCIS, SEVIS, or null if not applicable before visa application */
    prerequisite?: 'DOL' | 'USCIS' | 'SEVIS' | 'DOL_USCIS' | null;
}

export const OFFICIAL_NONIMMIGRANT_VISAS: OfficialVisaCategory[] = [
    { code: 'B-1', purpose_en: 'Business visitor', purpose_ru: 'Деловой визит', type: 'nonimmigrant', prerequisite: null },
    { code: 'B-2', purpose_en: 'Tourism, vacation, pleasure visitor; medical treatment', purpose_ru: 'Туризм, отдых; лечение', type: 'nonimmigrant', prerequisite: null },
    { code: 'C', purpose_en: 'Transit through the United States', purpose_ru: 'Транзит через США', type: 'nonimmigrant', prerequisite: null },
    { code: 'D', purpose_en: 'Crewmember', purpose_ru: 'Член экипажа', type: 'nonimmigrant', prerequisite: null },
    { code: 'A', purpose_en: 'Diplomat or foreign government official', purpose_ru: 'Дипломат или официальное лицо', type: 'nonimmigrant', prerequisite: null },
    { code: 'G', purpose_en: 'Employee of international organization or NATO', purpose_ru: 'Сотрудник международной организации / NATO', type: 'nonimmigrant', prerequisite: null },
    { code: 'I', purpose_en: 'Media, journalist', purpose_ru: 'Журналист / СМИ', type: 'nonimmigrant', prerequisite: null },
    { code: 'E-1', purpose_en: 'Treaty trader', purpose_ru: 'Treaty trader (торговля по договору)', type: 'nonimmigrant', prerequisite: null },
    { code: 'H-1B1', purpose_en: 'FTA professional worker (Chile, Singapore)', purpose_ru: 'Профессионал по FTA (Чили, Сингапур)', type: 'nonimmigrant', prerequisite: 'DOL' },
    { code: 'BCC', purpose_en: 'Border Crossing Card (Mexico)', purpose_ru: 'Border Crossing Card (Мексика)', type: 'nonimmigrant', prerequisite: null },
    { code: 'CW-1', purpose_en: 'CNMI-only transitional worker', purpose_ru: 'Переходный работник CNMI', type: 'nonimmigrant', prerequisite: 'USCIS' },
    { code: 'V', purpose_en: 'Spouse and children of lawful permanent resident', purpose_ru: 'Супруг(а) и дети LPR', type: 'nonimmigrant', prerequisite: null },
    { code: 'F-1', purpose_en: 'Student: academic', purpose_ru: 'Студент: академическое обучение', type: 'nonimmigrant', prerequisite: 'SEVIS' },
    { code: 'M-1', purpose_en: 'Student: vocational', purpose_ru: 'Студент: профессиональное обучение', type: 'nonimmigrant', prerequisite: 'SEVIS' },
    { code: 'J-1', purpose_en: 'Exchange visitor (au pair, physician, professor, etc.)', purpose_ru: 'Участник программы обмена', type: 'nonimmigrant', prerequisite: 'SEVIS' },
    { code: 'H-1B', purpose_en: 'Specialty occupations requiring highly specialized knowledge', purpose_ru: 'Специальные профессии (specialty occupation)', type: 'nonimmigrant', prerequisite: 'DOL_USCIS' },
    { code: 'H-2A', purpose_en: 'Temporary agricultural worker', purpose_ru: 'Сезонный сельскохозяйственный работник', type: 'nonimmigrant', prerequisite: 'DOL_USCIS' },
    { code: 'H-2B', purpose_en: 'Temporary worker — seasonal/temporary services or labor', purpose_ru: 'Временный работник — сезонные работы', type: 'nonimmigrant', prerequisite: 'DOL_USCIS' },
    { code: 'H-3', purpose_en: 'Training not primarily for employment', purpose_ru: 'Стажировка (не для трудоустройства)', type: 'nonimmigrant', prerequisite: 'USCIS' },
    { code: 'L-1', purpose_en: 'Intra-company transferee', purpose_ru: 'Перевод внутри компании', type: 'nonimmigrant', prerequisite: 'USCIS' },
    { code: 'O-1', purpose_en: 'Extraordinary ability in sciences, arts, education, business, athletics', purpose_ru: 'Выдающиеся способности', type: 'nonimmigrant', prerequisite: 'USCIS' },
    { code: 'P', purpose_en: 'Performing athlete, artist, entertainer', purpose_ru: 'Спортсмен, артист, entertainer', type: 'nonimmigrant', prerequisite: 'USCIS' },
    { code: 'Q', purpose_en: 'International cultural exchange visitor', purpose_ru: 'Международный культурный обмен', type: 'nonimmigrant', prerequisite: 'USCIS' },
    { code: 'R', purpose_en: 'Religious worker', purpose_ru: 'Религиозный работник', type: 'nonimmigrant', prerequisite: 'USCIS' },
    { code: 'TN', purpose_en: 'NAFTA/USMCA professional worker (Mexico, Canada)', purpose_ru: 'Профессионал USMCA (Мексика, Канада)', type: 'nonimmigrant', prerequisite: null },
    { code: 'E-2', purpose_en: 'Treaty trader / treaty investor', purpose_ru: 'Treaty trader / инвестор по договору', type: 'nonimmigrant', prerequisite: null },
    { code: 'E-3', purpose_en: 'Australian professional specialty', purpose_ru: 'Австралийский профессионал', type: 'nonimmigrant', prerequisite: 'DOL' },
    { code: 'U', purpose_en: 'Victim of criminal activity', purpose_ru: 'Жертва преступления', type: 'nonimmigrant', prerequisite: 'USCIS' },
    { code: 'T', purpose_en: 'Victim of human trafficking', purpose_ru: 'Жертва торговли людьми', type: 'nonimmigrant', prerequisite: 'USCIS' },
    { code: 'K-1', purpose_en: 'Fiancé(e) of US citizen to marry and live in US', purpose_ru: 'Помолвленный с гражданином США', type: 'immigrant', prerequisite: 'USCIS' },
];

export const OFFICIAL_IMMIGRANT_VISAS: OfficialVisaCategory[] = [
    { code: 'IR1/CR1', purpose_en: 'Spouse of US citizen', purpose_ru: 'Супруг(а) гражданина США', type: 'immigrant', prerequisite: 'USCIS' },
    { code: 'K-3', purpose_en: 'Spouse of US citizen awaiting I-130 approval', purpose_ru: 'Супруг(а) гражданина США (ожидание I-130)', type: 'immigrant', prerequisite: 'USCIS' },
    { code: 'EB-1', purpose_en: 'Employment-based: priority workers', purpose_ru: 'Трудовая иммиграция: первая категория', type: 'immigrant', prerequisite: 'USCIS' },
    { code: 'EB-2', purpose_en: 'Employment-based: advanced degree / exceptional ability', purpose_ru: 'Трудовая иммиграция: вторая категория', type: 'immigrant', prerequisite: 'USCIS' },
    { code: 'EB-3', purpose_en: 'Employment-based: professionals and other workers', purpose_ru: 'Трудовая иммиграция: третья категория', type: 'immigrant', prerequisite: 'USCIS' },
    { code: 'EB-5', purpose_en: 'Employment-based: investor', purpose_ru: 'Трудовая иммиграция: инвестор', type: 'immigrant', prerequisite: 'USCIS' },
    { code: 'DV', purpose_en: 'Diversity Immigrant Visa (lottery)', purpose_ru: 'Лотерея DV (Diversity Visa)', type: 'immigrant', prerequisite: null },
    { code: 'SB', purpose_en: 'Returning resident', purpose_ru: 'Возвращение резидента', type: 'immigrant', prerequisite: null },
    { code: 'IR3/IH3', purpose_en: 'Intercountry adoption of orphan children', purpose_ru: 'Международное усыновление', type: 'immigrant', prerequisite: 'USCIS' },
    { code: 'F2A/F2B', purpose_en: 'Family members of lawful permanent residents', purpose_ru: 'Родственники LPR', type: 'immigrant', prerequisite: 'USCIS' },
    { code: 'EB-4', purpose_en: 'Employment-based: special immigrants', purpose_ru: 'Трудовая иммиграция: особые иммигранты', type: 'immigrant', prerequisite: 'USCIS' },
];

export const VISA_CODE_ALIASES: Record<string, string> = {
    'B-1/B-2': 'B-1/B-2',
    'U-VISA': 'U',
    'ASYLUM': 'Asylum (I-589)',
    'TPS': 'TPS (status, not a visa)',
};

export function getOfficialVisaInfo(code: string): OfficialVisaCategory | undefined {
    const normalized = VISA_CODE_ALIASES[code] ?? code;
    if (normalized.startsWith('B-1/B-2')) {
        return OFFICIAL_NONIMMIGRANT_VISAS.find((v) => v.code === 'B-1');
    }
    return [...OFFICIAL_NONIMMIGRANT_VISAS, ...OFFICIAL_IMMIGRANT_VISAS].find(
        (v) => v.code === normalized || normalized.startsWith(v.code)
    );
}

export function formatVisaDisplayName(code: string, lang: string): string {
    const isRu = lang.startsWith('ru');
    const aliases: Record<string, { en: string; ru: string }> = {
        'U': { en: 'U (Crime Victim)', ru: 'U (жертва преступления)' },
        'U-VISA': { en: 'U (Crime Victim)', ru: 'U (жертва преступления)' },
        'ASYLUM': { en: 'Asylum (not a visa stamp)', ru: 'Убежище (не визовый штамп)' },
        'TPS': { en: 'TPS (protected status)', ru: 'TPS (защищённый статус)' },
        'T': { en: 'T (Trafficking Victim)', ru: 'T (жертва торговли людьми)' },
        'IR1/CR1': { en: 'IR1/CR1 (Spouse of U.S. Citizen)', ru: 'IR1/CR1 (супруг гражданина США)' },
        'EB-5': { en: 'EB-5 (Immigrant Investor)', ru: 'EB-5 (иммиграционный инвестор)' },
        'E-1': { en: 'E-1 (Treaty Trader)', ru: 'E-1 (Treaty Trader)' },
        'B-1/B-2': { en: 'B-1/B-2 (Visitor)', ru: 'B-1/B-2 (Посетитель)' },
    };
    const alias = aliases[code];
    if (alias) return isRu ? alias.ru : alias.en;
    return code;
}

export function getPrerequisiteNote(code: string, lang: string): string | null {
    const info = getOfficialVisaInfo(code);
    if (!info?.prerequisite) return null;

    const notes: Record<string, { en: string; ru: string }> = {
        DOL: {
            en: 'Before applying for a visa: US employer must obtain DOL labor certification.',
            ru: 'До подачи на визу: работодатель должен получить сертификацию DOL.',
        },
        USCIS: {
            en: 'Before applying for a visa: USCIS must approve the petition or application.',
            ru: 'До подачи на визу: USCIS должен одобрить петицию или заявление.',
        },
        SEVIS: {
            en: 'Before applying for a visa: program must be approved in SEVIS (Form I-20 or DS-2019).',
            ru: 'До подачи на визу: программа должна быть одобрена в SEVIS (I-20 или DS-2019).',
        },
        DOL_USCIS: {
            en: 'Before applying for a visa: employer needs DOL certification (LCA), then USCIS petition approval (I-129).',
            ru: 'До подачи на визу: работодателю нужна сертификация DOL (LCA), затем одобрение петиции USCIS (I-129).',
        },
    };

    const note = notes[info.prerequisite];
    const isRu = lang === 'ru' || lang.startsWith('ru');
    return note ? (isRu ? note.ru : note.en) : null;
}
