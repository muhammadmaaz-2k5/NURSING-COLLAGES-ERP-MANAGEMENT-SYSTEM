'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { createPatient } from '../services/hospital.api';
import { CreatePatientDto, Gender } from '../types/hospital.types';

export interface PatientRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PatientRegistrationModal: React.FC<PatientRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<CreatePatientDto>({
    firstName: '',
    lastName: '',
    dateOfBirth: '1990-01-01',
    gender: 'MALE',
    phone: '',
    address: '',
    city: 'Islamabad',
    bloodGroup: 'B+',
    emergencyContact: '',
    emergencyPhone: '',
    allergies: '',
    medicalHistory: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName) {
      toast.error('Validation Error', 'First name is required.');
      return;
    }

    setIsLoading(true);
    try {
      await createPatient(form);
      toast.success(
        'Patient Registered',
        `${form.firstName} ${form.lastName || ''} registered with Medical Record Number.`,
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Registration Failed', err?.message || 'Could not register patient');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register New Patient (EMR Record)"
      description="Create electronic medical record with demographic identity, allergies, and blood group."
      size="lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Register Patient & Issue MRN
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name *"
            placeholder="e.g. Ahmed"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            required
          />
          <Input
            label="Last Name"
            placeholder="e.g. Raza"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Date of Birth"
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
          />
          <Select
            label="Gender"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value as Gender })}
            options={[
              { value: 'MALE', label: 'Male' },
              { value: 'FEMALE', label: 'Female' },
              { value: 'OTHER', label: 'Other' },
            ]}
          />
          <Select
            label="Blood Group"
            value={form.bloodGroup}
            onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
            options={[
              { value: 'A+', label: 'A+' },
              { value: 'A-', label: 'A-' },
              { value: 'B+', label: 'B+' },
              { value: 'B-', label: 'B-' },
              { value: 'AB+', label: 'AB+' },
              { value: 'AB-', label: 'AB-' },
              { value: 'O+', label: 'O+' },
              { value: 'O-', label: 'O-' },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Contact Phone"
            placeholder="+92 300 1122334"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Input
            label="City"
            placeholder="e.g. Islamabad"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Emergency Contact Name & Relation"
            placeholder="e.g. Muhammad Raza (Brother)"
            value={form.emergencyContact}
            onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
          />
          <Input
            label="Emergency Phone"
            placeholder="+92 333 1122334"
            value={form.emergencyPhone}
            onChange={(e) => setForm({ ...form, emergencyPhone: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Known Drug / Food Allergies"
            placeholder="e.g. Penicillin, Sulfa drugs"
            value={form.allergies}
            onChange={(e) => setForm({ ...form, allergies: e.target.value })}
          />
          <Input
            label="Past Medical History / Comorbidities"
            placeholder="e.g. Diabetes, Hypertension"
            value={form.medicalHistory}
            onChange={(e) => setForm({ ...form, medicalHistory: e.target.value })}
          />
        </div>
      </form>
    </Modal>
  );
};
