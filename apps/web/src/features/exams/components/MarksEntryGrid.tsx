'use client';

import React, { useState } from 'react';
import {
  Save,
  Send,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Award,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { StudentMarkRecord } from '../types/exams.types';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Modal } from '../../../components/ui/Modal';
import { GradeBadge } from './GradeBadge';
import { useToast } from '../../../context/ToastContext';
import { enterMarks, publishResults } from '../services/exams.api';

export interface MarksEntryGridProps {
  examId: string;
  examName: string;
  maxMarks: number;
  passingMarks: number;
  status: string;
  results: StudentMarkRecord[];
  onSuccess?: () => void;
}

export const MarksEntryGrid: React.FC<MarksEntryGridProps> = ({
  examId,
  examName,
  maxMarks,
  passingMarks,
  status,
  results: initialResults,
  onSuccess,
}) => {
  const toast = useToast();
  const [results, setResults] = useState<StudentMarkRecord[]>(initialResults);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const isPublished = status === 'PUBLISHED';

  // Helper: compute grade and GP
  const calculateGradeInfo = (obtained: number) => {
    const pct = Math.round((obtained / maxMarks) * 100);
    let grade = 'F';
    let gpa = 0.0;
    let passFail: 'PASS' | 'FAIL' = 'FAIL';

    if (obtained >= passingMarks) {
      passFail = 'PASS';
      if (pct >= 85) {
        grade = 'A+';
        gpa = 4.0;
      } else if (pct >= 80) {
        grade = 'A';
        gpa = 3.7;
      } else if (pct >= 75) {
        grade = 'B+';
        gpa = 3.3;
      } else if (pct >= 70) {
        grade = 'B';
        gpa = 3.0;
      } else if (pct >= 60) {
        grade = 'C+';
        gpa = 2.3;
      } else {
        grade = 'C';
        gpa = 2.0;
      }
    }

    return { percentage: pct, grade, gpa, status: passFail };
  };

  const handleMarkChange = (studentId: string, value: string) => {
    const num = Math.min(Math.max(Number(value) || 0, 0), maxMarks);
    const { percentage, grade, gpa, status: passFail } = calculateGradeInfo(num);

    setResults((prev) =>
      prev.map((r) =>
        r.studentId === studentId
          ? {
              ...r,
              marksObtained: num,
              percentage,
              grade,
              gpa,
              status: passFail,
            }
          : r,
      ),
    );
    setHasUnsavedChanges(true);
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setResults((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, remarks } : r)),
    );
    setHasUnsavedChanges(true);
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      await enterMarks(
        examId,
        results.map((r) => ({
          studentId: r.studentId,
          marks: r.marksObtained,
          remarks: r.remarks,
        })),
      );
      toast.success('Marks Draft Saved', 'Student scores and auto-computed grades saved.');
      setHasUnsavedChanges(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error('Save Failed', err?.message || 'Could not save marks');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishResults = async () => {
    setIsPublishing(true);
    try {
      await publishResults(examId);
      toast.success('Results Published & Locked', 'Scores have been published to student transcripts.');
      setIsPublishModalOpen(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error('Publish Failed', err?.message || 'Could not publish results');
    } finally {
      setIsPublishing(false);
    }
  };

  const passCount = results.filter((r) => r.status === 'PASS').length;
  const failCount = results.filter((r) => r.status === 'FAIL').length;
  const passRate = Math.round((passCount / (results.length || 1)) * 100);

  return (
    <Card className="p-6 space-y-6">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">Marks Entry & Grade Compilation</CardTitle>
            {isPublished ? (
              <Badge variant="purple" size="sm">
                <Lock className="w-3 h-3 mr-1" />
                Results Published & Locked
              </Badge>
            ) : (
              <Badge variant="warning" size="sm" dot>
                Grading in Progress
              </Badge>
            )}
          </div>
          <CardDescription>
            Passing Marks Threshold: {passingMarks} / {maxMarks} Total Marks
          </CardDescription>
        </div>

        <div className="flex items-center gap-2.5">
          {hasUnsavedChanges && (
            <span className="text-xs text-amber-400 font-semibold animate-pulse flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Unsaved Changes
            </span>
          )}

          {!isPublished && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveDraft}
                isLoading={isSaving}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Draft
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsPublishModalOpen(true)}
                leftIcon={<Send className="w-4 h-4" />}
              >
                Publish & Lock Results
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Stats Meter */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-500">Graded Candidates</span>
          <p className="text-xl font-bold text-white mt-0.5">{results.length}</p>
        </div>
        <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-center">
          <span className="text-[10px] uppercase font-bold text-emerald-400">Passed Candidates</span>
          <p className="text-xl font-bold text-emerald-400 mt-0.5">{passCount}</p>
        </div>
        <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/20 text-center">
          <span className="text-[10px] uppercase font-bold text-rose-400">Failed Candidates</span>
          <p className="text-xl font-bold text-rose-400 mt-0.5">{failCount}</p>
        </div>
        <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 text-center">
          <span className="text-[10px] uppercase font-bold text-blue-400">Overall Pass Rate</span>
          <p className="text-xl font-bold text-blue-400 mt-0.5">{passRate}%</p>
        </div>
      </div>

      {/* Operational Marks Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80">
        <table className="w-full text-left text-xs border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
              <th className="p-4 font-bold uppercase w-12">#</th>
              <th className="p-4 font-bold uppercase">Student Name & ID</th>
              <th className="p-4 font-bold uppercase text-center w-32">
                Obtained / {maxMarks}
              </th>
              <th className="p-4 font-bold uppercase text-center">Percentage</th>
              <th className="p-4 font-bold uppercase text-center">Letter Grade</th>
              <th className="p-4 font-bold uppercase text-center">GP</th>
              <th className="p-4 font-bold uppercase text-center">Standing</th>
              <th className="p-4 font-bold uppercase">Examiner Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {results.map((r, idx) => (
              <tr key={r.studentId} className="hover:bg-slate-900/40">
                <td className="p-4 font-mono text-slate-500">{idx + 1}</td>

                <td className="p-4">
                  <p className="font-bold text-slate-100">{r.studentName}</p>
                  <span className="font-mono text-blue-400 text-[11px]">{r.regId}</span>
                </td>

                <td className="p-4 text-center">
                  {isPublished ? (
                    <span className="font-mono font-bold text-base text-slate-100">
                      {r.marksObtained}
                    </span>
                  ) : (
                    <input
                      type="number"
                      min={0}
                      max={maxMarks}
                      value={r.marksObtained}
                      onChange={(e) => handleMarkChange(r.studentId, e.target.value)}
                      className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-sm font-mono font-bold text-center text-white focus:outline-none focus:border-blue-500"
                    />
                  )}
                </td>

                <td className="p-4 text-center font-mono font-bold text-slate-300">
                  {r.percentage}%
                </td>

                <td className="p-4 text-center">
                  <GradeBadge grade={r.grade} />
                </td>

                <td className="p-4 text-center font-mono font-bold text-blue-400">
                  {r.gpa.toFixed(1)}
                </td>

                <td className="p-4 text-center">
                  <Badge variant={r.status === 'PASS' ? 'success' : 'danger'} size="sm">
                    {r.status}
                  </Badge>
                </td>

                <td className="p-4">
                  {isPublished ? (
                    <span className="text-slate-400">{r.remarks || '—'}</span>
                  ) : (
                    <input
                      type="text"
                      value={r.remarks || ''}
                      onChange={(e) => handleRemarksChange(r.studentId, e.target.value)}
                      placeholder="Optional feedback..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Publish & Lock Confirmation Modal */}
      <Modal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        title="Publish & Lock Examination Results"
        description="Are you sure you want to officially publish these marks? This action locks the scores and reflects on all student GPA transcripts."
        size="sm"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsPublishModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handlePublishResults}
              isLoading={isPublishing}
              leftIcon={<Lock className="w-4 h-4" />}
            >
              Confirm & Publish Results
            </Button>
          </>
        }
      >
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs space-y-1">
          <p className="font-bold">Important Policy Warning</p>
          <p className="text-[11px] text-amber-300/80">
            Once published, marks are immutable and can only be altered through an official academic dean revision request.
          </p>
        </div>
      </Modal>
    </Card>
  );
};
