import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './vitest.setup.ts',
        alias: { '@': path.resolve(__dirname, './') },
        include: ['**/*.{test,spec}.{ts,tsx,js,jsx}'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'lcov'],
            reportsDirectory: './coverage',
            include: [
                'components/ui/SiteLogo.tsx',
                'components/ui/ThemeToggle.tsx',
                'components/ui/LanguageSwitcher.tsx',
                'components/ui/MainLoader.tsx',
                'components/ui/Card.tsx',
                'components/ui/Button.tsx',
                'components/questionnaire/**/*.tsx',
            ],
            exclude: [
                '**/*.{test,spec}.{ts,tsx}',
            ],
            thresholds: {
                lines: 55,
                functions: 50,
                branches: 45,
                statements: 55,
            },
        },
    },
});
