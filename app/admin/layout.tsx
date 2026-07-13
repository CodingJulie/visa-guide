'use client';

import AdminNav from '@/components/admin/AdminNav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto px-4 py-8 pl-20">
                <AdminNav />
                {children}
            </main>
        </div>
    );
}
