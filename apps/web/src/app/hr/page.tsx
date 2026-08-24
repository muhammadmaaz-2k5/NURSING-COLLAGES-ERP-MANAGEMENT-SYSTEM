'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  DollarSign,
  Calendar,
  Plus,
  ArrowRight,
  ShieldCheck,
  Building,
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  RotateCcw,
} from 'lucide-react';
import { DataTable, Column } from '../../components/tables/DataTable';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { PayrollStatusBadge } from '../../features/hr/components/PayrollStatusBadge';
import { EmployeeModal } from '../../features/hr/components/EmployeeModal';
import { PayrollRunModal } from '../../features/hr/components/PayrollRunModal';
import { LeaveRequestModal } from '../../features/hr/components/LeaveRequestModal';
import {
  fetchHrDashboard,
  fetchEmployees,
  fetchLeaves,
  fetchPayrolls,
  updateLeaveStatus,
} from '../../features/hr/services/hr.api';
import {
  Employee,
  EmployeeLeave,
  PayrollRecord,
  HrDashboardData,
} from '../../features/hr/types/hr.types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { useToast } from '../../context/ToastContext';

type HrTab = 'employees' | 'payroll' | 'leaves';

export default function HrPage() {
  const router = useRouter();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<HrTab>('employees');
  const [dashboard, setDashboard] = useState<HrDashboardData | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]);
  const [leaves, setLeaves] = useState<EmployeeLeave[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [dashRes, empRes, payRes, lvRes] = await Promise.all([
        fetchHrDashboard(),
        fetchEmployees(),
        fetchPayrolls({ month: 8, year: 2026 }),
        fetchLeaves(),
      ]);
      setDashboard(dashRes);
      setEmployees(empRes.data);
      setPayrolls(payRes);
      setLeaves(lvRes);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLeaveDecision = async (id: string, decision: 'APPROVED' | 'REJECTED') => {
    try {
      await updateLeaveStatus(id, decision);
      toast.success(
        `Leave ${decision}`,
        `Application status updated to ${decision.toLowerCase()}.`,
      );
      loadData();
    } catch (err: any) {
      toast.error('Decision Failed', err?.message || 'Could not update leave');
    }
  };

  const employeeColumns: Column<Employee>[] = [
    {
      header: 'Faculty / Staff Member',
      accessorKey: 'firstName',
      sortable: true,
      cell: (emp) => (
        <div className="flex items-center gap-3">
          <img
            src={emp.avatarUrl || 'https://images.unsplash.com/photo-1594824813689-53697e887640?w=150'}
            alt={emp.firstName}
            className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
          />
          <div>
            <p className="font-bold text-slate-100">
              {emp.firstName} {emp.lastName || ''}
            </p>
            <span className="font-mono text-blue-400 text-xs font-semibold">{emp.employeeId}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Designation & Department',
      accessorKey: 'designation',
      sortable: true,
      cell: (emp) => (
        <div>
          <p className="font-semibold text-slate-200 text-xs">{emp.designation}</p>
          <span className="text-slate-400 text-[11px] block">{emp.departmentName || 'Nursing Faculty'}</span>
        </div>
      ),
    },
    {
      header: 'Monthly Compensation',
      sortable: true,
      cell: (emp) => (
        <div className="font-mono text-xs">
          <span className="font-bold text-emerald-400 text-sm">
            {formatCurrency(emp.netSalary || emp.basicSalary)}
          </span>
          <span className="text-slate-500 block text-[10px]">
            Base: {formatCurrency(emp.basicSalary)}
          </span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (emp) => (
        <Badge
          variant={
            emp.status === 'ACTIVE'
              ? 'success'
              : emp.status === 'ON_LEAVE'
              ? 'warning'
              : 'neutral'
          }
          size="sm"
          dot
        >
          {emp.status}
        </Badge>
      ),
    },
    {
      header: 'Action',
      cell: (emp) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/hr/employees/${emp.id}`)}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          360° Profile
        </Button>
      ),
    },
  ];

  const payrollColumns: Column<PayrollRecord>[] = [
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
      header: 'Salary Breakdown',
      cell: (p) => (
        <div className="font-mono text-xs text-slate-400">
          <span>Base {formatCurrency(p.basicSalary)}</span>
          <span className="text-emerald-400 font-semibold"> + Allow {formatCurrency(p.allowances)}</span>
          <span className="text-rose-400"> - Tax {formatCurrency(p.taxDeduction)}</span>
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
          Salary Payslip
        </Button>
      ),
    },
  ];

  const leaveColumns: Column<EmployeeLeave>[] = [
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
              onClick={() => handleLeaveDecision(lv.id, 'APPROVED')}
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
            >
              Approve
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLeaveDecision(lv.id, 'REJECTED')}
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
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Human Resources & Payroll Management
            </h1>
            <Badge variant="success" size="sm">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Deterministic Salary Engine
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage faculty profiles, automated payroll calculations, disbursement immutability locks, and staff leave approvals.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEmployeeModalOpen(true)}
            leftIcon={<Users className="w-4 h-4" />}
          >
            Register Employee
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLeaveModalOpen(true)}
            leftIcon={<Calendar className="w-4 h-4" />}
          >
            Apply Leave
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
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Staff Headcount
          </span>
          <h3 className="text-2xl font-black text-white mt-1">
            {dashboard?.totalEmployees || 46}
          </h3>
          <p className="text-xs text-blue-400 mt-2 font-medium">Faculty & Healthcare Staff</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Active On Duty
          </span>
          <h3 className="text-2xl font-black text-emerald-400 mt-1">
            {dashboard?.activeEmployees || 43}
          </h3>
          <p className="text-xs text-emerald-300 mt-2 font-medium">Teaching & Clinical Duties</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Monthly Payroll Budget
          </span>
          <h3 className="text-2xl font-black text-purple-400 mt-1">
            {formatCurrency(dashboard?.monthlyPayrollExpense || 4280000)}
          </h3>
          <p className="text-xs text-purple-300 mt-2 font-medium">August 2026 Batch</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Pending Leave Requests
          </span>
          <h3 className="text-2xl font-black text-amber-400 mt-1">
            {dashboard?.pendingLeavesCount || 2}
          </h3>
          <p className="text-xs text-amber-300 mt-2 font-medium">Awaiting HOD Approval</p>
        </Card>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {[
          { id: 'employees' as const, label: 'Faculty & Staff Directory', icon: Users, count: employees.length },
          { id: 'payroll' as const, label: 'Payroll Engine & Batches', icon: DollarSign, count: payrolls.length },
          { id: 'leaves' as const, label: 'Staff Leave Management', icon: Calendar, count: leaves.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}

      {/* 1. EMPLOYEES */}
      {activeTab === 'employees' && (
        <Card className="p-6 space-y-4">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-lg">Faculty & Staff Employee Directory</CardTitle>
              <CardDescription>
                Search employee roster by name, employee code, or academic department
              </CardDescription>
            </div>
          </CardHeader>

          <DataTable
            columns={employeeColumns}
            data={employees}
            isLoading={isLoading}
            searchPlaceholder="Search by name, employee ID, or designation..."
            pageSize={10}
            onRowClick={(emp) => router.push(`/hr/employees/${emp.id}`)}
          />
        </Card>
      )}

      {/* 2. PAYROLL */}
      {activeTab === 'payroll' && (
        <Card className="p-6 space-y-4">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-lg">Monthly Payroll Runs & Immutability Ledger</CardTitle>
              <CardDescription>
                Deterministic payroll formula: Basic + Allowances + Bonuses - Tax Deductions
              </CardDescription>
            </div>
          </CardHeader>

          <DataTable
            columns={payrollColumns}
            data={payrolls}
            isLoading={isLoading}
            searchPlaceholder="Search by employee name or code..."
            pageSize={10}
            onRowClick={(p) => router.push(`/hr/payroll/${p.id}`)}
          />
        </Card>
      )}

      {/* 3. LEAVES */}
      {activeTab === 'leaves' && (
        <Card className="p-6 space-y-4">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-lg">Faculty & Staff Leave Approvals Queue</CardTitle>
              <CardDescription>
                Review and approve leave applications for academic and administrative staff
              </CardDescription>
            </div>
          </CardHeader>

          <DataTable
            columns={leaveColumns}
            data={leaves}
            isLoading={isLoading}
            searchPlaceholder="Search by employee name or leave type..."
            pageSize={10}
          />
        </Card>
      )}

      {/* Modals */}
      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        onSuccess={loadData}
      />

      <PayrollRunModal
        isOpen={isPayrollModalOpen}
        onClose={() => setIsPayrollModalOpen(false)}
        onSuccess={loadData}
      />

      <LeaveRequestModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
