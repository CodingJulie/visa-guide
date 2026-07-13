import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggle from '@/components/ui/ThemeToggle';

const setTheme = vi.fn();

vi.mock('next-themes', () => ({
    useTheme: vi.fn(() => ({ theme: 'light', resolvedTheme: 'light', setTheme })),
}));

describe('ThemeToggle', () => {
    beforeEach(() => {
        setTheme.mockClear();
    });

    it('renders theme toggle button after mount', async () => {
        render(<ThemeToggle />);
        const button = await screen.findByRole('button');
        expect(button).toBeInTheDocument();
    });

    it('switches to dark theme on click', async () => {
        const user = userEvent.setup();
        render(<ThemeToggle />);
        const button = await screen.findByRole('button');
        await user.click(button);
        expect(setTheme).toHaveBeenCalledWith('dark');
    });
});
