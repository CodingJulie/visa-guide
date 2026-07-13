import type { VisaStep } from '@/components/guide/StepCard';

type StepSeed = Omit<VisaStep, 'id' | 'conditions_json'>;

const FALLBACK_STEPS: Record<string, StepSeed[]> = {
    'B-1/B-2': [
        {
            step_number: 1,
            title_en: 'Determine eligibility',
            title_ru: 'Определите право на визу',
            content_en: 'Confirm your purpose is temporary tourism, business, or medical treatment. You must demonstrate strong ties to your home country.',
            content_ru: 'Подтвердите, что цель — временный туризм, бизнес или лечение. Необходимо доказать тесные связи с родной страной.',
            required_forms: ['DS-160'],
            estimated_days: 3,
        },
        {
            step_number: 2,
            title_en: 'Complete DS-160',
            title_ru: 'Заполните DS-160',
            content_en: 'Fill out Form DS-160 online at ceac.state.gov. Save your confirmation page with barcode.',
            content_ru: 'Заполните Form DS-160 на ceac.state.gov. Сохраните страницу подтверждения со штрих-кодом.',
            required_forms: ['DS-160'],
            estimated_days: 2,
        },
        {
            step_number: 3,
            title_en: 'Pay visa fee',
            title_ru: 'Оплатите консульский сбор',
            content_en: 'Pay the MRV fee ($185 as of 2024). Keep the receipt.',
            content_ru: 'Оплатите MRV-сбор ($185 по состоянию на 2024). Сохраните квитанцию.',
            required_forms: [],
            estimated_days: 1,
        },
        {
            step_number: 4,
            title_en: 'Schedule interview',
            title_ru: 'Запишитесь на интервью',
            content_en: 'Book an appointment at the US embassy/consulate in your country via ustraveldocs.com.',
            content_ru: 'Запишитесь в посольство/консульство США через ustraveldocs.com.',
            required_forms: [],
            estimated_days: 7,
        },
        {
            step_number: 5,
            title_en: 'Attend interview',
            title_ru: 'Пройдите интервью',
            content_en: 'Bring passport, DS-160 confirmation, fee receipt, photo, and supporting documents. Answer questions honestly.',
            content_ru: 'Возьмите паспорт, подтверждение DS-160, квитанцию об оплате, фото и документы. Отвечайте честно.',
            required_forms: [],
            estimated_days: 1,
        },
    ],
    'F-1': [
        {
            step_number: 1,
            title_en: 'Get accepted by SEVP school',
            title_ru: 'Поступите в SEVP-школу',
            content_en: 'Apply and receive acceptance from a SEVP-certified school.',
            content_ru: 'Подайте заявление и получите зачисление в SEVP-школу.',
            required_forms: ['I-20'],
            estimated_days: 60,
        },
        {
            step_number: 2,
            title_en: 'Receive Form I-20',
            title_ru: 'Получите Form I-20',
            content_en: 'School issues I-20. Review and sign the student attestation section.',
            content_ru: 'Школа выдаёт I-20. Проверьте и подпишите секцию attestation.',
            required_forms: ['I-20'],
            estimated_days: 14,
        },
        {
            step_number: 3,
            title_en: 'Pay SEVIS fee',
            title_ru: 'Оплатите SEVIS',
            content_en: 'Pay I-901 SEVIS fee at fmjfee.com before visa interview.',
            content_ru: 'Оплатите I-901 SEVIS на fmjfee.com до интервью.',
            required_forms: ['I-901'],
            estimated_days: 1,
        },
        {
            step_number: 4,
            title_en: 'Complete DS-160',
            title_ru: 'Заполните DS-160',
            content_en: 'Fill DS-160 selecting F-1 visa category.',
            content_ru: 'Заполните DS-160, выбрав категорию F-1.',
            required_forms: ['DS-160'],
            estimated_days: 2,
        },
        {
            step_number: 5,
            title_en: 'Visa interview',
            title_ru: 'Интервью на визу',
            content_en: 'Demonstrate non-immigrant intent and financial ability to study.',
            content_ru: 'Докажите немиграционное намерение и финансовую возможность учиться.',
            required_forms: [],
            estimated_days: 1,
        },
    ],
    'H-1B': [
        {
            step_number: 1,
            title_en: 'Employer files LCA',
            title_ru: 'Работодатель подаёт LCA',
            content_en: 'Employer obtains Labor Condition Application (LCA) from DOL.',
            content_ru: 'Работодатель получает LCA от DOL.',
            required_forms: ['ETA-9035'],
            estimated_days: 7,
        },
        {
            step_number: 2,
            title_en: 'Employer files I-129',
            title_ru: 'Работодатель подаёт I-129',
            content_en: 'Employer submits Form I-129 with H supplement to USCIS during cap season (March).',
            content_ru: 'Работодатель подаёт I-129 с H supplement в USCIS в сезон cap (март).',
            required_forms: ['I-129'],
            estimated_days: 90,
        },
        {
            step_number: 3,
            title_en: 'Cap lottery (if applicable)',
            title_ru: 'Лотерея cap (если применимо)',
            content_en: 'If cap-subject, USCIS conducts random selection. Monitor case status.',
            content_ru: 'Если cap-subject, USCIS проводит случайный отбор. Следите за статусом.',
            required_forms: [],
            estimated_days: 30,
        },
        {
            step_number: 4,
            title_en: 'Approval & I-797',
            title_ru: 'Одобрение и I-797',
            content_en: 'Upon approval, receive I-797 Notice of Action.',
            content_ru: 'После одобрения получите I-797 Notice of Action.',
            required_forms: ['I-797'],
            estimated_days: 14,
        },
        {
            step_number: 5,
            title_en: 'Consular processing or change of status',
            title_ru: 'Консульская обработка или смена статуса',
            content_en: 'Apply for visa stamp abroad or change status if in US.',
            content_ru: 'Подайте на визовый штамп за рубежом или смените статус, если в США.',
            required_forms: ['DS-160'],
            estimated_days: 30,
        },
    ],
};

function normalizeVisaCode(visaCode: string): string {
    return visaCode === 'U-VISA' ? 'U' : visaCode;
}

export function getFallbackGuideSteps(visaCode: string): VisaStep[] {
    const normalized = normalizeVisaCode(visaCode);
    const steps = FALLBACK_STEPS[normalized];
    if (!steps) return [];

    return steps.map((step) => ({
        ...step,
        id: `fallback-${normalized}-${step.step_number}`,
        conditions_json: [],
    }));
}

export function isFallbackStepId(stepId: string): boolean {
    return stepId.startsWith('fallback-');
}
