'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { createScholarship } from '../services/finance.api';
import { CreateScholarshipDto, ScholarshipType } from '../types/finance.types';

export interface ScholarshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ScholarshipModal: React.FC<ScholarshipModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<CreateScholarshipDto>({
    name: '',
    type: 'MERIT',
    percentage: 50,
    fixedAmount: 0,
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      toast.error('Validation Error', 'Please specify scholarship title.');
      return;
    }

    setIsLoading(true);
    try {
      await createScholarship(form);
      toast.success('Scholarship Scheme Created', `${form.name} registered.`);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Creation Failed', err?.message || 'Could not create scholarship');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Scholarship / Financial Concession Scheme"
      description="Register merit waivers or need-based financial aid policies."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Save Scholarship Scheme
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Scheme Title *"
          placeholder="e.g. PNC Merit Excellence Concession"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Scholarship Type *"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as ScholarshipType })}
            options={[
              { value: 'MERIT', label: 'Academic Merit Waiver' },
              { value: 'NEED_BASED', label: 'Financial Need Grant' },
              { value: 'FACULTY_WARD', label: 'Healthcare Worker / Faculty Kin' },
              { value: 'GOVERNMENT', label: 'Government / PM National Grant' },
            ]}
          />

          <Input
            label="Tuition Waiver Percentage (%)"
            type="number"
            min={0}
            max={100}
            value={form.percentage}
            onChange={(e) => setForm({ ...form, percentage: Number(e.target.value) })}
          />
        </div>

        <Input
          label="Or Fixed Semester Grant (PKR)"
          type="number"
          value={form.fixedAmount}
          onChange={(e) => setForm({ ...form, fixedAmount: Number(e.target.value) })}
        />

        <Input
          label="Eligibility Criteria & Description"
          placeholder="e.g. Minimum 3.80 CGPA required in previous semester"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </form>
    </Modal>
  );
};
