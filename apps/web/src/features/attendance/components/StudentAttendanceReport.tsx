'use client';

import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BookOpen,
  ShieldCheck,
  Award,
  Info,
  Calendar,
  Filter,
  Check,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { useAuth } from '../../../context/AuthContext';
import { AttendanceStatusBadge } from './AttendanceStatusBadge';

export const StudentAttendanceReport: React.FC = () => {
  const { user } = useAuth();
  const studentName = user?.name || 'Amina Bibi';
  const institutionalThreshold = 75; // PNC Institutional Requirement

  const subjectAttendance = [
    { code: 'NUR-301', name: 'Adult Health Nursing II', instructor: 'Dr. Tariq Mahmood', attended: 28, total: 30, rate: 93.3 },
    { code: 'NUR-302', name: 'Pharmacology in Clinical Nursing', instructor: 'Dr. Ayesha Malik', attended: 22, total: 24, rate: 91.6 },
    { code: 'NUR-303', name: 'Nursing Research & Biostatistics', instructor: 'Prof. Muhammad Asif', attended: 20, total: 22, rate: 90.9 },
    { code: 'NUR-304', name: 'Mental Health & Psychiatric Nursing', instructor: 'Dr. Sarah Ahmed', attended: 29, total: 32, rate: 90.6 },
    { code: 'NUR-305', name: 'Professional Nursing Ethics & Law', instructor: 'Sister Farida Bano', attended: 15, total: 16, rate: 93.7 },
    { code: 'CLN-306', name: 'Hospital Clinical Practicum VI', instructor: 'Sister Farida Bano', attended: 42, total: 45, rate: 93.3 },
  ];

  const recentLogs = [
    { date: '2026-08-25', subject: 'Adult Health Nursing II', time: '02:30 PM', status: 'PRESENT', instructor: 'Dr. Tariq Mahmood', remarks: 'Present on-time' },
    { date: '2026-08-25', subject: 'Hospital Clinical Practicum VI', time: '08:00 AM', status: 'PRESENT', instructor: 'Sister Farida Bano', remarks: 'ICU ward morning shift' },
    { date: '2026-08-24', subject: 'Pharmacology in Clinical Nursing', time: '10:00 AM', status: 'PRESENT', instructor: 'Dr. Ayesha Malik', remarks: 'Interactive case study' },
    { date: '2026-08-24', subject: 'Nursing Research & Biostatistics', time: '12:00 PM', status: 'PRESENT', instructor: 'Prof. Muhammad Asif', remarks: 'Present' },
    { date: '2026-08-22', subject: 'Mental Health & Psychiatric Nursing', time: '09:00 AM', status: 'LATE', instructor: 'Dr. Sarah Ahmed', remarks: 'Arrived 10 mins late' },
    { date: '2026-08-21', subject: 'Hospital Clinical Practicum VI', time: '08:00 AM', status: 'PRESENT', instructor: 'Sister Farida Bano', remarks: 'Emergency rotation' },
    { date: '2026-08-19', subject: 'Adult Health Nursing II', time: '02:30 PM', status: 'PRESENT', instructor: 'Dr. Tariq Mahmood', remarks: 'Present' },
  ];

  // Calculate overall metrics
  const totalAttended = subjectAttendance.reduce((a, c) => a + c.attended, 0);
  const totalClasses = subjectAttendance.reduce((a, c) => a + c.total, 0);
  const overallPercentage = Math.round((totalAttended / totalClasses) * 1000) / 10;
  const isOverallEligible = overallPercentage >= institutionalThreshold;
  const bufferPercentage = Math.round((overallPercentage - institutionalThreshold) * 10) / 10;

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* 1. Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              My Academic & Clinical Attendance
            </h1>
            <Badge variant={isOverallEligible ? 'success' : 'danger'} size="sm">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" />
              {isOverallEligible ? 'PNC 75% Rule Cleared' : 'Below 75% Cutoff'}
            </Badge>
          </div>
          <p className="text-xs text-slate-300">
            Student: <span className="font-bold text-white">{studentName}</span> (NUR-2022-0041) • Generic BSN Semester 6 (Spring 2026 Active)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Cumulative</span>
              <span className="text-xl font-black text-emerald-400">{overallPercentage}%</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Institutional Examination Policy Context */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>
            <strong>Institutional Requirement:</strong> Minimum <span className="font-mono font-bold text-blue-600 dark:text-blue-400">75% attendance</span> required in each subject under PNC Examination Regulations.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> All 6 Subjects Cleared (+{bufferPercentage}% Buffer)
          </span>
        </div>
      </div>

      {/* 3. Subject-wise Progress & Exam Eligibility Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjectAttendance.map((sub) => {
          const isEligible = sub.rate >= institutionalThreshold;
          const needed = isEligible
            ? 0
            : Math.ceil((institutionalThreshold * sub.total - 100 * sub.attended) / (100 - institutionalThreshold));

          return (
            <Card
              key={sub.code}
              className={`p-5 flex flex-col justify-between space-y-4 ${
                !isEligible ? 'border-amber-400 dark:border-amber-600 bg-amber-50/20 dark:bg-amber-950/10' : ''
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{sub.code}</span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{sub.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{sub.instructor}</p>
                  </div>
                  <Badge variant={isEligible ? 'success' : 'warning'} size="sm">
                    {sub.rate}%
                  </Badge>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isEligible ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${sub.rate}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-mono">
                  <span>Attended: <strong>{sub.attended}</strong> / {sub.total} Sessions</span>
                  <span>Required: {institutionalThreshold}%</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span
                  className={`text-xs font-bold flex items-center gap-1 ${
                    isEligible ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {isEligible ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ALLOWED FOR EXAM
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5" />
                      AT RISK ({needed} class needed)
                    </>
                  )}
                </span>

                <span className="text-[11px] text-slate-400">
                  {isEligible ? `+${(sub.rate - institutionalThreshold).toFixed(1)}% Safe` : `-${(institutionalThreshold - sub.rate).toFixed(1)}% Short`}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 4. Recent Session Log Activity */}
      <Card className="p-6 space-y-4">
        <CardHeader className="pb-2">
          <div>
            <CardTitle className="text-base">Recent Attendance Session History</CardTitle>
            <CardDescription>Verified lecture & hospital ward attendance timestamp records</CardDescription>
          </div>
        </CardHeader>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase">
              <tr>
                <th className="p-3.5">Session Date & Time</th>
                <th className="p-3.5">Subject / Practicum</th>
                <th className="p-3.5">Faculty Preceptor</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5">Teacher Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {recentLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                  <td className="p-3.5">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{log.date}</span>
                    <span className="text-slate-500 block text-[11px]">{log.time}</span>
                  </td>
                  <td className="p-3.5 font-medium text-slate-900 dark:text-slate-100">{log.subject}</td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400">{log.instructor}</td>
                  <td className="p-3.5 text-center">
                    <AttendanceStatusBadge status={log.status as any} />
                  </td>
                  <td className="p-3.5 text-slate-500 italic">{log.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
