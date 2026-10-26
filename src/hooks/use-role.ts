'use client';

import { ROLE_HIERARCHY, type Role } from '@/lib/types';

export function useRole(userRole?: Role) {
  const hasPermission = (requiredRole: Role): boolean => {
    if (!userRole) return false;
    const userLevel = ROLE_HIERARCHY[userRole];
    const requiredLevel = ROLE_HIERARCHY[requiredRole];
    return userLevel <= requiredLevel; // Lower number = higher privilege
  };

  const isAtLeast = (role: Role): boolean => hasPermission(role);
  const isExactly = (role: Role): boolean => userRole === role;
  const isAdmin = isAtLeast('ADMIN');
  const isOrganizer = isAtLeast('ORGANIZER');
  const isSuperAdmin = isExactly('SUPER_ADMIN');

  return { hasPermission, isAtLeast, isExactly, isAdmin, isOrganizer, isSuperAdmin };
}
