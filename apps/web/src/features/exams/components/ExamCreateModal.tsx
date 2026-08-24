'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../context/ToastContext';
import { createExam } from '../services/exams.api';
import { CreateExamDto, ExamType } from '../types/exams.types';

export interface ExamCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ExamCreateModal: React.FC<ExamCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState<CreateExamDto>({
    semesterId: 'sem-01',
    subjectId: 'sub-08',
    facultyId: 'fac-01',
    name: '',
    type: 'MIDTERM',
    totalMarks: 100,
    passingMarks: 50,
    examDate: '2026-09-15',
    startTime: '09:00',
    endTime: '11:00',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      toast.error('Validation Error', 'Please specify Examination Title.');
      return;
    }

    setIsLoading(true);
    try {
      await createExam(form);
      toast.success(
        'Exam Scheduled',
        `${form.name} has been created on the examination calendar.`,
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Scheduling Failed', err?.message || 'Could not schedule examination');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Academic / Clinical Examination"
      description="Create an official examination entry and allocate marks distribution."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Schedule Examination
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Examination Title *"
          placeholder="e.g. Adult Health Nursing II — Midterm Exam"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Examination Type *"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as ExamType })}
            options={[
              { value: 'MIDTERM', label: 'Midterm Examination' },
              { value: 'FINAL', label: 'Semester Final Examination' },
              { value: 'CLINICAL_OSCE', label: 'Clinical OSCE Practicum' },
              { value: 'PRACTICAL', label: 'Laboratory Practical Exam' },
              { value: 'QUIZ', label: 'Quiz / Sessional Assessment' },
              { value: 'ASSIGNMENT', label: 'Term Assignment / Case Study' },
            ]}
          />
          <Select
            label="Subject / Module *"
            value={form.subjectId}
            onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
            options={[
              { value: 'sub-08', label: 'Adult Health Nursing II (AHN-302)' },
              { value: 'sub-02', label: 'Fundamentals of Nursing II (FON-102)' },
              { value: 'sub-09', label: 'Clinical Pharmacology (PHM-304)' },
              { value: 'sub-05', label: 'Human Anatomy & Physiology II (ANAT-102)' },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Maximum Marks *"
            type="number"
            value={form.totalMarks}
            onChange={(e) => setForm({ ...form, totalMarks: Number(e.target.value) })}
            required
          />
          <Input
            label="Passing Marks Threshold *"
            type="number"
            value={form.passingMarks}
            onChange={(e) => setForm({ ...form, passingMarks: Number(e.target.value) })}
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Input
            label="Exam Date"
            type="date"
            value={form.examDate}
            onChange={(e) => setForm({ ...form, examDate: e.target.value })}
          />
          <Input
            label="Start Time"
            type="time"
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
          />
          <Input
            label="End Time"
            type="time"
            value={form.endTime}
            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
          />
        </div>
      </form>
    </Modal>
  );
};
