-- Seed anonymized case stories for the public archive

INSERT INTO case_stories (
    slug, title_en, title_ru, summary_en, summary_ru,
    story_en, story_ru, person_alias_en, person_alias_ru,
    origin_country, visa_types, tags, outcome, is_complex, lawyer_involved,
    duration_months, lessons_learned_en, lessons_learned_ru,
    key_takeaways_en, key_takeaways_ru, status, published_at
) VALUES
(
    'h1b-denial-rfe-approval',
    'H-1B: From RFE to Approval After Initial Denial Intent',
    'H-1B: от RFE до одобрения после угрозы отказа',
    'A software engineer from India faced a specialty occupation RFE. Documenting the bachelor''s degree equivalency and detailed job duties led to approval.',
    'Инженер из Индии получил RFE по specialty occupation. Документирование эквивалентности диплoma и детальных обязанностей привело к одобрению.',
    'Anonymized case — composite based on publicly reported patterns.

Maria''s colleague (we call him Raj, India, age 29) received an H-1B approval notice after a stressful Request for Evidence (RFE). His employer filed in the regular cap. USCIS questioned whether his role truly required a specialty degree.

Raj gathered: (1) a credential evaluation showing his Indian B.Tech equals a U.S. bachelor''s in computer science; (2) a detailed employer letter explaining why the QA automation role could not be performed without that degree; (3) project documentation showing specialized tasks.

The RFE response was submitted within 87 days. Approval came 3 weeks later. Total process from filing to approval: 11 months.

Raj did not attend the interview — this was a change-of-status while in F-1 OPT. He hired an attorney only for the RFE response ($2,800).',
    'Анонимизированный кейс — композит на основе публично описанных паттернов.

Коллега (назовём его Raj, Индия, 29 лет) получил одобрение H-1B после стрессового Request for Evidence (RFE). Работодатель подал в regular cap. USCIS усомнился, требует ли роль профильного образования.

Raj собрал: (1) credential evaluation — индийский B.Tech = бакалавр CS в США; (2) детальное письмо работодателя; (3) документацию проектов.

Ответ на RFE за 87 дней. Одобрение через 3 недели. Весь процесс: 11 месяцев.

Адвокат — только для RFE ($2,800).',
    'Raj S., India', 'Raj S., Индия',
    'India',
    ARRAY['H-1B', 'F-1'],
    ARRAY['RFE', 'specialty occupation', 'credential evaluation', 'OPT'],
    'approved',
    true,
    true,
    11,
    'Never submit a minimal RFE response. Treat every RFE as a chance to rebuild the entire specialty occupation argument.',
    'Никогда не отвечайте на RFE минимально. Каждый RFE — шанс заново доказать specialty occupation.',
    ARRAY['Credential evaluation before filing saves time', 'Employer letter must explain why degree is required', 'Consider attorney for RFE even if filing was DIY'],
    ARRAY['Credential evaluation до подачи экономит время', 'Письмо работодателя должно объяснять необходимость диплoma', 'Адвокат на RFE оправдан даже при самостоятельной подаче'],
    'published',
    now()
),
(
    'asylum-one-year-deadline',
    'Asylum: Missing the One-Year Filing Deadline and Building a Late-Filing Case',
    'Убежище: пропуск годового срока и построение late-filing кейса',
    'A journalist from Central America missed the 1-year asylum filing deadline but succeeded with an exception based on changed circumstances.',
    'Журналист из Центральной Америки пропустил годовой срок подачи на убежище, но добился исключения по changed circumstances.',
    'Anonymized composite case.

Elena (pseudonym, Honduras) entered the U.S. in 2019 on B-2 visa. She did not know she could apply for asylum. After reporting corruption in her hometown newspaper, she received threats in 2022 — after she had already been in the U.S. for more than one year.

An attorney helped file asylum with a "changed circumstances" exception under 8 CFR 208.4(a)(4): the persecution was not reasonably foreseeable at entry. Evidence included: sworn affidavits, news articles about attacks on journalists in her region, psychological evaluation, and country conditions reports.

The case took 28 months. Elena received asylum approval in 2024. Work authorization came via pending asylum EAD while waiting.

Critical: she never worked without authorization before EAD. One brief overstay on B-2 was disclosed honestly.',
    'Анонимизированный композитный кейс.

Elena (псевдоним, Гондuras) въехала в США в 2019 по B-2. Не знала о праве на asylum. После расследования коррупции получила угрозы в 2022 — уже после года в США.

Адвокат подал asylum с исключением "changed circumstances" (8 CFR 208.4(a)(4)): преследование не было разумно предсказуемо при въезде.

Доказательства: affidavits, статьи о нападениях на журналистов, психологическая экспертиза, country conditions reports.

Кейс занял 28 месяцев. Одобрение в 2024. EAD по pending asylum.

Критично: не работала без авторизации. Overstay на B-2 раскрыт честно.',
    'Elena M., Honduras', 'Elena M., Гондuras',
    'Honduras',
    ARRAY['ASYLUM', 'B-1/B-2'],
    ARRAY['one-year deadline', 'changed circumstances', 'journalist', 'persecution', 'EAD'],
    'approved',
    true,
    true,
    28,
    'The one-year rule has exceptions. Document when circumstances changed and why you could not have filed earlier.',
    'Годовое правило имеет исключения. Документируйте, когда изменились обстоятельства.',
    ARRAY['Changed circumstances exception is real but hard to prove', 'Country conditions reports strengthen cases', 'Always disclose prior visa violations honestly'],
    ARRAY['Исключение changed circumstances реально, но сложно доказать', 'Country conditions reports усиливают кейс', 'Всегда честно раскрывайте нарушения визового режима'],
    'published',
    now()
),
(
    'f1-denial-214b-second-interview',
    'F-1: 214(b) Denial and Winning on the Second Interview',
    'F-1: отказ по 214(b) и одобрение на втором интервью',
    'A Ukrainian student was denied F-1 under 214(b) for weak ties to home country, then approved after strengthening financial and family ties evidence.',
    'Украинский студент получил отказ F-1 по 214(b) из-за слабых связей с родиной, затем одобрение после усиления финансовых и семейных доказательств.',
    'Anonymized composite.

Oksana, 22, from Ukraine, was admitted to a Texas community college. First consular interview in Frankfurt (third-country processing): denied under INA 214(b) — officer believed she would not return home.

She waited 6 months (not reapplying immediately). Changes: (1) father opened a documented business in Ukraine with tax records showing family stake; (2) she obtained a letter from a local employer offering a guaranteed internship slot after graduation; (3) bank statements showed 2 years of tuition + living costs; (4) she prepared a 1-page ties summary in English.

Second interview: approved F-1. She entered the U.S. and maintained status. No attorney — she used a student advisor and a community legal clinic for document review.

Lesson: a 214(b) denial is not permanent, but reapplication requires genuine new evidence, not the same packet.',
    'Анонимизированный композит.

Oksana, 22, Украина, community college в Texas. Первое интервью во Frankfurt: отказ по INA 214(b).

Ждала 6 месяцев. Изменения: (1) бизнес отца с налоговыми документами; (2) письмо о стажировке после graduation; (3) выписки на 2 года обучения; (4) one-page summary связей с родиной.

Второе интервью: одобрение F-1. Без адвоката — advisor и legal clinic.

Урок: отказ 214(b) не окончателен, но нужны новые доказательства.',
    'Oksana T., Ukraine', 'Oksana T., Украина',
    'Ukraine',
    ARRAY['F-1'],
    ARRAY['214(b)', 'consular interview', 'ties to home country', 'reapplication', 'third-country processing'],
    'approved',
    true,
    false,
    9,
    'After 214(b), change something real — finances, employment plans, family business — before reapplying.',
    'После 214(b) измените что-то реальное — финансы, планы работы, семейный бизнес.',
    ARRAY['214(b) presumption can be overcome with strong ties evidence', 'Third-country processing is possible but risky', 'Wait and improve — do not reapply with identical documents'],
    ARRAY['Презumption 214(b) можно преодолеть', 'Third-country processing возможен, но рискован', 'Подождите и улучшите пакет — не подавайте с теми же документами'],
    'published',
    now()
),
(
    'k1-cr1-adjustment-complications',
    'K-1 to Green Card: A Complicated Adjustment with Prior Overstay',
    'K-1 до Green Card: сложный adjustment с prior overstay',
    'A Filipino fiancé entered on K-1 but had a prior brief overstay. Adjustment of status required a waiver strategy and careful timeline management.',
    'Филиппинский fiancé въехал по K-1 с prior overstay. Adjustment потребовал waiver strategy и контроля сроков.',
    'Anonymized composite.

Mark (Philippines) had a 45-day overstay on a previous B-2 visit years earlier — disclosed on DS-160. He entered on K-1, married within 75 days, filed I-485 adjustment with I-864 affidavit of support.

USCIS issued an RFE about the overstay and whether he maintained K-1 intent. Attorney filed response with: marriage bona fides evidence (joint lease, photos, affidavits), overstay explanation letter, and proof Mark did not work illegally.

Outcome: mixed — I-485 approved but required additional review at local field office interview (Stokes-style questions). Total timeline: K-1 entry to green card = 19 months. Legal fees: ~$5,500.

Without the attorney, Mark believes the overstay would have triggered a denial.',
    'Анонимизированный композит.

Mark (Филиппины) имел 45-дневный overstay на B-2 — раскрыт в DS-160. K-1, брак за 75 дней, I-485 + I-864.

RFE об overstay и K-1 intent. Адвокат: bona fides брака, объяснение overstay, proof без illegal work.

Итог: mixed — I-485 одобрен после Stokes-style интервью. K-1 до green card: 19 месяцев. ~$5,500 адвокату.',
    'Mark D., Philippines', 'Mark D., Филиппины',
    'Philippines',
    ARRAY['K-1', 'B-1/B-2'],
    ARRAY['overstay', 'adjustment of status', 'I-485', 'RFE', 'bona fide marriage', 'waiver'],
    'mixed',
    true,
    true,
    19,
    'Prior overstays must be disclosed everywhere. K-1 timeline (90-day marriage rule) leaves no room for errors.',
    'Prior overstay раскрывайте везде. K-1 timeline (90 дней на брак) не прощает ошибок.',
    ARRAY['Disclose all prior violations on every form', 'K-1 to AOS needs strong marriage evidence from day one', 'Field office interviews can be intensive for flagged cases'],
    ARRAY['Раскрывайте все нарушения на каждой форме', 'K-1 to AOS — доказательства брака с первого дня', 'Интервью в field office может быть интенсивным'],
    'published',
    now()
),
(
    'o1-artist-denied-then-approved',
    'O-1: Denied Once, Approved After Building the Extraordinary Ability Portfolio',
    'O-1: отказ, затем одобрение после портфолио extraordinary ability',
    'A Brazilian choreographer was denied O-1B, then approved after documenting awards, critical reviews, and leading role evidence.',
    'Бразильский хореограф получил отказ O-1B, затем одобрение после документирования наград, рецензий и leading role.',
    'Anonymized composite.

Carla (Brazil, O-1B arts) first petition was employer-filed with weak evidence — mostly performance contracts. USCIS denied: insufficient proof of extraordinary ability.

She switched attorneys. Second petition included: international competition awards (with translation), published critical reviews in major dance publications, letters from recognized experts, evidence of leading role in distinguished productions, and high salary compared to peers (contract + tax docs).

Approved in 4 months on second try. Total journey: 14 months including first denial.

Carla''s lesson: O-1 is not "talented person visa" — it requires meeting specific regulatory criteria with hard evidence, not resumes alone.',
    'Анонимизированный композит.

Carla (Бразилия, O-1B) — первый petition со слабыми доказательствами (только контракты). Отказ USCIS.

Второй petition с адвокатом: международные награды, рецензии, письма экспертов, leading role, высокая зарплата.

Одобрение за 4 месяца. Весь путь: 14 месяцев.

O-1 — не виза "талантливого человека", а конкретные критерии с доказательствами.',
    'Carla R., Brazil', 'Carla R., Бразилия',
    'Brazil',
    ARRAY['O-1'],
    ARRAY['extraordinary ability', 'denial', 'repetition', 'arts', 'evidence portfolio'],
    'approved',
    true,
    true,
    14,
    'O-1 requires mapping evidence to specific regulatory criteria — awards, press, leading roles, high salary, or judging.',
    'O-1 требует привязки доказательств к конкретным критериям — награды, пресса, leading roles, зарплата.',
    ARRAY['First O-1 denial is common — rebuild the evidence matrix', 'Expert recommendation letters must be detailed and specific', 'Translations and credentials must be certified'],
    ARRAY['Первый отказ O-1 частый — перестройте матрицу доказательств', 'Recommendation letters должны быть детальными', 'Переводы и credentials — certified'],
    'published',
    now()
),
(
    'l1a-rfe-managerial-capacity',
    'L-1A: RFE on Managerial Role and Proving Executive Duties',
    'L-1A: RFE о managerial role и доказательство executive duties',
    'A UK operations director faced an L-1A RFE questioning whether she truly managed staff rather than performing day-to-day tasks. Reorganizing the org chart evidence led to approval.',
    'Директор по операциям из UK получила RFE по L-1A — USCIS усомнилась, что она управляет, а не выполняет рутинные задачи. Перестройка доказательств org chart привела к одобрению.',
    'Anonymized composite case.

Sophie (pseudonym, United Kingdom, age 38) was transferred from a London fintech subsidiary to the U.S. parent company as Operations Director on an L-1A blanket petition. USCIS issued an RFE within 45 days: the officer argued her role looked "functional" rather than "managerial" because she still reviewed dashboards and attended product meetings.

Her immigration counsel rebuilt the response around 8 CFR 214.2(l)(1)(ii)(A): (1) organizational charts showing she supervised two managers who collectively oversaw 14 staff; (2) job descriptions proving she did not perform the same work as subordinates; (3) performance reviews documenting strategic planning and budget authority; (4) payroll records confirming direct reports.

The RFE response was filed in 78 days. Approval followed in 19 days. Total L-1A process: 7 months. Sophie later transitioned to EB-1C — that petition is still pending.

She spent approximately $4,200 on legal fees for the RFE alone. Without counsel, she believes USCIS would have denied based on the initial job description wording.',
    'Анонимизированный композитный кейс.

Sophie (псевдоним, Великобритания, 38 лет) переведена из лондонского fintech-филиала в U.S. parent как Operations Director по L-1A blanket. RFE через 45 дней: офicer счёл роль «functional», а не «managerial» — она всё ещё смотрела dashboards и ходила на product meetings.

Адвокат перестроил ответ вокруг 8 CFR 214.2(l)(1)(ii)(A): (1) org charts — два manager''а, 14 сотрудников; (2) job descriptions — не выполняет работу subordinates; (3) performance reviews — стратегия и бюджет; (4) payroll records.

Ответ на RFE за 78 дней. Одобрение через 19. Весь L-1A: 7 месяцев. Планирует EB-1C — в процессе.

~$4,200 за RFE. Без адвоката, по её словам, был бы отказ из-за формулировок в job description.',
    'Sophie W., United Kingdom', 'Sophie W., Великобритания',
    'United Kingdom',
    ARRAY['L-1', 'EB-1'],
    ARRAY['RFE', 'managerial capacity', 'blanket petition', 'intracompany transfer', 'org chart'],
    'approved',
    true,
    true,
    7,
    'L-1A job descriptions written by HR often trigger RFEs. Map every duty to managerial criteria before filing.',
    'Job descriptions для L-1A от HR часто вызывают RFE. Сопоставьте каждую обязанность с managerial criteria до подачи.',
    ARRAY['Org charts must show a real management chain', 'Avoid hybrid individual-contributor language in L-1A petitions', 'Blanket L-1 does not eliminate specialty RFEs'],
    ARRAY['Org charts должны показывать реальную цепочку управления', 'Избегайте IC-формулировок в L-1A petitions', 'Blanket L-1 не отменяет specialty RFE'],
    'published',
    now()
),
(
    'eb2-niw-stem-self-petition',
    'EB-2 NIW: Self-Petition Without Employer Sponsor',
    'EB-2 NIW: self-petition без спонсора-работодателя',
    'A biomedical researcher from South Korea self-petitioned EB-2 NIW using publications, citations, and a detailed national importance argument. Approved without PERM.',
    'Биomed-исследователь из Южной Кореи подала EB-2 NIW self-petition с публикациями, цитированиями и аргументом national importance. Одобрено без PERM.',
    'Anonymized composite case.

Dr. Kim (pseudonym, South Korea, age 34) completed a postdoc at a U.S. university on J-1, then moved to H-1B with a hospital employer. She wanted a green card but her hospital would not sponsor PERM due to budget cycles.

An attorney recommended EB-2 National Interest Waiver (NIW) under Matter of Dhanasar: (1) proposed endeavor — developing low-cost diagnostic tools for rural clinics; (2) well-positioned — 12 peer-reviewed papers, 340+ citations, peer review invitations; (3) national importance — letters from public health officials and a NIH-funded collaborator.

She filed I-140 self-petition with premium processing. USCIS issued an RFE asking for more evidence that her specific work (not the field generally) benefits the U.S. The response added grant documentation, media coverage of her lab''s COVID-related work, and detailed implementation plans.

I-140 approved in 11 months total. She is now waiting for priority date current status (EB-2 backlog for her country). No employer signature required on the petition.

Total legal fees: ~$8,500 including RFE. Dr. Kim kept working on H-1B throughout.',
    'Анонимизированный композитный кейс.

Dr. Kim (псевдоним, Южная Корея, 34) — postdoc на J-1, затем H-1B в hospital. Green card нужен, но PERM hospital не спонсирует.

Адвокат рекомендовал EB-2 NIW (Matter of Dhanasar): (1) endeavor — low-cost diagnostics для rural clinics; (2) well-positioned — 12 papers, 340+ citations; (3) national importance — письма public health officials и NIH collaborator.

I-140 self-petition с premium processing. RFE: больше доказательств, что именно её работа (не поле в целом) benefit U.S. Ответ: grants, media coverage COVID-work, implementation plans.

I-140 одобрен за 11 месяцев. Ждёт priority date (EB-2 backlog). Работодатель не подписывал petition.

~$8,500 с RFE. Работала на H-1B всё время.',
    'Dr. Kim H., South Korea', 'Dr. Kim H., Южная Корея',
    'South Korea',
    ARRAY['EB-2', 'H-1B', 'J-1'],
    ARRAY['NIW', 'self-petition', 'PERM waiver', 'RFE', 'Matter of Dhanasar', 'STEM'],
    'approved',
    true,
    true,
    11,
    'NIW is not easier than PERM — it replaces labor certification with a harder evidence standard about national benefit.',
    'NIW не проще PERM — вместо labor certification нужен более высокий стандарт доказательств national benefit.',
    ARRAY['Self-petition removes employer dependency but not evidence burden', 'RFEs often ask for endeavor specificity, not general field importance', 'Premium processing helps timeline planning on I-140'],
    ARRAY['Self-petition снимает зависимость от работодателя, но не от доказательств', 'RFE часто требуют конкретики endeavor, а не общей важности поля', 'Premium processing помогает планировать I-140'],
    'published',
    now()
),
(
    'j1-waiver-212e-h1b-path',
    'J-1: 212(e) Home Residency Waiver and Transition to H-1B',
    'J-1: waiver 212(e) home residency и переход на H-1B',
    'A Chinese research scholar subject to the two-year home residency rule obtained a J-1 waiver through a interested government agency, then changed to H-1B.',
    'Китайский research scholar с two-year home residency rule получил J-1 waiver через interested government agency, затем сменил статус на H-1B.',
    'Anonymized composite case.

Wei (pseudonym, China, age 31) entered the U.S. on J-1 research scholar status funded by his home-university exchange program. His J-1 visa stamp and DS-2019 carried the 212(e) two-year home residency requirement because his funding was partially government-linked.

After three years of research, a U.S. biotech startup offered him an H-1B role. He could not change status until the waiver cleared.

Strategy with counsel: (1) apply for an interested government agency (IGA) waiver — NIH sponsorship based on ongoing federally funded project continuity; (2) parallel documentation of exceptional hardship was prepared but not needed; (3) after waiver approval, employer filed cap-exempt H-1B (nonprofit research affiliation).

Timeline: waiver application to approval = 14 months; H-1B change-of-status = 4 months after waiver. Total: 18 months. One brief period of uncertainty when his J-1 grace period nearly overlapped with waiver processing — he did not depart the U.S.

Critical mistake avoided: Wei never worked for the startup before the H-1B approval, even informally.',
    'Анонимизированный композитный кейс.

Wei (псевдоним, Китай, 31) — J-1 research scholar, funding частично government-linked → 212(e) two-year home residency на DS-2019.

Через 3 года biotech startup предложил H-1B. Смена статуса невозможна без waiver.

Стратегия: (1) IGA waiver через NIH sponsorship (federally funded project); (2) exceptional hardship подготовлен, но не понадобился; (3) после waiver — cap-exempt H-1B через nonprofit research affiliation.

Waiver: 14 месяцев. Change-of-status: 4 месяца. Итого: 18 месяцев. J-1 grace period почти пересёкся с waiver — не выезжал.

Критично: не работал для startup до H-1B approval, даже informally.',
    'Wei L., China', 'Wei L., Китай',
    'China',
    ARRAY['J-1', 'H-1B'],
    ARRAY['212(e)', 'home residency', 'J-1 waiver', 'IGA', 'change of status', 'cap-exempt'],
    'approved',
    true,
    true,
    18,
    'Check DS-2019 for 212(e) before accepting any U.S. job offer. A waiver path must be planned years ahead, not weeks.',
    'Проверяйте DS-2019 на 212(e) до принятия job offer. Waiver path планируют годами, а не неделями.',
    ARRAY['IGA waivers can take over a year — build timeline into job negotiations', 'Never work before status change is approved', 'Cap-exempt H-1B may be available through research affiliations'],
    ARRAY['IGA waivers могут занять больше года — закладывайте в переговоры', 'Не работайте до approval смены статуса', 'Cap-exempt H-1B возможен через research affiliations'],
    'published',
    now()
),
(
    'tn-mexico-engineer-denied-then-approved',
    'TN: Initial Denial for Job Title Mismatch, Approved on Reapplication',
    'TN: первоначальный отказ из-за job title, одобрение при повторной подаче',
    'A Mexican mechanical engineer was denied TN at the border because his offer letter title did not match USMCA profession list wording. A revised employer letter fixed it.',
    'Мексиканский инженер-механик получил отказ TN на границе — title в offer letter не совпал с USMCA profession list. Исправленное письмо работодателя решило проблему.',
    'Anonymized composite case.

Diego (pseudonym, Mexico, age 27) had a bachelor''s in mechanical engineering and a job offer from an automotive supplier in Michigan. He applied for TN at the Detroit-Windsor land port.

The CBP officer denied the application: the offer letter listed "Product Development Specialist," which the officer did not map clearly to "Engineer" under the USMCA professions list. Diego was given a short written note and allowed to withdraw the application (no formal deportation, but a denial record).

He waited 3 months. Changes: (1) employer rewrote the letter with title "Mechanical Engineer" matching the degree; (2) added a duties section explicitly tied to engineering tasks — CAD design, stress analysis, BOM review; (3) included a credentials packet with certified translations and a credential evaluation; (4) a one-page TN profession memo from HR.

Second application at the same port: approved for 3 years. Diego entered, maintained status, and later applied for renewal without issues.

No immigration attorney — he used an employer HR immigration contact and a community clinic review. Total cost under $500 excluding evaluation fees.',
    'Анонимизированный композит.

Diego (псевдоним, Мексика, 27) — bachelor''s mechanical engineering, offer от automotive supplier в Michigan. TN на Detroit-Windsor land port.

CBP отказал: title "Product Development Specialist" не совпал с "Engineer" в USMCA list. Withdraw application, не deportation.

Ждал 3 месяца. Изменения: (1) title "Mechanical Engineer"; (2) duties — CAD, stress analysis, BOM; (3) certified translations + credential evaluation; (4) TN profession memo от HR.

Вторая подача: одобрение на 3 года. Renewal без проблем.

Без адвоката — HR contact и community clinic. <$500 без evaluation.',
    'Diego M., Mexico', 'Diego M., Мексика',
    'Mexico',
    ARRAY['TN'],
    ARRAY['USMCA', 'job title', 'border application', 'denial', 'credential evaluation', 'Engineer'],
    'approved',
    false,
    false,
    4,
    'TN approvals live or die on profession list alignment. The offer letter title and duties must mirror the USMCA category exactly.',
    'TN одобряют или отказывают по profession list. Title и duties в offer letter должны точно соответствовать USMCA category.',
    ARRAY['Creative job titles hurt TN applications', 'Withdrawal is often better than arguing at the port', 'Credential evaluations help even for Mexican degrees'],
    ARRAY['Креативные job titles вредят TN', 'Withdrawal часто лучше спора на порту', 'Credential evaluation полезен даже для мексиканских диплomов'],
    'published',
    now()
),
(
    'u-visa-certification-green-card-path',
    'U Visa: Law Enforcement Certification and the Path to Adjustment',
    'U visa: law enforcement certification и путь к adjustment',
    'A domestic violence survivor obtained U nonimmigrant status after a delayed certification, then filed adjustment after the statutory wait.',
    'Выжившая после domestic violence получила U nonimmigrant status после задержки certification, затем подала adjustment после statutory wait.',
    'Anonymized composite case.

Ana (pseudonym, Guatemala, age 30) reported an assault to local police while undocumented in Texas. She cooperated with the investigation and received crime victim services referrals, but did not know about the U visa until two years later.

A nonprofit legal clinic helped her request U nonimmigrant status certification (Form I-918, Supplement B) from the district attorney''s office. The first request was ignored for 8 months; a follow-up with victim advocate support yielded certification confirming she was helpful to the investigation.

She filed I-918 with waiver of inadmissibility (prior entry without inspection). USCIS placed her in the U visa backlog (cap wait) for 4 years. She received deferred action and a four-year EAD while waiting. When a visa number became available, U status was granted. One year later, she filed I-485 adjustment to lawful permanent resident.

Total timeline from certification request to green card interview: 9 years. Outcome: approved LPR. Legal services were pro bono through the clinic; she paid only filing fees (~$1,200 total over time).

Ana''s lesson: certification is the gatekeeper — without law enforcement signing Supplement B, the case cannot proceed.',
    'Анонимизированный композит.

Ana (псевдоним, Гватемала, 30) — сообщила о assault в Texas, будучи undocumented. Сотрудничала со следствием, но узнала о U visa только через 2 года.

Legal clinic запросила certification (I-918 Supplement B) у district attorney. Первый запрос игнорировали 8 месяцев; повтор с victim advocate — certification подтвердила helpfulness.

I-918 с waiver (entry without inspection). U visa cap backlog — 4 года. Deferred action + EAD на 4 года. Visa number → U status. Через год I-485 adjustment.

От certification до green card interview: 9 лет. LPR одобрен. Pro bono clinic, ~$1,200 filing fees.

Урок: certification — gatekeeper без Supplement B кейс не идёт.',
    'Ana G., Guatemala', 'Ana G., Гватемала',
    'Guatemala',
    ARRAY['U', 'ASYLUM'],
    ARRAY['U visa', 'law enforcement certification', 'I-918', 'adjustment of status', 'EAD', 'cap backlog', 'domestic violence'],
    'approved',
    true,
    true,
    108,
    'U visa cases are multi-year journeys. Start certification early and keep every document from police cooperation.',
    'U visa — путь на годы. Начинайте certification рано и сохраняйте все документы сотрудничества с полицией.',
    ARRAY['Supplement B certification can take advocacy to obtain', 'Cap backlog means years of waiting even after approval in principle', 'EAD during wait allows lawful work'],
    ARRAY['Supplement B может потребовать advocacy', 'Cap backlog — годы ожидания даже после одобрения in principle', 'EAD на время ожидания даёт lawful work'],
    'published',
    now()
),
(
    'dv-lottery-consular-interview-221g',
    'DV Lottery: Selectee Navigating 221(g) and Document Review',
    'DV Lottery: selectee проходит 221(g) и проверку документов',
    'An Egyptian DV lottery winner received 221(g) at consular interview for missing police certificates, then obtained a visa after submitting complete records.',
    'Победитель DV lottery из Египта получил 221(g) на consular interview из-за police certificates, затем визу после полного пакета документов.',
    'Anonymized composite case.

Hassan (pseudonym, Egypt, age 29) was selected in the DV lottery while finishing his pharmacy degree. He completed education check, translated documents, and scheduled an interview at the U.S. Embassy in Cairo.

At interview, the consular officer issued 221(g) — administrative processing — because: (1) police certificate from a city where he lived briefly during university was missing; (2) his civil documents showed a minor name transliteration difference between birth certificate and passport.

Hassan did not panic. Within 6 weeks he obtained the missing police certificate (with help from a family member in that city), submitted a sworn affidavit explaining the name variant with a formal translation reconciliation sheet, and uploaded everything via the embassy document portal.

Visa issued 11 weeks after the interview. He entered the U.S. before his fiscal year window closed. Total from selection notice to entry: 16 months.

No attorney. He used the official DV instructions checklist and a Facebook group for DV selectees (verified against official sources only).

Upon entry he received conditional permanent resident documents and later received his green card by mail without additional interview.',
    'Анонимизированный композит.

Hassan (псевдоним, Египет, 29) — selected в DV lottery во время pharmacy degree. Interview в Cairo.

221(g): (1) нет police certificate из города, где жил во время university; (2) расхождение transliteration имени в birth certificate и passport.

За 6 недель — missing certificate (помощь родственника), sworn affidavit о имени, reconciliation sheet. Upload через embassy portal.

Visa через 11 недель после interview. Въезд до закрытия fiscal year window. Selection → entry: 16 месяцев.

Без адвоката — official DV checklist и verified DV groups.

После entry — conditional LPR documents, green card по почте без доп. interview.',
    'Hassan A., Egypt', 'Hassan A., Египет',
    'Egypt',
    ARRAY['DV'],
    ARRAY['DV lottery', '221(g)', 'consular interview', 'police certificate', 'document translation', 'administrative processing'],
    'approved',
    false,
    false,
    16,
    'DV selectees win a narrow window — treat 221(g) as a checklist fix, not a denial.',
    'DV selectees имеют узкое окно — 221(g) это checklist fix, а не отказ.',
    ARRAY['Collect police certificates from every jurisdiction you lived in', 'Name transliteration mismatches are fixable with affidavits', 'Track fiscal year deadlines obsessively'],
    ARRAY['Police certificates из каждого места жительства', 'Transliteration расхождения исправляются affidavits', 'Следите за fiscal year deadlines'],
    'published',
    now()
);
