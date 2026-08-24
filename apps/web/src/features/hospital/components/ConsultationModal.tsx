'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { createConsultation } from '../services/hospital.api';
import { CreateConsultationDto } from '../types/hospital.types';

export interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<CreateConsultationDto>({
    patientId: 'pat-01',
    doctorId: 'doc-01',
    symptoms: '',
    diagnosis: '',
    clinicalNotes: '',
    vitalSigns: {
      bp: '120/80',
      pulse: 76,
      temp: 98.6,
      spo2: 98,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.diagnosis) {
      toast.error('Validation Error', 'Clinical diagnosis is required.');
      return;
    }

    setIsLoading(true);
    try {
      await createConsultation(form);
      toast.success(
        'Consultation Recorded',
        'Clinical diagnosis, vital signs, and notes logged to Patient EMR.',
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Recording Failed', err?.message || 'Could not record consultation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Clinical Consultation & Diagnosis"
      description="Document bedside patient examination, vital signs, and diagnostic assessment."
      size="lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Save Consultation Record
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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

          <Select
            label="Consulting Physician *"
            value={form.doctorId}
            onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
            options={[
              { value: 'doc-01', label: 'Dr. Sarah Tariq (Cardiologist)' },
              { value: 'doc-02', label: 'Dr. Tariq Mahmood (General Physician)' },
              { value: 'doc-03', label: 'Dr. Bilal Siddiqui (General Surgeon)' },
            ]}
          />
        </div>

        {/* Vital Signs Strip */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-300 uppercase">
            Clinical Vital Signs
          </span>
          <div className="grid grid-cols-4 gap-3">
            <Input
              label="Blood Pressure"
              placeholder="120/80"
              value={form.vitalSigns?.bp}
              onChange={(e) =>
                setForm({
                  ...form,
                  vitalSigns: { ...form.vitalSigns, bp: e.target.value },
                })
              }
            />
            <Input
              label="Pulse (bpm)"
              type="number"
              value={form.vitalSigns?.pulse}
              onChange={(e) =>
                setForm({
                  ...form,
                  vitalSigns: { ...form.vitalSigns, pulse: Number(e.target.value) },
                })
              }
            />
            <Input
              label="Temp (°F)"
              type="number"
              step="0.1"
              value={form.vitalSigns?.temp}
              onChange={(e) =>
                setForm({
                  ...form,
                  vitalSigns: { ...form.vitalSigns, temp: Number(e.target.value) },
                })
              }
            />
            <Input
              label="SpO2 (%)"
              type="number"
              value={form.vitalSigns?.spo2}
              onChange={(e) =>
                setForm({
                  ...form,
                  vitalSigns: { ...form.vitalSigns, spo2: Number(e.target.value) },
                })
              }
            />
          </div>
        </div>

        <Input
          label="Presenting Symptoms & Clinical History"
          placeholder="e.g. Productive cough for 3 days, low grade fever, shortness of breath"
          value={form.symptoms}
          onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
        />

        <Input
          label="Primary Clinical Diagnosis *"
          placeholder="e.g. Acute Bronchitis with mild wheeze"
          value={form.diagnosis}
          onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
          required
        />

        <Input
          label="Clinical Notes & Management Plan"
          placeholder="e.g. Advised steam inhalation, chest physiotherapy, oral fluids"
          value={form.clinicalNotes}
          onChange={(e) => setForm({ ...form, clinicalNotes: e.target.value })}
        />
      </form>
    </Modal>
  );
};
