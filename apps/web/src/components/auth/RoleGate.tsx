'use client';

import React from 'react';
import { useAuth } from '../../context/AuthContext';

export interface RoleGateProps {
  roles: string | string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const RoleGate: React.FC<RoleGateProps> = ({
  roles,
  fallback = null,
  children,
}) => {
  const { hasRole } = useAuth();

  const isAllowed = hasRole(roles);

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
