import { render, screen } from '@testing-library/react';
import DashboardPage from './page';
import { useUserCases } from '@/hooks/useCaseProgress';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/hooks/useCaseProgress', () => ({
    useUserCases: vi.fn(),
}));

const mockDeleteCase = vi.fn();

describe('DashboardPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockDeleteCase.mockResolvedValue(true);
        vi.mocked(useUserCases).mockReturnValue({
            cases: [],
            loading: false,
            deleteCase: mockDeleteCase,
        });
    });

    it('shows loader while loading', () => {
        vi.mocked(useUserCases).mockReturnValue({
            cases: [],
            loading: true,
            deleteCase: mockDeleteCase,
        });
        render(<DashboardPage />);
        expect(screen.getByText('main_loader_title')).toBeInTheDocument();
    });

    it('shows empty state when there are no cases', () => {
        render(<DashboardPage />);
        expect(screen.getByText('dashboard_no_cases')).toBeInTheDocument();
        expect(screen.getByText('start_questionnaire')).toBeInTheDocument();
    });

    it('renders case list', () => {
        vi.mocked(useUserCases).mockReturnValue({
            loading: false,
            deleteCase: mockDeleteCase,
            cases: [
                {
                    id: 'case-1',
                    recommended_visa_type: 'F-1',
                    created_at: '2026-01-15T00:00:00.000Z',
                    answers_json: {},
                    recommendation_json: null,
                    status: 'active',
                },
            ],
        });
        render(<DashboardPage />);
        expect(screen.getByText('F-1')).toBeInTheDocument();
        expect(screen.getByText('dashboard_view_case')).toBeInTheDocument();
        expect(screen.getByText('dashboard_delete_case')).toBeInTheDocument();
    });
});
