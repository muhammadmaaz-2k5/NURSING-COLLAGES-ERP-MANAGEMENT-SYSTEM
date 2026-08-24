'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Shield,
  Plus,
  ArrowRight,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { DataTable, Column } from '../../../components/tables/DataTable';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { RoleModal } from '../../../features/settings/components/RoleModal';
import { fetchRoles } from '../../../features/settings/services/settings.api';
import { SystemRole } from '../../../features/settings/types/settings.types';

export default function RolesSettingsPage() {
  const router = useRouter();
  const [roles, setRoles] = useState<SystemRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchRoles();
      setRoles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const columns: Column<SystemRole>[] = [
    {
      header: 'Role Name',
      accessorKey: 'name',
      sortable: true,
      cell: (r) => (
        <div className="flex items-center gap-2">
          <Badge variant="purple" size="sm">
            {r.name}
          </Badge>
          {r.isSystem && (
            <span className="text-[10px] font-mono text-slate-500 font-bold">(System Builtin)</span>
          )}
        </div>
      ),
    },
    {
      header: 'Description & Scope',
      accessorKey: 'description',
      cell: (r) => <span className="text-slate-400 text-xs">{r.description || '—'}</span>,
    },
    {
      header: 'Assigned Users',
      sortable: true,
      cell: (r) => (
        <span className="font-mono text-emerald-400 font-bold text-xs">
          {r.usersCount} Accounts
        </span>
      ),
    },
    {
      header: 'Action',
      cell: (r) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/settings/roles/${r.id}`)}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Permission Matrix
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
          Create Custom Role
        </Button>
      </div>

      <Card className="p-6 space-y-4">
        <CardHeader className="pb-2">
          <div>
            <CardTitle className="text-lg">Security Roles & Permissions</CardTitle>
            <CardDescription>
              Configure role-based access control (RBAC) and functional module permissions
            </CardDescription>
          </div>
        </CardHeader>

        <DataTable
          columns={columns}
          data={roles}
          isLoading={isLoading}
          searchPlaceholder="Search roles..."
          pageSize={10}
          onRowClick={(r) => router.push(`/settings/roles/${r.id}`)}
        />
      </Card>

      <RoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
