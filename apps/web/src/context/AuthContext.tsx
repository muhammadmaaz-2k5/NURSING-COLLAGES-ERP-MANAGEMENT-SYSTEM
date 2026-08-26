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
  department?: string;
  title?: string;
}

export interface PersonaProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  roles: string[];
  permissions: string[];
  avatarUrl: string;
  title: string;
  department?: string;
}

export const SYSTEM_PERSONAS: Record<string, PersonaProfile> = {
  SUPER_ADMIN: {
    id: 'usr-admin-01',
    email: 'admin@nmc.edu.pk',
    name: 'Dr. System Administrator',
    role: 'SUPER_ADMIN',
    roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN'],
    permissions: ['*'],
    avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150',
    title: 'Super Administrator',
    department: 'Executive Administration',
  },
  COLLEGE_ADMIN: {
    id: 'usr-cadm-02',
    email: 'principal@nmc.edu.pk',
    name: 'Prof. Muhammad Asif',
    role: 'COLLEGE_ADMIN',
    roles: ['COLLEGE_ADMIN'],
    permissions: [
      'students.read', 'students.create', 'students.update',
      'academic.read', 'academic.create', 'academic.update',
      'faculty.read', 'faculty.create',
      'attendance.read', 'attendance.create',
      'exams.read', 'exams.create',
      'finance.read', 'finance.create',
      'hostel.read', 'hostel.create',
      'library.read', 'library.create',
      'transport.read', 'transport.create',
      'hr.read', 'hr.create',
      'cms.read', 'cms.create',
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    title: 'College Principal & Dean',
    department: 'Dean Office',
  },
  FACULTY: {
    id: 'usr-fac-03',
    email: 'tariq.mahmood@nmc.edu.pk',
    name: 'Dr. Tariq Mahmood',
    role: 'FACULTY',
    roles: ['FACULTY'],
    permissions: [
      'students.read',
      'academic.read',
      'faculty.read',
      'attendance.read', 'attendance.create', 'attendance.update',
      'exams.read', 'exams.create', 'exams.update',
      'clinical.read', 'clinical.verify',
      'library.read',
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150',
    title: 'Associate Professor of Nursing',
    department: 'Department of Clinical Care',
  },
  ACCOUNTANT: {
    id: 'usr-acc-04',
    email: 'finance@nmc.edu.pk',
    name: 'Mr. Zahid Hussain',
    role: 'ACCOUNTANT',
    roles: ['ACCOUNTANT'],
    permissions: [
      'students.read',
      'finance.read', 'finance.create', 'finance.update', 'finance.delete',
      'hr.read', 'hr.create',
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    title: 'Senior Bursar & Finance Officer',
    department: 'Accounts & Billing Department',
  },
  DOCTOR: {
    id: 'usr-doc-05',
    email: 'doctor.ayesha@nmc.edu.pk',
    name: 'Dr. Ayesha Malik',
    role: 'DOCTOR',
    roles: ['DOCTOR'],
    permissions: [
      'hospital.read', 'hospital.create', 'hospital.update',
      'pharmacy.read', 'pharmacy.dispense',
      'clinical.read', 'clinical.verify',
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
    title: 'Consultant Physician & Ward Incharge',
    department: 'Teaching Hospital OPD/IPD',
  },
  CLINICAL_SUPERVISOR: {
    id: 'usr-clin-06',
    email: 'supervisor.farida@nmc.edu.pk',
    name: 'Sister Farida Bano',
    role: 'CLINICAL_SUPERVISOR',
    roles: ['CLINICAL_SUPERVISOR'],
    permissions: [
      'students.read',
      'clinical.read', 'clinical.create', 'clinical.update', 'clinical.verify',
      'hospital.read',
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1594824813689-53697e887640?w=150',
    title: 'Head Clinical Nursing Supervisor',
    department: 'Clinical Training Division',
  },
  STUDENT: {
    id: 'usr-stud-07',
    email: 'amina.bibi@student.nmc.edu.pk',
    name: 'Amina Bibi',
    role: 'STUDENT',
    roles: ['STUDENT'],
    permissions: [
      'student.portal.read',
      'academic.read',
      'attendance.read',
      'exams.read',
      'finance.read',
      'library.read',
      'clinical.read',
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    title: 'Generic BSN Student (Semester 6)',
    department: 'Undergraduate Nursing',
  },
};

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  activePersonaKey: string;
  login: (email: string, role?: string) => void;
  logout: () => void;
  switchPersona: (personaKey: string) => void;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  hasRole: (role: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePersonaKey, setActivePersonaKey] = useState<string>('SUPER_ADMIN');
  const [user, setUser] = useState<UserSession | null>(SYSTEM_PERSONAS.SUPER_ADMIN);
  const [isLoading, setIsLoading] = useState(false);

  // Restore saved persona from localStorage if present
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem('pern_active_persona');
      if (savedKey && SYSTEM_PERSONAS[savedKey]) {
        setActivePersonaKey(savedKey);
        setUser(SYSTEM_PERSONAS[savedKey]);
      }
    } catch {}
  }, []);

  const switchPersona = (personaKey: string) => {
    const selected = SYSTEM_PERSONAS[personaKey];
    if (selected) {
      setActivePersonaKey(personaKey);
      setUser(selected);
      try {
        localStorage.setItem('pern_active_persona', personaKey);
      } catch {}
    }
  };

  const login = (email: string, role = 'SUPER_ADMIN') => {
    const matchingKey = Object.keys(SYSTEM_PERSONAS).find(
      (k) => SYSTEM_PERSONAS[k].role === role || SYSTEM_PERSONAS[k].email.toLowerCase() === email.toLowerCase(),
    );

    if (matchingKey) {
      switchPersona(matchingKey);
    } else {
      const customUser: UserSession = {
        id: 'usr-custom',
        email,
        name: email.split('@')[0],
        role,
        roles: [role],
        permissions: role === 'SUPER_ADMIN' ? ['*'] : [`${role.toLowerCase()}.read`],
      };
      setUser(customUser);
      setActivePersonaKey(role);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('pern_active_persona');
    } catch {}
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.permissions.includes('*')) return true;
    if (user.permissions.includes(permission)) return true;

    // Check module wildcard (e.g. students.* matching students.read)
    const [mod] = permission.split('.');
    if (user.permissions.includes(`${mod}.*`)) return true;

    return false;
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user) return false;
    if (user.permissions.includes('*')) return true;
    return permissions.some((p) => hasPermission(p));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user) return false;
    if (user.permissions.includes('*')) return true;
    return permissions.every((p) => hasPermission(p));
  };

  const hasRole = (role: string | string[]): boolean => {
    if (!user) return false;
    if (user.roles.includes('SUPER_ADMIN')) return true;
    if (Array.isArray(role)) {
      return role.some((r) => user.roles.includes(r));
    }
    return user.roles.includes(role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        activePersonaKey,
        login,
        logout,
        switchPersona,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
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
