import type { QuestionnaireAnswers } from '@/lib/questionnaire-schema';
import { getPreparationTargetVisa, isWorkVisaNoOfferGoal } from '@/lib/questionnaire-schema';
import { STATE_DEPT_VISA_CATEGORIES_URL } from '@/lib/visa-official-reference';

export interface VisaDocument {
    name: string;
    description: string;
    mandatory: boolean;
}

export interface VisaRecommendation {
    title: string;
    description: string;
}

const DOCUMENTS: Record<string, { en: Omit<VisaDocument, 'name' | 'description'> & { name: string; description: string }; ru: Omit<VisaDocument, 'name' | 'description'> & { name: string; description: string } }[]> = {
    'B-1/B-2': [
        { en: { name: 'Valid passport', description: 'Passport valid 6+ months beyond intended stay', mandatory: true }, ru: { name: 'Действующий паспорт', description: 'Паспорт действителен минимум 6 месяцев после поездки', mandatory: true } },
        { en: { name: 'DS-160 confirmation', description: 'Printed confirmation page with barcode', mandatory: true }, ru: { name: 'Подтверждение DS-160', description: 'Распечатанная страница подтверждения со штрих-кодом', mandatory: true } },
        { en: { name: 'Photo 2×2 inches', description: 'Recent photo meeting US visa requirements', mandatory: true }, ru: { name: 'Фото 2×2 дюйма', description: 'Недавнее фото по требованиям визы США', mandatory: true } },
        { en: { name: 'Financial proof', description: 'Bank statements, employment letter, tax returns', mandatory: true }, ru: { name: 'Финансовые документы', description: 'Выписки из банка, справка с работы, налоговые декларации', mandatory: true } },
        { en: { name: 'Travel itinerary', description: 'Flight/hotel bookings or invitation letter', mandatory: false }, ru: { name: 'Маршрут поездки', description: 'Брони билетов/отелей или приглашение', mandatory: false } },
    ],
    'F-1': [
        { en: { name: 'Form I-20', description: 'Signed I-20 from a SEVP-certified school', mandatory: true }, ru: { name: 'Form I-20', description: 'Подписанный I-20 от SEVP-школы', mandatory: true } },
        { en: { name: 'SEVIS fee receipt (I-901)', description: 'Payment confirmation for SEVIS fee', mandatory: true }, ru: { name: 'Квитанция SEVIS (I-901)', description: 'Подтверждение оплаты SEVIS', mandatory: true } },
        { en: { name: 'Financial support proof', description: 'Bank statements, sponsor affidavit (I-134)', mandatory: true }, ru: { name: 'Подтверждение финансирования', description: 'Выписки, affidavit спонсора (I-134)', mandatory: true } },
        { en: { name: 'Valid passport', description: 'Passport valid 6+ months beyond program end', mandatory: true }, ru: { name: 'Действующий паспорт', description: 'Паспорт действителен 6+ месяцев после окончания программы', mandatory: true } },
        { en: { name: 'DS-160 confirmation', description: 'Completed visa application confirmation', mandatory: true }, ru: { name: 'Подтверждение DS-160', description: 'Подтверждение заполненной визовой анкеты', mandatory: true } },
    ],
    'H-1B': [
        { en: { name: 'Valid passport', description: 'Passport valid for entire intended stay', mandatory: true }, ru: { name: 'Действующий паспорт', description: 'Паспорт, действительный на весь срок пребывания', mandatory: true } },
        { en: { name: 'Approved I-797 (Notice of Action)', description: 'USCIS approval notice for H-1B petition', mandatory: true }, ru: { name: 'Одобренный I-797', description: 'Notice of Action от USCIS по петиции H-1B', mandatory: true } },
        { en: { name: 'Employment offer letter', description: 'Detailed job offer with salary, duties, and start date', mandatory: true }, ru: { name: 'Оффер от работодателя', description: 'Детальный оффер с зарплатой, обязанностями и датой начала', mandatory: true } },
        { en: { name: 'Educational credentials', description: 'Degree, transcripts, and credential evaluation report', mandatory: true }, ru: { name: 'Документы об образовании', description: 'Диплом, транскрипты и отчёт credential evaluation', mandatory: true } },
        { en: { name: 'DS-160 confirmation', description: 'Completed visa application confirmation', mandatory: true }, ru: { name: 'Подтверждение DS-160', description: 'Подтверждение заполненной визовой анкеты', mandatory: true } },
        { en: { name: 'Resume / CV', description: 'Professional resume matching the specialty occupation', mandatory: true }, ru: { name: 'Резюме / CV', description: 'Профессиональное резюме, соответствующее specialty occupation', mandatory: true } },
    ],
    'L-1': [
        { en: { name: 'Valid passport', description: 'Passport valid for entire intended stay', mandatory: true }, ru: { name: 'Действующий паспорт', description: 'Паспорт, действительный на весь срок пребывания', mandatory: true } },
        { en: { name: 'Approved I-797', description: 'USCIS approval for L-1 petition', mandatory: true }, ru: { name: 'Одобренный I-797', description: 'Одобрение USCIS по петиции L-1', mandatory: true } },
        { en: { name: 'Employment documentation', description: 'Proof of employment with qualifying company for 1+ year', mandatory: true }, ru: { name: 'Документы о работе', description: 'Подтверждение работы в компании минимум 1 год', mandatory: true } },
        { en: { name: 'DS-160 confirmation', description: 'Completed visa application confirmation', mandatory: true }, ru: { name: 'Подтверждение DS-160', description: 'Подтверждение заполненной визовой анкеты', mandatory: true } },
    ],
    'O-1': [
        { en: { name: 'Valid passport', description: 'Passport valid for entire intended stay', mandatory: true }, ru: { name: 'Действующий паспорт', description: 'Паспорт, действительный на весь срок пребывания', mandatory: true } },
        { en: { name: 'Approved I-797', description: 'USCIS approval for O-1 petition', mandatory: true }, ru: { name: 'Одобренный I-797', description: 'Одобрение USCIS по петиции O-1', mandatory: true } },
        { en: { name: 'Evidence of extraordinary ability', description: 'Awards, publications, media coverage, expert letters', mandatory: true }, ru: { name: 'Доказательства выдающихся способностей', description: 'Награды, публикации, упоминания в СМИ, письма экспертов', mandatory: true } },
        { en: { name: 'DS-160 confirmation', description: 'Completed visa application confirmation', mandatory: true }, ru: { name: 'Подтверждение DS-160', description: 'Подтверждение заполненной визовой анкеты', mandatory: true } },
    ],
    'K-1': [
        { en: { name: 'Valid passport', description: 'Passport valid 6+ months beyond intended stay', mandatory: true }, ru: { name: 'Действующий паспорт', description: 'Паспорт действителен 6+ месяцев после поездки', mandatory: true } },
        { en: { name: 'Approved I-129F petition', description: 'USCIS approval for fiancé(e) petition', mandatory: true }, ru: { name: 'Одобренная петиция I-129F', description: 'Одобрение USCIS по петиции на fiancé(e)', mandatory: true } },
        { en: { name: 'Proof of relationship', description: 'Photos, correspondence, meeting evidence', mandatory: true }, ru: { name: 'Подтверждение отношений', description: 'Фото, переписка, доказательства встреч', mandatory: true } },
        { en: { name: 'DS-160 confirmation', description: 'Completed visa application confirmation', mandatory: true }, ru: { name: 'Подтверждение DS-160', description: 'Подтверждение заполненной визовой анкеты', mandatory: true } },
    ],
    'J-1': [
        { en: { name: 'Form DS-2019', description: 'Certificate of eligibility from program sponsor (SEVIS)', mandatory: true }, ru: { name: 'Form DS-2019', description: 'Сертификат от спонсора программы (SEVIS)', mandatory: true } },
        { en: { name: 'SEVIS fee receipt (I-901)', description: 'Payment confirmation for SEVIS fee', mandatory: true }, ru: { name: 'Квитанция SEVIS (I-901)', description: 'Подтверждение оплаты SEVIS', mandatory: true } },
        { en: { name: 'Valid passport', description: 'Passport valid for program duration', mandatory: true }, ru: { name: 'Действующий паспорт', description: 'Паспорт, действительный на срок программы', mandatory: true } },
        { en: { name: 'DS-160 confirmation', description: 'Completed visa application confirmation', mandatory: true }, ru: { name: 'Подтверждение DS-160', description: 'Подтверждение заполненной визовой анкеты', mandatory: true } },
    ],
    'M-1': [
        { en: { name: 'Form I-20 (M-1)', description: 'Signed I-20 from SEVP-certified vocational school', mandatory: true }, ru: { name: 'Form I-20 (M-1)', description: 'Подписанный I-20 от SEVP-школы профессионального обучения', mandatory: true } },
        { en: { name: 'SEVIS fee receipt (I-901)', description: 'Payment confirmation for SEVIS fee', mandatory: true }, ru: { name: 'Квитанция SEVIS (I-901)', description: 'Подтверждение оплаты SEVIS', mandatory: true } },
        { en: { name: 'Financial support proof', description: 'Bank statements showing ability to cover tuition and living costs', mandatory: true }, ru: { name: 'Подтверждение финансирования', description: 'Выписки, подтверждающие возможность оплатить обучение и проживание', mandatory: true } },
        { en: { name: 'DS-160 confirmation', description: 'Completed visa application confirmation', mandatory: true }, ru: { name: 'Подтверждение DS-160', description: 'Подтверждение заполненной визовой анкеты', mandatory: true } },
    ],
    'U': [
        { en: { name: 'Form I-918', description: 'Petition for U Nonimmigrant Status (USCIS approval required before visa)', mandatory: true }, ru: { name: 'Form I-918', description: 'Петиция U Nonimmigrant Status (одобрение USCIS до визы)', mandatory: true } },
        { en: { name: 'Law enforcement certification (I-918 Supplement B)', description: 'Certification that you were helpful in investigation/prosecution', mandatory: true }, ru: { name: 'Сертификация правоохранительных органов (I-918 Supplement B)', description: 'Подтверждение помощи в расследовании/судебном преследовании', mandatory: true } },
        { en: { name: 'Evidence of qualifying crime', description: 'Police reports, court records, medical records', mandatory: true }, ru: { name: 'Доказательства квалифицированного преступления', description: 'Полиция, судебные документы, медицинские записи', mandatory: true } },
    ],
    'E-2': [
        { en: { name: 'Valid passport', description: 'Passport from treaty country valid for intended stay', mandatory: true }, ru: { name: 'Действующий паспорт', description: 'Паспорт страны-договора, действительный на срок пребывания', mandatory: true } },
        { en: { name: 'Investment documentation', description: 'Proof of substantial investment in US business (at risk, not marginal enterprise)', mandatory: true }, ru: { name: 'Документы об инвестициях', description: 'Подтверждение существенных инвестиций в бизнес в США (at risk, не marginal enterprise)', mandatory: true } },
        { en: { name: 'Business plan', description: 'Detailed plan showing business is not marginal', mandatory: true }, ru: { name: 'Бизнес-план', description: 'Детальный план, показывающий, что бизнес не маргинальный', mandatory: true } },
        { en: { name: 'DS-160 confirmation', description: 'Completed visa application confirmation', mandatory: true }, ru: { name: 'Подтверждение DS-160', description: 'Подтверждение заполненной визовой анкеты', mandatory: true } },
    ],
    'E-1': [
        { en: { name: 'Valid passport', description: 'Passport from treaty country with substantial trade with the U.S.', mandatory: true }, ru: { name: 'Действующий паспорт', description: 'Паспорт страны-договора со substantial trade с США', mandatory: true } },
        { en: { name: 'Trade documentation', description: 'Invoices, contracts, and records showing principal trade between treaty country and U.S.', mandatory: true }, ru: { name: 'Торговые документы', description: 'Счета, контракты и записи о principal trade между страной и США', mandatory: true } },
        { en: { name: 'Corporate structure proof', description: 'Ownership documents showing treaty nationality of enterprise', mandatory: true }, ru: { name: 'Структура компании', description: 'Документы о владении с treaty nationality предприятия', mandatory: true } },
        { en: { name: 'DS-160 confirmation', description: 'Completed visa application confirmation', mandatory: true }, ru: { name: 'Подтверждение DS-160', description: 'Подтверждение заполненной визовой анкеты', mandatory: true } },
    ],
    'H-2A': [
        { en: { name: 'Valid passport', description: 'Passport valid for intended stay; agricultural workers often from designated countries', mandatory: true }, ru: { name: 'Действующий паспорт', description: 'Паспорт на срок пребывания; H-2A часто для граждан определённых стран', mandatory: true } },
        { en: { name: 'Approved I-797 (H-2A petition)', description: 'USCIS approval notice after employer filed Form I-129 with H-2A supplement', mandatory: true }, ru: { name: 'Одобренный I-797 (петиция H-2A)', description: 'Notice of Action после подачи работодателем I-129 с supplement H-2A', mandatory: true } },
        { en: { name: 'DOL temporary labor certification (ETA-9142)', description: 'Department of Labor certification that no qualified U.S. workers are available', mandatory: true }, ru: { name: 'DOL temporary labor certification (ETA-9142)', description: 'Сертификация DOL об отсутствии доступных работников США', mandatory: true } },
        { en: { name: 'Job offer / contract', description: 'Written offer detailing agricultural duties, wage (at or above Adverse Effect Wage Rate), and housing if provided', mandatory: true }, ru: { name: 'Оффер / контракт', description: 'Письменный оффер с обязанностями, зарплатой (AEWR или выше) и жильём, если предоставляется', mandatory: true } },
        { en: { name: 'DS-160 confirmation', description: 'Completed nonimmigrant visa application confirmation', mandatory: true }, ru: { name: 'Подтверждение DS-160', description: 'Подтверждение заполненной nonimmigrant visa анкеты', mandatory: true } },
        { en: { name: 'Proof of ties to home country', description: 'Documents showing intent to return after temporary work (family, property, prior employment)', mandatory: false }, ru: { name: 'Связи с родиной', description: 'Документы о намерении вернуться после временной работы (семья, имущество, работа)', mandatory: false } },
    ],
    'H-2B': [
        { en: { name: 'Valid passport', description: 'Passport valid for intended stay', mandatory: true }, ru: { name: 'Действующий паспорт', description: 'Паспорт на срок пребывания', mandatory: true } },
        { en: { name: 'Approved I-797 (H-2B petition)', description: 'USCIS approval after employer filed Form I-129 for temporary non-agricultural workers', mandatory: true }, ru: { name: 'Одобренный I-797 (петиция H-2B)', description: 'Одобрение USCIS после I-129 для временных non-agricultural работников', mandatory: true } },
        { en: { name: 'DOL temporary labor certification', description: 'DOL certification (Form ETA-9142B) for seasonal/temporary need', mandatory: true }, ru: { name: 'DOL temporary labor certification', description: 'Сертификация DOL (ETA-9142B) для сезонной/временной потребности', mandatory: true } },
        { en: { name: 'Employment contract', description: 'Offer letter with job duties, dates, and prevailing wage', mandatory: true }, ru: { name: 'Трудовой контракт', description: 'Оффер с обязанностями, датами и prevailing wage', mandatory: true } },
        { en: { name: 'DS-160 confirmation', description: 'Completed visa application confirmation', mandatory: true }, ru: { name: 'Подтверждение DS-160', description: 'Подтверждение заполненной визовой анкеты', mandatory: true } },
        { en: { name: 'Work experience proof', description: 'CV or letters showing skills required for the job (if applicable)', mandatory: false }, ru: { name: 'Подтверждение опыта', description: 'CV или письма о навыках для должности (если применимо)', mandatory: false } },
    ],
    'P': [
        { en: { name: 'Valid passport', description: 'Passport valid for entire performance period', mandatory: true }, ru: { name: 'Действующий паспорт', description: 'Паспорт на весь период выступлений/работы', mandatory: true } },
        { en: { name: 'Approved I-797 (P petition)', description: 'USCIS approval for P-1/P-2/P-3 classification (Form I-129)', mandatory: true }, ru: { name: 'Одобренный I-797 (петиция P)', description: 'Одобрение USCIS по классификации P-1/P-2/P-3 (I-129)', mandatory: true } },
        { en: { name: 'Itinerary and event details', description: 'Schedule of performances, competitions, or events in the U.S.', mandatory: true }, ru: { name: 'Маршрут и события', description: 'Расписание выступлений, соревнований или мероприятий в США', mandatory: true } },
        { en: { name: 'Evidence of international recognition', description: 'Awards, media coverage, contracts, or rankings (especially for P-1 athletes/artists)', mandatory: true }, ru: { name: 'Международное признание', description: 'Награды, СМИ, контракты или рейтинги (особенно для P-1)', mandatory: true } },
        { en: { name: 'Consultation letter', description: 'Written advisory opinion from relevant U.S. peer group or labor organization when required', mandatory: true }, ru: { name: 'Consultation letter', description: 'Письменное advisory opinion от peer group или профсоюза, если требуется', mandatory: true } },
        { en: { name: 'DS-160 confirmation', description: 'Completed visa application confirmation', mandatory: true }, ru: { name: 'Подтверждение DS-160', description: 'Подтверждение заполненной визовой анкеты', mandatory: true } },
    ],
    'R': [
        { en: { name: 'Valid passport', description: 'Passport valid for intended religious work period', mandatory: true }, ru: { name: 'Действующий паспорт', description: 'Паспорт на срок религиозной работы', mandatory: true } },
        { en: { name: 'Approved I-797 (R-1 petition)', description: 'USCIS approval for religious worker petition (Form I-129, R supplement)', mandatory: true }, ru: { name: 'Одобренный I-797 (петиция R-1)', description: 'Одобрение USCIS по петиции религиозного работника (I-129, R supplement)', mandatory: true } },
        { en: { name: 'Proof of religious denomination membership', description: 'At least 2 years membership in same religious denomination as U.S. petitioning organization', mandatory: true }, ru: { name: 'Членство в религиозной организации', description: 'Минимум 2 года в той же denomination, что и организация в США', mandatory: true } },
        { en: { name: 'Letter from petitioning organization', description: 'Description of role, compensation, and that work is religious in nature', mandatory: true }, ru: { name: 'Письмо от организации-спонсора', description: 'Описание роли, компенсации и релigious характера работы', mandatory: true } },
        { en: { name: 'DS-160 confirmation', description: 'Completed visa application confirmation', mandatory: true }, ru: { name: 'Подтверждение DS-160', description: 'Подтверждение заполненной визовой анкеты', mandatory: true } },
    ],
    'Q': [
        { en: { name: 'Valid passport', description: 'Passport valid for cultural exchange program duration', mandatory: true }, ru: { name: 'Действующий паспорт', description: 'Паспорт на срок программы культурного обмена', mandatory: true } },
        { en: { name: 'Approved I-797 (Q petition)', description: 'USCIS approval for international cultural exchange program (Form I-129)', mandatory: true }, ru: { name: 'Одобренный I-797 (петиция Q)', description: 'Одобрение USCIS по программе международного культурного обмена (I-129)', mandatory: true } },
        { en: { name: 'Program description', description: 'Details showing participant will share culture abroad and work is incidental to cultural exchange', mandatory: true }, ru: { name: 'Описание программы', description: 'Детали о sharing культуры за рубежом; работа вторична по отношению к обмену', mandatory: true } },
        { en: { name: 'Employer / sponsor documentation', description: 'Evidence the employer operates a qualified cultural exchange program', mandatory: true }, ru: { name: 'Документы спонсора', description: 'Подтверждение qualified программы культурного обмена', mandatory: true } },
        { en: { name: 'DS-160 confirmation', description: 'Completed visa application confirmation', mandatory: true }, ru: { name: 'Подтверждение DS-160', description: 'Подтверждение заполненной визовой анкеты', mandatory: true } },
    ],
    'TN': [
        { en: { name: 'Valid passport', description: 'Canadian or Mexican passport', mandatory: true }, ru: { name: 'Действующий паспорт', description: 'Паспорт Канады или Мексики', mandatory: true } },
        { en: { name: 'Job offer letter', description: 'Letter detailing USMCA profession, duties, and duration', mandatory: true }, ru: { name: 'Оффер от работодателя', description: 'Письмо с профессией USMCA, обязанностями и сроком', mandatory: true } },
        { en: { name: 'Qualifications proof', description: 'Degrees, licenses, or credentials for the profession', mandatory: true }, ru: { name: 'Подтверждение квалификации', description: 'Дипломы, лицензии или сертификаты по профессии', mandatory: true } },
    ],
    'DV': [
        { en: { name: 'Diversity Visa selection notification', description: 'Confirmation from DV lottery entry system', mandatory: true }, ru: { name: 'Уведомление о выборе в DV', description: 'Подтверждение из системы лотереи DV', mandatory: true } },
        { en: { name: 'Valid passport', description: 'Passport valid 6+ months beyond intended immigration', mandatory: true }, ru: { name: 'Действующий паспорт', description: 'Паспорт действителен 6+ месяцев после иммиграции', mandatory: true } },
        { en: { name: 'Form DS-260', description: 'Immigrant visa electronic application', mandatory: true }, ru: { name: 'Form DS-260', description: 'Электронная иммиграционная визовая анкета', mandatory: true } },
        { en: { name: 'Education/work documents', description: 'High school diploma or 2 years qualifying work experience', mandatory: true }, ru: { name: 'Документы об образовании/работе', description: 'Аттестат или 2 года квалифицированного опыта', mandatory: true } },
    ],
    'EB-2': [
        { en: { name: 'Approved I-140 petition', description: 'USCIS employment-based immigrant petition approval', mandatory: true }, ru: { name: 'Одобренная петиция I-140', description: 'Одобрение трудовой иммиграционной петиции USCIS', mandatory: true } },
        { en: { name: 'PERM labor certification', description: 'DOL certification (unless NIW waiver applies)', mandatory: true }, ru: { name: 'PERM labor certification', description: 'Сертификация DOL (если не применяется NIW waiver)', mandatory: true } },
        { en: { name: 'Educational credentials', description: 'Advanced degree or exceptional ability evidence', mandatory: true }, ru: { name: 'Документы об образовании', description: 'Степень магистра/PhD или доказательства exceptional ability', mandatory: true } },
    ],
    'ASYLUM': [
        { en: { name: 'Identity documents', description: 'Passport, birth certificate, or national ID', mandatory: true }, ru: { name: 'Документы личности', description: 'Паспорт, свидетельство о рождении или ID', mandatory: true } },
        { en: { name: 'Evidence of persecution', description: 'Police reports, medical records, witness statements', mandatory: true }, ru: { name: 'Доказательства преследования', description: 'Полиция, медицинские документы, показания свидетелей', mandatory: true } },
        { en: { name: 'Form I-589', description: 'Application for Asylum and Withholding of Removal (file within 1 year of U.S. entry unless exception applies)', mandatory: true }, ru: { name: 'Form I-589', description: 'Заявление на убежище (подаётся в течение 1 года после въезда, если нет исключения)', mandatory: true } },
    ],
    'T': [
        { en: { name: 'Form I-914', description: 'Application for T Nonimmigrant Status', mandatory: true }, ru: { name: 'Form I-914', description: 'Заявление на T Nonimmigrant Status', mandatory: true } },
        { en: { name: 'Trafficking evidence', description: 'Documentation of severe form of trafficking and physical presence in U.S. due to trafficking', mandatory: true }, ru: { name: 'Доказательства trafficking', description: 'Документы о severe form of trafficking и присутствии в США из-за trafficking', mandatory: true } },
        { en: { name: 'Law enforcement response', description: 'Evidence of compliance with reasonable requests from law enforcement, if applicable', mandatory: false }, ru: { name: 'Сотрудничество со следствием', description: 'Подтверждение сотрудничества с правоохранительными органами, если применимо', mandatory: false } },
    ],
    'IR1/CR1': [
        { en: { name: 'Approved I-130 petition', description: 'USCIS approval notice for immediate relative spouse petition', mandatory: true }, ru: { name: 'Одобренная I-130', description: 'Одобрение USCIS по петиции на супруга immediate relative', mandatory: true } },
        { en: { name: 'Civil marriage certificate', description: 'Legal proof of marriage to U.S. citizen', mandatory: true }, ru: { name: 'Свидетельство о браке', description: 'Юридическое подтверждение брака с гражданином США', mandatory: true } },
        { en: { name: 'Form DS-260', description: 'Immigrant visa electronic application', mandatory: true }, ru: { name: 'Form DS-260', description: 'Электронная иммиграционная визовая анкета', mandatory: true } },
        { en: { name: 'Affidavit of Support (I-864)', description: 'U.S. citizen spouse must demonstrate adequate financial support', mandatory: true }, ru: { name: 'Affidavit of Support (I-864)', description: 'Супруг-гражданин США подтверждает финансовую поддержку', mandatory: true } },
    ],
    'EB-3': [
        { en: { name: 'Approved I-140 petition', description: 'USCIS employment-based immigrant petition approval', mandatory: true }, ru: { name: 'Одобренная I-140', description: 'Одобрение трудовой иммиграционной петиции USCIS', mandatory: true } },
        { en: { name: 'PERM labor certification', description: 'DOL certification showing no qualified U.S. workers available', mandatory: true }, ru: { name: 'PERM labor certification', description: 'Сертификация DOL об отсутствии квалифицированных работников США', mandatory: true } },
        { en: { name: 'Job offer and credentials', description: 'Permanent full-time job offer and qualifying education/experience', mandatory: true }, ru: { name: 'Оффер и квалификация', description: 'Постоянный оффер full-time и подтверждение образования/опыта', mandatory: true } },
    ],
    'EB-5': [
        { en: { name: 'Approved I-526 or I-526E petition', description: 'USCIS immigrant investor petition approval', mandatory: true }, ru: { name: 'Одобренная I-526/I-526E', description: 'Одобрение иммиграционной инвесторской петиции USCIS', mandatory: true } },
        { en: { name: 'Source of funds documentation', description: 'Lawful source and path of investment capital', mandatory: true }, ru: { name: 'Источник средств', description: 'Законный источник и путь инвестиционного капитала', mandatory: true } },
        { en: { name: 'Regional center or direct investment proof', description: 'Evidence of required capital investment in new commercial enterprise', mandatory: true }, ru: { name: 'Подтверждение инвестиции', description: 'Доказательство требуемого капитала в new commercial enterprise', mandatory: true } },
    ],
};

export function getVisaDocuments(visaType: string, lang: string): VisaDocument[] {
    const normalized = visaType === 'U-VISA' ? 'U' : visaType;
    const docs = DOCUMENTS[normalized];
    if (!docs) return [];

    const isRu = lang.startsWith('ru');
    return docs.map((d) => {
        const entry = isRu ? d.ru : d.en;
        return { name: entry.name, description: entry.description, mandatory: entry.mandatory };
    });
}

export interface ChecklistDocumentRequirement {
    id: string;
    doc_name_en: string;
    doc_name_ru: string;
    description_en: string | null;
    description_ru: string | null;
    is_mandatory: boolean;
}

export function getChecklistDocumentRequirements(visaType: string): ChecklistDocumentRequirement[] {
    const normalized = visaType === 'U-VISA' ? 'U' : visaType;
    const docs = DOCUMENTS[normalized];
    if (!docs) return [];

    return docs.map((d, index) => ({
        id: `fallback-${normalized}-${index}`,
        doc_name_en: d.en.name,
        doc_name_ru: d.ru.name,
        description_en: d.en.description,
        description_ru: d.ru.description,
        is_mandatory: d.en.mandatory,
    }));
}

export function isFallbackDocumentId(docId: string): boolean {
    return docId.startsWith('fallback-');
}

export function getVisaRecommendations(
    visaType: string,
    answers: QuestionnaireAnswers,
    lang: string
): VisaRecommendation[] {
    const isRu = lang.startsWith('ru');
    const recs: VisaRecommendation[] = [];

    const preparationVisa = getPreparationTargetVisa(answers.visa_goal);
    if (isWorkVisaNoOfferGoal(answers.visa_goal) || (answers.travel_purpose === 'work' && !answers.has_us_job_offer)) {
        const visaLabel = preparationVisa ?? visaType;
        recs.push(
            isRu
                ? { title: 'Найдите работодателя-спонсора', description: `${visaLabel} требует, чтобы работодатель в США подал петицию или предложил работу. Начните поиск через LinkedIn, специализированные job boards и networking.` }
                : { title: 'Find a sponsoring employer', description: `${visaLabel} requires a US employer to file a petition or offer employment. Start searching via LinkedIn, specialized job boards, and networking.` },
        );

        if (preparationVisa === 'H-1B' || preparationVisa === 'E-3') {
            recs.push(
                isRu
                    ? { title: 'Подготовьте credential evaluation диплома', description: 'Если у вас иностранный диплом, закажите оценку у аккредитованной организации (WES, ECE, NACES member). Это обязательно для specialty occupation.' }
                    : { title: 'Prepare credential evaluation of your degree', description: 'If you have a foreign degree, order an evaluation from an accredited agency (WES, ECE, NACES member). Required for specialty occupation.' },
            );
        }

        if (preparationVisa === 'H-1B') {
            recs.push(
                isRu
                    ? { title: 'Порядок H-1B по travel.state.gov', description: 'До подачи на визу: работодатель получает сертификацию DOL (LCA), затем одобрение петиции USCIS (I-129). Только после I-797 можно записываться на консульское интервью.' }
                    : { title: 'H-1B process per travel.state.gov', description: 'Before applying for a visa: employer obtains DOL certification (LCA), then USCIS petition approval (I-129). Consular interview comes only after I-797 approval.' },
                isRu
                    ? { title: 'Следите за H-1B cap registration', description: 'Регистрация на H-1B cap проходит ежегодно (обычно март). Работодатель должен зарегистрировать вас в системе USCIS.' }
                    : { title: 'Track H-1B cap registration', description: 'H-1B cap registration happens annually (usually March). Your employer must register you in the USCIS system.' },
            );
        }

        if (preparationVisa === 'L-1') {
            recs.push(
                isRu
                    ? { title: 'Требования L-1', description: 'Для L-1 нужна работа минимум 1 год в иностранном офисе компании, которая имеет связь с US entity (parent, branch, affiliate). Обсудите перевод с текущим работодателем.' }
                    : { title: 'L-1 requirements', description: 'L-1 requires at least 1 year with a foreign office of a company linked to a US entity (parent, branch, affiliate). Discuss an intracompany transfer with your current employer.' },
            );
        }

        if (preparationVisa === 'O-1' || preparationVisa === 'P') {
            recs.push(
                isRu
                    ? { title: 'Соберите доказательства достижений', description: 'Подготовьте награды, публикации, упоминания в СМИ, экспертные письма и контракты — они понадобятся для петиции USCIS.' }
                    : { title: 'Gather evidence of achievements', description: 'Prepare awards, publications, media coverage, expert letters, and contracts — needed for the USCIS petition.' },
            );
        }
    }

    if (answers.has_university_degree && !answers.degree_evaluated && ['H-1B', 'L-1', 'O-1'].includes(visaType)) {
        recs.push(
            isRu
                ? { title: 'Credential evaluation (оценка диплома)', description: 'Ваш иностранный диплом нужно оценить через WES, ECE или другую организацию из списка NACES. Отчёт покажет эквивалент американской степени.' }
                : { title: 'Credential evaluation', description: 'Your foreign degree should be evaluated through WES, ECE, or another NACES member. The report shows the US degree equivalent.' }
        );
    }

    if (visaType === 'H-1B' && answers.has_us_job_offer) {
        recs.push(
            isRu
                ? { title: 'Проверьте specialty occupation', description: 'Убедитесь, что должность требует минимум бакалавра в специальности и ваша квалификация ей соответствует.' }
                : { title: 'Verify specialty occupation', description: 'Ensure the position requires at least a bachelor\'s degree in a specialty field and your qualifications match.' }
        );
    }

    if (visaType === 'F-1' && answers.study_program_type === 'academic' && !answers.has_i20) {
        recs.push(
            isRu
                ? { title: 'Получите Form I-20', description: 'Подайте заявку в SEVP-аккредитованную школу и получите подписанный I-20 — без него нельзя подать на F-1.' }
                : { title: 'Obtain Form I-20', description: 'Apply to a SEVP-certified school and receive a signed I-20 — required before applying for F-1.' }
        );
    }

    if (visaType === 'M-1' || answers.study_program_type === 'vocational') {
        recs.push(
            isRu
                ? { title: 'M-1: профессиональное обучение', description: 'M-1 для non-academic/vocational программ. Нужен I-20 от SEVP-школы; после окончания возможен ограниченный practical training.' }
                : { title: 'M-1: vocational study', description: 'M-1 is for non-academic/vocational programs. You need an I-20 from a SEVP school; limited practical training may be available after completion.' }
        );
    }

    if (visaType === 'J-1' || answers.study_program_type === 'exchange') {
        recs.push(
            isRu
                ? { title: 'J-1: DS-2019 и home residency', description: 'Получите DS-2019 от designated sponsor. Проверьте, не applies ли two-year home residency requirement (212(e)) для вашей категории.' }
                : { title: 'J-1: DS-2019 and home residency', description: 'Obtain DS-2019 from a designated sponsor. Check whether the two-year home residency requirement (212(e)) applies to your category.' }
        );
    }

    if (answers.investment_type === 'treaty_trader') {
        recs.push(
            isRu
                ? { title: 'E-1 treaty trader', description: 'Нужна substantial trade между страной гражданства и США; более 50% trade должно быть с США. Проверьте treaty status страны на travel.state.gov.' }
                : { title: 'E-1 treaty trader', description: 'Requires substantial trade between your country of citizenship and the U.S.; over 50% of trade must be with the U.S. Verify treaty status on travel.state.gov.' }
        );
    }

    if (answers.us_citizen_spouse) {
        recs.push(
            isRu
                ? { title: 'IR/CR spouse immigrant visa', description: 'После одобрения I-130 подайте на immigrant visa (IR1/CR1). Подготовьте I-864 Affidavit of Support и civil documents по checklist NVC.' }
                : { title: 'IR/CR spouse immigrant visa', description: 'After I-130 approval, apply for an immigrant visa (IR1/CR1). Prepare I-864 Affidavit of Support and civil documents per NVC checklist.' }
        );
    }

    if (answers.dv_lottery_selected === false && answers.visa_goal === 'dv_lottery') {
        recs.push(
            isRu
                ? { title: 'DV lottery registration', description: 'Регистрация бесплатна только на dvprogram.state.gov (октябрь–ноябрь). Без selection immigrant visa недоступна.' }
                : { title: 'DV lottery registration', description: 'Registration is free only at dvprogram.state.gov (typically October–November). Without selection, an immigrant visa is not available.' }
        );
    }

    if (answers.financial_sponsor === 'none' && ['B-1/B-2', 'F-1', 'M-1'].includes(visaType)) {
        recs.push(
            isRu
                ? { title: 'Финансовый спонсор', description: 'Для visitor и student visas консул ожидает доказательства финансирования (выписки, I-134, sponsor letter).' }
                : { title: 'Financial sponsor', description: 'For visitor and student visas, consular officers expect proof of funding (bank statements, I-134, sponsor letter).' }
        );
    }

    if (answers.prior_visa_denial) {
        recs.push(
            isRu
                ? { title: 'Подготовьтесь к вопросам об отказе', description: 'На собеседовании объясните, что изменилось с момента предыдущего отказа. Подготовьте дополнительные документы.' }
                : { title: 'Prepare for denial questions', description: 'At the interview, explain what changed since your previous denial. Prepare supporting documents.' }
        );
    }

    if (answers.prior_overstay) {
        recs.push(
            isRu
                ? { title: 'Проверьте последствия оверстея', description: 'Оверстей может повлечь bar на въезд (3 или 10 лет). Проконсультируйтесь с адвокатом о waiver, если применимо.' }
                : { title: 'Check overstay consequences', description: 'Overstay may trigger entry bars (3 or 10 years). Consult an attorney about a waiver if applicable.' }
        );
    }

    if (visaType === 'B-1/B-2') {
        recs.push(
            isRu
                ? { title: 'Докажите связи с родиной', description: 'Подготовьте документы о работе, семье, имуществе — это ключевой фактор при INA 214(b).' }
                : { title: 'Prove ties to home country', description: 'Prepare documents about employment, family, property — key factor under INA 214(b).' }
        );
    }

    recs.push(
        isRu
            ? { title: 'Официальный источник', description: `Актуальный справочник категорий виз: ${STATE_DEPT_VISA_CATEGORIES_URL}` }
            : { title: 'Official source', description: `Current visa category directory: ${STATE_DEPT_VISA_CATEGORIES_URL}` }
    );

    return recs;
}

export function getPreparationDocuments(answers: QuestionnaireAnswers, lang: string): VisaDocument[] {
    const isRu = lang.startsWith('ru');

    if (!isWorkVisaNoOfferGoal(answers.visa_goal)) return [];

    const targetVisa = getPreparationTargetVisa(answers.visa_goal);
    const needsDegreeEval = targetVisa === 'H-1B' || targetVisa === 'E-3' || targetVisa === 'L-1';

    const docs: VisaDocument[] = [
        isRu
            ? { name: 'Резюме / CV (американский формат)', description: '1–2 страницы, без фото, с ключевыми словами для ATS', mandatory: true }
            : { name: 'Resume / CV (US format)', description: '1–2 pages, no photo, ATS-friendly keywords', mandatory: true },
        isRu
            ? { name: 'Рекомендательные письма', description: '2–3 письма от бывших работодателей или профессоров', mandatory: false }
            : { name: 'Recommendation letters', description: '2–3 letters from former employers or professors', mandatory: false },
    ];

    if (needsDegreeEval) {
        docs.unshift(
            isRu
                ? { name: 'Диплом и транскрипты', description: 'Заверенные копии с переводом на английский', mandatory: true }
                : { name: 'Degree and transcripts', description: 'Certified copies with English translation', mandatory: true },
            isRu
                ? { name: 'Credential evaluation report', description: 'Отчёт WES/ECE/NACES — закажите заранее', mandatory: true }
                : { name: 'Credential evaluation report', description: 'WES/ECE/NACES report — order in advance', mandatory: true },
        );
    }

    if (targetVisa === 'O-1' || targetVisa === 'P') {
        docs.push(
            isRu
                ? { name: 'Портфолио / сертификаты', description: 'Подтверждение навыков, наград и достижений в вашей области', mandatory: true }
                : { name: 'Portfolio / certificates', description: 'Proof of skills, awards, and achievements in your field', mandatory: true },
        );
    } else {
        docs.push(
            isRu
                ? { name: 'Портфолио / сертификаты', description: 'Подтверждение навыков и достижений в вашей области', mandatory: false }
                : { name: 'Portfolio / certificates', description: 'Proof of skills and achievements in your field', mandatory: false },
        );
    }

    return docs;
}
