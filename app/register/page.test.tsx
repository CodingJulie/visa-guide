import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterPage from './page';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('RegisterPage', () => {
    const mockPush = vi.fn();
    const mockRefresh = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({ push: mockPush, refresh: mockRefresh });
    });

    it('registers successfully with session', async () => {
        const user = userEvent.setup();
        vi.mocked(supabase.auth.signUp).mockResolvedValue({
            data: {
                user: { id: '1', identities: [{ id: '1' }] } as never,
                session: { user: { id: '1' } } as never,
            },
            error: null,
        });

        render(<RegisterPage />);
        await screen.findByRole('heading', { name: /register_to_app/i });

        await user.type(screen.getByLabelText(/full_name/i), 'Test User');
        await user.type(screen.getByLabelText(/email/i), 'test@example.com');
        await user.type(screen.getByLabelText(/^password$/i), 'password123');
        await user.click(screen.getByRole('button', { name: /register/i }));

        await waitFor(() => {
            expect(mockRefresh).toHaveBeenCalled();
            expect(mockPush).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('shows email confirmation message without session', async () => {
        const user = userEvent.setup();
        vi.mocked(supabase.auth.signUp).mockResolvedValue({
            data: {
                user: { id: '1', identities: [{ id: '1' }] } as never,
                session: null,
            },
            error: null,
        });

        render(<RegisterPage />);
        await screen.findByRole('heading', { name: /register_to_app/i });

        await user.type(screen.getByLabelText(/full_name/i), 'Test User');
        await user.type(screen.getByLabelText(/email/i), 'test@example.com');
        await user.type(screen.getByLabelText(/^password$/i), 'password123');
        await user.click(screen.getByRole('button', { name: /register/i }));

        await screen.findByText(/register_success_confirm_email/i);
    });
});
