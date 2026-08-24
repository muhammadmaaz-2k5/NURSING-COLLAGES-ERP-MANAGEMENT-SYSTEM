'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { createRotation } from '../services/clinical.api';
import { CreateRotationDto } from '../types/clinical.types';

export interface RotationCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RotationCreateModal: React.FC<RotationCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<CreateRotationDto>({
    studentId: 'stud-01',
    siteId: 'site-01',
    facultyId: 'fac-01',
    department: 'Cardiology & Intensive Care',
    ward: 'CCU / ICU Ward 4',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    remarks: 'Morning shift rotation (08:00 - 14:00)',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createRotation(form);
      toast.success(
        'Rotation Scheduled',
        `Clinical posting created at ${form.ward} with automatic shift clash check.`,
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Scheduling Conflict', err?.message || 'Failed to schedule rotation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Student Clinical Ward Rotation"
      description="Allocate hospital duty, ward unit, and supervising faculty with clash prevention."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Assign Rotation
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Select Nursing Student *"
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
          <Select
            label="Hospital / Clinical Site *"
            value={form.siteId}
            onChange={(e) => setForm({ ...form, siteId: e.target.value })}
            options={[
              { value: 'site-01', label: 'National Teaching Hospital' },
              { value: 'site-02', label: 'Federal Community Health Center' },
              { value: 'site-03', label: 'Margalla Trauma & Emergency' },
            ]}
          />
          <Select
            label="Supervising Faculty *"
            value={form.facultyId}
            onChange={(e) => setForm({ ...form, facultyId: e.target.value })}
            options={[
              { value: 'fac-01', label: 'Dr. Sarah Khan (Assistant Prof)' },
              { value: 'fac-02', label: 'Dr. Tariq Mahmood (Associate Prof)' },
              { value: 'fac-03', label: 'Dr. Usman Ali (Senior Lecturer)' },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Clinical Department *"
            placeholder="e.g. Cardiology & ICU"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            required
          />
          <Input
            label="Hospital Ward / Unit *"
            placeholder="e.g. CCU / ICU Ward 4"
            value={form.ward}
            onChange={(e) => setForm({ ...form, ward: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start Date *"
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            required
          />
          <Input
            label="End Date *"
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            required
          />
        </div>

        <Input
          label="Shift Timing & Duty Instructions"
          placeholder="e.g. Morning Shift (08:00 - 14:00)"
          value={form.remarks}
          onChange={(e) => setForm({ ...form, remarks: e.target.value })}
        />
      </form>
    </Modal>
  );
};
