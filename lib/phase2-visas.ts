/**
 * Phase 2 visa templates — eligibility rules and CMS seed data.
 * MVP ships B-1/B-2, F-1, H-1B fully populated.
 * These rules activate when users match Phase 2 criteria.
 * Full step/document content is added via Admin CMS (see supabase/seed.sql drafts).
 */
import type { EligibilityRule } from '@/lib/eligibility-engine';

export const PHASE2_ELIGIBILITY_RULES: EligibilityRule[] = [
    {
        id: 'c-transit',
        visaType: 'C',
        weight: 85,
        conditions: [
            { field: 'visa_goal', operator: 'eq', value: 'transit' },
        ],
    },
    {
        id: 'h2a-seasonal-ag',
        visaType: 'H-2A',
        weight: 85,
        conditions: [
            { field: 'visa_goal', operator: 'eq', value: 'work_seasonal_ag' },
        ],
    },
    {
        id: 'h2b-seasonal-temp',
        visaType: 'H-2B',
        weight: 85,
        conditions: [
            { field: 'visa_goal', operator: 'eq', value: 'work_seasonal_temp' },
        ],
    },
    {
        id: 'h3-training',
        visaType: 'H-3',
        weight: 80,
        conditions: [
            { field: 'visa_goal', operator: 'eq', value: 'work_training' },
        ],
    },
    {
        id: 'e3-australian',
        visaType: 'E-3',
        weight: 85,
        conditions: [
            { field: 'visa_goal', operator: 'in', value: ['australian_professional', 'work_seeking_e3'] },
        ],
    },
    {
        id: 'cw1-cnmi',
        visaType: 'CW-1',
        weight: 80,
        conditions: [
            { field: 'visa_goal', operator: 'eq', value: 'cnmi_worker' },
        ],
    },
    {
        id: 'q-cultural-exchange',
        visaType: 'Q',
        weight: 80,
        conditions: [
            { field: 'visa_goal', operator: 'eq', value: 'cultural_exchange' },
        ],
    },
    {
        id: 'p-performing',
        visaType: 'P',
        weight: 85,
        conditions: [
            { field: 'visa_goal', operator: 'eq', value: 'performing_artist' },
        ],
    },
    {
        id: 'i-media',
        visaType: 'I',
        weight: 85,
        conditions: [
            { field: 'visa_goal', operator: 'eq', value: 'media_journalist' },
        ],
    },
    {
        id: 'r-religious',
        visaType: 'R',
        weight: 85,
        lawyerRequired: true,
        conditions: [
            { field: 'visa_goal', operator: 'eq', value: 'religious_worker' },
        ],
    },
    {
        id: 'v-lpr-family',
        visaType: 'V',
        weight: 85,
        conditions: [
            { field: 'visa_goal', operator: 'eq', value: 'family_lpr' },
        ],
    },
    {
        id: 'f2-lpr-family',
        visaType: 'F2A/F2B',
        weight: 80,
        conditions: [
            { field: 'visa_goal', operator: 'eq', value: 'family_lpr' },
        ],
    },
    {
        id: 'adoption-immigrant',
        visaType: 'IR3/IH3',
        weight: 90,
        lawyerRequired: true,
        conditions: [
            { field: 'visa_goal', operator: 'eq', value: 'adoption' },
        ],
    },
    {
        id: 'a-diplomat',
        visaType: 'A',
        weight: 90,
        conditions: [
            { field: 'visa_goal', operator: 'eq', value: 'diplomat_official' },
        ],
    },
    {
        id: 'g-international-org',
        visaType: 'G',
        weight: 90,
        conditions: [
            { field: 'visa_goal', operator: 'eq', value: 'international_org' },
        ],
    },
    {
        id: 'd-crewmember',
        visaType: 'D',
        weight: 85,
        conditions: [
            { field: 'visa_goal', operator: 'eq', value: 'crewmember' },
        ],
    },
    {
        id: 'bcc-mexico',
        visaType: 'BCC',
        weight: 80,
        conditions: [
            { field: 'visa_goal', operator: 'eq', value: 'border_crossing' },
        ],
    },
    {
        id: 'sb-returning-resident',
        visaType: 'SB',
        weight: 85,
        lawyerRequired: true,
        conditions: [
            { field: 'visa_goal', operator: 'eq', value: 'returning_resident' },
        ],
    },
    {
        id: 'eb-immigrant-employment',
        visaType: 'EB-1',
        weight: 75,
        lawyerRequired: true,
        conditions: [
            { field: 'eb_immigrant_category', operator: 'eq', value: 'eb1' },
        ],
    },
    {
        id: 'eb3-employment',
        visaType: 'EB-3',
        weight: 72,
        lawyerRequired: true,
        conditions: [
            { field: 'eb_immigrant_category', operator: 'eq', value: 'eb3' },
        ],
    },
    {
        id: 'tn-nafta',
        visaType: 'TN',
        weight: 85,
        conditions: [
            { field: 'visa_goal', operator: 'in', value: ['usmca_professional', 'work_seeking_tn'] },
        ],
    },
    {
        id: 'tn-nafta-citizenship',
        visaType: 'TN',
        weight: 80,
        conditions: [
            { field: 'travel_purpose', operator: 'eq', value: 'work' },
            { field: 'citizenship', operator: 'in', value: ['Canada', 'Mexico', 'CA', 'MX'] },
        ],
    },
    {
        id: 'e1-treaty-trader',
        visaType: 'E-1',
        weight: 82,
        lawyerRequired: true,
        conditions: [
            { field: 'investment_type', operator: 'eq', value: 'treaty_trader' },
        ],
    },
    {
        id: 'e2-investor',
        visaType: 'E-2',
        weight: 80,
        lawyerRequired: true,
        conditions: [
            { field: 'investment_type', operator: 'eq', value: 'treaty_investor' },
        ],
    },
    {
        id: 'eb5-investor',
        visaType: 'EB-5',
        weight: 78,
        lawyerRequired: true,
        conditions: [
            { field: 'eb_immigrant_category', operator: 'eq', value: 'eb5' },
        ],
    },
    {
        id: 'm1-vocational',
        visaType: 'M-1',
        weight: 75,
        conditions: [
            { field: 'study_program_type', operator: 'eq', value: 'vocational' },
        ],
        blockers: [
            { field: 'prior_deportation', operator: 'eq', value: true },
        ],
    },
    {
        id: 'eb2-employment',
        visaType: 'EB-2',
        weight: 75,
        lawyerRequired: true,
        conditions: [
            { field: 'eb_immigrant_category', operator: 'eq', value: 'eb2' },
        ],
    },
    {
        id: 'eb2-employment-offer',
        visaType: 'EB-2',
        weight: 74,
        lawyerRequired: true,
        conditions: [
            { field: 'travel_purpose', operator: 'eq', value: 'work' },
            { field: 'has_us_job_offer', operator: 'eq', value: true },
            { field: 'job_requires_degree', operator: 'eq', value: true },
        ],
    },
    {
        id: 'dv-lottery',
        visaType: 'DV',
        weight: 85,
        conditions: [
            { field: 'visa_goal', operator: 'eq', value: 'dv_lottery' },
            { field: 'dv_lottery_selected', operator: 'eq', value: true },
        ],
    },
    {
        id: 'dv-lottery-prep',
        visaType: 'DV',
        weight: 55,
        conditions: [
            { field: 'visa_goal', operator: 'eq', value: 'dv_lottery' },
        ],
    },
    {
        id: 'h1b1-chile-singapore',
        visaType: 'H-1B1',
        weight: 82,
        conditions: [
            { field: 'travel_purpose', operator: 'eq', value: 'work' },
            { field: 'has_us_job_offer', operator: 'eq', value: true },
            { field: 'citizenship', operator: 'in', value: ['Chile', 'Singapore', 'CL', 'SG'] },
        ],
    },
];

export const ALL_VISA_CODES = [
    'B-1/B-2', 'F-1', 'H-1B', 'H-1B1',
    'L-1', 'O-1', 'K-1', 'J-1', 'M-1', 'TN', 'E-1', 'E-2', 'E-3',
    'H-2A', 'H-2B', 'H-3', 'P', 'I', 'R', 'Q', 'C', 'D', 'A', 'G', 'V', 'BCC', 'CW-1',
    'ASYLUM', 'TPS', 'U', 'T', 'EB-1', 'EB-2', 'EB-3', 'EB-5', 'DV', 'SB', 'IR1/CR1', 'IR3/IH3', 'F2A/F2B',
] as const;

export type VisaCode = typeof ALL_VISA_CODES[number];
