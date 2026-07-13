import type { ChecklistItemStatus } from '@/components/checklist/DocumentChecklist';

const PREFIX = 'visaguide-local-progress';

function checklistKey(caseId: string) {
    return `${PREFIX}:checklist:${caseId}`;
}

function guideKey(scopeId: string) {
    return `${PREFIX}:guide:${scopeId}`;
}

export function loadLocalChecklistItems(caseId: string): Record<string, ChecklistItemStatus> {
    if (typeof window === 'undefined') return {};

    try {
        const raw = localStorage.getItem(checklistKey(caseId));
        return raw ? (JSON.parse(raw) as Record<string, ChecklistItemStatus>) : {};
    } catch {
        return {};
    }
}

export function saveLocalChecklistItem(
    caseId: string,
    docId: string,
    status: ChecklistItemStatus,
): Record<string, ChecklistItemStatus> {
    const current = loadLocalChecklistItems(caseId);
    const next = { ...current, [docId]: status };

    localStorage.setItem(checklistKey(caseId), JSON.stringify(next));
    return next;
}

export function loadLocalCompletedSteps(scopeId: string): Set<string> {
    if (typeof window === 'undefined') return new Set();

    try {
        const raw = localStorage.getItem(guideKey(scopeId));
        return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
    } catch {
        return new Set();
    }
}

export function toggleLocalCompletedStep(scopeId: string, stepId: string): Set<string> {
    const current = loadLocalCompletedSteps(scopeId);
    const next = new Set(current);

    if (next.has(stepId)) {
        next.delete(stepId);
    } else {
        next.add(stepId);
    }

    localStorage.setItem(guideKey(scopeId), JSON.stringify([...next]));
    return next;
}
