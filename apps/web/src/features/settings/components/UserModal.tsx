'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { createUser } from '../services/settings.api';
import { CreateUserDto } from '../types/settings.types';

export interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<CreateUserDto>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    roleNames: ['FACULTY'],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.firstName) {
      toast.error('Validation Error', 'Email and first name are required.');
      return;
    }

    setIsLoading(true);
    try {
      await createUser(form);
      toast.success(
        'User Account Created',
        `Account for ${form.firstName} (${form.email}) has been provisioned.`,
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Account Creation Failed', err?.message || 'Could not create user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Institutional User Account"
      description="Provision new login credentials, role assignments, and departmental permissions."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Create User Account
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name *"
            placeholder="e.g. Dr. Sarah"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            required
          />
          <Input
            label="Last Name"
            placeholder="e.g. Ahmed"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
        </div>

        <Input
          label="Official Email Address *"
          type="email"
          placeholder="e.g. sarah.ahmed@college.edu.pk"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Temporary Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Select
            label="Primary Role *"
            value={form.roleNames[0] || 'FACULTY'}
            onChange={(e) => setForm({ ...form, roleNames: [e.target.value] })}
            options={[
              { value: 'SUPER_ADMIN', label: 'Super Administrator' },
              { value: 'FACULTY', label: 'Faculty / Professor' },
              { value: 'ACCOUNTANT', label: 'Finance & Accounts Officer' },
              { value: 'CLINICAL_SUPERVISOR', label: 'Clinical Nursing Supervisor' },
              { value: 'LIBRARIAN', label: 'Librarian' },
              { value: 'STUDENT', label: 'Student' },
            ]}
          />
        </div>

        <Input
          label="Contact Mobile Phone"
          placeholder="e.g. +92 300 1234567"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </form>
    </Modal>
  );
};
