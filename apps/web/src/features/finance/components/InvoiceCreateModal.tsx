'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { generateInvoice } from '../services/finance.api';
import { GenerateInvoiceDto } from '../types/finance.types';

export interface InvoiceCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const InvoiceCreateModal: React.FC<InvoiceCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<GenerateInvoiceDto>({
    studentId: 'stud-01',
    feeStructureId: 'fs-01',
    dueDate: '2026-09-10',
    notes: 'Semester Fee Challan',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await generateInvoice(form);
      toast.success(
        'Fee Challan Issued',
        'Invoice generated with automated scholarship deduction applied.',
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Generation Failed', err?.message || 'Could not generate fee challan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate Student Fee Challan / Invoice"
      description="Issue an official fee bill with automated scholarship and concession calculation."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Generate & Issue Challan
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Select Enrolled Student *"
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
          label="Fee Structure / Tariff *"
          value={form.feeStructureId}
          onChange={(e) => setForm({ ...form, feeStructureId: e.target.value })}
          options={[
            { value: 'fs-01', label: 'Generic BSN — Semester Tuition Fee (Rs. 85,000)' },
            { value: 'fs-02', label: 'Hospital Clinical Practicum Fee (Rs. 25,000)' },
            { value: 'fs-03', label: 'Nursing Skills Lab Consumables Fee (Rs. 15,000)' },
            { value: 'fs-04', label: 'Post-RN BSN — Semester Tuition (Rs. 65,000)' },
          ]}
        />

        <Input
          label="Due Date for Payment *"
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          required
        />

        <Input
          label="Challan Notes / Description"
          placeholder="e.g. Fall 2026 Semester 6 Tuition Bill"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </form>
    </Modal>
  );
};
