-- Seed data for MVP + Phase 2 visa templates

INSERT INTO visa_categories (code, name_en, name_ru, sort_order) VALUES
    ('nonimmigrant', 'Nonimmigrant Visas', 'Немиграционные визы', 1),
    ('immigrant', 'Immigrant Visas', 'Иммиграционные визы', 2),
    ('humanitarian', 'Humanitarian', 'Гуманитарные', 3);

-- MVP visas
INSERT INTO visa_types (code, name_en, name_ru, description_en, description_ru, lawyer_recommended, status, category_id)
SELECT 'B-1/B-2', 'B-1/B-2 Visitor Visa', 'B-1/B-2 Виза посетителя',
    'Temporary visa for business (B-1) or tourism/medical (B-2) visits.',
    'Временная виза для деловых (B-1) или туристических/медицинских (B-2) поездок.',
    false, 'published', id FROM visa_categories WHERE code = 'nonimmigrant';

INSERT INTO visa_types (code, name_en, name_ru, description_en, description_ru, lawyer_recommended, status, category_id)
SELECT 'F-1', 'F-1 Student Visa', 'F-1 Студенческая виза',
    'For academic studies at SEVP-certified US institutions.',
    'Для академического обучения в SEVP-сертифицированных учреждениях США.',
    false, 'published', id FROM visa_categories WHERE code = 'nonimmigrant';

INSERT INTO visa_types (code, name_en, name_ru, description_en, description_ru, lawyer_recommended, status, category_id)
SELECT 'H-1B', 'H-1B Specialty Occupation', 'H-1B Специальная профессия',
    'Temporary work visa for specialty occupations requiring a bachelor''s degree or equivalent.',
    'Временная рабочая виза для специальностей, требующих степени бакалавра или эквивалента.',
    true, 'published', id FROM visa_categories WHERE code = 'nonimmigrant';

-- Phase 2 templates
INSERT INTO visa_types (code, name_en, name_ru, description_en, description_ru, lawyer_recommended, status, category_id)
SELECT v.code, v.name_en, v.name_ru, v.desc_en, v.desc_ru, v.lawyer, 'draft', c.id
FROM (VALUES
    ('L-1', 'L-1 Intracompany Transfer', 'L-1 Перевод внутри компании', 'For managers/executives transferred within the same company.', 'Для менеджеров, переводимых внутри одной компании.', false),
    ('O-1', 'O-1 Extraordinary Ability', 'O-1 Выдающиеся способности', 'For individuals with extraordinary ability in sciences, arts, education, business, or athletics.', 'Для лиц с выдающимися способностями.', true),
    ('K-1', 'K-1 Fiancé(e) Visa', 'K-1 Виза помолвленного', 'For foreign-citizen fiancé(e) of a US citizen.', 'Для иностранного гражданина, помолвленного с гражданином США.', true),
    ('J-1', 'J-1 Exchange Visitor', 'J-1 Программа обмена', 'For approved exchange programs including study, research, training.', 'Для одобренных программ обмена.', false),
    ('M-1', 'M-1 Vocational Student', 'M-1 Профессиональное обучение', 'For vocational or non-academic studies.', 'Для профессионального или неакадемического обучения.', false),
    ('TN', 'TN NAFTA Professional', 'TN Профессионал NAFTA/USMCA', 'For Canadian and Mexican professionals under USMCA.', 'Для канадских и мексиканских профессионалов по USMCA.', false),
    ('E-2', 'E-2 Treaty Investor', 'E-2 Инвестор по договору', 'For investors from treaty countries.', 'Для инвесторов из стран с договором.', true),
    ('ASYLUM', 'Asylum', 'Убежище', 'Protection for those unable or unwilling to return due to persecution.', 'Защита для лиц, не могущих вернуться из-за преследования.', true),
    ('TPS', 'Temporary Protected Status', 'Временный защищённый статус', 'Temporary status for nationals of designated countries.', 'Временный статус для граждан определённых стран.', true),
    ('U-VISA', 'U Visa (Crime Victim)', 'U-виза (жертва преступления)', 'For victims of qualifying criminal activity.', 'Для жертв квалифицированной преступной деятельности.', true),
    ('EB-2', 'EB-2 Employment-Based', 'EB-2 Трудовая иммиграция', 'Second preference employment-based immigrant visa.', 'Иммиграционная виза второй категории.', true),
    ('DV', 'Diversity Visa Lottery', 'Лотерея DV', 'Annual lottery for countries with low immigration rates.', 'Ежегодная лотерея для стран с низкой иммиграцией.', false)
) AS v(code, name_en, name_ru, desc_en, desc_ru, lawyer)
CROSS JOIN visa_categories c WHERE c.code = CASE WHEN v.code IN ('EB-2','DV') THEN 'immigrant' WHEN v.code IN ('ASYLUM','TPS','U-VISA') THEN 'humanitarian' ELSE 'nonimmigrant' END;

-- B-1/B-2 steps
INSERT INTO visa_steps (visa_type_id, step_number, title_en, title_ru, content_en, content_ru, required_forms, estimated_days, status)
SELECT id, 1, 'Determine eligibility', 'Определите право на визу',
    'Confirm your purpose is temporary tourism, business, or medical treatment. You must demonstrate strong ties to your home country.',
    'Подтвердите, что цель — временный туризм, бизнес или лечение. Необходимо доказать тесные связи с родной страной.',
    ARRAY['DS-160'], 3, 'published' FROM visa_types WHERE code = 'B-1/B-2'
UNION ALL SELECT id, 2, 'Complete DS-160', 'Заполните DS-160',
    'Fill out Form DS-160 online at ceac.state.gov. Save your confirmation page with barcode.',
    'Заполните Form DS-160 на ceac.state.gov. Сохраните страницу подтверждения со штрих-кодом.',
    ARRAY['DS-160'], 2, 'published' FROM visa_types WHERE code = 'B-1/B-2'
UNION ALL SELECT id, 3, 'Pay visa fee', 'Оплатите консульский сбор',
    'Pay the MRV fee ($185 as of 2024). Keep the receipt.',
    'Оплатите MRV-сбор ($185 по состоянию на 2024). Сохраните квитанцию.',
    ARRAY[]::TEXT[], 1, 'published' FROM visa_types WHERE code = 'B-1/B-2'
UNION ALL SELECT id, 4, 'Schedule interview', 'Запишитесь на интервью',
    'Book an appointment at the US embassy/consulate in your country via ustraveldocs.com.',
    'Запишитесь в посольство/консульство США через ustraveldocs.com.',
    ARRAY[]::TEXT[], 7, 'published' FROM visa_types WHERE code = 'B-1/B-2'
UNION ALL SELECT id, 5, 'Attend interview', 'Пройдите интервью',
    'Bring passport, DS-160 confirmation, fee receipt, photo, and supporting documents. Answer questions honestly.',
    'Возьмите паспорт, подтверждение DS-160, квитанцию об оплате, фото и документы. Отвечайте честно.',
    ARRAY[]::TEXT[], 1, 'published' FROM visa_types WHERE code = 'B-1/B-2';

-- F-1 steps
INSERT INTO visa_steps (visa_type_id, step_number, title_en, title_ru, content_en, content_ru, required_forms, estimated_days, status)
SELECT id, s.num, s.t_en, s.t_ru, s.c_en, s.c_ru, s.forms, s.days, 'published'
FROM visa_types vt,
(VALUES
    (1, 'Get accepted by SEVP school', 'Поступите в SEVP-школу', 'Apply and receive acceptance from a SEVP-certified school.', 'Подайте заявление и получите зачисление в SEVP-школу.', ARRAY['I-20'], 60),
    (2, 'Receive Form I-20', 'Получите Form I-20', 'School issues I-20. Review and sign the student attestation section.', 'Школа выдаёт I-20. Проверьте и подпишите секцию attestation.', ARRAY['I-20'], 14),
    (3, 'Pay SEVIS fee', 'Оплатите SEVIS', 'Pay I-901 SEVIS fee at fmjfee.com before visa interview.', 'Оплатите I-901 SEVIS на fmjfee.com до интервью.', ARRAY['I-901'], 1),
    (4, 'Complete DS-160', 'Заполните DS-160', 'Fill DS-160 selecting F-1 visa category.', 'Заполните DS-160, выбрав категорию F-1.', ARRAY['DS-160'], 2),
    (5, 'Visa interview', 'Интервью на визу', 'Demonstrate non-immigrant intent and financial ability to study.', 'Докажите немиграционное намерение и финансовую возможность учиться.', ARRAY[]::TEXT[], 1)
) AS s(num, t_en, t_ru, c_en, c_ru, forms, days)
WHERE vt.code = 'F-1';

-- H-1B steps
INSERT INTO visa_steps (visa_type_id, step_number, title_en, title_ru, content_en, content_ru, required_forms, estimated_days, status)
SELECT id, s.num, s.t_en, s.t_ru, s.c_en, s.c_ru, s.forms, s.days, 'published'
FROM visa_types vt,
(VALUES
    (1, 'Employer files LCA', 'Работодатель подаёт LCA', 'Employer obtains Labor Condition Application (LCA) from DOL.', 'Работодатель получает LCA от DOL.', ARRAY['ETA-9035'], 7),
    (2, 'Employer files I-129', 'Работодатель подаёт I-129', 'Employer submits Form I-129 with H supplement to USCIS during cap season (March).', 'Работодатель подаёт I-129 с H supplement в USCIS в сезон cap (март).', ARRAY['I-129'], 90),
    (3, 'Cap lottery (if applicable)', 'Лотерея cap (если применимо)', 'If cap-subject, USCIS conducts random selection. Monitor case status.', 'Если cap-subject, USCIS проводит случайный отбор. Следите за статусом.', ARRAY[]::TEXT[], 30),
    (4, 'Approval & I-797', 'Одобрение и I-797', 'Upon approval, receive I-797 Notice of Action.', 'После одобрения получите I-797 Notice of Action.', ARRAY['I-797'], 14),
    (5, 'Consular processing or change of status', 'Консульская обработка или смена статуса', 'Apply for visa stamp abroad or change status if in US.', 'Подайте на визовый штамп за рубежом или смените статус, если в США.', ARRAY['DS-160'], 30)
) AS s(num, t_en, t_ru, c_en, c_ru, forms, days)
WHERE vt.code = 'H-1B';

-- Document requirements
INSERT INTO visa_document_requirements (visa_type_id, doc_name_en, doc_name_ru, description_en, description_ru, is_mandatory, sort_order, status)
SELECT vt.id, d.en, d.ru, d.de, d.dr, d.m, d.o, 'published'
FROM visa_types vt
CROSS JOIN (VALUES
    ('B-1/B-2', 'Valid passport', 'Действующий паспорт', 'Passport valid 6+ months beyond stay', 'Паспорт действителен 6+ месяцев после поездки', true, 1),
    ('B-1/B-2', 'DS-160 confirmation', 'Подтверждение DS-160', 'Printed confirmation page with barcode', 'Распечатанная страница подтверждения со штрих-кодом', true, 2),
    ('B-1/B-2', 'Photo 2x2 inches', 'Фото 2x2 дюйма', 'Recent photo meeting US visa requirements', 'Недавнее фото по требованиям визы США', true, 3),
    ('B-1/B-2', 'Financial proof', 'Финансовые документы', 'Bank statements, employment letter', 'Выписки, справка с работы', true, 4),
    ('B-1/B-2', 'Travel itinerary', 'Маршрут поездки', 'Flight/hotel bookings or invitation letter', 'Брони или приглашение', false, 5),
    ('F-1', 'Form I-20', 'Form I-20', 'Signed I-20 from SEVP school', 'Подписанный I-20 от SEVP-школы', true, 1),
    ('F-1', 'SEVIS fee receipt', 'Квитанция SEVIS', 'I-901 payment confirmation', 'Подтверждение оплаты I-901', true, 2),
    ('F-1', 'Financial support proof', 'Подтверждение финансирования', 'Bank statements, sponsor affidavit (I-134)', 'Выписки, affidavit спонсора (I-134)', true, 3),
    ('H-1B', 'Approved I-797', 'Одобренный I-797', 'Notice of Action from USCIS', 'Notice of Action от USCIS', true, 1),
    ('H-1B', 'Employment offer letter', 'Оффер от работодателя', 'Detailed job offer with salary and duties', 'Детальный оффер с зарплатой и обязанностями', true, 2),
    ('H-1B', 'Educational credentials', 'Образование', 'Degree transcripts and evaluations', 'Диплом, транскрипты, оценка диплома', true, 3)
) AS d(code, en, ru, de, dr, m, o)
WHERE vt.code = d.code;

-- Sample legal update banner
INSERT INTO legal_updates (title_en, title_ru, summary_en, summary_ru, severity, affected_visa_types, effective_date, banner_active, banner_expires_at, status, published_at)
VALUES (
    'H-1B Registration Period Updated',
    'Обновлён период регистрации H-1B',
    'USCIS announced updated H-1B cap registration dates for FY2026. Check uscis.gov for current window.',
    'USCIS объявил обновлённые даты регистрации H-1B cap на FY2026. Проверьте uscis.gov.',
    'warning',
    ARRAY['H-1B'],
    CURRENT_DATE,
    true,
    now() + interval '90 days',
    'published',
    now()
);

-- Legal article sample
INSERT INTO legal_articles (slug, title_en, title_ru, summary_en, summary_ru, content_en, content_ru, source_url, affected_visa_types, last_verified_at, status)
VALUES (
    'ina-214b',
    'INA Section 214(b) — Nonimmigrant Intent',
    'INA Section 214(b) — Немиграционное намерение',
    'Every nonimmigrant visa applicant must overcome presumption of immigrant intent.',
    'Каждый заявитель на немиграционную визу должен преодолеть презumption иммиграционного намерения.',
    'Section 214(b) of the Immigration and Nationality Act presumes every visa applicant intends to immigrate. Applicants must demonstrate strong ties to home country: employment, family, property, financial assets.',
    'Section 214(b) INA предполагает иммиграционное намерение. Необходимо доказать тесные связи с родиной: работа, семья, имущество, финансы.',
    'https://www.uscis.gov/laws-and-policy/legislation/immigration-and-nationality-act',
    ARRAY['B-1/B-2', 'F-1', 'H-1B'],
    now(),
    'published'
);
