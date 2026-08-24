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
      { name: 'Students Directory', href: '/students', icon: Users, module: 'STUDENTS' },
      { name: 'Daily Attendance', href: '/attendance', icon: CalendarCheck, module: 'ATTENDANCE' },
      { name: 'Faculty & Mentors', href: '/faculty', icon: GraduationCap, module: 'FACULTY' },
    ],
  },
  {
    title: 'Academic & Clinical',
    items: [
      { name: 'Curriculum & Programs', href: '/academic', icon: BookOpen, module: 'ACADEMIC' },
      { name: 'Exams & Results', href: '/exams', icon: Award, module: 'EXAMINATIONS' },
      { name: 'Clinical & Nursing Log', href: '/clinical', icon: Stethoscope, module: 'CLINICAL_TRAINING', badge: 'PNC' },
      { name: 'Fees & Finance', href: '/finance', icon: CreditCard, module: 'FEES' },
    ],
  },
  {
    title: 'Hospital & Healthcare',
    items: [
      { name: 'Hospital OPD / IPD', href: '/hospital', icon: Building2, module: 'HOSPITAL' },
      { name: 'Pharmacy & Batches', href: '/pharmacy', icon: Pill, module: 'PHARMACY' },
    ],
  },
  {
    title: 'Campus & Facilities',
    items: [
      { name: 'Hostel Allotment', href: '/hostel', icon: Home, module: 'HOSTEL' },
      { name: 'Library & Circulation', href: '/library', icon: BookOpen, module: 'LIBRARY' },
      { name: 'Transport Fleet', href: '/transport', icon: Bus, module: 'TRANSPORT' },
      { name: 'HR & Payroll Engine', href: '/hr', icon: UserCheck, module: 'HR' },
      { name: 'Campus Facilities', href: '/facilities', icon: Layers },
    ],
  },
  {
    title: 'Configuration',
    items: [
      { name: 'SaaS Module Manager', href: '/modules', icon: Settings, badge: '24 Modules' },
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
  const { user } = useAuth();

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar Wrapper */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen bg-slate-950/90 backdrop-blur-2xl border-r border-slate-800/80 flex flex-col transition-all duration-300 shadow-2xl',
          isCollapsed ? 'w-20' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Brand Header */}
        <div className="h-18 flex items-center justify-between px-4 border-b border-slate-800/80 bg-slate-950/60">
          <Link href="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-500/25 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-sm text-slate-100 tracking-tight leading-tight">
                  PERN ERP
                </span>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Healthcare Core
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          {navSections.map((section, sIdx) => {
            const visibleItems = section.items.filter(
              (item) => !item.module || isModuleEnabled(item.module),
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={sIdx} className="space-y-1">
                {!isCollapsed && (
                  <h4 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
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
                        'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 font-semibold'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80',
                        isCollapsed ? 'justify-center px-2' : '',
                      )}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <Icon
                        className={cn(
                          'w-5 h-5 shrink-0 transition-transform duration-150 group-hover:scale-110',
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400',
                        )}
                      />

                      {!isCollapsed && (
                        <div className="flex-1 flex items-center justify-between overflow-hidden">
                          <span className="truncate">{item.name}</span>
                          {item.badge && (
                            <span
                              className={cn(
                                'text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider',
                                isActive
                                  ? 'bg-white/20 text-white'
                                  : 'bg-slate-800 text-blue-400 border border-slate-700/50',
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

        {/* Footer College Profile */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <div
            className={cn(
              'flex items-center gap-3 p-2 rounded-xl bg-slate-900/50 border border-slate-800/60',
              isCollapsed ? 'justify-center p-1.5' : '',
            )}
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-200 truncate">National Medical College</p>
                <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Neon DB Connected
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
