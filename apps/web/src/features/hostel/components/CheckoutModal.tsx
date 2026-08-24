'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { checkOut } from '../services/hostel.api';
import { HostelBed } from '../types/hostel.types';

export interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  bed: HostelBed | null;
  onSuccess?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  bed,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [remarks, setRemarks] = useState(
    'Tenure completed. Room inventory verified and keys surrendered.',
  );

  if (!bed || !bed.currentAllocation) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await checkOut(bed.currentAllocation!.id, remarks);
      toast.success(
        'Student Checked Out',
        `Resident ${bed.currentAllocation?.studentName} checked out. Bed ${bed.bedNumber} released back to AVAILABLE.`,
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Checkout Failed', err?.message || 'Could not complete checkout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Check Out Student & Release Bed"
      description="Record room clearance, key return, and mark bed status as Available."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Confirm Checkout & Free Bed
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Student Name:</span>
            <span className="font-bold text-white">{bed.currentAllocation.studentName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Registration ID:</span>
            <span className="font-mono font-bold text-blue-400">
              {bed.currentAllocation.studentRegId}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Bed Slot:</span>
            <span className="font-mono font-bold text-rose-400">{bed.bedNumber}</span>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300 uppercase">
            Clearance Remarks & Key Handover Confirmation *
          </label>
          <textarea
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
      </form>
    </Modal>
  );
};
