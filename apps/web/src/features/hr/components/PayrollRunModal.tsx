'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { generatePayroll } from '../services/hr.api';
import { ProcessPayrollDto } from '../types/hr.types';

export interface PayrollRunModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PayrollRunModal: React.FC<PayrollRunModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<ProcessPayrollDto>({
    month: 8,
    year: 2026,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await generatePayroll(form);
      toast.success(
        'Payroll Engine Processed',
        `Deterministic payroll calculated for Month ${form.month}/${form.year}.`,
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Payroll Calculation Failed', err?.message || 'Calculation error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Run Deterministic Payroll Calculation Engine"
      description="Execute monthly payroll calculations for active employees: Basic + Allowances + Bonuses - Tax - Unpaid Leaves."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Calculate Payroll Batch
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Payroll Month *"
            value={String(form.month)}
            onChange={(e) => setForm({ ...form, month: Number(e.target.value) })}
            options={[
              { value: '1', label: 'January' },
              { value: '2', label: 'February' },
              { value: '3', label: 'March' },
              { value: '4', label: 'April' },
              { value: '5', label: 'May' },
              { value: '6', label: 'June' },
              { value: '7', label: 'July' },
              { value: '8', label: 'August' },
              { value: '9', label: 'September' },
              { value: '10', label: 'October' },
              { value: '11', label: 'November' },
              { value: '12', label: 'December' },
            ]}
          />

          <Select
            label="Payroll Year *"
            value={String(form.year)}
            onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
            options={[
              { value: '2026', label: '2026' },
              { value: '2027', label: '2027' },
            ]}
          />
        </div>
      </form>
    </Modal>
  );
};
