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
import { fetchClassAttendanceSheet } from '../../features/attendance/services/attendance.api';
import { StudentRosterAttendanceRecord } from '../../features/attendance/types/attendance.types';

export default function AttendancePage() {
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
    loadAttendance();
  }, [selectedClassId, selectedSubjectId, selectedDate]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Daily Academic & Clinical Attendance
            </h1>
            <Badge variant="success" size="sm">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              75% PNC Rule Active
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Optimized operational attendance roster with one-click batch marking and automated examination eligibility calculations.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Overall Attendance
          </span>
          <h3 className="text-2xl font-black text-white mt-1">91.4%</h3>
          <p className="text-xs text-emerald-400 mt-2 font-medium">Across all sections</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Exam Eligible
          </span>
          <h3 className="text-2xl font-black text-emerald-400 mt-1">94.2%</h3>
          <p className="text-xs text-slate-400 mt-2 font-medium">≥ 75% Compliance Rate</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Barred Candidates
          </span>
          <h3 className="text-2xl font-black text-rose-400 mt-1">4</h3>
          <p className="text-xs text-rose-300 mt-2 font-medium">&lt; 75% Critical Warning</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Today Sessions
          </span>
          <h3 className="text-2xl font-black text-blue-400 mt-1">18</h3>
          <p className="text-xs text-blue-300 mt-2 font-medium">Classroom & Hospital Wards</p>
        </Card>
      </div>

      {/* Filter Roster Selection Strip */}
      <Card className="p-5 bg-slate-900/90 border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Class Cohort / Section *"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            options={[
              { value: 'cls-1', label: 'Generic BSN — Semester 2 (Section A)' },
              { value: 'cls-2', label: 'Generic BSN — Semester 6 (Section A)' },
              { value: 'cls-3', label: 'Post-RN BSN — Semester 3' },
            ]}
          />

          <Select
            label="Course / Clinical Module *"
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            options={[
              { value: 'sub-02', label: 'Fundamentals of Nursing II (FON-102)' },
              { value: 'sub-08', label: 'Adult Health Nursing II (AHN-302)' },
              { value: 'sub-09', label: 'Clinical Pharmacology (PHM-304)' },
              { value: 'sub-05', label: 'Human Anatomy & Physiology II (ANAT-102)' },
            ]}
          />

          <Input
            label="Attendance Session Date *"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </Card>

      {/* Marking Roster Table Panel */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-400">
          Loading batch attendance sheet...
        </div>
      ) : (
        <AttendanceMarkingPanel
          records={records}
          classId={selectedClassId}
          subjectId={selectedSubjectId}
          date={selectedDate}
          onSuccess={loadAttendance}
        />
      )}
    </div>
  );
}
