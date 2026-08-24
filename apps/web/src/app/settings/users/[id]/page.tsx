'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  Users,
  Shield,
  Key,
  Mail,
  Phone,
  Calendar,
  Lock,
} from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { fetchUserById } from '../../../../features/settings/services/settings.api';
import { UserAccount } from '../../../../features/settings/types/settings.types';
import { formatDate } from '../../../../lib/utils';
import { useToast } from '../../../../context/ToastContext';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const userId = params?.id as string;

  const [user, setUser] = useState<UserAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!userId) return;
      setIsLoading(true);
      try {
        const data = await fetchUserById(userId);
        setUser(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [userId]);

  const handleResetPassword = () => {
    toast.success(
      'Password Reset Link Sent',
      `A secure password reset link was dispatched to ${user?.email}.`,
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-xs text-slate-400 font-medium">Loading User Security Profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="text-lg font-bold text-slate-200">User Account Not Found</h3>
        <Button variant="primary" size="sm" onClick={() => router.push('/settings/users')}>
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/settings/users')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Users Directory
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleResetPassword}
          leftIcon={<Key className="w-4 h-4" />}
        >
          Reset Password
        </Button>
      </div>

      {/* User Header */}
      <div className="p-6 lg:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={
                user.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
              }
              alt={user.firstName}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shrink-0 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">
                  {user.firstName} {user.lastName || ''}
                </h1>
                <Badge variant={user.status === 'ACTIVE' ? 'success' : 'danger'} size="sm" dot>
                  {user.status}
                </Badge>
              </div>
              <p className="font-mono text-blue-400 font-bold text-xs mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {user.roles.map((r) => (
              <Badge key={r} variant="purple" size="sm">
                <Shield className="w-3 h-3 mr-1 inline" /> {r}
              </Badge>
            ))}
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 font-medium block">Contact Mobile</span>
            <span className="font-mono text-slate-200">{user.phone || '—'}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Account Created</span>
            <span className="font-mono text-slate-200">{formatDate(user.createdAt)}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Last Active Session</span>
            <span className="font-mono text-slate-200">
              {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
