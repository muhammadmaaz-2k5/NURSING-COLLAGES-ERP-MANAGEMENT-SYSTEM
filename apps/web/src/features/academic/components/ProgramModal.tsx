'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { CreateProgramDto } from '../types/academic.types';

export interface ProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ProgramModal: React.FC<ProgramModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateProgramDto>({
    departmentId: 'dept-01',
    name: '',
    code: '',
    durationYears: 4,
    totalCredits: 135,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      toast.error('Validation Error', 'Please specify Program Name and Code.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Program Created', `${formData.name} added to academic registry.`);
      onSuccess?.();
      onClose();
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Degree / Diploma Program"
      description="Register an accredited healthcare curriculum and credit structure."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Save Degree Program
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Academic Department *"
          value={formData.departmentId}
          onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
          options={[
            { value: 'dept-01', label: 'Department of Nursing & Clinical Care' },
            { value: 'dept-02', label: 'Department of Allied Health Sciences' },
          ]}
        />

        <Input
          label="Program Name *"
          placeholder="e.g. Master of Science in Nursing (MSN)"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Program Code *"
            placeholder="e.g. MSN-GEN"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
          />
          <Input
            label="Duration (Years) *"
            type="number"
            value={formData.durationYears}
            onChange={(e) => setFormData({ ...formData, durationYears: Number(e.target.value) })}
          />
        </div>

        <Input
          label="Total Credit Hours (HEC/PNC) *"
          type="number"
          value={formData.totalCredits}
          onChange={(e) => setFormData({ ...formData, totalCredits: Number(e.target.value) })}
        />
      </form>
    </Modal>
  );
};
