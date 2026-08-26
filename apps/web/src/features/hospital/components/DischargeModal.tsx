'use client';

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { TinyEditor } from '../../../components/ui/TinyEditor';
import { useToast } from '../../../context/ToastContext';
import { dischargePatient } from '../services/hospital.api';
import { HospitalBed } from '../types/hospital.types';

export interface DischargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  bed: HospitalBed | null;
  onSuccess?: () => void;
}

export const DischargeModal: React.FC<DischargeModalProps> = ({
  isOpen,
  onClose,
  bed,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState(
    '<p>Post-operative clinical recovery satisfactory. Vitals stable.</p><ul><li>Oral medications prescribed for 7 days</li><li>Wound dressing review scheduled in 5 days</li><li>Emergency SOS instructions provided to patient</li></ul>',
  );

  if (!bed || !bed.currentAdmission) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await dischargePatient(bed.currentAdmission!.id, {
        dischargeSummary: summary,
      });

      toast.success(
        'Patient Discharged',
        `${bed.currentAdmission?.patientName} discharged. Bed ${bed.bedNumber} released back to AVAILABLE.`,
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Discharge Failed', err?.message || 'Could not discharge patient');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Discharge Inpatient & Release Bed"
      description="Record official clinical discharge summary and mark bed status as Available."
      size="lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleSubmit} isLoading={isLoading}>
            Confirm Discharge & Free Bed
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Patient Name:</span>
            <span className="font-bold text-slate-900 dark:text-white">{bed.currentAdmission.patientName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Medical Record No (MRN):</span>
            <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
              {bed.currentAdmission.patientNo}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Occupied Bed:</span>
            <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{bed.bedNumber}</span>
          </div>
        </div>

        <div className="space-y-1">
          <TinyEditor
            label="Clinical Discharge Summary & Post-Discharge Advice *"
            value={summary}
            onChange={(content) => setSummary(content)}
            height={220}
          />
        </div>
      </form>
    </Modal>
  );
};
