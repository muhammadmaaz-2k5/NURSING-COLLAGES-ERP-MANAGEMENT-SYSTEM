'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Filter,
  ShieldCheck,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { AttendanceMarkingPanel } from '../../features/attendance/components/AttendanceMarkingPanel';
import { StudentAttendanceReport } from '../../features/attendance/components/StudentAttendanceReport';
import { fetchClassAttendanceSheet } from '../../features/attendance/services/attendance.api';
import { StudentRosterAttendanceRecord } from '../../features/attendance/types/attendance.types';
import { useAuth } from '../../context/AuthContext';

export default function AttendancePage() {
  const { user } = useAuth();
  const [selectedClassId, setSelectedClassId] = useState('cls-1');
  const [selectedSubjectId, setSelectedSubjectId] = useState('sub-02');
  const [selectedDate, setSelectedDate] = useState('2026-08-24');
  const [records, setRecords] = useState<StudentRosterAttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAttendance = async () => {
    setIsLoading(true);
    try {
      const data = await fetchClassAttendanceSheet(
        selectedClassId,
        selectedSubjectId,
        selectedDate,
      );
      setRecords(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role !== 'STUDENT') {
      loadAttendance();
    }
  }, [selectedClassId, selectedSubjectId, selectedDate, user?.role]);

  // If active user is a student, show their read-only personal attendance report
  if (user?.role === 'STUDENT') {
    return <StudentAttendanceReport />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Daily Academic & Clinical Attendance
            </h1>
            <Badge variant="success" size="sm">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-500 dark:text-emerald-400" />
              75% PNC Rule Active
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Faculty attendance marking roster with one-click batch marking and automated examination eligibility calculations.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Overall Attendance
          </span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">91.4%</h3>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">Across all sections</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Exam Eligible
          </span>
          <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">94.2%</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">≥ 75% Compliance Rate</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Barred Candidates
          </span>
          <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">4</h3>
          <p className="text-xs text-rose-500 dark:text-rose-300 mt-2 font-medium">&lt; 75% Critical Warning</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Today Sessions
          </span>
          <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">12</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">Classes & Hospital Rotations</p>
        </Card>
      </div>

      {/* Roster & Filter Controls */}
      <Card className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <CardTitle className="text-lg">Class Roster & Marking Panel</CardTitle>
            <CardDescription>
              Select class section and subject to record batch attendance
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <Select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              options={[
                { value: 'cls-1', label: 'BSN-2022-A (Semester 6)' },
                { value: 'cls-2', label: 'BSN-2023-A (Semester 4)' },
                { value: 'cls-3', label: 'POST-RN-2024 (Semester 2)' },
              ]}
              className="w-full sm:w-56"
            />

            <Select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              options={[
                { value: 'sub-01', label: 'NUR-301: Adult Health Nursing II' },
                { value: 'sub-02', label: 'NUR-302: Pharmacology in Nursing' },
                { value: 'sub-03', label: 'NUR-303: Nursing Research' },
                { value: 'sub-04', label: 'CLN-306: Clinical Practicum VI' },
              ]}
              className="w-full sm:w-64"
            />

            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full sm:w-40"
            />
          </div>
        </div>

        {/* Teacher Batch Marking Panel */}
        <AttendanceMarkingPanel
          classId={selectedClassId}
          subjectId={selectedSubjectId}
          date={selectedDate}
          records={records}
          onSuccess={loadAttendance}
        />
      </Card>
    </div>
  );
}
