'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { MediaUploader } from '../../../components/forms/MediaUploader';
import { useToast } from '../../../context/ToastContext';
import { createFaculty } from '../services/faculty.api';

export interface FacultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const FacultyModal: React.FC<FacultyModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    departmentId: 'dept-01',
    designation: 'Assistant Professor of Nursing',
    qualification: 'MSN, BScN (PNC Registered)',
    specialization: 'Critical Care & Emergency Nursing',
    phone: '',
    joiningDate: '2026-08-01',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.email) {
      toast.error('Validation Error', 'Please provide Faculty Name and Institutional Email.');
      return;
    }

    setIsLoading(true);
    try {
      await createFaculty(form);
      toast.success(
        'Faculty Registered',
        `${form.firstName} has been added to the academic faculty directory.`,
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Creation Failed', err?.message || 'Could not create faculty member');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register Academic Faculty Member"
      description="Create a new instructor profile, assign department, and issue ERP credentials."
      size="lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Confirm Faculty Registration
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <MediaUploader
          label="Faculty Portrait (Cloudinary CDN)"
          folder="faculty/portraits"
          value={avatarUrl}
          onChange={setAvatarUrl}
          accept="image/*"
          helperText="Upload official professional photograph."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name & Title *"
            placeholder="e.g. Dr. Sarah"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            required
          />
          <Input
            label="Last Name"
            placeholder="e.g. Khan"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Institutional Email *"
            type="email"
            placeholder="sarah.khan@nmc.edu.pk"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            label="Phone Contact"
            placeholder="+92 300 1234567"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Academic Department *"
            value={form.departmentId}
            onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
            options={[
              { value: 'dept-01', label: 'Department of Nursing & Clinical Care' },
              { value: 'dept-02', label: 'Department of Allied Health Sciences' },
            ]}
          />
          <Select
            label="Academic Designation *"
            value={form.designation}
            onChange={(e) => setForm({ ...form, designation: e.target.value })}
            options={[
              { value: 'Professor & Dean', label: 'Professor & Dean' },
              { value: 'Associate Professor', label: 'Associate Professor' },
              { value: 'Assistant Professor of Nursing', label: 'Assistant Professor' },
              { value: 'Senior Lecturer', label: 'Senior Lecturer' },
              { value: 'Clinical Instructor / Supervisor', label: 'Clinical Instructor' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Academic Qualifications *"
            placeholder="e.g. PhD Nursing, MSN, RN, RM"
            value={form.qualification}
            onChange={(e) => setForm({ ...form, qualification: e.target.value })}
            required
          />
          <Input
            label="Clinical Specialization"
            placeholder="e.g. Critical Care & Cardiology"
            value={form.specialization}
            onChange={(e) => setForm({ ...form, specialization: e.target.value })}
          />
        </div>
      </form>
    </Modal>
  );
};
