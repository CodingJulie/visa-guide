export function sectionTitleKey(sectionKey: string): string {
    return `questionnaire.sections.${sectionKey}.title`;
}

export function sectionSubtitleKey(sectionKey: string): string {
    return `questionnaire.sections.${sectionKey}.subtitle`;
}

export function questionLabelKey(questionKey: string): string {
    return `questionnaire.questions.${questionKey}.label`;
}

export function questionHelpKey(questionKey: string): string {
    return `questionnaire.questions.${questionKey}.help`;
}

export function optionLabelKey(questionKey: string, optionValue: string): string {
    return `questionnaire.options.${questionKey}.${optionValue}`;
}

export function translateQuestionLabel(
    t: (key: string, options?: { defaultValue?: string }) => string,
    questionKey: string,
): string {
    return t(questionLabelKey(questionKey));
}

export function translateQuestionHelp(
    t: (key: string, options?: { defaultValue?: string }) => string,
    questionKey: string,
): string | undefined {
    const key = questionHelpKey(questionKey);
    const value = t(key, { defaultValue: '' });
    return value || undefined;
}

export function translateOptionLabel(
    t: (key: string) => string,
    questionKey: string,
    optionValue: string,
): string {
    return t(optionLabelKey(questionKey, optionValue));
}
