'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { returnBook } from '../services/library.api';
import { CirculationIssue } from '../types/library.types';
import { formatCurrency } from '../../../lib/utils';

export interface ReturnBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: CirculationIssue | null;
  onSuccess?: () => void;
}

export const ReturnBookModal: React.FC<ReturnBookModalProps> = ({
  isOpen,
  onClose,
  issue,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [condition, setCondition] = useState('Good');
  const [waiveFine, setWaiveFine] = useState(false);

  if (!issue) return null;

  const fineAmount = issue.fineAmount || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await returnBook(issue.id, {
        condition,
        fineAmount: waiveFine ? 0 : fineAmount,
        waiveFine,
      });

      toast.success(
        'Book Returned',
        `Accession copy ${issue.accessionNo} returned and released to AVAILABLE inventory.`,
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Return Failed', err?.message || 'Could not process return');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Process Library Book Return"
      description="Check in book copy, assess physical condition, and reconcile overdue fines."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Confirm Return & Free Copy
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Book Title:</span>
            <span className="font-bold text-white truncate max-w-xs">{issue.bookTitle}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Accession Copy:</span>
            <span className="font-mono font-bold text-blue-400">{issue.accessionNo}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Borrower Student:</span>
            <span className="font-semibold text-slate-200">
              {issue.studentName} ({issue.studentRegId})
            </span>
          </div>
        </div>

        {fineAmount > 0 && (
          <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-rose-300 font-bold">Overdue Fine Calculation:</span>
              <span className="font-mono font-black text-rose-400 text-sm">
                {formatCurrency(fineAmount)} ({issue.daysOverdue} days overdue)
              </span>
            </div>

            <label className="flex items-center gap-2 text-slate-300 cursor-pointer pt-1 border-t border-rose-500/20">
              <input
                type="checkbox"
                checked={waiveFine}
                onChange={(e) => setWaiveFine(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-0"
              />
              <span>Waive Overdue Fine (Authorized Exemption)</span>
            </label>
          </div>
        )}

        <Input
          label="Book Return Physical Condition"
          placeholder="e.g. Good / Minor Wear"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
        />
      </form>
    </Modal>
  );
};
