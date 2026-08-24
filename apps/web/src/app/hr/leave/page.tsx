'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  XCircle,
  Plus,
  Clock,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { DataTable, Column } from '../../../components/tables/DataTable';
import { LeaveRequestModal } from '../../../features/hr/components/LeaveRequestModal';
import { fetchLeaves, updateLeaveStatus } from '../../../features/hr/services/hr.api';
import { EmployeeLeave } from '../../../features/hr/types/hr.types';
import { formatDate } from '../../../lib/utils';
import { useToast } from '../../../context/ToastContext';

export default function LeavePage() {
  const router = useRouter();
  const toast = useToast();
  const [leaves, setLeaves] = useState<EmployeeLeave[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchLeaves();
      setLeaves(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDecision = async (id: string, decision: 'APPROVED' | 'REJECTED') => {
    try {
      await updateLeaveStatus(id, decision);
      toast.success(
        `Leave ${decision}`,
        `Application marked as ${decision.toLowerCase()}.`,
      );
      loadData();
    } catch (err: any) {
      toast.error('Action Failed', err?.message || 'Could not update leave');
    }
  };

  const columns: Column<EmployeeLeave>[] = [
    {
      header: 'Faculty Member',
      accessorKey: 'employeeName',
      sortable: true,
      cell: (lv) => (
        <div>
          <p className="font-bold text-slate-100">{lv.employeeName}</p>
          <span className="font-mono text-xs text-blue-400">{lv.employeeCode}</span>
        </div>
      ),
    },
    {
      header: 'Leave Type & Days',
      accessorKey: 'leaveType',
      sortable: true,
      cell: (lv) => (
        <div>
          <Badge variant="purple" size="sm">
            {lv.leaveType} LEAVE
          </Badge>
          <span className="text-xs text-slate-300 font-semibold block mt-1">
            {lv.daysCount} Days ({formatDate(lv.startDate)} - {formatDate(lv.endDate)})
          </span>
        </div>
      ),
    },
    {
      header: 'Reason',
      accessorKey: 'reason',
      cell: (lv) => <span className="text-xs text-slate-400">{lv.reason || 'Personal'}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (lv) => (
        <Badge
          variant={
            lv.status === 'APPROVED'
              ? 'success'
              : lv.status === 'PENDING'
              ? 'warning'
              : 'danger'
          }
          size="sm"
          dot
        >
          {lv.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      cell: (lv) =>
        lv.status === 'PENDING' ? (
          <div className="flex items-center gap-1.5">
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleDecision(lv.id, 'APPROVED')}
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
            >
              Approve
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDecision(lv.id, 'REJECTED')}
              leftIcon={<XCircle className="w-3.5 h-3.5" />}
            >
              Reject
            </Button>
          </div>
        ) : (
          <span className="text-slate-500 text-xs">Decision Finalized</span>
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
          onClick={() => setIsLeaveModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Apply Leave
        </Button>
      </div>

      <Card className="p-6 space-y-4">
        <CardHeader className="pb-2">
          <div>
            <CardTitle className="text-lg">Staff & Faculty Leave Requests</CardTitle>
            <CardDescription>
              Review pending leave requests and approve duty leaves
            </CardDescription>
          </div>
        </CardHeader>

        <DataTable
          columns={columns}
          data={leaves}
          isLoading={isLoading}
          searchPlaceholder="Search by employee name or reason..."
          pageSize={10}
        />
      </Card>

      <LeaveRequestModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
