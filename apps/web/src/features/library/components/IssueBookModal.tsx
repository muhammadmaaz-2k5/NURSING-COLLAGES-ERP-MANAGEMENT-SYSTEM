'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { issueBook } from '../services/library.api';
import { IssueBookDto } from '../types/library.types';

export interface IssueBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const IssueBookModal: React.FC<IssueBookModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<IssueBookDto>({
    bookId: 'bk-01',
    studentId: 'stud-01',
    dueDays: 14,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await issueBook(form);
      toast.success(
        'Book Loan Issued',
        `Book copy issued for ${form.dueDays || 14} days tenure.`,
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Issue Failed', err?.message || 'No available copies or student loan limit reached');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Issue Library Book to Student"
      description="Loan a physical accession copy with automated 14-day due date calculation."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Issue Book
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Select Book Title *"
          value={form.bookId}
          onChange={(e) => setForm({ ...form, bookId: e.target.value })}
          options={[
            { value: 'bk-01', label: 'Potter & Perry’s Fundamentals of Nursing (8 Available)' },
            { value: 'bk-02', label: 'Brunner & Suddarth’s Medical-Surgical Nursing (5 Available)' },
            { value: 'bk-03', label: 'Ross & Wilson Anatomy and Physiology (11 Available)' },
          ]}
        />

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

        <Input
          label="Loan Period (Days) *"
          type="number"
          min={1}
          max={30}
          value={form.dueDays}
          onChange={(e) => setForm({ ...form, dueDays: Number(e.target.value) })}
          required
        />
      </form>
    </Modal>
  );
};
