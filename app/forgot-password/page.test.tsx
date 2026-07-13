import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ForgotPasswordPage from './page';
import { supabase } from '@/lib/supabase';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('ForgotPasswordPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('sends password reset email', async () => {
        const user = userEvent.setup();
        vi.mocked(supabase.auth.resetPasswordForEmail).mockResolvedValue({ data: {}, error: null });

        render(<ForgotPasswordPage />);

        await user.type(screen.getByLabelText(/email/i), 'test@example.com');
        await user.click(screen.getByRole('button', { name: /Send reset link/i }));

        expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalled();
        await screen.findByText(/Check your email/i);
    });
});
