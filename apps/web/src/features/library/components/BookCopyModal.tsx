'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { addBookCopy } from '../services/library.api';
import { AddBookCopyDto } from '../types/library.types';

export interface BookCopyModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  bookTitle: string;
  onSuccess?: () => void;
}

export const BookCopyModal: React.FC<BookCopyModalProps> = ({
  isOpen,
  onClose,
  bookId,
  bookTitle,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<AddBookCopyDto>({
    bookId,
    accessionNo: '',
    shelfLocation: 'Stack A — Shelf 04',
    condition: 'Good',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.accessionNo) {
      toast.error('Validation Error', 'Accession number / barcode is required.');
      return;
    }

    setIsLoading(true);
    try {
      await addBookCopy({ ...form, bookId });
      toast.success(
        'Physical Copy Registered',
        `Copy ${form.accessionNo} added to "${bookTitle}".`,
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Registration Failed', err?.message || 'Could not add book copy');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Physical Book Accession Copy"
      description={`Register barcode copy for "${bookTitle}".`}
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Register Copy
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Accession / Barcode Number *"
          placeholder="e.g. ACC-FON-007"
          value={form.accessionNo}
          onChange={(e) => setForm({ ...form, accessionNo: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Shelf / Stacks Location"
            placeholder="e.g. Stack A — Shelf 04"
            value={form.shelfLocation}
            onChange={(e) => setForm({ ...form, shelfLocation: e.target.value })}
          />
          <Input
            label="Physical Condition"
            placeholder="e.g. Good / New"
            value={form.condition}
            onChange={(e) => setForm({ ...form, condition: e.target.value })}
          />
        </div>
      </form>
    </Modal>
  );
};
