'use client';

import React, { useState } from 'react';
import { Stethoscope, CheckCircle2, Clock, MapPin, UserCheck, ShieldCheck, AlertCircle } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { useToast } from '../../../context/ToastContext';

export interface ClinicalProcedureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ClinicalProcedureModal: React.FC<ClinicalProcedureModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    skillId: 'skl-01',
    skillName: 'IV Cannulation & Fluid Infusion',
    location: 'Teaching Hospital — ICU Ward Bed 4',
    date: new Date().toISOString().split('T')[0],
    time: '10:30 AM',
    patientAgeGender: '45 M',
    notes: 'Successfully established 20G IV cannula on left cephalic vein with aseptic technique under preceptor observation.',
    supervisor: 'Sister Farida Bano',
  });

  const skillOptions = [
    { value: 'skl-01', label: 'IV Cannulation & Fluid Infusion (Core PNC)' },
    { value: 'skl-02', label: 'Foley Catheterization & Urethral Care' },
    { value: 'skl-03', label: 'Nasogastric Tube (NGT) Insertion' },
    { value: 'skl-04', label: 'Adult CPR & Basic Life Support (BLS)' },
    { value: 'skl-05', label: 'Surgical Wound Dressing & Aseptic Care' },
    { value: 'skl-06', label: '12-Lead Electrocardiogram (ECG) Recording' },
    { value: 'skl-07', label: 'Blood Glucose Monitoring & Insulin Administration' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      toast.success(
        'Bedside Procedure Logged',
        'Procedure submitted successfully. Status: Pending Supervisor Verification.',
      );
      onSuccess?.();
      onClose();
      setStep(1);
    } catch (err: any) {
      toast.error('Submission Failed', err?.message || 'Unable to log procedure');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Bedside Clinical Procedure"
      description="Submit bedside procedural nursing competency for hospital clinical supervisor verification"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step Indicator */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
              1
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Procedure Details</span>
          </div>
          <span className="text-slate-400">→</span>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold flex items-center justify-center text-xs">
              2
            </span>
            <span className="text-slate-600 dark:text-slate-400">Supervisor Review</span>
          </div>
          <span className="text-slate-400">→</span>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold flex items-center justify-center text-xs">
              3
            </span>
            <span className="text-slate-600 dark:text-slate-400">Verified</span>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-3">
          <Select
            label="PNC Clinical Procedure / Competency *"
            value={formData.skillId}
            onChange={(e) => {
              const selected = skillOptions.find((o) => o.value === e.target.value);
              setFormData({
                ...formData,
                skillId: e.target.value,
                skillName: selected?.label || formData.skillName,
              });
            }}
            options={skillOptions}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Clinical Ward & Hospital Bed Location *"
              placeholder="e.g. Teaching Hospital — ICU Ward Bed 4"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />

            <Select
              label="Assigned Clinical Supervisor (Preceptor) *"
              value={formData.supervisor}
              onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })}
              options={[
                { value: 'Sister Farida Bano', label: 'Sister Farida Bano (Clinical Supervisor — ICU)' },
                { value: 'Dr. Tariq Mahmood', label: 'Dr. Tariq Mahmood (Associate Professor)' },
                { value: 'Dr. Sarah Ahmed', label: 'Dr. Sarah Ahmed (Clinical Preceptor — ER)' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Date of Execution *"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />

            <Input
              label="Shift Time *"
              placeholder="e.g. 10:30 AM"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Procedure Clinical Notes & Observations *
            </label>
            <textarea
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 min-h-[90px]"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Describe technique, gauge size, asepsis, patient response, and supervisor oversight..."
              required
            />
          </div>
        </div>

        {/* Verification Alert Notice */}
        <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex items-start gap-2.5 text-xs text-blue-900 dark:text-blue-200">
          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <span>
            Upon submission, this log entry will appear in your supervisor's verification queue marked as <strong className="font-semibold text-blue-700 dark:text-blue-300">Pending Supervisor Verification</strong>.
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button variant="outline" size="sm" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting} leftIcon={<Stethoscope className="w-4 h-4" />}>
            Submit for Verification
          </Button>
        </div>
      </form>
    </Modal>
  );
};
