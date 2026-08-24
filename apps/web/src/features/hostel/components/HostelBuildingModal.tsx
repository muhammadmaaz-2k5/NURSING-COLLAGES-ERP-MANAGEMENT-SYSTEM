'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { createHostel } from '../services/hostel.api';
import { CreateHostelDto, Gender } from '../types/hostel.types';

export interface HostelBuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const HostelBuildingModal: React.FC<HostelBuildingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<CreateHostelDto>({
    name: '',
    code: '',
    gender: 'FEMALE',
    address: 'Campus West Wing, Sector H-8/4, Islamabad',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.code) {
      toast.error('Validation Error', 'Hostel name and code are required.');
      return;
    }

    setIsLoading(true);
    try {
      await createHostel(form);
      toast.success('Hostel Registered', `${form.name} added to residential facilities.`);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Creation Failed', err?.message || 'Could not register hostel building');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register Hostel Residence Building"
      description="Create student residential complex with gender policy and campus address."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Register Hostel Complex
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Hostel Building Name *"
          placeholder="e.g. Fatima Jinnah Female Residence"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Hostel Code *"
            placeholder="e.g. HST-F-01"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            required
          />
          <Select
            label="Gender Restriction *"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value as Gender })}
            options={[
              { value: 'FEMALE', label: 'Female Students Residence' },
              { value: 'MALE', label: 'Male Students Residence' },
            ]}
          />
        </div>

        <Input
          label="Campus Location / Physical Address"
          placeholder="e.g. Campus West Wing, Sector H-8/4, Islamabad"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
      </form>
    </Modal>
  );
};
