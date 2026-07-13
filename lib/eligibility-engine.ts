import { PHASE2_ELIGIBILITY_RULES } from '@/lib/phase2-visas';

export type Answers = Record<string, unknown>;

export type Confidence = 'high' | 'medium' | 'low';

export interface EligibilityRule {
    id: string;
    visaType: string;
    weight: number;
    required?: boolean;
    conditions: RuleCondition[];
    blockers?: RuleCondition[];
    lawyerRequired?: boolean;
}

export interface RuleCondition {
    field: string;
    operator: 'eq' | 'neq' | 'in' | 'not_in' | 'gt' | 'gte' | 'lt' | 'exists' | 'not_exists';
    value?: unknown;
}

export interface Recommendation {
    visaType: string;
    confidence: Confidence;
    score: number;
    alternatives: string[];
    blockers: string[];
    lawyerRequired: boolean;
    reasons: string[];
}

export interface EligibilityResult {
    primary: Recommendation | null;
    all: Recommendation[];
}

function getFieldValue(answers: Answers, field: string): unknown {
    return answers[field];
}

export function evaluateCondition(answers: Answers, condition: RuleCondition): boolean {
    const value = getFieldValue(answers, condition.field);

    switch (condition.operator) {
        case 'eq':
            return value === condition.value;
        case 'neq':
            return value !== condition.value;
        case 'in':
            return Array.isArray(condition.value) && condition.value.includes(value);
        case 'not_in':
            return Array.isArray(condition.value) && !condition.value.includes(value);
        case 'gt':
            return typeof value === 'number' && typeof condition.value === 'number' && value > condition.value;
        case 'gte':
            return typeof value === 'number' && typeof condition.value === 'number' && value >= condition.value;
        case 'lt':
            return typeof value === 'number' && typeof condition.value === 'number' && value < condition.value;
        case 'exists':
            return value !== undefined && value !== null && value !== '';
        case 'not_exists':
            return value === undefined || value === null || value === '';
        default:
            return false;
    }
}

export function evaluateConditions(answers: Answers, conditions: RuleCondition[]): boolean {
    if (conditions.length === 0) return true;
    return conditions.every((c) => evaluateCondition(answers, c));
}

function scoreToConfidence(score: number, maxScore: number): Confidence {
    const ratio = maxScore > 0 ? score / maxScore : 0;
    if (ratio >= 0.85) return 'high';
    if (ratio >= 0.55) return 'medium';
    return 'low';
}

function buildPrimaryResult(
    visaType: string,
    alternatives: string[],
    lawyerRequired: boolean,
    reasons: string[]
): EligibilityResult {
    const primary: Recommendation = {
        visaType,
        confidence: 'high',
        score: 100,
        alternatives,
        blockers: [],
        lawyerRequired,
        reasons,
    };
    return { primary, all: [primary] };
}

export function evaluateEligibility(answers: Answers, rules: EligibilityRule[]): EligibilityResult {
    const basis = answers.humanitarian_basis as string | undefined;

    if (basis === 't_visa' && answers.trafficking_victim === true) {
        return buildPrimaryResult('T', ['ASYLUM', 'U'], true, ['humanitarian_trafficking']);
    }

    if (basis === 'u_visa' && (answers.crime_victim === true || answers.gender_violence === true)) {
        return buildPrimaryResult('U', ['ASYLUM', 'TPS'], true, ['humanitarian_u_visa']);
    }

    const asylumFlags = [
        answers.life_threat === true,
        answers.persecution === true,
        answers.gender_violence === true && basis !== 'u_visa',
        answers.deportation_risk === true,
    ];

    if (asylumFlags.some(Boolean) && basis !== 'tps') {
        return buildPrimaryResult('ASYLUM', ['TPS', 'U'], true, ['humanitarian_case']);
    }

    if (basis === 'tps' && answers.life_threat === true) {
        return buildPrimaryResult('TPS', ['ASYLUM'], true, ['humanitarian_tps']);
    }

    const scored: Recommendation[] = [];

    for (const rule of rules) {
        const blockers = (rule.blockers ?? [])
            .filter((b) => evaluateCondition(answers, b))
            .map((b) => `${b.field}:${b.operator}`);

        if (blockers.length > 0) {
            scored.push({
                visaType: rule.visaType,
                confidence: 'low',
                score: 0,
                alternatives: [],
                blockers,
                lawyerRequired: rule.lawyerRequired ?? false,
                reasons: ['blocked'],
            });
            continue;
        }

        const matches = evaluateConditions(answers, rule.conditions);
        if (!matches) continue;

        const score = rule.weight;
        scored.push({
            visaType: rule.visaType,
            confidence: scoreToConfidence(score, rule.weight),
            score,
            alternatives: [],
            blockers: [],
            lawyerRequired: rule.lawyerRequired ?? false,
            reasons: ['matched_rules'],
        });
    }

    scored.sort((a, b) => b.score - a.score);

    const viable = scored.filter((s) => s.blockers.length === 0 && s.score > 0);

    for (const rec of viable) {
        rec.alternatives = viable
            .filter((v) => v.visaType !== rec.visaType)
            .slice(0, 3)
            .map((v) => v.visaType);
    }

    return {
        primary: viable[0] ?? null,
        all: scored,
    };
}

export const MVP_ELIGIBILITY_RULES: EligibilityRule[] = [
    {
        id: 'b1b2-tourism',
        visaType: 'B-1/B-2',
        weight: 80,
        conditions: [
            { field: 'travel_purpose', operator: 'in', value: ['tourism', 'business_visit', 'medical', 'transit'] },
            { field: 'has_us_job_offer', operator: 'eq', value: false },
            { field: 'wants_to_study', operator: 'eq', value: false },
        ],
        blockers: [
            { field: 'prior_deportation', operator: 'eq', value: true },
        ],
    },
    {
        id: 'f1-student',
        visaType: 'F-1',
        weight: 90,
        conditions: [
            { field: 'wants_to_study', operator: 'eq', value: true },
            { field: 'study_program_type', operator: 'eq', value: 'academic' },
            { field: 'has_i20', operator: 'eq', value: true },
        ],
        blockers: [
            { field: 'prior_deportation', operator: 'eq', value: true },
        ],
    },
    {
        id: 'h1b-work-seeking',
        visaType: 'H-1B',
        weight: 45,
        lawyerRequired: true,
        conditions: [
            { field: 'visa_goal', operator: 'in', value: ['work_seeking_h1b', 'work_seeking'] },
        ],
        blockers: [
            { field: 'prior_deportation', operator: 'eq', value: true },
        ],
    },
    {
        id: 'l1-work-seeking',
        visaType: 'L-1',
        weight: 40,
        lawyerRequired: true,
        conditions: [
            { field: 'visa_goal', operator: 'eq', value: 'work_seeking_l1' },
        ],
        blockers: [
            { field: 'prior_deportation', operator: 'eq', value: true },
        ],
    },
    {
        id: 'o1-work-seeking',
        visaType: 'O-1',
        weight: 40,
        lawyerRequired: true,
        conditions: [
            { field: 'visa_goal', operator: 'eq', value: 'work_seeking_o1' },
        ],
        blockers: [
            { field: 'prior_deportation', operator: 'eq', value: true },
        ],
    },
    {
        id: 'h1b-work',
        visaType: 'H-1B',
        weight: 95,
        lawyerRequired: true,
        conditions: [
            { field: 'travel_purpose', operator: 'eq', value: 'work' },
            { field: 'has_us_job_offer', operator: 'eq', value: true },
            { field: 'job_requires_degree', operator: 'eq', value: true },
        ],
        blockers: [
            { field: 'prior_deportation', operator: 'eq', value: true },
        ],
    },
    {
        id: 'l1-transfer',
        visaType: 'L-1',
        weight: 85,
        conditions: [
            { field: 'travel_purpose', operator: 'eq', value: 'work' },
            { field: 'has_us_job_offer', operator: 'eq', value: true },
            { field: 'intracompany_transfer', operator: 'eq', value: true },
        ],
    },
    {
        id: 'o1-extraordinary',
        visaType: 'O-1',
        weight: 80,
        lawyerRequired: true,
        conditions: [
            { field: 'travel_purpose', operator: 'eq', value: 'work' },
            { field: 'extraordinary_ability', operator: 'eq', value: true },
        ],
    },
    {
        id: 'k1-fiance',
        visaType: 'K-1',
        weight: 90,
        conditions: [
            { field: 'travel_purpose', operator: 'eq', value: 'family' },
            { field: 'us_citizen_fiance', operator: 'eq', value: true },
        ],
    },
    {
        id: 'j1-exchange',
        visaType: 'J-1',
        weight: 75,
        conditions: [
            { field: 'exchange_program', operator: 'eq', value: true },
        ],
    },
    {
        id: 'ir-spouse',
        visaType: 'IR1/CR1',
        weight: 92,
        lawyerRequired: true,
        conditions: [
            { field: 'travel_purpose', operator: 'eq', value: 'family' },
            { field: 'us_citizen_spouse', operator: 'eq', value: true },
        ],
    },
];

export const DEFAULT_ELIGIBILITY_RULES: EligibilityRule[] = [
    ...MVP_ELIGIBILITY_RULES,
    ...PHASE2_ELIGIBILITY_RULES,
];
