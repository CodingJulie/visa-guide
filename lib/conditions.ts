import { evaluateCondition, type RuleCondition } from '@/lib/eligibility-engine';

export function isQuestionVisible(
    answers: Record<string, unknown>,
    conditions?: RuleCondition[],
    conditionsOr?: RuleCondition[][]
): boolean {
    if (conditionsOr && conditionsOr.length > 0) {
        return conditionsOr.some((group) => group.every((c) => evaluateCondition(answers, c)));
    }
    if (!conditions || conditions.length === 0) return true;
    return conditions.every((c) => evaluateCondition(answers, c));
}

export function getVisibleQuestions<T extends { key: string; conditions?: RuleCondition[]; conditionsOr?: RuleCondition[][] }>(
    questions: T[],
    answers: Record<string, unknown>
): T[] {
    return questions.filter((q) => isQuestionVisible(answers, q.conditions, q.conditionsOr));
}

export function getAgeFromBirthDate(dateStr: string): number | null {
    if (!dateStr) return null;
    const birth = new Date(dateStr);
    if (Number.isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
}

export function evaluateStepCondition(
    answers: Record<string, unknown>,
    conditions?: RuleCondition[] | null
): boolean {
    if (!conditions || conditions.length === 0) return true;
    return conditions.every((c) => evaluateCondition(answers, c));
}
