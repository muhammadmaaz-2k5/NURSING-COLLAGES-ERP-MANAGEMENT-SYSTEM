'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  CheckCircle2,
  DollarSign,
  Calendar,
  Stethoscope,
  AlertTriangle,
  FileCheck,
  ArrowLeft,
  Filter,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { NotificationItem } from '../../features/notifications/components/NotificationItem';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../../features/notifications/services/notification.api';
import { AppNotification } from '../../features/notifications/types/notification.types';
import { useToast } from '../../context/ToastContext';

type CategoryFilter = 'ALL' | 'FINANCE' | 'HR' | 'CLINICAL' | 'FACILITIES' | 'ACADEMIC';

export default function NotificationsPage() {
  const router = useRouter();
  const toast = useToast();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('ALL');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchNotifications();
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success('All Marked as Read', 'Your notification feed is cleared.');
  };

  const filtered = notifications.filter((n) => {
    if (activeCategory !== 'ALL' && n.category !== activeCategory) return false;
    if (unreadOnly && n.isRead) return false;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Institutional Notification Center
            </h1>
            {unreadCount > 0 && (
              <Badge variant="primary" size="sm">
                {unreadCount} Unread
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time automated alerts for fee receipts, leave requests, clinical log submissions, and system notices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Mark All as Read
            </Button>
          )}
        </div>
      </div>

      {/* Category Sub-Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        <div className="flex items-center gap-2">
          {[
            { id: 'ALL' as const, label: 'All Alerts', icon: Bell },
            { id: 'FINANCE' as const, label: 'Finance & Invoices', icon: DollarSign },
            { id: 'HR' as const, label: 'HR & Leaves', icon: Calendar },
            { id: 'CLINICAL' as const, label: 'Clinical Skills', icon: Stethoscope },
            { id: 'FACILITIES' as const, label: 'Facilities & Pharmacy', icon: AlertTriangle },
            { id: 'ACADEMIC' as const, label: 'Admissions & Exams', icon: FileCheck },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={unreadOnly}
              onChange={(e) => setUnreadOnly(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-500 cursor-pointer"
            />
            <span>Unread Only</span>
          </label>
        </div>
      </div>

      {/* Main List Card */}
      <Card className="divide-y divide-slate-800/60 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-500 space-y-2">
            <Bell className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <h4 className="text-sm font-bold text-slate-300">No notifications found</h4>
            <p className="text-xs text-slate-400">
              There are no notifications matching your current filter criteria.
            </p>
          </div>
        ) : (
          filtered.map((notif) => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              onMarkRead={handleMarkRead}
            />
          ))
        )}
      </Card>
    </div>
  );
}
