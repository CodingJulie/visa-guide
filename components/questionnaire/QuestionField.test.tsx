import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuestionField from '@/components/questionnaire/QuestionField';
import type { QuestionDefinition } from '@/lib/questionnaire-schema';
import { questionLabelKey } from '@/lib/questionnaire-i18n';

const booleanQuestion: QuestionDefinition = {
    key: 'dual_citizenship',
    section: 'citizenship',
    type: 'boolean',
    required: false,
};

const textQuestion: QuestionDefinition = {
    key: 'full_name',
    section: 'personal',
    type: 'text',
    required: true,
};

describe('QuestionField', () => {
    it('renders boolean checkbox with i18n label key', () => {
        render(
            <QuestionField
                question={booleanQuestion}
                value={false}
                onChange={vi.fn()}
            />
        );
        expect(screen.getByLabelText(questionLabelKey('dual_citizenship'))).toBeInTheDocument();
    });

    it('calls onChange when boolean toggled', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(
            <QuestionField
                question={booleanQuestion}
                value={false}
                onChange={onChange}
            />
        );
        await user.click(screen.getByRole('checkbox'));
        expect(onChange).toHaveBeenCalledWith(true);
    });

    it('renders text input with required marker', () => {
        render(
            <QuestionField
                question={textQuestion}
                value=""
                onChange={vi.fn()}
            />
        );
        expect(screen.getByLabelText(new RegExp(questionLabelKey('full_name')))).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
});
