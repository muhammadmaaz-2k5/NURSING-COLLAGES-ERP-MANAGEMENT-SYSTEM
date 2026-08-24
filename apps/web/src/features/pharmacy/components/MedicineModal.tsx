'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { createMedicine } from '../services/pharmacy.api';
import { CreateMedicineDto } from '../types/pharmacy.types';

export interface MedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const MedicineModal: React.FC<MedicineModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<CreateMedicineDto>({
    name: '',
    genericName: '',
    category: 'Antibiotics',
    strength: '500mg',
    dosageForm: 'Tablet',
    manufacturer: '',
    unit: 'Box of 10',
    reorderLevel: 20,
    purchasePrice: 100,
    sellingPrice: 130,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      toast.error('Validation Error', 'Medicine brand name is required.');
      return;
    }

    setIsLoading(true);
    try {
      await createMedicine(form);
      toast.success(
        'Medicine Added',
        `${form.name} registered in hospital pharmacy formulary.`,
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Registration Failed', err?.message || 'Could not add medicine');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Medicine to Pharmacy Formulary"
      description="Register new pharmaceutical brand, generic chemical compound, and reorder safety thresholds."
      size="lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Save Medicine Formulation
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Brand Name *"
            placeholder="e.g. Augmentin 625mg"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="Generic Chemical Name"
            placeholder="e.g. Co-Amoxiclav"
            value={form.genericName}
            onChange={(e) => setForm({ ...form, genericName: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Select
            label="Therapeutic Category *"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            options={[
              { value: 'Antibiotics', label: 'Antibiotics & Antimicrobials' },
              { value: 'Analgesics & Antipyretics', label: 'Analgesics & Antipyretics' },
              { value: 'Injectables & Critical Care', label: 'Injectables & Critical Care' },
              { value: 'IV Infusions & Fluids', label: 'IV Infusions & Fluids' },
              { value: 'Cardiovascular & Antihypertensives', label: 'Cardiovascular Drugs' },
              { value: 'Respiratory & Inhalers', label: 'Respiratory & Inhalers' },
              { value: 'Gastrointestinal', label: 'Gastrointestinal Agents' },
            ]}
          />
          <Input
            label="Strength"
            placeholder="e.g. 625mg / 1g"
            value={form.strength}
            onChange={(e) => setForm({ ...form, strength: e.target.value })}
          />
          <Select
            label="Dosage Form"
            value={form.dosageForm}
            onChange={(e) => setForm({ ...form, dosageForm: e.target.value })}
            options={[
              { value: 'Tablet', label: 'Oral Tablet' },
              { value: 'Capsule', label: 'Oral Capsule' },
              { value: 'Injection', label: 'IV/IM Injection' },
              { value: 'Infusion Drip', label: 'IV Infusion Drip' },
              { value: 'Syrup / Suspension', label: 'Liquid Syrup' },
              { value: 'Ointment', label: 'Topical Ointment' },
            ]}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Manufacturer / Pharma"
            placeholder="e.g. GSK / Sami"
            value={form.manufacturer}
            onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
          />
          <Input
            label="Packaging Unit"
            placeholder="e.g. Box of 14 Tablets"
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
          />
          <Input
            label="Low Stock Reorder Threshold"
            type="number"
            value={form.reorderLevel}
            onChange={(e) => setForm({ ...form, reorderLevel: Number(e.target.value) })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Purchase Cost Price (PKR)"
            type="number"
            value={form.purchasePrice}
            onChange={(e) => setForm({ ...form, purchasePrice: Number(e.target.value) })}
          />
          <Input
            label="Retail / Selling Price (PKR)"
            type="number"
            value={form.sellingPrice}
            onChange={(e) => setForm({ ...form, sellingPrice: Number(e.target.value) })}
          />
        </div>
      </form>
    </Modal>
  );
};
