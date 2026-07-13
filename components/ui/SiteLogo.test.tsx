import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SiteLogo from '@/components/ui/SiteLogo';

describe('SiteLogo', () => {
    it('renders home link with app logo image', () => {
        render(<SiteLogo />);
        const link = screen.getByRole('link', { name: 'back_home' });
        expect(link).toHaveAttribute('href', '/');
        expect(screen.getByRole('img', { name: 'app_name' })).toBeInTheDocument();
    });
});
