'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Laptop, Eye, Check } from 'lucide-react';
import { useTheme, Theme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

export const ThemeToggle: React.FC = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options: { value: Theme; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { value: 'light', label: 'White / Light', desc: 'Crisp clinical canvas', icon: Sun },
    { value: 'dark', label: 'Dark Mode', desc: 'Deep high-focus theme', icon: Moon },
    { value: 'system', label: 'System Auto', desc: 'Sync with OS setting', icon: Laptop },
    { value: 'contrast', label: 'High Contrast', desc: 'Maximum accessibility', icon: Eye },
  ];

  const CurrentIcon =
    theme === 'contrast'
      ? Eye
      : theme === 'system'
      ? Laptop
      : resolvedTheme === 'dark'
      ? Moon
      : Sun;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 sm:p-2.5 rounded-xl bg-slate-100/90 dark:bg-slate-900/80 hover:bg-slate-200/90 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer flex items-center justify-center shadow-xs"
        aria-label="Toggle theme mode"
        title={`Mode: ${theme.toUpperCase()} (Click to change)`}
      >
        <CurrentIcon
          className={cn(
            'w-4 h-4 transition-transform duration-200',
            resolvedTheme === 'dark' ? 'text-blue-400' : 'text-amber-500',
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-52 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl p-1.5 z-50 animate-scale-in">
          <div className="px-2.5 py-1.5 border-b border-slate-100 dark:border-slate-800/80 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Appearance Mode
            </span>
          </div>

          <div className="space-y-0.5">
            {options.map((opt) => {
              const Icon = opt.icon;
              const isSelected = theme === opt.value;

              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    setTheme(opt.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left',
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60',
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        'p-1.5 rounded-lg shrink-0',
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400',
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block leading-tight">{opt.label}</span>
                      <span className="text-[10px] font-normal text-slate-400 block leading-tight mt-0.5">
                        {opt.desc}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
