'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { applyLeave } from '../services/hr.api';
import { ApplyLeaveDto, LeaveType } from '../types/hr.types';

export interface LeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const LeaveRequestModal: React.FC<LeaveRequestModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<ApplyLeaveDto>({
    employeeId: 'emp-01',
    leaveType: 'CASUAL',
    startDate: '2026-09-01',
    endDate: '2026-09-03',
    reason: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await applyLeave(form);
      toast.success(
        'Leave Application Submitted',
        'Your leave request has been submitted for departmental approval.',
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Submission Failed', err?.message || 'Could not submit leave');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Faculty / Staff Leave Application"
      description="Apply for casual, sick, annual, or academic conference leave."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Submit Leave Request
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Select Faculty / Staff Member *"
          value={form.employeeId}
          onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
          options={[
            { value: 'emp-01', label: 'Dr. Sarah Ahmed (EMP-2022-001 — HOD)' },
            { value: 'emp-02', label: 'Muhammad Usman (EMP-2023-014 — Senior Instructor)' },
            { value: 'emp-03', label: 'Fatima Zahra (EMP-2024-032 — Preceptor)' },
          ]}
        />

        <Select
          label="Leave Type *"
          value={form.leaveType}
          onChange={(e) => setForm({ ...form, leaveType: e.target.value as LeaveType })}
          options={[
            { value: 'CASUAL', label: 'Casual Leave (Paid)' },
            { value: 'SICK', label: 'Medical / Sick Leave (Paid)' },
            { value: 'ANNUAL', label: 'Annual Earned Leave (Paid)' },
            { value: 'MATERNITY', label: 'Maternity Leave (Paid)' },
            { value: 'UNPAID', label: 'Unpaid Leave of Absence' },
          ]}
        />

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
          label="Purpose / Reason for Leave"
          placeholder="e.g. Attending national clinical nursing seminar"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />
      </form>
    </Modal>
  );
};
