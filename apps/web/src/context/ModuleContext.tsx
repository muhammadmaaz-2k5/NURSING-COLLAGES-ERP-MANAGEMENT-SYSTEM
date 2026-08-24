'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ModuleType =
  | 'ACADEMIC'
  | 'STUDENTS'
  | 'ADMISSIONS'
  | 'FACULTY'
  | 'ATTENDANCE'
  | 'EXAMINATIONS'
  | 'RESULTS'
  | 'FEES'
  | 'CLINICAL_TRAINING'
  | 'HOSPITAL'
  | 'PHARMACY'
  | 'LABORATORY'
  | 'HOSTEL'
  | 'LIBRARY'
  | 'HR'
  | 'PAYROLL'
  | 'INVENTORY'
  | 'PROCUREMENT'
  | 'COMMUNICATION'
  | 'EVENTS'
  | 'DOCUMENTS'
  | 'ALUMNI'
  | 'CERTIFICATES'
  | 'TRANSPORT';

interface ModuleState {
  module: ModuleType | string;
  enabled: boolean;
}

interface ModuleContextType {
  modules: ModuleState[];
  isLoading: boolean;
  isModuleEnabled: (module: ModuleType | string) => boolean;
  toggleModule: (module: ModuleType | string, enabled: boolean) => Promise<void>;
  refreshModules: () => Promise<void>;
}

const defaultModules: ModuleState[] = [
  { module: 'ACADEMIC', enabled: true },
  { module: 'STUDENTS', enabled: true },
  { module: 'ADMISSIONS', enabled: true },
  { module: 'FACULTY', enabled: true },
  { module: 'ATTENDANCE', enabled: true },
  { module: 'EXAMINATIONS', enabled: true },
  { module: 'RESULTS', enabled: true },
  { module: 'FEES', enabled: true },
  { module: 'CLINICAL_TRAINING', enabled: true },
  { module: 'HOSPITAL', enabled: true },
  { module: 'PHARMACY', enabled: true },
  { module: 'LABORATORY', enabled: true },
  { module: 'HOSTEL', enabled: true },
  { module: 'LIBRARY', enabled: true },
  { module: 'HR', enabled: true },
  { module: 'PAYROLL', enabled: true },
  { module: 'INVENTORY', enabled: true },
  { module: 'PROCUREMENT', enabled: true },
  { module: 'COMMUNICATION', enabled: true },
  { module: 'EVENTS', enabled: true },
  { module: 'DOCUMENTS', enabled: true },
  { module: 'ALUMNI', enabled: true },
  { module: 'CERTIFICATES', enabled: true },
  { module: 'TRANSPORT', enabled: true },
];

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export const ModuleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modules, setModules] = useState<ModuleState[]>(defaultModules);
  const [isLoading, setIsLoading] = useState(false);

  const refreshModules = async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';
      const res = await fetch(`${API_BASE}/modules`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setModules(data);
        }
      }
    } catch {
      // Keep defaults
    }
  };

  useEffect(() => {
    refreshModules();
  }, []);

  const isModuleEnabled = (moduleName: ModuleType | string): boolean => {
    const found = modules.find((m) => m.module === moduleName);
    return found ? found.enabled : true;
  };

  const toggleModule = async (moduleName: ModuleType | string, enabled: boolean) => {
    setModules((prev) =>
      prev.map((m) => (m.module === moduleName ? { ...m, enabled } : m)),
    );

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';
      await fetch(`${API_BASE}/modules`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module: moduleName, enabled }),
      });
    } catch (err) {
      console.error('Failed to sync module toggle with backend:', err);
    }
  };

  return (
    <ModuleContext.Provider
      value={{
        modules,
        isLoading,
        isModuleEnabled,
        toggleModule,
        refreshModules,
      }}
    >
      {children}
    </ModuleContext.Provider>
  );
};

export const useModules = () => {
  const context = useContext(ModuleContext);
  if (!context) throw new Error('useModules must be used within a ModuleProvider');
  return context;
};
