'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  Shield,
  LogOut,
  ExternalLink,
  CheckCircle,
  Clock,
  ChevronDown,
  Building,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { cn, getInitials } from '../../lib/utils';
import { NotificationBell } from '../../features/notifications/components/NotificationBell';
import { ThemeToggle } from '../ui/ThemeToggle';

export interface TopbarProps {
  onMobileMenuOpen?: () => void;
  onQuickSearchOpen?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMobileMenuOpen, onQuickSearchOpen }) => {
  const { user, logout } = useAuth();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notifications = [
    {
      id: '1',
      title: 'Neon PostgreSQL Synced',
      description: 'Database schema & 24 modules successfully synced.',
      time: '2m ago',
      unread: true,
    },
    {
      id: '2',
      title: 'New Admission Application',
      description: 'Amina Bibi applied for Generic BSN Degree.',
      time: '15m ago',
      unread: true,
    },
    {
      id: '3',
      title: 'Cloudinary Storage Active',
      description: 'Images and videos streaming via cloud CDN preset.',
      time: '1h ago',
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-30 h-18 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 flex items-center justify-between shadow-lg">
      {/* Left: Mobile Toggle & Quick Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuOpen}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <button
          onClick={onQuickSearchOpen}
          className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-all text-xs w-48 sm:w-72 justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <span>Search anything...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-800 border border-slate-700 rounded-md">
            ⌘K
          </kbd>
        </button>

        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
          <Building className="w-3.5 h-3.5 text-blue-400" />
          <span>Main Healthcare City Campus</span>
        </div>
      </div>

      {/* Right: Public Link, Notifications, User Profile */}
      <div className="flex items-center gap-3">
        {/* Public Portal Quick Link */}
        <Link
          href="/portal"
          target="_blank"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
          <span>Public Portal</span>
        </Link>

        {/* Theme Mode Selector (Light / Dark / System) */}
        <ThemeToggle />

        {/* Notification Bell with Dropdown */}
        <NotificationBell />

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
              {getInitials(user?.name)}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-bold text-slate-200 leading-tight">
                {user?.name || 'Administrator'}
              </span>
              <span className="text-[10px] text-slate-400 capitalize">{user?.role?.replace('_', ' ') || 'Super Admin'}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-2 z-50 animate-scale-in">
              <div className="p-3 border-b border-slate-800/80">
                <p className="text-xs font-bold text-slate-100">{user?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                <Badge variant="purple" size="sm" className="mt-2">
                  {user?.role || 'SUPER_ADMIN'}
                </Badge>
              </div>

              <div className="py-1">
                <Link
                  href="/modules"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span>College Settings</span>
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors text-left mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
