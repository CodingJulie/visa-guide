import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UpdatePasswordPage from './page';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('UpdatePasswordPage', () => {
    const mockPush = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({ push: mockPush });
    });

    it('updates password when fields match', async () => {
        const user = userEvent.setup();
        vi.mocked(supabase.auth.updateUser).mockResolvedValue({ data: { user: { id: '1' } as never }, error: null });

        render(<UpdatePasswordPage />);
        await screen.findByRole('heading', { name: /update_password_title/i });

        await user.type(screen.getByLabelText(/^password$/i), 'password123');
        await user.type(screen.getByLabelText(/confirm_password/i), 'password123');
        await user.click(screen.getByRole('button', { name: /update_password_submit/i }));

        await screen.findByText(/update_password_success/i);
        await waitFor(() => {
            expect(supabase.auth.updateUser).toHaveBeenCalledWith({ password: 'password123' });
        });
    });

    it('shows error when passwords do not match', async () => {
        const user = userEvent.setup();
        render(<UpdatePasswordPage />);
        await screen.findByRole('heading', { name: /update_password_title/i });

        await user.type(screen.getByLabelText(/^password$/i), 'password123');
        await user.type(screen.getByLabelText(/confirm_password/i), 'password456');
        await user.click(screen.getByRole('button', { name: /update_password_submit/i }));

        await screen.findByText(/update_password_mismatch/i);
    });
});
