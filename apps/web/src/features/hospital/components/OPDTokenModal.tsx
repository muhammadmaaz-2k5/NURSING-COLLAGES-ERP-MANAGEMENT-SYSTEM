'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { createAppointment } from '../services/hospital.api';
import { CreateAppointmentDto } from '../types/hospital.types';

export interface OPDTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const OPDTokenModal: React.FC<OPDTokenModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<CreateAppointmentDto>({
    patientId: 'pat-01',
    doctorId: 'doc-01',
    appointmentDate: new Date().toISOString(),
    reason: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createAppointment(form);
      toast.success(
        'OPD Token Issued',
        'Patient assigned sequential queue token for clinical consultation.',
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Scheduling Failed', err?.message || 'Could not issue OPD token');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Issue OPD Consultation Token"
      description="Queue patient for Outpatient Department doctor consultation."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Issue OPD Queue Token
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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
          label="Consulting Doctor / Specialist *"
          value={form.doctorId}
          onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
          options={[
            { value: 'doc-01', label: 'Dr. Sarah Tariq (Cardiologist — Cardiology OPD)' },
            { value: 'doc-02', label: 'Dr. Tariq Mahmood (General Physician — Internal Med)' },
            { value: 'doc-03', label: 'Dr. Bilal Siddiqui (General Surgeon — Surgery OPD)' },
          ]}
        />

        <Input
          label="Chief Complaint / Reason for Visit"
          placeholder="e.g. Chest discomfort on climbing stairs, dry cough"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />
      </form>
    </Modal>
  );
};
