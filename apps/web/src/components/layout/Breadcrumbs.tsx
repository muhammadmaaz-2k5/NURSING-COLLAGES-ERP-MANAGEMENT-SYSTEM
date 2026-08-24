'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Breadcrumbs: React.FC = () => {
  const pathname = usePathname();

  if (pathname === '/' || pathname.startsWith('/portal')) {
    return null;
  }

  const segments = pathname.split('/').filter(Boolean);

  const formatSegment = (str: string) => {
    return str
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
      <Link
        href="/"
        className="flex items-center gap-1.5 hover:text-slate-200 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Dashboard</span>
      </Link>

      {segments.map((seg, idx) => {
        const href = `/${segments.slice(0, idx + 1).join('/')}`;
        const isLast = idx === segments.length - 1;

        return (
          <React.Fragment key={href}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            {isLast ? (
              <span className="font-semibold text-blue-400 truncate">
                {formatSegment(seg)}
              </span>
            ) : (
              <Link href={href} className="hover:text-slate-200 transition-colors truncate">
                {formatSegment(seg)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
