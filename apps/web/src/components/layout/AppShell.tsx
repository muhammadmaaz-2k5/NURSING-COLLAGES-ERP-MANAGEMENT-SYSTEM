'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Breadcrumbs } from './Breadcrumbs';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import {
  Search,
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
  Settings,
  Globe,
  PlusCircle,
} from 'lucide-react';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');

  // Public portal pages render their own layout without the internal ERP sidebar
  const isPortal = pathname.startsWith('/portal');

  // Command palette hotkey (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commands = [
    { title: 'Dashboard Overview', href: '/', icon: Home, category: 'Navigation' },
    { title: 'Students Directory', href: '/students', icon: Users, category: 'Student Life' },
    { title: 'Mark Daily Attendance', href: '/attendance', icon: CalendarCheck, category: 'Student Life' },
    { title: 'Clinical Logbook Verification', href: '/clinical', icon: Stethoscope, category: 'Nursing & Clinical' },
    { title: 'Examination & Grade Roster', href: '/exams', icon: Award, category: 'Academics' },
    { title: 'Fee Challans & Payments', href: '/finance', icon: CreditCard, category: 'Finance' },
    { title: 'Hospital Wards & Admissions', href: '/hospital', icon: Building2, category: 'Hospital' },
    { title: 'Pharmacy Inventory & Dispense', href: '/pharmacy', icon: Pill, category: 'Pharmacy' },
    { title: 'Hostel Room Allocations', href: '/hostel', icon: Home, category: 'Facilities' },
    { title: 'Library Book Circulation', href: '/library', icon: BookOpen, category: 'Facilities' },
    { title: 'Transport Bus Routes', href: '/transport', icon: Bus, category: 'Facilities' },
    { title: 'HR Employee Payroll', href: '/hr', icon: UserCheck, category: 'HR' },
    { title: 'SaaS Module Settings', href: '/modules', icon: Settings, category: 'Configuration' },
    { title: 'Public CMS Portal', href: '/portal', icon: Globe, category: 'Public' },
  ];

  const filteredCommands = commands.filter((c) =>
    c.title.toLowerCase().includes(commandSearch.toLowerCase()) ||
    c.category.toLowerCase().includes(commandSearch.toLowerCase()),
  );

  if (isPortal) {
    return <main className="min-h-screen bg-slate-950 text-slate-100">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />

      {/* Main Page Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Sticky Header */}
        <Topbar
          onMobileMenuOpen={() => setIsMobileOpen(true)}
          onQuickSearchOpen={() => setIsCommandOpen(true)}
        />

        {/* Dynamic Content Body */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          <Breadcrumbs />
          {children}
        </main>
      </div>

      {/* Global Command Palette Modal (Ctrl+K) */}
      <Modal
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        size="lg"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <Search className="w-5 h-5 text-blue-400" />
            <input
              autoFocus
              value={commandSearch}
              onChange={(e) => setCommandSearch(e.target.value)}
              placeholder="Search ERP modules, pages, or actions..."
              className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
            />
          </div>

          <div className="max-h-80 overflow-y-auto space-y-1">
            {filteredCommands.length > 0 ? (
              filteredCommands.map((cmd, idx) => {
                const Icon = cmd.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsCommandOpen(false);
                      setCommandSearch('');
                      router.push(cmd.href);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-blue-600 text-slate-400 group-hover:text-white transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold">{cmd.title}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {cmd.category}
                    </span>
                  </button>
                );
              })
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">No matching actions found</p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
