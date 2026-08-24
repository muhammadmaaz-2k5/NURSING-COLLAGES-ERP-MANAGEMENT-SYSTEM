'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Users,
  Plus,
  ArrowRight,
  ShieldCheck,
  Lock,
  Mail,
  Phone,
} from 'lucide-react';
import { DataTable, Column } from '../../../components/tables/DataTable';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { UserModal } from '../../../features/settings/components/UserModal';
import { fetchUsers } from '../../../features/settings/services/settings.api';
import { UserAccount } from '../../../features/settings/types/settings.types';
import { formatDate } from '../../../lib/utils';

export default function UsersSettingsPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchUsers();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const columns: Column<UserAccount>[] = [
    {
      header: 'User Account & Email',
      accessorKey: 'firstName',
      sortable: true,
      cell: (u) => (
        <div className="flex items-center gap-3">
          <img
            src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={u.firstName}
            className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
          />
          <div>
            <p className="font-bold text-slate-100">
              {u.firstName} {u.lastName || ''}
            </p>
            <span className="font-mono text-blue-400 text-xs">{u.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Assigned Role(s)',
      cell: (u) => (
        <div className="flex flex-wrap gap-1">
          {u.roles.map((r) => (
            <Badge key={r} variant="purple" size="sm">
              {r}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      header: 'Contact Phone',
      accessorKey: 'phone',
      cell: (u) => <span className="font-mono text-slate-400 text-xs">{u.phone || '—'}</span>,
    },
    {
      header: 'Last Active Session',
      accessorKey: 'lastLoginAt',
      cell: (u) => (
        <span className="font-mono text-slate-400 text-xs">
          {u.lastLoginAt ? formatDate(u.lastLoginAt) : 'Never'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (u) => (
        <Badge variant={u.status === 'ACTIVE' ? 'success' : 'danger'} size="sm" dot>
          {u.status}
        </Badge>
      ),
    },
    {
      header: 'Action',
      cell: (u) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/settings/users/${u.id}`)}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Manage Account
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/settings')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to System Administration
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create User Account
        </Button>
      </div>

      <Card className="p-6 space-y-4">
        <CardHeader className="pb-2">
          <div>
            <CardTitle className="text-lg">Institutional User Accounts Directory</CardTitle>
            <CardDescription>
              Manage administrator, faculty, staff, and student portal user accounts
            </CardDescription>
          </div>
        </CardHeader>

        <DataTable
          columns={columns}
          data={users}
          isLoading={isLoading}
          searchPlaceholder="Search by name, email, or role..."
          pageSize={10}
          onRowClick={(u) => router.push(`/settings/users/${u.id}`)}
        />
      </Card>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
