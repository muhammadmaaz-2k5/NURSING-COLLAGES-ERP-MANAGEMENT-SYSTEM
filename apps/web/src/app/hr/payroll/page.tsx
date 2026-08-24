'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  DollarSign,
  Play,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Lock,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { DataTable, Column } from '../../../components/tables/DataTable';
import { PayrollStatusBadge } from '../../../features/hr/components/PayrollStatusBadge';
import { PayrollRunModal } from '../../../features/hr/components/PayrollRunModal';
import { fetchPayrolls } from '../../../features/hr/services/hr.api';
import { PayrollRecord } from '../../../features/hr/types/hr.types';
import { formatCurrency, formatDate } from '../../../lib/utils';

export default function PayrollWorkspacePage() {
  const router = useRouter();
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchPayrolls();
      setPayrolls(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const columns: Column<PayrollRecord>[] = [
    {
      header: 'Staff Member',
      accessorKey: 'employeeName',
      sortable: true,
      cell: (p) => (
        <div>
          <p className="font-bold text-slate-100">{p.employeeName}</p>
          <span className="font-mono text-xs text-blue-400">{p.employeeCode}</span>
        </div>
      ),
    },
    {
      header: 'Period',
      sortable: true,
      cell: (p) => (
        <span className="font-mono text-xs font-bold text-slate-200">
          Month {p.month}/{p.year}
        </span>
      ),
    },
    {
      header: 'Basic + Allowances - Tax',
      cell: (p) => (
        <div className="font-mono text-xs text-slate-400">
          <span>Base {formatCurrency(p.basicSalary)}</span>
          <span className="text-emerald-400"> + {formatCurrency(p.allowances)}</span>
          <span className="text-rose-400"> - {formatCurrency(p.taxDeduction)}</span>
        </div>
      ),
    },
    {
      header: 'Net Disbursed',
      accessorKey: 'netSalary',
      sortable: true,
      cell: (p) => (
        <span className="font-mono font-bold text-emerald-400 text-sm">
          {formatCurrency(p.netSalary)}
        </span>
      ),
    },
    {
      header: 'Payroll Status',
      accessorKey: 'status',
      cell: (p) => <PayrollStatusBadge status={p.status} />,
    },
    {
      header: 'Action',
      cell: (p) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/hr/payroll/${p.id}`)}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          View Slip
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/hr')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to HR Command Center
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsPayrollModalOpen(true)}
          leftIcon={<Play className="w-4 h-4" />}
        >
          Run Payroll Engine
        </Button>
      </div>

      <Card className="p-6 space-y-4">
        <CardHeader className="pb-2">
          <div>
            <CardTitle className="text-lg">Monthly Payroll Engine Ledger</CardTitle>
            <CardDescription>
              Deterministic payroll calculations with immutability status locks
            </CardDescription>
          </div>
        </CardHeader>

        <DataTable
          columns={columns}
          data={payrolls}
          isLoading={isLoading}
          searchPlaceholder="Search by employee name or code..."
          pageSize={10}
          onRowClick={(p) => router.push(`/hr/payroll/${p.id}`)}
        />
      </Card>

      <PayrollRunModal
        isOpen={isPayrollModalOpen}
        onClose={() => setIsPayrollModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
