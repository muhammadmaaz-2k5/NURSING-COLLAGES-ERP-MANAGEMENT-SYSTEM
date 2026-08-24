'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { createFeeStructure } from '../services/finance.api';
import { CreateFeeStructureDto, FeeType } from '../types/finance.types';

export interface FeeStructureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const FeeStructureModal: React.FC<FeeStructureModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<CreateFeeStructureDto>({
    programId: 'prog-01',
    name: '',
    description: '',
    amount: 85000,
    feeType: 'TUITION',
    dueDate: '2026-09-10',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || form.amount <= 0) {
      toast.error('Validation Error', 'Please provide structure name and valid amount.');
      return;
    }

    setIsLoading(true);
    try {
      await createFeeStructure(form);
      toast.success('Tariff Created', `${form.name} added to institutional fee schedules.`);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Creation Failed', err?.message || 'Could not create fee structure');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Institutional Fee Tariff / Structure"
      description="Define standard tuition, clinical, or laboratory fee schedule for academic programs."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Save Fee Schedule
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Fee Schedule Title *"
          placeholder="e.g. BSN Semester 1 Tuition & Lab Fee"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Fee Category / Type *"
            value={form.feeType}
            onChange={(e) => setForm({ ...form, feeType: e.target.value as FeeType })}
            options={[
              { value: 'TUITION', label: 'Semester Tuition Fee' },
              { value: 'CLINICAL_TRAINING', label: 'Hospital Clinical Training' },
              { value: 'LABORATORY', label: 'Simulation & Wet Lab Consumables' },
              { value: 'ADMISSION', label: 'One-time Admission Fee' },
              { value: 'HOSTEL', label: 'Hostel Accommodation Fee' },
              { value: 'TRANSPORT', label: 'Campus Transport Bus Pass' },
              { value: 'EXAMINATION', label: 'PNC Examination Registration' },
            ]}
          />
          <Select
            label="Degree Program *"
            value={form.programId}
            onChange={(e) => setForm({ ...form, programId: e.target.value })}
            options={[
              { value: 'prog-01', label: 'Generic BSN (4-Year)' },
              { value: 'prog-02', label: 'Post-RN BSN (2-Year)' },
              { value: 'prog-03', label: 'Doctor of Physical Therapy (5-Year)' },
              { value: 'prog-04', label: 'BS-MLT (4-Year)' },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Amount (PKR) *"
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
            required
          />
          <Input
            label="Default Payment Due Date"
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
        </div>

        <Input
          label="Tariff Notes / Inclusions"
          placeholder="e.g. Includes semester tuition, clinical hospital access, and simulation lab kits"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </form>
    </Modal>
  );
};
