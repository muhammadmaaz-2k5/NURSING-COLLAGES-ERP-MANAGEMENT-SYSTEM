'use client';

import React, { useState } from 'react';
import { BookOpen, Layers, Clock, AlertCircle } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { useToast } from '../../../context/ToastContext';

export interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SubjectModal: React.FC<SubjectModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    departmentId: 'dept-01',
    programId: 'prog-01',
    creditHours: '3',
    theoryHours: '2',
    practicalHours: '1',
    clinicalHours: '0',
    passingMarks: '50',
    totalMarks: '100',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      toast.error('Validation Error', 'Course Code and Course Name are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate/call API
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success('Course Created', `Subject "${formData.code} - ${formData.name}" added to curriculum.`);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Error', err?.message || 'Failed to create subject');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Academic / Clinical Course"
      description="Add a new curriculum course with theory, practical, and clinical credit hours"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Course Code *"
            placeholder="e.g. NUR-301"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            required
          />

          <Input
            label="Course Title *"
            placeholder="e.g. Adult Health Nursing II"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Academic Program *"
            value={formData.programId}
            onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
            options={[
              { value: 'prog-01', label: 'Generic BSN (4-Year Degree)' },
              { value: 'prog-02', label: 'Post-RN BSN (2-Year Degree)' },
              { value: 'prog-03', label: 'Doctor of Physical Therapy (DPT)' },
              { value: 'prog-04', label: 'BS Medical Lab Technology (MLT)' },
            ]}
          />

          <Select
            label="Department *"
            value={formData.departmentId}
            onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
            options={[
              { value: 'dept-01', label: 'Department of Nursing Care' },
              { value: 'dept-02', label: 'Department of Clinical Sciences' },
              { value: 'dept-03', label: 'Department of Basic Medical Sciences' },
            ]}
          />
        </div>

        {/* Credit Hours Breakdown */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Credit Hours & Workload Breakdown
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Input
              label="Total Credits"
              type="number"
              min={1}
              max={10}
              value={formData.creditHours}
              onChange={(e) => setFormData({ ...formData, creditHours: e.target.value })}
            />
            <Input
              label="Theory Credits"
              type="number"
              min={0}
              max={10}
              value={formData.theoryHours}
              onChange={(e) => setFormData({ ...formData, theoryHours: e.target.value })}
            />
            <Input
              label="Practical (Lab)"
              type="number"
              min={0}
              max={10}
              value={formData.practicalHours}
              onChange={(e) => setFormData({ ...formData, practicalHours: e.target.value })}
            />
            <Input
              label="PNC Clinical (h)"
              type="number"
              min={0}
              step={10}
              value={formData.clinicalHours}
              onChange={(e) => setFormData({ ...formData, clinicalHours: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Total Exam Marks"
            type="number"
            value={formData.totalMarks}
            onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
          />
          <Input
            label="Minimum Passing Marks (50%)"
            type="number"
            value={formData.passingMarks}
            onChange={(e) => setFormData({ ...formData, passingMarks: e.target.value })}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button variant="outline" size="sm" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
            Create Course
          </Button>
        </div>
      </form>
    </Modal>
  );
};
