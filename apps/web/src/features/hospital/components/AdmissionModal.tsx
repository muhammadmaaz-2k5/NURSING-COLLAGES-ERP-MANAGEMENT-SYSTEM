'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { admitPatient } from '../services/hospital.api';
import { CreateAdmissionDto, HospitalBed } from '../types/hospital.types';

export interface AdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBed?: HospitalBed | null;
  onSuccess?: () => void;
}

export const AdmissionModal: React.FC<AdmissionModalProps> = ({
  isOpen,
  onClose,
  selectedBed,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<CreateAdmissionDto>({
    patientId: 'pat-01',
    bedId: selectedBed?.id || 'b-02',
    diagnosis: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await admitPatient({
        ...form,
        bedId: selectedBed?.id || form.bedId,
      });

      toast.success(
        'Patient Admitted',
        `Inpatient admission confirmed for Bed ${selectedBed?.bedNumber || form.bedId}.`,
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Admission Error', err?.message || 'Bed is unavailable or occupied');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Admit Inpatient to Ward & Bed"
      description="Lock inpatient bed allocation with strict concurrency and double-occupancy prevention."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Confirm Admission & Lock Bed
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {selectedBed && (
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Allocated Inpatient Bed:</span>
            <span className="font-mono font-bold text-emerald-400">
              {selectedBed.bedNumber} ({selectedBed.type})
            </span>
          </div>
        )}

        <Select
          label="Select Patient *"
          value={form.patientId}
          onChange={(e) => setForm({ ...form, patientId: e.target.value })}
          options={[
            { value: 'pat-01', label: 'Ahmed Raza (MRN-2026-0045)' },
            { value: 'pat-02', label: 'Fatima Noor (MRN-2026-0089)' },
            { value: 'pat-03', label: 'Usman Ali (MRN-2026-0102)' },
          ]}
        />

        <Input
          label="Admitting Diagnosis *"
          placeholder="e.g. Acute Appendicitis / Post-op Recovery"
          value={form.diagnosis}
          onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
          required
        />

        <Input
          label="Clinical Admission Notes"
          placeholder="e.g. Admitted via Emergency for 48-hour observation"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </form>
    </Modal>
  );
};
