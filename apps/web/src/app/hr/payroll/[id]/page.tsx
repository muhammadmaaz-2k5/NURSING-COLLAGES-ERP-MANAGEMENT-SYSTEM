'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  Printer,
  ShieldCheck,
  Building,
  RotateCcw,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { PayrollStatusBadge } from '../../../../features/hr/components/PayrollStatusBadge';
import { PayrollReversalModal } from '../../../../features/hr/components/PayrollReversalModal';
import {
  fetchPayrolls,
  approvePayroll,
  disbursePayroll,
} from '../../../../features/hr/services/hr.api';
import { PayrollRecord } from '../../../../features/hr/types/hr.types';
import { formatCurrency, formatDate } from '../../../../lib/utils';
import { useToast } from '../../../../context/ToastContext';

export default function SalarySlipPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const payrollId = params?.id as string;

  const [payroll, setPayroll] = useState<PayrollRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReversalModalOpen, setIsReversalModalOpen] = useState(false);

  const loadData = async () => {
    if (!payrollId) return;
    setIsLoading(true);
    try {
      const payrolls = await fetchPayrolls();
      const found = payrolls.find((p) => p.id === payrollId) || payrolls[0];
      setPayroll(found || null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [payrollId]);

  const handleApprove = async () => {
    if (!payroll) return;
    try {
      await approvePayroll(payroll.id);
      toast.success('Payroll Approved', 'Record locked from automatic modification.');
      loadData();
    } catch (err: any) {
      toast.error('Approval Error', err?.message || 'Failed to approve');
    }
  };

  const handleDisburse = async () => {
    if (!payroll) return;
    try {
      await disbursePayroll(payroll.id);
      toast.success('Payroll Disbursed', 'Marked as PAID and finalized.');
      loadData();
    } catch (err: any) {
      toast.error('Disbursement Error', err?.message || 'Failed to disburse');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-xs text-slate-400 font-medium">Generating Official Salary Slip...</p>
      </div>
    );
  }

  if (!payroll) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="text-lg font-bold text-slate-200">Payroll Record Not Found</h3>
        <Button variant="primary" size="sm" onClick={() => router.push('/hr')}>
          Back to HR
        </Button>
      </div>
    );
  }

  const isPaid = payroll.status === 'PAID';

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between print:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/hr')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to HR Command Center
        </Button>

        <div className="flex items-center gap-2">
          {payroll.status === 'CALCULATED' && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleApprove}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Approve Payroll
            </Button>
          )}

          {payroll.status === 'APPROVED' && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleDisburse}
              leftIcon={<Lock className="w-4 h-4" />}
            >
              Disburse & Lock
            </Button>
          )}

          {isPaid && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsReversalModalOpen(true)}
              leftIcon={<RotateCcw className="w-4 h-4 text-rose-400" />}
            >
              Audited Reversal
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print Payslip
          </Button>
        </div>
      </div>

      {/* Printable Payslip Container */}
      <div className="p-8 lg:p-12 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-2xl shadow-2xl space-y-8 print:bg-white print:text-black print:p-0 print:border-none print:shadow-none">
        {/* Header Strip */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-6 print:border-slate-300">
          <div>
            <div className="flex items-center gap-2">
              <Building className="w-6 h-6 text-blue-500 print:text-black" />
              <h2 className="text-xl font-black text-white print:text-black tracking-tight">
                COLLEGE OF NURSING & HEALTH SCIENCES
              </h2>
            </div>
            <p className="text-xs text-slate-400 print:text-slate-600 mt-1">
              Sector H-8/4 Institutional Campus, Islamabad, Pakistan
            </p>
            <p className="text-xs font-mono font-bold text-blue-400 print:text-black mt-0.5">
              OFFICIAL MONTHLY SALARY PAYSLIP
            </p>
          </div>

          <div className="text-right space-y-1">
            <PayrollStatusBadge status={payroll.status} />
            <p className="text-xs font-mono text-slate-400 print:text-slate-600">
              Period: Month {payroll.month} / {payroll.year}
            </p>
            <p className="text-[10px] font-mono text-slate-500">
              Slip ID: {payroll.id.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Employee Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 print:bg-slate-50 print:border-slate-300 text-xs">
          <div>
            <span className="text-slate-500 font-medium block">Employee Name</span>
            <span className="font-bold text-white print:text-black">{payroll.employeeName}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Employee Code</span>
            <span className="font-mono font-bold text-blue-400 print:text-black">
              {payroll.employeeCode}
            </span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Designation</span>
            <span className="text-white print:text-black">{payroll.designation}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Department</span>
            <span className="text-white print:text-black">{payroll.departmentName}</span>
          </div>
        </div>

        {/* Financial Breakdown Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Earnings */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 print:text-emerald-700 uppercase tracking-wider">
              Earnings & Allowances
            </h4>
            <div className="rounded-2xl border border-slate-800 print:border-slate-300 divide-y divide-slate-800 print:divide-slate-300 text-xs">
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-300 print:text-black">Basic Contractual Salary</span>
                <span className="font-mono font-bold text-white print:text-black">
                  {formatCurrency(payroll.basicSalary)}
                </span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-300 print:text-black">Teaching & Clinical Allowance</span>
                <span className="font-mono font-bold text-emerald-400 print:text-black">
                  +{formatCurrency(payroll.allowances)}
                </span>
              </div>
              {payroll.bonuses > 0 && (
                <div className="p-3 flex items-center justify-between">
                  <span className="text-slate-300 print:text-black">Performance Bonus</span>
                  <span className="font-mono font-bold text-emerald-400 print:text-black">
                    +{formatCurrency(payroll.bonuses)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Deductions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-rose-400 print:text-rose-700 uppercase tracking-wider">
              Statutory & Other Deductions
            </h4>
            <div className="rounded-2xl border border-slate-800 print:border-slate-300 divide-y divide-slate-800 print:divide-slate-300 text-xs">
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-300 print:text-black">Income Tax (FBR Withholding)</span>
                <span className="font-mono font-bold text-rose-400 print:text-black">
                  -{formatCurrency(payroll.taxDeduction)}
                </span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-300 print:text-black">Unpaid Leave Deduction</span>
                <span className="font-mono font-bold text-slate-400 print:text-black">
                  -{formatCurrency(payroll.unpaidLeaveDeduction)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Salary Summary */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/50 via-slate-950 to-indigo-950/50 border border-blue-500/30 print:bg-slate-100 print:border-slate-400 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-slate-400 print:text-slate-600">
              Net Payable Disbursed Amount
            </span>
            <p className="text-xs text-slate-400 print:text-slate-600 mt-0.5">
              Payment Method: {payroll.paymentMethod || 'Direct Bank Wire'}
            </p>
          </div>

          <h3 className="text-3xl font-black font-mono text-emerald-400 print:text-black">
            {formatCurrency(payroll.netSalary)}
          </h3>
        </div>

        {/* Cryptographic Verification Footer */}
        <div className="pt-6 border-t border-slate-800 print:border-slate-300 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-400 print:text-black" />
            <span>Deterministic Payroll Record • Immutability Verified</span>
          </div>

          <div className="text-right">
            <span>Authorizing Signatory: Finance & HR Directorate</span>
          </div>
        </div>
      </div>

      {/* Reversal Modal */}
      <PayrollReversalModal
        isOpen={isReversalModalOpen}
        onClose={() => setIsReversalModalOpen(false)}
        payroll={payroll}
        onSuccess={loadData}
      />
    </div>
  );
}
