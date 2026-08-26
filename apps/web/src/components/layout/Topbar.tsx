'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Menu,
  Search,
  ExternalLink,
  ChevronDown,
  Building,
  User,
  Shield,
  Check,
  Sparkles,
} from 'lucide-react';
import { useAuth, SYSTEM_PERSONAS } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';
import { NotificationBell } from '../../features/notifications/components/NotificationBell';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useToast } from '../../context/ToastContext';

export interface TopbarProps {
  onMobileMenuOpen?: () => void;
  onQuickSearchOpen?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMobileMenuOpen, onQuickSearchOpen }) => {
  const { user, activePersonaKey, switchPersona } = useAuth();
  const toast = useToast();
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const personaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (personaRef.current && !personaRef.current.contains(event.target as Node)) {
        setIsPersonaOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePersonaSelect = (key: string) => {
    switchPersona(key);
    setIsPersonaOpen(false);
    const persona = SYSTEM_PERSONAS[key];
    toast.info(
      'Switched Role Persona',
      `Active role changed to ${persona.name} (${persona.role}). UI permissions updated.`,
    );
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 lg:px-8 flex items-center justify-between shadow-xs transition-colors duration-150">
      {/* Left: Mobile Toggle & Quick Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuOpen}
          className="lg:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <button
          onClick={onQuickSearchOpen}
          className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all text-xs w-44 sm:w-64 justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search anything...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md">
            ⌘K
          </kbd>
        </button>

        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-xs text-blue-700 dark:text-blue-300 font-medium">
          <Building className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Main Healthcare Campus</span>
        </div>
      </div>

      {/* Right: Persona Switcher, Public Link, Mode Switcher, Notifications, User Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Interactive Persona & Role Switcher */}
        <div className="relative" ref={personaRef}>
          <button
            onClick={() => setIsPersonaOpen(!isPersonaOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs font-semibold transition-all cursor-pointer select-none"
            title="Switch institutional role persona to test RBAC"
          >
            <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden md:inline font-bold">Role:</span>
            <span className="font-bold">{user?.role || 'SUPER_ADMIN'}</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {isPersonaOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 animate-scale-in">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Simulate Institutional Role
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Switch persona to test permissions and UI gating
                </p>
              </div>

              <div className="py-1 space-y-0.5 max-h-72 overflow-y-auto">
                {Object.entries(SYSTEM_PERSONAS).map(([key, p]) => {
                  const isSelected = activePersonaKey === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handlePersonaSelect(key)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <img
                          src={p.avatarUrl}
                          alt={p.name}
                          className="w-6 h-6 rounded-full object-cover shrink-0"
                        />
                        <div className="overflow-hidden">
                          <p className="font-semibold truncate">{p.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{p.title}</p>
                        </div>
                      </div>

                      {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Public Portal Quick Link */}
        <Link
          href="/portal"
          target="_blank"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Public Portal</span>
        </Link>

        {/* Universal Theme Mode Selector */}
        <ThemeToggle />

        {/* Notification Bell with Dropdown */}
        <NotificationBell />

        {/* User Profile Avatar Pill */}
        <div className="flex items-center gap-2 pl-1">
          <img
            src={
              user?.avatarUrl ||
              'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150'
            }
            alt={user?.name || 'User'}
            className="w-8 h-8 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
          />
        </div>
      </div>
    </header>
  );
};
