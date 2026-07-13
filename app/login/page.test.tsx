import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './page';
import { AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('LoginPage', () => {
    const mockPush = vi.fn();
    const mockRefresh = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({ push: mockPush, refresh: mockRefresh });
        vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co');
        vi.stubEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'test-key');
    });

    it('logs in with valid credentials', async () => {
        const user = userEvent.setup();
        render(<LoginPage />);

        await screen.findByRole('heading', { name: /login_to_app/i });

        await user.type(screen.getByLabelText(/email/i), 'test@test.com');
        await user.type(screen.getByLabelText(/password/i), 'password123');

        vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
            data: { session: { user: { id: '1' } } as never, user: { id: '1' } as never },
            error: null,
        });

        await user.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(mockRefresh).toHaveBeenCalled();
            expect(mockPush).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('shows error with invalid credentials', async () => {
        const user = userEvent.setup();
        render(<LoginPage />);

        await user.type(screen.getByLabelText(/email/i), 'wrong@test.com');
        await user.type(screen.getByLabelText(/password/i), 'wrong');

        vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
            data: { session: null, user: null },
            error: new AuthError('Invalid credentials', 400, 'invalid_credentials'),
        });

        await user.click(screen.getByRole('button', { name: /login/i }));

        await screen.findByText(/Invalid credentials/i);
    });
});
