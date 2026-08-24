'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Check,
  X,
  Clock,
  FileText,
  AlertTriangle,
  ShieldCheck,
  Save,
  CheckCheck,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  StudentRosterAttendanceRecord,
  AttendanceStatus,
  MarkBatchAttendanceDto,
} from '../types/attendance.types';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { useToast } from '../../../context/ToastContext';
import { markBatchAttendance } from '../services/attendance.api';
import { cn } from '../../../lib/utils';

export interface AttendanceMarkingPanelProps {
  records: StudentRosterAttendanceRecord[];
  classId: string;
  subjectId: string;
  date: string;
  onSuccess?: () => void;
}

export const AttendanceMarkingPanel: React.FC<AttendanceMarkingPanelProps> = ({
  records: initialRecords,
  classId,
  subjectId,
  date,
  onSuccess,
}) => {
  const toast = useToast();
  const [records, setRecords] = useState<StudentRosterAttendanceRecord[]>(initialRecords);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick Action: Mark All Present
  const handleMarkAll = (status: AttendanceStatus) => {
    setRecords((prev) =>
      prev.map((r) => ({
        ...r,
        status,
      })),
    );
    toast.info(`Marked All ${status}`, `All student records set to ${status}.`);
  };

  // Individual Student Status Change
  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setRecords((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, status } : r)),
    );
  };

  // Inline Remarks Change
  const handleRemarksChange = (studentId: string, remarks: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, remarks } : r)),
    );
  };

  // Submit Batch to Backend
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload: MarkBatchAttendanceDto = {
        classId,
        subjectId,
        date,
        records: records.map((r) => ({
          studentId: r.studentId,
          status: r.status,
          remarks: r.remarks,
        })),
      };

      await markBatchAttendance(payload);
      toast.success(
        'Attendance Sheet Saved',
        `Batch attendance for ${records.length} students recorded with idempotency guarantee.`,
      );
      onSuccess?.();
    } catch (err: any) {
      toast.error('Submission Failed', err?.message || 'Could not record attendance');
    } finally {
      setIsSubmitting(false);
    }
  };

  const presentCount = records.filter((r) => r.status === 'PRESENT').length;
  const absentCount = records.filter((r) => r.status === 'ABSENT').length;
  const leaveCount = records.filter((r) => r.status === 'LEAVE').length;
  const lateCount = records.filter((r) => r.status === 'LATE').length;

  return (
    <Card className="p-6 space-y-6">
      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <CardTitle className="text-base">Batch Attendance Marking Roster</CardTitle>
          <CardDescription>
            Live attendance sheet for {date} • {records.length} Students Enrolled
          </CardDescription>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleMarkAll('PRESENT')}
            leftIcon={<CheckCheck className="w-4 h-4 text-emerald-400" />}
          >
            Mark All Present
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleMarkAll('ABSENT')}
            leftIcon={<X className="w-4 h-4 text-rose-400" />}
          >
            Mark All Absent
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save & Publish Sheet
          </Button>
        </div>
      </div>

      {/* Quick Summary Counts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center justify-between">
          <span className="text-xs font-semibold">Present:</span>
          <span className="font-bold font-mono text-sm">{presentCount}</span>
        </div>
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center justify-between">
          <span className="text-xs font-semibold">Absent:</span>
          <span className="font-bold font-mono text-sm">{absentCount}</span>
        </div>
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center justify-between">
          <span className="text-xs font-semibold">Late:</span>
          <span className="font-bold font-mono text-sm">{lateCount}</span>
        </div>
        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 flex items-center justify-between">
          <span className="text-xs font-semibold">Approved Leave:</span>
          <span className="font-bold font-mono text-sm">{leaveCount}</span>
        </div>
      </div>

      {/* Student Marking Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80">
        <table className="w-full text-left text-xs border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
              <th className="p-4 font-bold uppercase w-16">#</th>
              <th className="p-4 font-bold uppercase">Student Name & ID</th>
              <th className="p-4 font-bold uppercase text-center">Semester %</th>
              <th className="p-4 font-bold uppercase text-center">PNC Exam Eligibility</th>
              <th className="p-4 font-bold uppercase text-center">Mark Status</th>
              <th className="p-4 font-bold uppercase">Session Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {records.map((r, idx) => (
              <tr key={r.studentId} className="hover:bg-slate-900/40 transition-colors">
                <td className="p-4 font-mono text-slate-500">{idx + 1}</td>

                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        r.avatarUrl ||
                        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
                      }
                      alt={r.firstName}
                      className="w-8 h-8 rounded-lg object-cover border border-slate-700 shrink-0"
                    />
                    <div>
                      <Link
                        href={`/attendance/student/${r.studentId}`}
                        className="font-bold text-slate-100 hover:text-blue-400 transition-colors flex items-center gap-1"
                      >
                        <span>
                          {r.firstName} {r.lastName}
                        </span>
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </Link>
                      <span className="font-mono text-blue-400 text-[11px] block">{r.regId}</span>
                    </div>
                  </div>
                </td>

                <td className="p-4 text-center">
                  <span
                    className={cn(
                      'font-mono font-bold text-xs',
                      r.attendancePercentage >= 75 ? 'text-emerald-400' : 'text-rose-400',
                    )}
                  >
                    {r.attendancePercentage}%
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {r.attendedClasses}/{r.totalClasses}
                  </span>
                </td>

                <td className="p-4 text-center">
                  {r.isEligibleForExam ? (
                    <Badge variant="success" size="sm">
                      <ShieldCheck className="w-3 h-3 mr-1 text-emerald-400" />
                      Eligible (≥75%)
                    </Badge>
                  ) : (
                    <Badge variant="danger" size="sm" dot>
                      Barred (&lt;75%)
                    </Badge>
                  )}
                </td>

                {/* Quick Status Pill Toggle */}
                <td className="p-4 text-center">
                  <div className="inline-flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 gap-1">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(r.studentId, 'PRESENT')}
                      className={cn(
                        'px-2.5 py-1 rounded-lg text-xs font-bold transition-all',
                        r.status === 'PRESENT'
                          ? 'bg-emerald-600 text-white shadow'
                          : 'text-slate-400 hover:text-slate-200',
                      )}
                    >
                      P
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(r.studentId, 'ABSENT')}
                      className={cn(
                        'px-2.5 py-1 rounded-lg text-xs font-bold transition-all',
                        r.status === 'ABSENT'
                          ? 'bg-rose-600 text-white shadow'
                          : 'text-slate-400 hover:text-slate-200',
                      )}
                    >
                      A
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(r.studentId, 'LATE')}
                      className={cn(
                        'px-2.5 py-1 rounded-lg text-xs font-bold transition-all',
                        r.status === 'LATE'
                          ? 'bg-amber-600 text-white shadow'
                          : 'text-slate-400 hover:text-slate-200',
                      )}
                    >
                      Late
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(r.studentId, 'LEAVE')}
                      className={cn(
                        'px-2.5 py-1 rounded-lg text-xs font-bold transition-all',
                        r.status === 'LEAVE'
                          ? 'bg-blue-600 text-white shadow'
                          : 'text-slate-400 hover:text-slate-200',
                      )}
                    >
                      Leave
                    </button>
                  </div>
                </td>

                {/* Inline Remarks Input */}
                <td className="p-4">
                  <input
                    type="text"
                    value={r.remarks || ''}
                    onChange={(e) => handleRemarksChange(r.studentId, e.target.value)}
                    placeholder="Optional remarks..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
