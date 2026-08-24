'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { transferBed } from '../services/hostel.api';
import { HostelBed } from '../types/hostel.types';

export interface BedTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  bed: HostelBed | null;
  onSuccess?: () => void;
}

export const BedTransferModal: React.FC<BedTransferModalProps> = ({
  isOpen,
  onClose,
  bed,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [targetBedId, setTargetBedId] = useState('bd-202B');

  if (!bed || !bed.currentAllocation) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await transferBed(bed.currentAllocation!.id, targetBedId);
      toast.success(
        'Bed Transferred',
        `Resident ${bed.currentAllocation?.studentName} transferred to new bed.`,
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Transfer Failed', err?.message || 'Target bed is occupied or invalid');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transfer Student Hostel Bed"
      description="Relocate resident student to another available bed with atomic status update."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Execute Bed Transfer
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Current Resident:</span>
            <span className="font-bold text-white">{bed.currentAllocation.studentName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Current Bed Slot:</span>
            <span className="font-mono font-bold text-rose-400">{bed.bedNumber}</span>
          </div>
        </div>

        <Select
          label="Select Target Available Bed *"
          value={targetBedId}
          onChange={(e) => setTargetBedId(e.target.value)}
          options={[
            { value: 'bd-202B', label: 'Room 202 — Bed B-02 (Available)' },
            { value: 'bd-203C', label: 'Room 203 — Bed B-03 (Available)' },
            { value: 'bd-101B', label: 'Room 101 — Bed B-02 (Available)' },
          ]}
        />
      </form>
    </Modal>
  );
};
