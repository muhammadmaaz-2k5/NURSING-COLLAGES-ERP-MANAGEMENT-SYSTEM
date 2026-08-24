'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { MediaUploader } from '../../../components/forms/MediaUploader';
import { useToast } from '../../../context/ToastContext';
import { createStudent } from '../services/students.api';
import { CreateStudentDto } from '../types/students.types';

export interface StudentAdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const StudentAdmissionModal: React.FC<StudentAdmissionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: 'Password@123',
    programId: 'prog-01',
    cnic: '',
    phone: '',
    gender: 'FEMALE' as const,
    bloodGroup: 'B+',
    dateOfBirth: '2004-05-15',
    address: '',
    city: 'Islamabad',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email) {
      toast.error('Validation Error', 'Please fill in all mandatory fields.');
      return;
    }

    setIsLoading(true);
    try {
      await createStudent({
        ...formData,
      });

      toast.success(
        'Student Registered Successfully',
        `${formData.firstName} has been enrolled into the nursing program.`,
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Enrollment Failed', err?.message || 'Unable to register student');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Direct Student Registration & Intake"
      description="Create a new nursing student institutional profile and issue login credentials."
      size="lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            Confirm Admission & Enroll
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Photo Uploader */}
        <MediaUploader
          label="Student Profile Photograph (Cloudinary CDN)"
          folder="students/avatars"
          value={avatarUrl}
          onChange={setAvatarUrl}
          accept="image/*"
          helperText="Upload official passport size student photo."
        />

        {/* Basic Identity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name *"
            placeholder="e.g. Amina"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
          />
          <Input
            label="Last Name"
            placeholder="e.g. Bibi"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
        </div>

        {/* Email & Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Institutional Email *"
            type="email"
            placeholder="amina.bibi@student.nmc.edu.pk"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            label="Phone Number"
            placeholder="+92 300 1234567"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        {/* Academic Program & Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Degree Program *"
            value={formData.programId}
            onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
            options={[
              { value: 'prog-01', label: 'Bachelor of Science in Nursing (Generic 4-Year)' },
              { value: 'prog-02', label: 'Post-RN BSN Degree Program (2-Year)' },
              { value: 'prog-03', label: 'Diploma in General Nursing & Midwifery' },
            ]}
          />
          <Select
            label="Gender *"
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
            options={[
              { value: 'FEMALE', label: 'Female' },
              { value: 'MALE', label: 'Male' },
              { value: 'OTHER', label: 'Other' },
            ]}
          />
        </div>

        {/* CNIC & Blood Group */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="CNIC / B-Form Number"
            placeholder="37405-1234567-2"
            value={formData.cnic}
            onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
          />
          <Select
            label="Blood Group"
            value={formData.bloodGroup}
            onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
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
          <Input
            label="Date of Birth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
          />
        </div>

        {/* Address */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Permanent Residential Address"
              placeholder="House #, Street #, Sector/Area"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <Input
            label="City"
            placeholder="e.g. Islamabad"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
        </div>
      </form>
    </Modal>
  );
};
