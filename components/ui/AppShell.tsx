'use client';

import InstallPrompt from '@/components/ui/InstallPrompt';
import SideControls from '@/components/ui/SideControls';
import SiteLogo from '@/components/ui/SiteLogo';

export default function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="app-gradient-bg flex min-h-screen flex-col">
            <div className="mx-auto flex w-full max-w-lg flex-1 flex-col pl-20 pr-4">
                <header className="flex shrink-0 justify-center pb-4 pt-8">
                    <SiteLogo priority />
                </header>
                <InstallPrompt />
                <main className="flex min-h-0 flex-1 flex-col">{children}</main>
            </div>
            <SideControls />
        </div>
    );
}
