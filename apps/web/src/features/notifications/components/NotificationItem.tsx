'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  DollarSign,
  Calendar,
  Stethoscope,
  AlertTriangle,
  FileCheck,
  Bell,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { AppNotification } from '../types/notification.types';
import { cn, formatDate } from '../../../lib/utils';

export const NotificationItem: React.FC<{
  notification: AppNotification;
  onMarkRead?: (id: string) => void;
  onCloseDropdown?: () => void;
}> = ({ notification, onMarkRead, onCloseDropdown }) => {
  const router = useRouter();

  const getCategoryIcon = () => {
    switch (notification.category) {
      case 'FINANCE':
        return <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'HR':
        return <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'CLINICAL':
        return <Stethoscope className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'FACILITIES':
        return <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'ACADEMIC':
        return <FileCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      default:
        return <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    }
  };

  const handleClick = () => {
    if (!notification.isRead && onMarkRead) {
      onMarkRead(notification.id);
    }
    if (notification.actionUrl) {
      onCloseDropdown?.();
      router.push(notification.actionUrl);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'p-4 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer flex gap-3.5 items-start relative group border-b border-slate-100 dark:border-slate-800/50 last:border-none',
        !notification.isRead ? 'bg-blue-50/60 dark:bg-blue-950/15' : 'bg-transparent',
      )}
    >
      <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0 mt-0.5 shadow-2xs">
        {getCategoryIcon()}
      </div>

      <div className="flex-1 overflow-hidden space-y-1">
        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              'text-xs font-bold truncate',
              !notification.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300',
            )}
          >
            {notification.title}
          </p>
          {!notification.isRead && (
            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500 shrink-0 ring-4 ring-blue-500/20" />
          )}
        </div>

        <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {notification.message}
        </p>

        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
          <span className="flex items-center gap-1 font-mono">
            <Clock className="w-3 h-3" />
            {formatDate(notification.createdAt)}
          </span>

          <span className="font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
            View Details →
          </span>
        </div>
      </div>
    </div>
  );
};
