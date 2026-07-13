import { describe, it, expect } from 'vitest';
import { isQuestionVisible, getAgeFromBirthDate } from '@/lib/conditions';

describe('isQuestionVisible', () => {
    it('shows question without conditions', () => {
        expect(isQuestionVisible({}, undefined)).toBe(true);
        expect(isQuestionVisible({}, [])).toBe(true);
    });

    it('hides question when condition not met', () => {
        expect(isQuestionVisible(
            { dual_citizenship: false },
            [{ field: 'dual_citizenship', operator: 'eq', value: true }]
        )).toBe(false);
    });

    it('shows question when condition met', () => {
        expect(isQuestionVisible(
            { has_us_job_offer: true },
            [{ field: 'has_us_job_offer', operator: 'eq', value: true }]
        )).toBe(true);
    });
});

describe('getAgeFromBirthDate', () => {
    it('calculates age from birth date', () => {
        const birthYear = new Date().getFullYear() - 25;
        const age = getAgeFromBirthDate(`${birthYear}-01-15`);
        expect(age).toBe(25);
    });

    it('returns null for invalid date', () => {
        expect(getAgeFromBirthDate('')).toBeNull();
        expect(getAgeFromBirthDate('invalid')).toBeNull();
    });
});

describe('conditionsOr visibility', () => {
    it('shows question when any OR group matches', () => {
        expect(isQuestionVisible(
            { visa_goal: 'cultural_exchange' },
            undefined,
            [[{ field: 'visa_goal', operator: 'eq', value: 'cultural_exchange' }]]
        )).toBe(true);

        expect(isQuestionVisible(
            { visa_goal: 'study', study_program_type: 'exchange' },
            undefined,
            [[
                { field: 'visa_goal', operator: 'eq', value: 'cultural_exchange' },
            ], [
                { field: 'visa_goal', operator: 'eq', value: 'study' },
                { field: 'study_program_type', operator: 'eq', value: 'exchange' },
            ]]
        )).toBe(true);
    });
});
