'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  Users,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { fetchEmployeeById } from '../../../../features/hr/services/hr.api';
import { Employee } from '../../../../features/hr/types/hr.types';
import { formatCurrency, formatDate } from '../../../../lib/utils';

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params?.id as string;

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!employeeId) return;
      setIsLoading(true);
      try {
        const data = await fetchEmployeeById(employeeId);
        setEmployee(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [employeeId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-xs text-slate-400 font-medium">Loading Employee 360° Profile...</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="text-lg font-bold text-slate-200">Employee Record Not Found</h3>
        <Button variant="primary" size="sm" onClick={() => router.push('/hr')}>
          Back to HR
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/hr')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to HR Directory
        </Button>
      </div>

      {/* Employee 360° Banner */}
      <div className="p-6 lg:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={
                employee.avatarUrl ||
                'https://images.unsplash.com/photo-1594824813689-53697e887640?w=150'
              }
              alt={employee.firstName}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shrink-0 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">
                  {employee.firstName} {employee.lastName || ''}
                </h1>
                <Badge variant={employee.status === 'ACTIVE' ? 'success' : 'warning'} size="sm" dot>
                  {employee.status}
                </Badge>
              </div>
              <p className="font-mono text-blue-400 font-bold text-xs mt-0.5">
                {employee.employeeId}
              </p>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                {employee.designation} • {employee.departmentName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center min-w-[140px]">
              <span className="text-[10px] uppercase font-bold text-slate-500">Contractual Net</span>
              <p className="text-xl font-black font-mono text-emerald-400 mt-0.5">
                {formatCurrency(employee.netSalary || employee.basicSalary)}
              </p>
              <span className="text-[10px] text-slate-400 block">Monthly Compensation</span>
            </div>
          </div>
        </div>

        {/* Employee Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 font-medium block">Qualifications</span>
            <span className="font-bold text-slate-200">{employee.qualification || 'RN, BSN'}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Official Email</span>
            <span className="font-mono text-slate-200">{employee.email || '—'}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Contact Mobile</span>
            <span className="font-mono text-slate-200">{employee.phone || '—'}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Joining Date</span>
            <span className="font-mono text-slate-200">{formatDate(employee.joiningDate)}</span>
          </div>
        </div>
      </div>

      {/* Leave Balance Counters */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-5 text-center">
          <span className="text-xs font-semibold text-slate-400 uppercase">Casual Leaves</span>
          <p className="text-2xl font-black font-mono text-blue-400 mt-1">
            {employee.leaveBalance?.casual || 8} Days
          </p>
          <span className="text-[10px] text-slate-500 block mt-1">Available Balance</span>
        </Card>

        <Card className="p-5 text-center">
          <span className="text-xs font-semibold text-slate-400 uppercase">Sick Leaves</span>
          <p className="text-2xl font-black font-mono text-emerald-400 mt-1">
            {employee.leaveBalance?.sick || 10} Days
          </p>
          <span className="text-[10px] text-slate-500 block mt-1">Medical Allowance</span>
        </Card>

        <Card className="p-5 text-center">
          <span className="text-xs font-semibold text-slate-400 uppercase">Annual Leaves</span>
          <p className="text-2xl font-black font-mono text-purple-400 mt-1">
            {employee.leaveBalance?.annual || 18} Days
          </p>
          <span className="text-[10px] text-slate-500 block mt-1">Earned Balance</span>
        </Card>
      </div>
    </div>
  );
}
