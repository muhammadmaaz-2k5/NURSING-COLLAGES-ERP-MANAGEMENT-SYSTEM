'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  CalendarCheck,
  Award,
  CreditCard,
  Stethoscope,
  Building2,
  Pill,
  Home,
  BookOpen,
  Bus,
  UserCheck,
  Globe,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useModules, ModuleType } from '../../context/ModuleContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  module?: ModuleType;
  badge?: string;
  permission?: string;
  roles?: string[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { name: 'Public CMS Portal', href: '/portal', icon: Globe, badge: 'Public' },
    ],
  },
  {
    title: 'Student Lifecycle',
    items: [
      {
        name: 'Students Directory',
        href: '/students',
        icon: Users,
        module: 'STUDENTS',
        permission: 'students.read',
        roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'FACULTY', 'CLINICAL_SUPERVISOR', 'ACCOUNTANT'],
      },
      {
        name: 'Daily Attendance',
        href: '/attendance',
        icon: CalendarCheck,
        module: 'ATTENDANCE',
        permission: 'attendance.read',
        roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'FACULTY', 'STUDENT'],
      },
      {
        name: 'Faculty & Mentors',
        href: '/faculty',
        icon: GraduationCap,
        module: 'FACULTY',
        permission: 'faculty.read',
        roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'FACULTY'],
      },
    ],
  },
  {
    title: 'Academic & Clinical',
    items: [
      {
        name: 'Curriculum & Programs',
        href: '/academic',
        icon: BookOpen,
        module: 'ACADEMIC',
        permission: 'academic.read',
        roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'FACULTY', 'STUDENT'],
      },
      {
        name: 'Exams & Results',
        href: '/exams',
        icon: Award,
        module: 'EXAMINATIONS',
        permission: 'exams.read',
        roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'FACULTY', 'STUDENT'],
      },
      {
        name: 'Clinical & Nursing Log',
        href: '/clinical',
        icon: Stethoscope,
        module: 'CLINICAL_TRAINING',
        badge: 'PNC',
        permission: 'clinical.read',
        roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'FACULTY', 'CLINICAL_SUPERVISOR', 'DOCTOR', 'STUDENT'],
      },
      {
        name: 'Fees & Finance',
        href: '/finance',
        icon: CreditCard,
        module: 'FEES',
        permission: 'finance.read',
        roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'ACCOUNTANT', 'STUDENT'],
      },
    ],
  },
  {
    title: 'Hospital & Healthcare',
    items: [
      {
        name: 'Hospital OPD / IPD',
        href: '/hospital',
        icon: Building2,
        module: 'HOSPITAL',
        permission: 'hospital.read',
        roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'DOCTOR', 'CLINICAL_SUPERVISOR'],
      },
      {
        name: 'Pharmacy & Batches',
        href: '/pharmacy',
        icon: Pill,
        module: 'PHARMACY',
        permission: 'pharmacy.read',
        roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'DOCTOR'],
      },
    ],
  },
  {
    title: 'Campus & Facilities',
    items: [
      {
        name: 'Hostel Allotment',
        href: '/hostel',
        icon: Home,
        module: 'HOSTEL',
        permission: 'hostel.read',
        roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN'],
      },
      {
        name: 'Library & Circulation',
        href: '/library',
        icon: BookOpen,
        module: 'LIBRARY',
        permission: 'library.read',
        roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'FACULTY', 'STUDENT'],
      },
      {
        name: 'Transport Fleet',
        href: '/transport',
        icon: Bus,
        module: 'TRANSPORT',
        permission: 'transport.read',
        roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN'],
      },
      {
        name: 'HR & Payroll Engine',
        href: '/hr',
        icon: UserCheck,
        module: 'HR',
        permission: 'hr.read',
        roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'ACCOUNTANT'],
      },
      {
        name: 'Campus Facilities',
        href: '/facilities',
        icon: Layers,
        roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN'],
      },
    ],
  },
  {
    title: 'Configuration',
    items: [
      {
        name: 'SaaS Module Manager',
        href: '/modules',
        icon: Settings,
        badge: '24 Modules',
        roles: ['SUPER_ADMIN'],
      },
      {
        name: 'System Settings',
        href: '/settings',
        icon: Settings,
        roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN'],
      },
    ],
  },
];

const studentNavSections: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { name: 'Command Center', href: '/', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Academic Pillar',
    items: [
      { name: 'My Academics & Timetable', href: '/academic', icon: BookOpen },
      { name: 'Attendance Standing', href: '/attendance', icon: CalendarCheck, badge: '91.4%' },
      { name: 'Exams & Results', href: '/exams', icon: Award, badge: 'CGPA 3.82' },
    ],
  },
  {
    title: 'Clinical Pillar',
    items: [
      { name: '1200h Clinical Logbook', href: '/clinical', icon: Stethoscope, badge: '840 / 1200h' },
    ],
  },
  {
    title: 'Campus Pillar',
    items: [
      { name: 'Tuition & Fees Ledger', href: '/finance', icon: CreditCard, badge: '₨ 0' },
      { name: 'Library & Stacks', href: '/library', icon: BookOpen },
      { name: 'Hostel & Transport', href: '/facilities', icon: Home },
    ],
  },
  {
    title: 'Account & College',
    items: [
      { name: 'Notifications & Alerts', href: '/notifications', icon: Sparkles },
      { name: 'College Public Portal', href: '/portal', icon: Globe },
    ],
  },
];

export interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen = false, onMobileClose }) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isModuleEnabled } = useModules();
  const { user, hasPermission, hasRole } = useAuth();
  const isStudent = user?.role === 'STUDENT';
  const currentSections = isStudent ? studentNavSections : navSections;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar Wrapper */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-200 shadow-sm',
          isCollapsed ? 'w-20' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
          <Link href="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                  PERN ERP
                </span>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  Healthcare Core
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Sections with RBAC & SaaS Filtering */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {currentSections.map((section, sIdx) => {
            const visibleItems = section.items.filter((item) => {
              if (isStudent) return true; // Student items are already curated

              // 1. SaaS Module Check
              if (item.module && !isModuleEnabled(item.module)) return false;

              // 2. RBAC Permission & Role Check
              if (item.roles && !hasRole(item.roles)) {
                if (item.permission && !hasPermission(item.permission)) {
                  return false;
                }
              }

              return true;
            });

            if (visibleItems.length === 0) return null;

            return (
              <div key={sIdx} className="space-y-1">
                {!isCollapsed && (
                  <h4 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    {section.title}
                  </h4>
                )}

                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onMobileClose}
                      className={cn(
                        'group flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150',
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900',
                        isCollapsed ? 'justify-center px-2 py-2.5' : '',
                      )}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <Icon
                        className={cn(
                          'w-4 h-4 shrink-0 transition-transform duration-150',
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400',
                        )}
                      />

                      {!isCollapsed && (
                        <div className="flex-1 flex items-center justify-between overflow-hidden">
                          <span className="truncate">{item.name}</span>
                          {item.badge && (
                            <span
                              className={cn(
                                'text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider',
                                isActive
                                  ? 'bg-white/20 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700/60',
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer Active Persona Indicator */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
          <div
            className={cn(
              'flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm',
              isCollapsed ? 'justify-center p-1.5' : '',
            )}
          >
            <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {user?.role || 'SUPER_ADMIN'}
                </p>
                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  RBAC Active ({user?.permissions.includes('*') ? 'All' : user?.permissions.length} perms)
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
