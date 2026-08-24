'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { createBook } from '../services/library.api';
import { CreateBookDto } from '../types/library.types';

export interface BookTitleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const BookTitleModal: React.FC<BookTitleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<CreateBookDto>({
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    category: 'Nursing Fundamentals',
    edition: '10th Edition',
    copiesCount: 5,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) {
      toast.error('Validation Error', 'Book title is required.');
      return;
    }

    setIsLoading(true);
    try {
      await createBook(form);
      toast.success(
        'Book Cataloged',
        `"${form.title}" added with ${form.copiesCount} auto-generated accession copies.`,
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Cataloging Failed', err?.message || 'Could not add book title');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Catalog New Library Book Title"
      description="Register book title metadata and auto-generate physical barcode copies."
      size="lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Catalog Book & Generate Barcodes
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Book Title *"
          placeholder="e.g. Potter & Perry’s Fundamentals of Nursing"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Author(s) *"
            placeholder="e.g. Patricia A. Potter, Anne G. Perry"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
          />
          <Input
            label="Publisher"
            placeholder="e.g. Elsevier Health Sciences"
            value={form.publisher}
            onChange={(e) => setForm({ ...form, publisher: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="ISBN Number"
            placeholder="e.g. 978-0323677721"
            value={form.isbn}
            onChange={(e) => setForm({ ...form, isbn: e.target.value })}
          />
          <Select
            label="Subject Category *"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            options={[
              { value: 'Nursing Fundamentals', label: 'Nursing Fundamentals' },
              { value: 'Medical-Surgical Nursing', label: 'Medical-Surgical Nursing' },
              { value: 'Anatomy & Physiology', label: 'Anatomy & Physiology' },
              { value: 'Pharmacology', label: 'Pharmacology & Therapeutics' },
              { value: 'Critical Care & ICU', label: 'Critical Care & ICU' },
              { value: 'Pediatrics & Midwifery', label: 'Pediatrics & Midwifery' },
              { value: 'Community Health', label: 'Community Health' },
            ]}
          />
          <Input
            label="Edition"
            placeholder="e.g. 10th Edition"
            value={form.edition}
            onChange={(e) => setForm({ ...form, edition: e.target.value })}
          />
        </div>

        <Input
          label="Initial Number of Physical Copies to Generate *"
          type="number"
          min={1}
          max={50}
          value={form.copiesCount}
          onChange={(e) => setForm({ ...form, copiesCount: Number(e.target.value) })}
          required
        />
      </form>
    </Modal>
  );
};
