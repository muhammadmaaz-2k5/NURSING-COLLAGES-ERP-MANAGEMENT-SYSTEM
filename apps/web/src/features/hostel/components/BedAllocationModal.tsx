'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { allocateBed } from '../services/hostel.api';
import { AllocateHostelBedDto, HostelBed } from '../types/hostel.types';

export interface BedAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBed?: HostelBed | null;
  onSuccess?: () => void;
}

export const BedAllocationModal: React.FC<BedAllocationModalProps> = ({
  isOpen,
  onClose,
  selectedBed,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<AllocateHostelBedDto>({
    studentId: 'stud-01',
    bedId: selectedBed?.id || 'bd-202B',
    startDate: '2026-09-01',
    endDate: '2027-08-31',
    remarks: 'Fall 2026 academic year hostel allotment',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await allocateBed({
        ...form,
        bedId: selectedBed?.id || form.bedId,
      });

      toast.success(
        'Bed Allocated',
        `Student allocated to Bed ${selectedBed?.bedNumber || form.bedId}. Single occupant lock verified.`,
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Allocation Error', err?.message || 'Bed is already occupied or unavailable');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Allocate Hostel Bed to Student"
      description="Assign residential bed with single-occupant isolation guarantee."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Confirm Bed Allocation
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {selectedBed && (
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Allocated Bed Slot:</span>
            <span className="font-mono font-bold text-emerald-400">
              {selectedBed.bedNumber}
            </span>
          </div>
        )}

        <Select
          label="Select Student *"
          value={form.studentId}
          onChange={(e) => setForm({ ...form, studentId: e.target.value })}
          options={[
            { value: 'stud-01', label: 'Amina Bibi (NUR-2022-0041 — BSN Sem 6)' },
            { value: 'stud-02', label: 'Bilal Khan (NUR-2022-0089 — BSN Sem 6)' },
            { value: 'stud-03', label: 'Farah Naz (NUR-2023-0104 — Post-RN Sem 3)' },
            { value: 'stud-04', label: 'Zainab Qureshi (NUR-2024-0012 — BSN Sem 2)' },
          ]}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Allocation Start Date *"
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            required
          />
          <Input
            label="Tenure Expiry Date"
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          />
        </div>

        <Input
          label="Hostel Allotment Remarks"
          placeholder="e.g. Fall semester residential accommodation"
          value={form.remarks}
          onChange={(e) => setForm({ ...form, remarks: e.target.value })}
        />
      </form>
    </Modal>
  );
};
