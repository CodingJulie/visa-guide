import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

describe('LanguageSwitcher', () => {
    it('renders EN and RU buttons with accessible labels', () => {
        render(<LanguageSwitcher />);
        expect(screen.getByRole('button', { name: 'lang_switch_en' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'lang_switch_ru' })).toBeInTheDocument();
    });

    it('active button has blue class', () => {
        render(<LanguageSwitcher />);
        const enBtn = screen.getByRole('button', { name: 'lang_switch_en' });
        expect(enBtn).toHaveClass('bg-blue-600');
    });
});
