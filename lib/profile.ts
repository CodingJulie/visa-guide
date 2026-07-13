export type UserRole = 'user' | 'editor' | 'admin';

export interface Profile {
    id: string;
    role: UserRole;
    full_name: string | null;
    preferred_language: 'en' | 'ru';
}

export function canEditContent(role: UserRole | undefined): boolean {
    return role === 'editor' || role === 'admin';
}

export function canPublishContent(role: UserRole | undefined): boolean {
    return role === 'admin';
}

export function canManageRoles(role: UserRole | undefined): boolean {
    return role === 'admin';
}
