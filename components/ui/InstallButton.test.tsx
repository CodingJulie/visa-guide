import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import InstallButton from './InstallButton';
import { usePwaInstall } from '@/hooks/use-pwa-install';

vi.mock('@/hooks/use-pwa-install', () => ({
    usePwaInstall: vi.fn(),
}));

describe('InstallButton', () => {
    const mockInstall = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (usePwaInstall as ReturnType<typeof vi.fn>).mockReturnValue({
            visible: false,
            install: mockInstall,
        });
    });

    it('is hidden when install is unavailable', () => {
        render(<InstallButton />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('is visible on mobile when install is available', () => {
        (usePwaInstall as ReturnType<typeof vi.fn>).mockReturnValue({
            visible: true,
            install: mockInstall,
        });
        render(<InstallButton />);
        expect(screen.getByRole('button', { name: /install/i })).toBeInTheDocument();
    });

    it('calls install on click', async () => {
        (usePwaInstall as ReturnType<typeof vi.fn>).mockReturnValue({
            visible: true,
            install: mockInstall,
        });
        const user = userEvent.setup();
        render(<InstallButton />);
        await user.click(screen.getByRole('button'));
        expect(mockInstall).toHaveBeenCalledOnce();
    });
});
