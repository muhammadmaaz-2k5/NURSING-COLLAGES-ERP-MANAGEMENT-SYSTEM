'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: string;
  roles: string[];
  permissions: string[];
  avatarUrl?: string;
}

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role?: string) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>({
    id: 'usr_admin_01',
    email: 'admin@nmc.edu.pk',
    name: 'Dr. System Administrator',
    role: 'SUPER_ADMIN',
    roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN'],
    permissions: ['*'],
    avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150',
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = (email: string, role = 'SUPER_ADMIN') => {
    setUser({
      id: 'usr_admin_01',
      email,
      name: email.split('@')[0],
      role,
      roles: [role],
      permissions: ['*'],
    });
  };

  const logout = () => {
    setUser(null);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.permissions.includes('*')) return true;
    return user.permissions.includes(permission);
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    if (user.roles.includes('SUPER_ADMIN')) return true;
    return user.roles.includes(role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasPermission,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
