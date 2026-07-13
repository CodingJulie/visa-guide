import { describe, expect, it } from 'vitest';
import { canEditContent, canManageRoles, canPublishContent } from './profile';

describe('profile utils', () => {
    it('canEditContent allows editor and admin', () => {
        expect(canEditContent('editor')).toBe(true);
        expect(canEditContent('admin')).toBe(true);
        expect(canEditContent('user')).toBe(false);
        expect(canEditContent(undefined)).toBe(false);
    });

    it('canPublishContent allows only admin', () => {
        expect(canPublishContent('admin')).toBe(true);
        expect(canPublishContent('editor')).toBe(false);
        expect(canPublishContent('user')).toBe(false);
    });

    it('canManageRoles allows only admin', () => {
        expect(canManageRoles('admin')).toBe(true);
        expect(canManageRoles('editor')).toBe(false);
    });
});
