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

import { SearchOmnibox } from '../../features/search/components/SearchOmnibox';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

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

      {/* Global Universal Search Omnibox (Cmd+K / Ctrl+K) */}
      <SearchOmnibox
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />
    </div>
  );
};
