'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  ArrowRight,
  Sparkles,
  Users,
  GraduationCap,
  DollarSign,
  Stethoscope,
  Pill,
  Building,
  BookOpen,
  Bus,
  Calendar,
  Command,
  X,
  Zap,
} from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { searchGlobal, getQuickActions } from '../services/search.api';
import { SearchResult, QuickAction, SearchCategory } from '../types/search.types';
import { cn } from '../../../lib/utils';

export interface SearchOmniboxProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchOmnibox: React.FC<SearchOmniboxProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickActions = getQuickActions();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await searchGlobal(query);
        setResults(data);
        setSelectedIndex(0);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (url: string) => {
    onClose();
    router.push(url);
  };

  const getCategoryIcon = (cat: SearchCategory) => {
    switch (cat) {
      case 'STUDENTS':
        return <Users className="w-4 h-4 text-blue-400" />;
      case 'FACULTY':
        return <GraduationCap className="w-4 h-4 text-purple-400" />;
      case 'FINANCE':
        return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'HOSPITAL':
        return <Stethoscope className="w-4 h-4 text-rose-400" />;
      case 'PHARMACY':
        return <Pill className="w-4 h-4 text-amber-400" />;
      case 'HOSTEL':
        return <Building className="w-4 h-4 text-indigo-400" />;
      case 'LIBRARY':
        return <BookOpen className="w-4 h-4 text-cyan-400" />;
      case 'TRANSPORT':
        return <Bus className="w-4 h-4 text-teal-400" />;
      default:
        return <Search className="w-4 h-4 text-slate-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-scale-in">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-800 bg-slate-950/60">
          <Search className="w-5 h-5 text-blue-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students, faculty, challans, patients, medicines, books..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="px-2 py-0.5 text-[10px] font-bold text-slate-400 bg-slate-800 border border-slate-700 rounded-md">
              ESC
            </kbd>
          )}
        </div>

        {/* Results / Quick Actions Container */}
        <div className="overflow-y-auto p-3 space-y-4 max-h-96 scrollbar-none">
          {/* If no query, display Quick Actions */}
          {!query.trim() && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Instant Institutional Quick Actions</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickActions.map((qa) => (
                  <div
                    key={qa.id}
                    onClick={() => handleSelect(qa.url)}
                    className="p-3 rounded-2xl bg-slate-950/60 hover:bg-blue-600/10 border border-slate-800/80 hover:border-blue-500/30 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                        {qa.title}
                      </p>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{qa.description}</p>
                    </div>
                    {qa.shortcut && (
                      <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-slate-800 border border-slate-700 rounded-md">
                        {qa.shortcut}
                      </kbd>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {query.trim() && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                Search Results ({results.length})
              </div>

              {results.length === 0 ? (
                <div className="py-12 text-center text-slate-500 space-y-1">
                  <Search className="w-6 h-6 mx-auto text-slate-600 mb-2" />
                  <p className="text-xs font-semibold text-slate-300">No matching records found</p>
                  <p className="text-[11px]">
                    Try searching with student roll numbers, faculty names, or invoice references.
                  </p>
                </div>
              ) : (
                results.map((res, index) => (
                  <div
                    key={res.id}
                    onClick={() => handleSelect(res.url)}
                    className={cn(
                      'p-3 rounded-2xl transition-all cursor-pointer flex items-center justify-between group border border-transparent',
                      index === selectedIndex
                        ? 'bg-blue-600/15 border-blue-500/30 text-white'
                        : 'hover:bg-slate-800/60 text-slate-200',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                        {getCategoryIcon(res.category)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                          {res.title}
                        </p>
                        {res.subtitle && (
                          <p className="text-[11px] text-slate-400 line-clamp-1">{res.subtitle}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {res.badge && (
                        <Badge variant="purple" size="sm">
                          {res.badge}
                        </Badge>
                      )}
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-500 px-4">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1 bg-slate-800 rounded border border-slate-700">↑</kbd>{' '}
              <kbd className="px-1 bg-slate-800 rounded border border-slate-700">↓</kbd> to
              navigate
            </span>
            <span>
              <kbd className="px-1 bg-slate-800 rounded border border-slate-700">ENTER</kbd> to open
            </span>
          </div>

          <span className="font-mono text-[10px] text-blue-400 font-semibold">
            Universal Enterprise Index
          </span>
        </div>
      </div>
    </div>
  );
};
