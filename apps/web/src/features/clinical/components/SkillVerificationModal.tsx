'use client';

import React, { useState } from 'react';
import { ShieldCheck, Award, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { useToast } from '../../../context/ToastContext';
import { verifySkill } from '../services/clinical.api';
import { SupervisorPendingVerification, SkillStatus } from '../types/clinical.types';

export interface SkillVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: SupervisorPendingVerification | null;
  onSuccess?: () => void;
}

export const SkillVerificationModal: React.FC<SkillVerificationModalProps> = ({
  isOpen,
  onClose,
  item,
  onSuccess,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState<number>(90);
  const [status, setStatus] = useState<SkillStatus>('VERIFIED');
  const [remarks, setRemarks] = useState(
    'Aseptic non-touch technique followed meticulously. Full procedural compliance declared.',
  );

  if (!item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await verifySkill(item.studentId, item.skillId, {
        score,
        status,
        remarks,
      });

      toast.success(
        'Skill Verified & Signed Off',
        `${item.skillName} for ${item.studentName} has been officially recorded in PNC logbook.`,
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error('Verification Failed', err?.message || 'Could not verify skill');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Supervisor Clinical Skill Verification"
      description="Evaluate bedside nursing competency and authorize official logbook credit."
      size="md"
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
            leftIcon={<ShieldCheck className="w-4 h-4" />}
          >
            Authorize & Sign Logbook
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Student & Skill Context Header */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">{item.skillName}</h4>
              <p className="text-xs text-blue-400 font-medium">{item.category}</p>
            </div>
            <Badge variant="purple" size="sm">
              Attempt #{item.attemptNumber}
            </Badge>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <span>
              Candidate: <strong className="text-slate-200">{item.studentName}</strong> ({item.studentRegId})
            </span>
            <span className="font-mono">{item.wardName}</span>
          </div>

          {item.studentRemarks && (
            <div className="text-[11px] text-slate-400 italic bg-slate-900/60 p-2 rounded-lg border border-slate-800">
              Student Note: &ldquo;{item.studentRemarks}&rdquo;
            </div>
          )}
        </div>

        {/* Evaluation Score (0 - 100) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-200 uppercase">
              Competency Evaluation Score (0 - 100) *
            </label>
            <span className="font-mono font-bold text-emerald-400 text-sm">{score}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        {/* Verification Status */}
        <Select
          label="Verification Decision *"
          value={status}
          onChange={(e) => setStatus(e.target.value as SkillStatus)}
          options={[
            { value: 'VERIFIED', label: 'Verified & Competent (PNC Credit Approved)' },
            { value: 'IN_PROGRESS', label: 'In Progress (Needs Further Clinical Practice)' },
            { value: 'REJECTED', label: 'Rejected (Aseptic / Safety Breach)' },
          ]}
        />

        {/* Clinical Remarks */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300 uppercase">
            Supervisor Evaluation Remarks *
          </label>
          <textarea
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500"
          />
        </div>
      </form>
    </Modal>
  );
};
