'use client';

import React, { useState } from 'react';
import { Layers, GraduationCap, UserCheck, ShieldCheck } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { useToast } from '../../../context/ToastContext';

export interface SemesterCourseAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SemesterCourseAllocationModal: React.FC<SemesterCourseAllocationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    programId: 'prog-01',
    semesterId: 'sem-06',
    subjectId: 'sub-01',
    facultyId: 'fac-01',
    classSectionId: 'sec-a',
    isMandatory: 'true',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success(
        'Course Allocated to Semester',
        'Course mapped to Semester syllabus and faculty instructor assigned successfully.',
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Error', err?.message || 'Failed to allocate course');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Map Course to Semester & Assign Faculty"
      description="Select the academic semester, curriculum subject, and assign the lead course instructor"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Degree Program *"
          value={formData.programId}
          onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
          options={[
            { value: 'prog-01', label: 'Generic BSN (4-Year Degree)' },
            { value: 'prog-02', label: 'Post-RN BSN (2-Year Degree)' },
          ]}
        />

        <Select
          label="Target Semester *"
          value={formData.semesterId}
          onChange={(e) => setFormData({ ...formData, semesterId: e.target.value })}
          options={[
            { value: 'sem-01', label: 'Semester 1 (Fall 2023)' },
            { value: 'sem-02', label: 'Semester 2 (Spring 2024)' },
            { value: 'sem-03', label: 'Semester 3 (Fall 2024)' },
            { value: 'sem-04', label: 'Semester 4 (Spring 2025)' },
            { value: 'sem-05', label: 'Semester 5 (Fall 2025)' },
            { value: 'sem-06', label: 'Semester 6 (Spring 2026 - Active)' },
            { value: 'sem-07', label: 'Semester 7 (Fall 2026)' },
            { value: 'sem-08', label: 'Semester 8 (Spring 2027)' },
          ]}
        />

        <Select
          label="Subject / Course *"
          value={formData.subjectId}
          onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
          options={[
            { value: 'sub-01', label: 'NUR-301: Adult Health Nursing II (4 Cr)' },
            { value: 'sub-02', label: 'NUR-302: Pharmacology in Clinical Nursing (3 Cr)' },
            { value: 'sub-03', label: 'NUR-303: Nursing Research & Biostatistics (3 Cr)' },
            { value: 'sub-04', label: 'NUR-304: Mental Health & Psychiatric Nursing (4 Cr)' },
            { value: 'sub-05', label: 'NUR-305: Professional Nursing Ethics & Law (2 Cr)' },
            { value: 'sub-06', label: 'CLN-306: Hospital Clinical Practicum VI (2 Cr)' },
          ]}
        />

        <Select
          label="Assigned Course Instructor (Faculty) *"
          value={formData.facultyId}
          onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
          options={[
            { value: 'fac-01', label: 'Dr. Tariq Mahmood (Associate Professor)' },
            { value: 'fac-02', label: 'Dr. Sarah Ahmed (Assistant Professor)' },
            { value: 'fac-03', label: 'Sister Farida Bano (Clinical Supervisor)' },
            { value: 'fac-04', label: 'Dr. Ayesha Malik (Senior Lecturer)' },
            { value: 'fac-05', label: 'Prof. Muhammad Asif (Principal & Dean)' },
          ]}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Class Cohort"
            value={formData.classSectionId}
            onChange={(e) => setFormData({ ...formData, classSectionId: e.target.value })}
            options={[
              { value: 'sec-a', label: 'Section A (Morning)' },
              { value: 'sec-b', label: 'Section B (Evening)' },
              { value: 'all', label: 'All Sections' },
            ]}
          />

          <Select
            label="Course Type"
            value={formData.isMandatory}
            onChange={(e) => setFormData({ ...formData, isMandatory: e.target.value })}
            options={[
              { value: 'true', label: 'Core / Mandatory' },
              { value: 'false', label: 'Elective Course' },
            ]}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button variant="outline" size="sm" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
            Allocate Course
          </Button>
        </div>
      </form>
    </Modal>
  );
};
