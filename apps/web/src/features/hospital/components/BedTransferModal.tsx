'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { transferBed } from '../services/hospital.api';
import { HospitalBed } from '../types/hospital.types';

export interface BedTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  bed: HospitalBed | null;
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
  const [targetBedId, setTargetBedId] = useState('b-04');

  if (!bed || !bed.currentAdmission) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await transferBed(bed.currentAdmission!.id, targetBedId);
      toast.success(
        'Bed Transferred',
        `Patient ${bed.currentAdmission?.patientName} relocated to new bed atomically.`,
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
      title="Transfer Inpatient Bed"
      description="Relocate active patient to another available bed with atomic status update."
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
            <span className="text-slate-400">Current Patient:</span>
            <span className="font-bold text-white">{bed.currentAdmission.patientName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Current Bed:</span>
            <span className="font-mono font-bold text-rose-400">{bed.bedNumber}</span>
          </div>
        </div>

        <Select
          label="Select Target Available Bed *"
          value={targetBedId}
          onChange={(e) => setTargetBedId(e.target.value)}
          options={[
            { value: 'b-02', label: 'B-02 (Ward A — General)' },
            { value: 'b-04', label: 'B-04 (Ward A — General)' },
            { value: 'b-06', label: 'B-06 (Ward A — General)' },
            { value: 'b-13', label: 'ICU-03 (ICU — Critical Care)' },
            { value: 'b-16', label: 'ICU-06 (ICU — Critical Care)' },
          ]}
        />
      </form>
    </Modal>
  );
};
