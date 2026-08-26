'use client';

import React from 'react';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  Clock,
  Stethoscope,
  BookOpen,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

export interface DegreeProgressCardProps {
  studentName?: string;
  programName?: string;
  totalCreditsRequired?: number;
  creditsEarned?: number;
  clinicalHoursRequired?: number;
  clinicalHoursCompleted?: number;
  cgpa?: number;
  attendanceRate?: number;
  isFinanceClear?: boolean;
}

export const DegreeProgressCard: React.FC<DegreeProgressCardProps> = ({
  studentName = 'Amina Bibi',
  programName = 'Generic BSN (4-Year Degree)',
  totalCreditsRequired = 136,
  creditsEarned = 94,
  clinicalHoursRequired = 1200,
  clinicalHoursCompleted = 840,
  cgpa = 3.82,
  attendanceRate = 91.4,
  isFinanceClear = true,
}) => {
  const creditPercent = Math.round((creditsEarned / totalCreditsRequired) * 100);
  const clinicalPercent = Math.round((clinicalHoursCompleted / clinicalHoursRequired) * 100);

  const clearanceItems = [
    {
      label: 'Minimum Cumulative GPA (≥ 2.50)',
      value: `${cgpa} CGPA (Pass with Distinction)`,
      isComplete: cgpa >= 2.5,
    },
    {
      label: 'Mandatory 75% PNC Attendance Rule',
      value: `${attendanceRate}% Overall Attendance`,
      isComplete: attendanceRate >= 75,
    },
    {
      label: '1200 Hours PNC Clinical Logbook',
      value: `${clinicalHoursCompleted} / ${clinicalHoursRequired} Hours (${clinicalPercent}%)`,
      isComplete: clinicalHoursCompleted >= clinicalHoursRequired,
      inProgress: true,
    },
    {
      label: 'Institutional Fee & Billing Clearance',
      value: isFinanceClear ? 'All Semester Dues Cleared (₨ 0)' : 'Pending Due',
      isComplete: isFinanceClear,
    },
  ];

  return (
    <Card className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Degree Audit & Graduation Clearance Milestone
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {programName} • Target Convocation: <span className="font-semibold text-blue-600 dark:text-blue-400">Spring 2027</span>
            </p>
          </div>
        </div>

        <Badge variant="purple" size="sm">
          <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" />
          {creditPercent}% Degree Complete
        </Badge>
      </div>

      {/* Main Dual Progress Meters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Academic Credit Hours */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Academic Credits Earned</span>
            </div>
            <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
              {creditsEarned} / {totalCreditsRequired} Cr.
            </span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${creditPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Completed Semesters: 5 of 8</span>
            <span>{totalCreditsRequired - creditsEarned} Credits Remaining</span>
          </div>
        </div>

        {/* 1200h PNC Clinical Logbook Hours */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">PNC Clinical Rotations</span>
            </div>
            <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
              {clinicalHoursCompleted} / {clinicalHoursRequired} Hours
            </span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${clinicalPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Verified Wards: 4 Rotations</span>
            <span>{clinicalHoursRequired - clinicalHoursCompleted} Hours Remaining</span>
          </div>
        </div>
      </div>

      {/* Graduation Requirements Checklist */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          PNC & University Graduation Clearance Verification
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {clearanceItems.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start gap-3 shadow-2xs"
            >
              <div className="mt-0.5">
                {item.isComplete ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : item.inProgress ? (
                  <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {item.label}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {item.value}
                </p>
              </div>
              <Badge
                variant={item.isComplete ? 'success' : item.inProgress ? 'primary' : 'warning'}
                size="xs"
              >
                {item.isComplete ? 'Cleared' : item.inProgress ? 'In Progress' : 'Pending'}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
