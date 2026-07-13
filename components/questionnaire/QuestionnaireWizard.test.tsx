import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import QuestionnaireWizard from '@/components/questionnaire/QuestionnaireWizard';
import { questionLabelKey } from '@/lib/questionnaire-i18n';

describe('QuestionnaireWizard', () => {
    it('renders section progress and navigation buttons', () => {
        render(<QuestionnaireWizard />);
        expect(screen.getByText(/questionnaire_section_of/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'questionnaire_back' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'questionnaire_next' })).toBeInTheDocument();
    });

    it('renders first section question', () => {
        render(<QuestionnaireWizard />);
        expect(screen.getByLabelText(new RegExp(questionLabelKey('visa_goal')))).toBeInTheDocument();
    });
});
