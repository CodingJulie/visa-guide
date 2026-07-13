import { z } from 'zod';
import type { RuleCondition } from '@/lib/eligibility-engine';

export const VISA_GOAL_VALUES = [
    'tourism',
    'business_visit',
    'medical',
    'transit',
    'work_has_offer',
    'work_seeking_h1b',
    'work_seeking_l1',
    'work_seeking_o1',
    'work_seeking_tn',
    'work_seeking_e3',
    'work_seeking',
    'work_seasonal_ag',
    'work_seasonal_temp',
    'work_training',
    'usmca_professional',
    'australian_professional',
    'cnmi_worker',
    'study',
    'cultural_exchange',
    'performing_artist',
    'media_journalist',
    'religious_worker',
    'family',
    'family_lpr',
    'adoption',
    'investment',
    'immigrant_employment',
    'dv_lottery',
    'returning_resident',
    'diplomat_official',
    'international_org',
    'crewmember',
    'border_crossing',
    'humanitarian',
] as const;

export type VisaGoal = (typeof VISA_GOAL_VALUES)[number];

/** Goals where the user is preparing for a work visa without a US job offer yet */
export const WORK_VISA_NO_OFFER_GOALS = [
    'work_seeking_h1b',
    'work_seeking_l1',
    'work_seeking_o1',
    'work_seeking_tn',
    'work_seeking_e3',
    'work_seeking',
    'work_seasonal_ag',
    'work_seasonal_temp',
    'work_training',
    'usmca_professional',
    'australian_professional',
    'cnmi_worker',
    'performing_artist',
    'religious_worker',
] as const satisfies readonly VisaGoal[];

export function isWorkVisaNoOfferGoal(goal: VisaGoal | undefined): boolean {
    return goal !== undefined && (WORK_VISA_NO_OFFER_GOALS as readonly string[]).includes(goal);
}

export function getPreparationTargetVisa(goal: VisaGoal | undefined): string | null {
    if (!goal) return null;
    const map: Partial<Record<VisaGoal, string>> = {
        work_seeking_h1b: 'H-1B',
        work_seeking: 'H-1B',
        work_seeking_l1: 'L-1',
        work_seeking_o1: 'O-1',
        work_seeking_tn: 'TN',
        usmca_professional: 'TN',
        work_seeking_e3: 'E-3',
        australian_professional: 'E-3',
        work_seasonal_ag: 'H-2A',
        work_seasonal_temp: 'H-2B',
        work_training: 'H-3',
        cnmi_worker: 'CW-1',
        performing_artist: 'P',
        religious_worker: 'R',
    };
    return map[goal] ?? null;
}

export const TRAVEL_PURPOSE_VALUES = [
    'tourism',
    'business_visit',
    'medical',
    'transit',
    'work',
    'study',
    'cultural_exchange',
    'performing',
    'media',
    'religious',
    'family',
    'family_lpr',
    'adoption',
    'investment',
    'immigrant',
    'dv_lottery',
    'returning_resident',
    'official',
    'international_org',
    'crewmember',
    'humanitarian',
] as const;

export const STUDY_PROGRAM_TYPE_VALUES = ['academic', 'vocational', 'exchange'] as const;
export const INVESTMENT_TYPE_VALUES = ['treaty_trader', 'treaty_investor', 'eb5_immigrant'] as const;
export const EB_IMMIGRANT_CATEGORY_VALUES = ['eb1', 'eb2', 'eb3', 'eb5'] as const;
export const HUMANITARIAN_BASIS_VALUES = ['asylum', 'u_visa', 't_visa', 'tps'] as const;
export const LPR_FAMILY_RELATIONSHIP_VALUES = ['spouse', 'unmarried_child', 'adult_child', 'other'] as const;

export const questionnaireSchema = z.object({
    visa_goal: z.enum(VISA_GOAL_VALUES),

    citizenship: z.string().min(1),
    dual_citizenship: z.boolean().default(false),
    second_citizenship: z.string().optional(),
    current_us_status: z.enum(['none', 'visitor', 'student', 'worker', 'permanent_resident', 'other']).default('none'),

    full_name: z.string().min(2),
    date_of_birth: z.string().min(1),
    marital_status: z.enum(['single', 'married', 'divorced', 'widowed']),
    has_dependents: z.boolean().default(false),
    dependents_count: z.coerce.number().min(0).optional(),

    travel_purpose: z.enum(TRAVEL_PURPOSE_VALUES),
    residence_country: z.string().min(1),
    planned_us_state: z.string().optional(),
    planned_us_city: z.string().optional(),

    employment_status: z.enum(['employed', 'job_search', 'self_employed', 'unemployed', 'student']).optional(),
    has_us_job_offer: z.boolean().default(false),
    job_requires_degree: z.boolean().optional(),
    intracompany_transfer: z.boolean().optional(),
    extraordinary_ability: z.boolean().optional(),
    l1_qualifying_employment: z.boolean().optional(),

    has_university_degree: z.boolean().default(false),
    degree_evaluated: z.boolean().optional(),

    wants_to_study: z.boolean().default(false),
    study_program_type: z.enum(STUDY_PROGRAM_TYPE_VALUES).optional(),
    has_i20: z.boolean().optional(),
    has_ds2019: z.boolean().optional(),
    exchange_program: z.boolean().optional(),

    us_citizen_fiance: z.boolean().optional(),
    us_citizen_spouse: z.boolean().optional(),
    lpr_family_relationship: z.enum(LPR_FAMILY_RELATIONSHIP_VALUES).optional(),

    investment_type: z.enum(INVESTMENT_TYPE_VALUES).optional(),
    eb_immigrant_category: z.enum(EB_IMMIGRANT_CATEGORY_VALUES).optional(),
    had_permanent_residence: z.boolean().optional(),
    dv_lottery_selected: z.boolean().optional(),

    humanitarian_basis: z.enum(HUMANITARIAN_BASIS_VALUES).optional(),
    crime_victim: z.boolean().optional(),
    crime_victim_cooperation: z.boolean().optional(),
    trafficking_victim: z.boolean().optional(),

    chronic_conditions: z.boolean().default(false),
    disability: z.boolean().default(false),

    life_threat: z.boolean().default(false),
    persecution: z.boolean().default(false),
    gender_violence: z.boolean().default(false),
    deportation_risk: z.boolean().default(false),

    prior_visa_denial: z.boolean().default(false),
    prior_overstay: z.boolean().default(false),
    overstay_days: z.coerce.number().optional(),
    prior_deportation: z.boolean().default(false),

    financial_sponsor: z.enum(['self', 'family', 'employer', 'other_sponsor', 'none']),
    annual_income_usd: z.coerce.number().optional(),
});

export type QuestionnaireAnswers = z.infer<typeof questionnaireSchema>;

export type QuestionType = 'text' | 'date' | 'select' | 'boolean' | 'number' | 'textarea';

export interface QuestionOption {
    value: string;
}

export interface QuestionDefinition {
    key: keyof QuestionnaireAnswers | string;
    section: string;
    type: QuestionType;
    options?: QuestionOption[];
    conditions?: RuleCondition[];
    conditionsOr?: RuleCondition[][];
    required?: boolean;
}

export interface QuestionSection {
    key: string;
}

export const QUESTION_SECTIONS: QuestionSection[] = [
    { key: 'goal' },
    { key: 'citizenship' },
    { key: 'personal' },
    { key: 'residence' },
    { key: 'employment' },
    { key: 'education' },
    { key: 'health' },
    { key: 'humanitarian' },
    { key: 'history' },
    { key: 'finance' },
];

function optionsFromValues(values: readonly string[]): QuestionOption[] {
    return values.map((value) => ({ value }));
}

const VISA_GOAL_OPTION_VALUES = ["tourism","business_visit","medical","transit","work_has_offer","work_seeking_h1b","work_seeking","work_seeking_l1","work_seeking_o1","work_seeking_tn","usmca_professional","work_seeking_e3","australian_professional","work_seasonal_ag","work_seasonal_temp","work_training","cnmi_worker","performing_artist","religious_worker","study","cultural_exchange","media_journalist","family","family_lpr","adoption","investment","immigrant_employment","dv_lottery","returning_resident","diplomat_official","international_org","crewmember","border_crossing","humanitarian"] as const;
const STUDY_PROGRAM_OPTION_VALUES = ["academic","vocational","exchange"] as const;
const INVESTMENT_TYPE_OPTION_VALUES = ["treaty_trader","treaty_investor","eb5_immigrant"] as const;
const EB_CATEGORY_OPTION_VALUES = ["eb1","eb2","eb3","eb5"] as const;
const HUMANITARIAN_BASIS_OPTION_VALUES = ["asylum","u_visa","t_visa","tps"] as const;
const LPR_RELATIONSHIP_OPTION_VALUES = ["spouse","unmarried_child","adult_child","other"] as const;
const CURRENT_US_STATUS_OPTION_VALUES = ["none","visitor","student","worker","permanent_resident","other"] as const;
const MARITAL_STATUS_OPTION_VALUES = ["single","married","divorced","widowed"] as const;
const EMPLOYMENT_STATUS_OPTION_VALUES = ["employed","job_search","self_employed","unemployed","student"] as const;
const FINANCIAL_SPONSOR_OPTION_VALUES = ["self","family","employer","other_sponsor","none"] as const;

const OPTION_SETS: Record<string, QuestionOption[]> = {
    VISA_GOAL_OPTIONS: optionsFromValues(VISA_GOAL_OPTION_VALUES),
    STUDY_PROGRAM_OPTIONS: optionsFromValues(STUDY_PROGRAM_OPTION_VALUES),
    INVESTMENT_TYPE_OPTIONS: optionsFromValues(INVESTMENT_TYPE_OPTION_VALUES),
    EB_CATEGORY_OPTIONS: optionsFromValues(EB_CATEGORY_OPTION_VALUES),
    HUMANITARIAN_BASIS_OPTIONS: optionsFromValues(HUMANITARIAN_BASIS_OPTION_VALUES),
    LPR_RELATIONSHIP_OPTIONS: optionsFromValues(LPR_RELATIONSHIP_OPTION_VALUES),
    CURRENT_US_STATUS_OPTIONS: optionsFromValues(CURRENT_US_STATUS_OPTION_VALUES),
    MARITAL_STATUS_OPTIONS: optionsFromValues(MARITAL_STATUS_OPTION_VALUES),
    EMPLOYMENT_STATUS_OPTIONS: optionsFromValues(EMPLOYMENT_STATUS_OPTION_VALUES),
    FINANCIAL_SPONSOR_OPTIONS: optionsFromValues(FINANCIAL_SPONSOR_OPTION_VALUES),
};

export const QUESTION_DEFINITIONS: QuestionDefinition[] = [
    {
        key: 'visa_goal',
        section: 'goal',
        type: 'select',
        required: true,
        options: OPTION_SETS['VISA_GOAL_OPTIONS'],
    },
    {
        key: 'investment_type',
        section: 'goal',
        type: 'select',
        required: true,
        options: OPTION_SETS['INVESTMENT_TYPE_OPTIONS'],
        conditions: [{ field: 'visa_goal', operator: 'eq', value: 'investment' }],
    },
    {
        key: 'eb_immigrant_category',
        section: 'goal',
        type: 'select',
        required: true,
        options: OPTION_SETS['EB_CATEGORY_OPTIONS'],
        conditions: [{ field: 'visa_goal', operator: 'eq', value: 'immigrant_employment' }],
    },
    {
        key: 'dv_lottery_selected',
        section: 'goal',
        type: 'boolean',
        conditions: [{ field: 'visa_goal', operator: 'eq', value: 'dv_lottery' }],
    },
    {
        key: 'had_permanent_residence',
        section: 'goal',
        type: 'boolean',
        conditions: [{ field: 'visa_goal', operator: 'eq', value: 'returning_resident' }],
    },
    {
        key: 'us_citizen_fiance',
        section: 'goal',
        type: 'boolean',
        conditions: [{ field: 'visa_goal', operator: 'eq', value: 'family' }],
    },
    {
        key: 'us_citizen_spouse',
        section: 'goal',
        type: 'boolean',
        conditions: [{ field: 'visa_goal', operator: 'eq', value: 'family' }],
    },
    {
        key: 'lpr_family_relationship',
        section: 'goal',
        type: 'select',
        required: true,
        options: OPTION_SETS['LPR_RELATIONSHIP_OPTIONS'],
        conditions: [{ field: 'visa_goal', operator: 'eq', value: 'family_lpr' }],
    },
    {
        key: 'citizenship',
        section: 'citizenship',
        type: 'text',
        required: true,
    },
    {
        key: 'dual_citizenship',
        section: 'citizenship',
        type: 'boolean',
    },
    {
        key: 'second_citizenship',
        section: 'citizenship',
        type: 'text',
        conditions: [{ field: 'dual_citizenship', operator: 'eq', value: true }],
    },
    {
        key: 'current_us_status',
        section: 'citizenship',
        type: 'select',
        options: OPTION_SETS['CURRENT_US_STATUS_OPTIONS'],
    },
    {
        key: 'full_name',
        section: 'personal',
        type: 'text',
        required: true,
    },
    {
        key: 'date_of_birth',
        section: 'personal',
        type: 'date',
        required: true,
    },
    {
        key: 'marital_status',
        section: 'personal',
        type: 'select',
        required: true,
        options: OPTION_SETS['MARITAL_STATUS_OPTIONS'],
    },
    {
        key: 'has_dependents',
        section: 'personal',
        type: 'boolean',
    },
    {
        key: 'dependents_count',
        section: 'personal',
        type: 'number',
        conditions: [{ field: 'has_dependents', operator: 'eq', value: true }],
    },
    {
        key: 'residence_country',
        section: 'residence',
        type: 'text',
        required: true,
    },
    {
        key: 'planned_us_state',
        section: 'residence',
        type: 'text',
    },
    {
        key: 'planned_us_city',
        section: 'residence',
        type: 'text',
    },
    {
        key: 'employment_status',
        section: 'employment',
        type: 'select',
        required: true,
        options: OPTION_SETS['EMPLOYMENT_STATUS_OPTIONS'],
        conditions: [{ field: 'visa_goal', operator: 'in', value: [...WORK_VISA_NO_OFFER_GOALS, 'work_has_offer'] }],
    },
    {
        key: 'has_us_job_offer',
        section: 'employment',
        type: 'boolean',
        conditions: [{ field: 'visa_goal', operator: 'eq', value: 'work_has_offer' }],
    },
    {
        key: 'job_requires_degree',
        section: 'employment',
        type: 'boolean',
        conditions: [{ field: 'has_us_job_offer', operator: 'eq', value: true }],
    },
    {
        key: 'intracompany_transfer',
        section: 'employment',
        type: 'boolean',
        conditions: [{ field: 'has_us_job_offer', operator: 'eq', value: true }],
    },
    {
        key: 'l1_qualifying_employment',
        section: 'employment',
        type: 'boolean',
        conditions: [{ field: 'visa_goal', operator: 'eq', value: 'work_seeking_l1' }],
    },
    {
        key: 'extraordinary_ability',
        section: 'employment',
        type: 'boolean',
        conditions: [{ field: 'visa_goal', operator: 'in', value: ['work_has_offer', 'work_seeking_h1b', 'work_seeking', 'work_seeking_o1', 'performing_artist'] }],
    },
    {
        key: 'has_university_degree',
        section: 'education',
        type: 'boolean',
    },
    {
        key: 'degree_evaluated',
        section: 'education',
        type: 'boolean',
        conditions: [{ field: 'has_university_degree', operator: 'eq', value: true }],
    },
    {
        key: 'study_program_type',
        section: 'education',
        type: 'select',
        required: true,
        options: OPTION_SETS['STUDY_PROGRAM_OPTIONS'],
        conditions: [{ field: 'visa_goal', operator: 'eq', value: 'study' }],
    },
    {
        key: 'has_i20',
        section: 'education',
        type: 'boolean',
        conditions: [
            { field: 'visa_goal', operator: 'eq', value: 'study' },
            { field: 'study_program_type', operator: 'in', value: ['academic', 'vocational'] },
        ],
    },
    {
        key: 'has_ds2019',
        section: 'education',
        type: 'boolean',
        conditionsOr: [
            [{ field: 'visa_goal', operator: 'eq', value: 'cultural_exchange' }],
            [
                { field: 'visa_goal', operator: 'eq', value: 'study' },
                { field: 'study_program_type', operator: 'eq', value: 'exchange' },
            ],
        ],
    },
    {
        key: 'humanitarian_basis',
        section: 'humanitarian',
        type: 'select',
        required: true,
        options: OPTION_SETS['HUMANITARIAN_BASIS_OPTIONS'],
        conditions: [{ field: 'visa_goal', operator: 'eq', value: 'humanitarian' }],
    },
    {
        key: 'life_threat',
        section: 'humanitarian',
        type: 'boolean',
        conditions: [
            { field: 'visa_goal', operator: 'eq', value: 'humanitarian' },
            { field: 'humanitarian_basis', operator: 'in', value: ['asylum', 'tps'] },
        ],
    },
    {
        key: 'persecution',
        section: 'humanitarian',
        type: 'boolean',
        conditions: [
            { field: 'visa_goal', operator: 'eq', value: 'humanitarian' },
            { field: 'humanitarian_basis', operator: 'eq', value: 'asylum' },
        ],
    },
    {
        key: 'gender_violence',
        section: 'humanitarian',
        type: 'boolean',
        conditions: [
            { field: 'visa_goal', operator: 'eq', value: 'humanitarian' },
            { field: 'humanitarian_basis', operator: 'in', value: ['asylum', 'u_visa'] },
        ],
    },
    {
        key: 'crime_victim',
        section: 'humanitarian',
        type: 'boolean',
        conditions: [
            { field: 'visa_goal', operator: 'eq', value: 'humanitarian' },
            { field: 'humanitarian_basis', operator: 'eq', value: 'u_visa' },
        ],
    },
    {
        key: 'crime_victim_cooperation',
        section: 'humanitarian',
        type: 'boolean',
        conditions: [
            { field: 'visa_goal', operator: 'eq', value: 'humanitarian' },
            { field: 'humanitarian_basis', operator: 'eq', value: 'u_visa' },
        ],
    },
    {
        key: 'trafficking_victim',
        section: 'humanitarian',
        type: 'boolean',
        conditions: [
            { field: 'visa_goal', operator: 'eq', value: 'humanitarian' },
            { field: 'humanitarian_basis', operator: 'eq', value: 't_visa' },
        ],
    },
    {
        key: 'deportation_risk',
        section: 'humanitarian',
        type: 'boolean',
        conditions: [{ field: 'visa_goal', operator: 'eq', value: 'humanitarian' }],
    },
    {
        key: 'chronic_conditions',
        section: 'health',
        type: 'boolean',
    },
    {
        key: 'disability',
        section: 'health',
        type: 'boolean',
    },
    {
        key: 'prior_visa_denial',
        section: 'history',
        type: 'boolean',
    },
    {
        key: 'prior_overstay',
        section: 'history',
        type: 'boolean',
    },
    {
        key: 'overstay_days',
        section: 'history',
        type: 'number',
        conditions: [{ field: 'prior_overstay', operator: 'eq', value: true }],
    },
    {
        key: 'prior_deportation',
        section: 'history',
        type: 'boolean',
    },
    {
        key: 'financial_sponsor',
        section: 'finance',
        type: 'select',
        required: true,
        options: OPTION_SETS['FINANCIAL_SPONSOR_OPTIONS'],
    },
    {
        key: 'annual_income_usd',
        section: 'finance',
        type: 'number',
    },
];

/** Derive travel_purpose and related flags from visa_goal before eligibility evaluation */
export function normalizeQuestionnaireAnswers(data: QuestionnaireAnswers): QuestionnaireAnswers {
    const goal = data.visa_goal;
    let normalized = { ...data };

    if (goal === 'work_has_offer') {
        normalized = { ...normalized, travel_purpose: 'work', has_us_job_offer: true, wants_to_study: false };
    } else if (goal === 'study') {
        const isExchange = data.study_program_type === 'exchange';
        normalized = {
            ...normalized,
            travel_purpose: 'study',
            wants_to_study: true,
            has_us_job_offer: false,
            exchange_program: isExchange,
        };
    } else if (isWorkVisaNoOfferGoal(goal)) {
        normalized = { ...normalized, travel_purpose: 'work', has_us_job_offer: false, wants_to_study: false };
    } else {
        const purposeMap: Partial<Record<VisaGoal, QuestionnaireAnswers['travel_purpose']>> = {
            tourism: 'tourism',
            business_visit: 'business_visit',
            medical: 'medical',
            transit: 'transit',
            cultural_exchange: 'cultural_exchange',
            performing_artist: 'performing',
            media_journalist: 'media',
            religious_worker: 'religious',
            family: 'family',
            family_lpr: 'family_lpr',
            adoption: 'adoption',
            investment: 'investment',
            immigrant_employment: 'immigrant',
            dv_lottery: 'dv_lottery',
            returning_resident: 'returning_resident',
            diplomat_official: 'official',
            international_org: 'international_org',
            crewmember: 'crewmember',
            border_crossing: 'tourism',
            humanitarian: 'humanitarian',
        };

        normalized = {
            ...normalized,
            travel_purpose: purposeMap[goal] ?? data.travel_purpose,
            has_us_job_offer: false,
            wants_to_study: false,
        };
    }

    if (goal === 'cultural_exchange') {
        normalized.exchange_program = true;
    }

    return normalized;
}
