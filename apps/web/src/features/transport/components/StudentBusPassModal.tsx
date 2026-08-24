'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { assignTransport } from '../services/transport.api';
import { AssignTransportDto } from '../types/transport.types';

export interface StudentBusPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const StudentBusPassModal: React.FC<StudentBusPassModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<AssignTransportDto>({
    studentId: 'stud-01',
    vehicleId: 'veh-01',
    startDate: '2026-09-01',
    endDate: '2027-08-31',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await assignTransport(form);
      toast.success(
        'Bus Pass Issued',
        'Student allocated a seat in college transit fleet.',
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Pass Issuance Failed', err?.message || 'Vehicle seating capacity reached or unavailable');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Issue Student Transport Bus Pass"
      description="Assign student to bus route and deduct from real-time vehicle seating capacity."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Issue Transport Pass
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <Select
          label="Select Vehicle & Route *"
          value={form.vehicleId}
          onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
          options={[
            { value: 'veh-01', label: 'ICT-BUS-901 — Route 1 Rawalpindi (4 Seats Available)' },
            { value: 'veh-02', label: 'ICT-BUS-902 — Route 2 Islamabad (FULL / 0 Seats)' },
            { value: 'veh-03', label: 'ICT-BUS-903 — Route 3 Faizabad (7 Seats Available)' },
            { value: 'veh-04', label: 'ICT-BUS-904 — Route 4 PWD (12 Seats Available)' },
          ]}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Pass Validity Start *"
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            required
          />
          <Input
            label="Pass Expiry Date"
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          />
        </div>
      </form>
    </Modal>
  );
};
