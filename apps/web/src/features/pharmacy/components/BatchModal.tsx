'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { addStockBatch } from '../services/pharmacy.api';
import { AddStockBatchDto } from '../types/pharmacy.types';

export interface BatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const BatchModal: React.FC<BatchModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<AddStockBatchDto>({
    medicineId: 'med-01',
    batchNumber: '',
    quantity: 100,
    expiryDate: '2028-12-31',
    purchasePrice: 420,
    sellingPrice: 490,
    notes: 'Received via Supplier Invoice',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.batchNumber) {
      toast.error('Validation Error', 'Batch number is required.');
      return;
    }

    setIsLoading(true);
    try {
      await addStockBatch(form);
      toast.success(
        'Stock Batch Received',
        `Batch ${form.batchNumber} (${form.quantity} units) added to inventory.`,
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Stock Receipt Failed', err?.message || 'Could not add batch');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Receive New Medicine Stock Shipment / Batch"
      description="Stock receipt with batch tracking, expiry date verification, and cost allocation."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Receive & Stock Batch
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Select Medicine Formulation *"
          value={form.medicineId}
          onChange={(e) => setForm({ ...form, medicineId: e.target.value })}
          options={[
            { value: 'med-01', label: 'Augmentin 625mg (Tablet)' },
            { value: 'med-02', label: 'Panadol Extra 500mg (Tablet)' },
            { value: 'med-03', label: 'Ceftriaxone 1g (Injection)' },
            { value: 'med-04', label: 'Normal Saline 0.9% 1000ml (Drip)' },
          ]}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Manufacturer Batch # *"
            placeholder="e.g. BAT-2026-X89"
            value={form.batchNumber}
            onChange={(e) => setForm({ ...form, batchNumber: e.target.value })}
            required
          />
          <Input
            label="Expiry Date *"
            type="date"
            value={form.expiryDate}
            onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Quantity (Units) *"
            type="number"
            min={1}
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
            required
          />
          <Input
            label="Unit Cost Price"
            type="number"
            value={form.purchasePrice}
            onChange={(e) => setForm({ ...form, purchasePrice: Number(e.target.value) })}
          />
          <Input
            label="Unit Retail Price"
            type="number"
            value={form.sellingPrice}
            onChange={(e) => setForm({ ...form, sellingPrice: Number(e.target.value) })}
          />
        </div>

        <Input
          label="Supplier Invoice / PO Reference"
          placeholder="e.g. PO-2026-0044 delivered by GSK"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </form>
    </Modal>
  );
};
