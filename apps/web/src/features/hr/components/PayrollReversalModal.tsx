'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { reversePayroll } from '../services/hr.api';
import { PayrollRecord } from '../types/hr.types';
import { formatCurrency } from '../../../lib/utils';

export interface PayrollReversalModalProps {
  isOpen: boolean;
  onClose: () => void;
  payroll: PayrollRecord | null;
  onSuccess?: () => void;
}

export const PayrollReversalModal: React.FC<PayrollReversalModalProps> = ({
  isOpen,
  onClose,
  payroll,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState('');

  if (!payroll) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error('Validation Error', 'Mandatory reversal reason required for audit compliance.');
      return;
    }

    setIsLoading(true);
    try {
      await reversePayroll(payroll.id, reason);
      toast.success(
        'Payroll Reversed',
        `Compensating audit entry created for ${payroll.employeeName}.`,
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Reversal Failed', err?.message || 'Could not reverse payroll');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reverse Finalized Payroll Record (Audited)"
      description="Compensating financial reversal with mandatory compliance audit explanation."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Confirm Audited Reversal
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Employee:</span>
            <span className="font-bold text-white">{payroll.employeeName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Payroll Period:</span>
            <span className="font-mono font-bold text-blue-400">
              Month {payroll.month} / {payroll.year}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Net Salary to Reverse:</span>
            <span className="font-mono font-bold text-rose-400">
              {formatCurrency(payroll.netSalary)}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300 uppercase">
            Mandatory Reversal Justification Reason *
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Erroneous tax deduction adjustment required for revised allowance policy"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-rose-500"
            required
          />
        </div>
      </form>
    </Modal>
  );
};
