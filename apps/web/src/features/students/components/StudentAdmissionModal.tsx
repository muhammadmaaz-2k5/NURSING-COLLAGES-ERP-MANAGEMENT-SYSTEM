'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { MediaUploader } from '../../../components/forms/MediaUploader';
import { useToast } from '../../../context/ToastContext';
import { createStudent } from '../services/students.api';
import {
  User,
  BookOpen,
  FileText,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
} from 'lucide-react';

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
  const [currentStep, setCurrentStep] = useState(1);
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
    guardianName: 'Muhammad Tariq',
    guardianPhone: '+92-300-1122334',
    guardianRelation: 'Father',
  });

  const steps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Program Selection', icon: BookOpen },
    { number: 3, title: 'Guardian & Photo', icon: FileText },
    { number: 4, title: 'Review & Submit', icon: CheckCircle2 },
  ];

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.firstName || !formData.email) {
        toast.error('Validation Error', 'First name and email are mandatory.');
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      setCurrentStep(1);
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
      description="Step-by-step guided workflow for enrolling a nursing student."
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={currentStep === 1 ? onClose : handlePrev}
            disabled={isLoading}
            leftIcon={currentStep > 1 ? <ChevronLeft className="w-3.5 h-3.5" /> : undefined}
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </Button>

          <div className="flex items-center gap-2">
            {currentStep < 4 ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleNext}
                rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmit}
                isLoading={isLoading}
                leftIcon={<ShieldCheck className="w-4 h-4" />}
              >
                Confirm Admission & Enroll
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Multi-step progress bar */}
        <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800">
          {steps.map((s) => {
            const Icon = s.icon;
            const isCompleted = currentStep > s.number;
            const isCurrent = currentStep === s.number;
            return (
              <div
                key={s.number}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.number}
                </div>
                <span
                  className={
                    isCurrent
                      ? 'text-blue-600 dark:text-blue-400 font-bold hidden sm:inline'
                      : 'text-slate-500 hidden sm:inline'
                  }
                >
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* STEP 1: Personal & Identity Info */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fade-in text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="e.g. Amina"
              />
              <Input
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="e.g. Bibi"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Institutional Email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="amina.bibi@college.edu.pk"
              />
              <Input
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+92 300 1234567"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="National CNIC / B-Form"
                value={formData.cnic}
                onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                placeholder="61101-1234567-8"
              />
              <Select
                label="Gender"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                options={[
                  { value: 'FEMALE', label: 'Female' },
                  { value: 'MALE', label: 'Male' },
                  { value: 'OTHER', label: 'Other' },
                ]}
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
                  { value: 'O+', label: 'O+' },
                  { value: 'O-', label: 'O-' },
                  { value: 'AB+', label: 'AB+' },
                  { value: 'AB-', label: 'AB-' },
                ]}
              />
            </div>
          </div>
        )}

        {/* STEP 2: Academic Program Selection */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fade-in text-xs">
            <Select
              label="Degree Program Enrollment"
              required
              value={formData.programId}
              onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
              options={[
                { value: 'prog-01', label: 'Bachelor of Science in Nursing (Generic 4-Year)' },
                { value: 'prog-02', label: 'Post-RN BSN Degree Program (2-Year)' },
                { value: 'prog-03', label: 'Doctor of Physical Therapy (DPT 5-Year)' },
                { value: 'prog-04', label: 'BS Medical Laboratory Technology (BS-MLT 4-Year)' },
              ]}
              helperText="Determines curriculum roadmap and PNC procedural logbook requirements."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
              <Input
                label="City of Domicile"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Islamabad / Rawalpindi"
              />
            </div>

            <Input
              label="Residential Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="House, Street, Sector / Area"
            />
          </div>
        )}

        {/* STEP 3: Guardian & Document Upload */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-fade-in text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Guardian Name"
                value={formData.guardianName}
                onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                placeholder="Guardian Full Name"
              />
              <Input
                label="Guardian Phone"
                value={formData.guardianPhone}
                onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                placeholder="+92 300 0000000"
              />
              <Select
                label="Relationship"
                value={formData.guardianRelation}
                onChange={(e) => setFormData({ ...formData, guardianRelation: e.target.value })}
                options={[
                  { value: 'Father', label: 'Father' },
                  { value: 'Mother', label: 'Mother' },
                  { value: 'Brother', label: 'Brother' },
                  { value: 'Sister', label: 'Sister' },
                  { value: 'Guardian', label: 'Legal Guardian' },
                ]}
              />
            </div>

            <MediaUploader
              label="Student Profile Photograph (Cloudinary CDN)"
              folder="students/avatars"
              value={avatarUrl}
              onChange={setAvatarUrl}
              accept="image/*"
              helperText="Upload official passport size student photo."
            />
          </div>
        )}

        {/* STEP 4: Review & Final Confirmation */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-fade-in text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-800 dark:text-slate-200">Full Name</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {formData.firstName} {formData.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Program</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Bachelor of Science in Nursing (Generic)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">CNIC</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{formData.cnic || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Guardian</span>
                <span className="text-slate-800 dark:text-slate-200">
                  {formData.guardianName} ({formData.guardianRelation})
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                Ready for submission. Automatic student portal credentials will be issued upon enrollment.
              </span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
