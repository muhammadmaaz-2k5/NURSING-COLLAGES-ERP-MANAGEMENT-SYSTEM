'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { dispenseMedicines } from '../services/pharmacy.api';
import { DispensePrescriptionDto } from '../types/pharmacy.types';
import { formatCurrency } from '../../../lib/utils';

export interface DispenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DispenseModal: React.FC<DispenseModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [patientId, setPatientId] = useState('pat-01');
  const [medicineId, setMedicineId] = useState('med-01');
  const [quantity, setQuantity] = useState(2);
  const [notes, setNotes] = useState('Dispensed at Hospital Pharmacy Counter');

  const unitPrices: Record<string, number> = {
    'med-01': 490,
    'med-02': 45,
    'med-03': 260,
    'med-04': 120,
  };

  const totalPrice = (unitPrices[medicineId] || 100) * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await dispenseMedicines({
        patientId,
        items: [
          {
            medicineId,
            quantity,
            unitPrice: unitPrices[medicineId] || 100,
          },
        ],
        notes,
      });

      toast.success(
        'Medicines Dispensed',
        `Stock deducted via FIFO allocation. Total billed: ${formatCurrency(totalPrice)}.`,
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Dispensing Failed', err?.message || 'Insufficient stock or expired batch');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Dispense Prescription / Medicines"
      description="Transactional FIFO stock deduction with automated inventory movement audit."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Confirm & Dispense ({formatCurrency(totalPrice)})
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Select Patient (MRN) *"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          options={[
            { value: 'pat-01', label: 'Ahmed Raza (MRN-2026-0045)' },
            { value: 'pat-02', label: 'Fatima Noor (MRN-2026-0089)' },
            { value: 'pat-03', label: 'Usman Ali (MRN-2026-0102)' },
          ]}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Select Medicine *"
            value={medicineId}
            onChange={(e) => setMedicineId(e.target.value)}
            options={[
              { value: 'med-01', label: 'Augmentin 625mg (Rs. 490)' },
              { value: 'med-02', label: 'Panadol Extra 500mg (Rs. 45)' },
              { value: 'med-03', label: 'Ceftriaxone 1g Inj (Rs. 260)' },
              { value: 'med-04', label: 'Normal Saline 1000ml (Rs. 120)' },
            ]}
          />
          <Input
            label="Quantity to Dispense *"
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
          />
        </div>

        {/* Pricing Strip */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Total Prescription Bill:</span>
          <span className="font-bold text-emerald-400 text-sm">
            {formatCurrency(totalPrice)}
          </span>
        </div>

        <Input
          label="Dispensing Remarks"
          placeholder="e.g. Dispensed to patient attendant"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </form>
    </Modal>
  );
};
