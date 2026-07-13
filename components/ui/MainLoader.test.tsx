import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MainLoader } from '@/components/ui/MainLoader';

describe('MainLoader', () => {
    it('renders loading animation', () => {
        render(<MainLoader />);
        const icon = document.querySelector('.text-blue-600');
        expect(icon).toBeInTheDocument();
    });
});
