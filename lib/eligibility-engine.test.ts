import { describe, it, expect } from 'vitest';
import {
    evaluateEligibility,
    evaluateCondition,
    DEFAULT_ELIGIBILITY_RULES,
} from '@/lib/eligibility-engine';

describe('evaluateCondition', () => {
    it('matches eq operator', () => {
        expect(evaluateCondition({ purpose: 'work' }, { field: 'purpose', operator: 'eq', value: 'work' })).toBe(true);
    });

    it('matches in operator', () => {
        expect(evaluateCondition(
            { purpose: 'tourism' },
            { field: 'purpose', operator: 'in', value: ['tourism', 'business_visit'] }
        )).toBe(true);
    });

    it('matches exists operator', () => {
        expect(evaluateCondition({ name: 'John' }, { field: 'name', operator: 'exists' })).toBe(true);
        expect(evaluateCondition({ name: '' }, { field: 'name', operator: 'exists' })).toBe(false);
    });
});

describe('evaluateEligibility', () => {
    it('recommends B-1/B-2 for tourism', () => {
        const result = evaluateEligibility({
            travel_purpose: 'tourism',
            has_us_job_offer: false,
            wants_to_study: false,
            prior_deportation: false,
        }, DEFAULT_ELIGIBILITY_RULES);

        expect(result.primary?.visaType).toBe('B-1/B-2');
        expect(result.primary?.confidence).toBe('high');
    });

    it('recommends F-1 for student with I-20', () => {
        const result = evaluateEligibility({
            travel_purpose: 'study',
            wants_to_study: true,
            study_program_type: 'academic',
            has_i20: true,
            prior_deportation: false,
        }, DEFAULT_ELIGIBILITY_RULES);

        expect(result.primary?.visaType).toBe('F-1');
    });

    it('recommends H-1B for work with job offer and degree', () => {
        const result = evaluateEligibility({
            travel_purpose: 'work',
            has_us_job_offer: true,
            job_requires_degree: true,
            prior_deportation: false,
        }, DEFAULT_ELIGIBILITY_RULES);

        expect(result.primary?.visaType).toBe('H-1B');
        expect(result.primary?.lawyerRequired).toBe(true);
    });

    it('flags asylum for humanitarian cases', () => {
        const result = evaluateEligibility({
            humanitarian_basis: 'asylum',
            persecution: true,
        }, DEFAULT_ELIGIBILITY_RULES);

        expect(result.primary?.visaType).toBe('ASYLUM');
        expect(result.primary?.lawyerRequired).toBe(true);
    });

    it('recommends T visa for trafficking victims', () => {
        const result = evaluateEligibility({
            humanitarian_basis: 't_visa',
            trafficking_victim: true,
        }, DEFAULT_ELIGIBILITY_RULES);

        expect(result.primary?.visaType).toBe('T');
    });

    it('recommends IR1/CR1 for US citizen spouse', () => {
        const result = evaluateEligibility({
            travel_purpose: 'family',
            us_citizen_spouse: true,
            prior_deportation: false,
        }, DEFAULT_ELIGIBILITY_RULES);

        expect(result.all.some((r) => r.visaType === 'IR1/CR1' && r.score > 0)).toBe(true);
    });

    it('blocks visa with prior deportation', () => {
        const result = evaluateEligibility({
            travel_purpose: 'tourism',
            has_us_job_offer: false,
            wants_to_study: false,
            prior_deportation: true,
        }, DEFAULT_ELIGIBILITY_RULES);

        const bVisa = result.all.find((r) => r.visaType === 'B-1/B-2');
        expect(bVisa?.blockers.length).toBeGreaterThan(0);
    });

    it('recommends H-1B for work seeking without job offer', () => {
        const result = evaluateEligibility({
            visa_goal: 'work_seeking_h1b',
            travel_purpose: 'work',
            has_us_job_offer: false,
            prior_deportation: false,
        }, DEFAULT_ELIGIBILITY_RULES);

        expect(result.primary?.visaType).toBe('H-1B');
        expect(result.primary?.lawyerRequired).toBe(true);
    });

    it('recommends L-1 for intracompany transfer preparation', () => {
        const result = evaluateEligibility({
            visa_goal: 'work_seeking_l1',
            travel_purpose: 'work',
            has_us_job_offer: false,
            prior_deportation: false,
        }, DEFAULT_ELIGIBILITY_RULES);

        expect(result.primary?.visaType).toBe('L-1');
    });

    it('recommends O-1 for extraordinary ability preparation', () => {
        const result = evaluateEligibility({
            visa_goal: 'work_seeking_o1',
            travel_purpose: 'work',
            has_us_job_offer: false,
            prior_deportation: false,
        }, DEFAULT_ELIGIBILITY_RULES);

        expect(result.primary?.visaType).toBe('O-1');
    });

    it('recommends L-1 for intracompany transfer', () => {
        const result = evaluateEligibility({
            travel_purpose: 'work',
            has_us_job_offer: true,
            job_requires_degree: false,
            intracompany_transfer: true,
            prior_deportation: false,
        }, DEFAULT_ELIGIBILITY_RULES);

        expect(result.all.some((r) => r.visaType === 'L-1' && r.score > 0)).toBe(true);
    });

    it('recommends K-1 for fiancé of US citizen', () => {
        const result = evaluateEligibility({
            travel_purpose: 'family',
            us_citizen_fiance: true,
            prior_deportation: false,
        }, DEFAULT_ELIGIBILITY_RULES);

        expect(result.all.some((r) => r.visaType === 'K-1' && r.score > 0)).toBe(true);
    });
});
