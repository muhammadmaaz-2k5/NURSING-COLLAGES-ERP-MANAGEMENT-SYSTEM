'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Check, ExternalLink, Bell, Loader2 } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { NotificationItem } from './NotificationItem';
import { AppNotification } from '../types/notification.types';

export interface NotificationDropdownProps {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  unreadCount,
  isLoading,
  onClose,
  onMarkRead,
  onMarkAllRead,
}) => {
  const router = useRouter();

  return (
    <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden z-50 animate-scale-in">
      {/* Dropdown Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold text-white">System Notifications</h4>
          {unreadCount > 0 && (
            <Badge variant="primary" size="sm">
              {unreadCount} New
            </Badge>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 scrollbar-none">
        {isLoading ? (
          <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            <span className="text-xs">Loading alerts...</span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-10 text-center text-slate-500 space-y-1">
            <Bell className="w-6 h-6 mx-auto text-slate-600 mb-2" />
            <p className="text-xs font-semibold text-slate-400">No new notifications</p>
            <p className="text-[11px]">All institutional alerts are up to date.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              onMarkRead={onMarkRead}
              onCloseDropdown={onClose}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-center">
        <button
          onClick={() => {
            onClose();
            router.push('/notifications');
          }}
          className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1.5 w-full cursor-pointer"
        >
          <span>Open Full Notification Center</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
