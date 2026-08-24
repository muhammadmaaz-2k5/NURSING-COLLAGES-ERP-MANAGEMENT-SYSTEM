'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { createEmployee } from '../services/hr.api';
import { CreateEmployeeDto } from '../types/hr.types';

export interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<CreateEmployeeDto>({
    firstName: '',
    lastName: '',
    employeeId: '',
    designation: 'Clinical Nursing Instructor',
    qualification: 'MSN Nursing, RN',
    joiningDate: '2026-08-01',
    phone: '+92 300 1234567',
    email: '',
    basicSalary: 95000,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.basicSalary) {
      toast.error('Validation Error', 'First name and basic salary are required.');
      return;
    }

    setIsLoading(true);
    try {
      await createEmployee(form);
      toast.success(
        'Employee Registered',
        `${form.firstName} ${form.lastName || ''} added to college human resources.`,
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Registration Failed', err?.message || 'Could not register employee');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register College Faculty / Staff Member"
      description="Create employee profile with designation, department, and contractual salary scale."
      size="lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Register Employee
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

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Employee ID (Optional)"
            placeholder="e.g. EMP-2026-0044"
            value={form.employeeId}
            onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
          />
          <Input
            label="Designation / Role *"
            placeholder="e.g. Associate Professor"
            value={form.designation}
            onChange={(e) => setForm({ ...form, designation: e.target.value })}
            required
          />
          <Input
            label="Qualifications"
            placeholder="e.g. Ph.D. Nursing, RN, RM"
            value={form.qualification}
            onChange={(e) => setForm({ ...form, qualification: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Contractual Basic Salary (PKR) *"
            type="number"
            value={form.basicSalary}
            onChange={(e) => setForm({ ...form, basicSalary: Number(e.target.value) })}
            required
          />
          <Input
            label="Official College Email"
            type="email"
            placeholder="e.g. s.ahmed@college.edu.pk"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Contact Mobile Phone"
            placeholder="e.g. +92 300 1234567"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
      </form>
    </Modal>
  );
};
