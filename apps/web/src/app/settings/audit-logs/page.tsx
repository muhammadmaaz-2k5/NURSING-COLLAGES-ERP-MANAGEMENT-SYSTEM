'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  FileText,
  ShieldCheck,
  Search,
  Filter,
} from 'lucide-react';
import { DataTable, Column } from '../../../components/tables/DataTable';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { fetchAuditLogs } from '../../../features/settings/services/settings.api';
import { AuditLogEntry } from '../../../features/settings/types/settings.types';
import { formatDate } from '../../../lib/utils';

export default function AuditLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const columns: Column<AuditLogEntry>[] = [
    {
      header: 'Timestamp',
      accessorKey: 'createdAt',
      sortable: true,
      cell: (l) => <span className="font-mono text-slate-400 text-xs">{formatDate(l.createdAt)}</span>,
    },
    {
      header: 'User / Actor',
      accessorKey: 'userName',
      sortable: true,
      cell: (l) => (
        <div>
          <p className="font-bold text-slate-100">{l.userName || 'System'}</p>
          <span className="font-mono text-blue-400 text-xs">{l.userEmail || 'system@core'}</span>
        </div>
      ),
    },
    {
      header: 'Action',
      accessorKey: 'action',
      cell: (l) => (
        <Badge
          variant={
            l.action === 'CREATE' || l.action === 'APPROVE'
              ? 'success'
              : l.action === 'REVERSE'
              ? 'danger'
              : 'primary'
          }
          size="sm"
        >
          {l.action}
        </Badge>
      ),
    },
    {
      header: 'Entity / Resource',
      accessorKey: 'entity',
      sortable: true,
      cell: (l) => (
        <span className="font-mono text-purple-300 font-semibold text-xs">
          {l.entity}
        </span>
      ),
    },
    {
      header: 'Event Details & Audit Notes',
      accessorKey: 'details',
      cell: (l) => (
        <div className="text-xs text-slate-300 max-w-md truncate">
          {l.details}
        </div>
      ),
    },
    {
      header: 'IP Address',
      accessorKey: 'ipAddress',
      cell: (l) => <span className="font-mono text-slate-500 text-xs">{l.ipAddress || '—'}</span>,
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

        <Badge variant="success" size="sm">
          <ShieldCheck className="w-3.5 h-3.5 mr-1" />
          Tamper-Evident Audit Active
        </Badge>
      </div>

      <Card className="p-6 space-y-4">
        <CardHeader className="pb-2">
          <div>
            <CardTitle className="text-lg">Security & Operational Audit Trail</CardTitle>
            <CardDescription>
              Immutable compliance record of administrative actions, status reversals, and financial operations
            </CardDescription>
          </div>
        </CardHeader>

        <DataTable
          columns={columns}
          data={logs}
          isLoading={isLoading}
          searchPlaceholder="Search audit events by user, entity, or action..."
          pageSize={10}
        />
      </Card>
    </div>
  );
}
