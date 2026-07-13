export type StoryOutcome = 'approved' | 'denied' | 'pending' | 'mixed';

export interface CaseStory {
    id: string;
    slug: string;
    title_en: string;
    title_ru: string;
    summary_en: string;
    summary_ru: string;
    story_en: string;
    story_ru: string;
    person_alias_en: string;
    person_alias_ru: string;
    origin_country: string;
    visa_types: string[];
    tags: string[];
    outcome: StoryOutcome;
    is_complex: boolean;
    lawyer_involved: boolean;
    duration_months: number | null;
    lessons_learned_en: string | null;
    lessons_learned_ru: string | null;
    key_takeaways_en: string[];
    key_takeaways_ru: string[];
    published_at: string | null;
}

export const STORY_OUTCOME_LABELS: Record<StoryOutcome, { en: string; ru: string }> = {
    approved: { en: 'Approved', ru: 'Одобрено' },
    denied: { en: 'Denied', ru: 'Отказ' },
    pending: { en: 'Pending', ru: 'В процессе' },
    mixed: { en: 'Mixed outcome', ru: 'Смешанный исход' },
};

export const OUTCOME_VARIANT: Record<StoryOutcome, 'default' | 'destructive' | 'secondary' | 'outline'> = {
    approved: 'default',
    denied: 'destructive',
    pending: 'secondary',
    mixed: 'outline',
};
