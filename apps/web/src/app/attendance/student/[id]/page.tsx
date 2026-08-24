'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Award,
  Loader2,
} from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { AttendanceStatusBadge } from '../../../../features/attendance/components/AttendanceStatusBadge';
import { fetchStudentAttendanceReport } from '../../../../features/attendance/services/attendance.api';
import { StudentAttendanceReport } from '../../../../features/attendance/types/attendance.types';
import { formatDate } from '../../../../lib/utils';

export default function StudentAttendancePage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params?.id as string;

  const [report, setReport] = useState<StudentAttendanceReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!studentId) return;
      setIsLoading(true);
      try {
        const data = await fetchStudentAttendanceReport(studentId);
        setReport(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [studentId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-xs text-slate-400 font-medium">Loading Student Attendance Audit...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="text-lg font-bold text-slate-200">Attendance Record Not Found</h3>
        <Button variant="primary" size="sm" onClick={() => router.push('/attendance')}>
          Back to Attendance
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/attendance')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Attendance Roster
        </Button>
      </div>

      {/* Header Banner */}
      <div className="p-6 lg:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">{report.studentName}</h1>
              <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                {report.regId}
              </span>
            </div>
            <p className="text-xs text-slate-400">{report.programName}</p>
          </div>

          <div className="flex items-center gap-3">
            {report.isEligibleForExam ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>PNC Exam Eligible ({report.attendancePercentage}%)</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Barred from Examination ({report.attendancePercentage}%)</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6 mt-6 border-t border-slate-800/80 text-center">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500">Total Classes</span>
            <p className="text-xl font-bold text-white mt-0.5">{report.totalClasses}</p>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
            <span className="text-[10px] uppercase font-bold text-emerald-400">Present</span>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">{report.present}</p>
          </div>

          <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/20">
            <span className="text-[10px] uppercase font-bold text-rose-400">Absent</span>
            <p className="text-xl font-bold text-rose-400 mt-0.5">{report.absent}</p>
          </div>

          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/20">
            <span className="text-[10px] uppercase font-bold text-amber-400">Late</span>
            <p className="text-xl font-bold text-amber-400 mt-0.5">{report.late}</p>
          </div>

          <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/20">
            <span className="text-[10px] uppercase font-bold text-blue-400">Approved Leave</span>
            <p className="text-xl font-bold text-blue-400 mt-0.5">{report.leave}</p>
          </div>
        </div>
      </div>

      {/* Historical Session Logs */}
      <Card className="p-6 space-y-4">
        <CardHeader className="pb-2">
          <div>
            <CardTitle className="text-base">Session-by-Session Attendance Logs</CardTitle>
            <CardDescription>
              Complete date-stamped audit trail for the semester
            </CardDescription>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-bold uppercase">Date</th>
                <th className="pb-3 font-bold uppercase">Subject Name & Code</th>
                <th className="pb-3 font-bold uppercase">Faculty Instructor</th>
                <th className="pb-3 font-bold uppercase text-center">Status</th>
                <th className="pb-3 font-bold uppercase">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {report.history.map((h) => (
                <tr key={h.id} className="hover:bg-slate-800/30">
                  <td className="py-3 font-mono text-slate-400">{formatDate(h.date)}</td>
                  <td className="py-3">
                    <p className="font-bold text-slate-200">{h.subjectName}</p>
                    <span className="font-mono text-blue-400 text-[11px]">{h.subjectCode}</span>
                  </td>
                  <td className="py-3 text-slate-300 font-medium">{h.facultyName}</td>
                  <td className="py-3 text-center">
                    <AttendanceStatusBadge status={h.status} />
                  </td>
                  <td className="py-3 text-slate-400">{h.remarks || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
