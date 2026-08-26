'use client';

import React, { useState } from 'react';
import { BookOpen, Plus, Sparkles, Layers, Award, UserCheck } from 'lucide-react';
import { Subject, Program } from '../types/academic.types';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { RoleGate } from '../../../components/auth/RoleGate';
import { SubjectModal } from './SubjectModal';
import { SemesterCourseAllocationModal } from './SemesterCourseAllocationModal';

export interface CurriculumViewProps {
  programs: Program[];
  subjects: Subject[];
  onRefresh?: () => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({ programs, subjects, onRefresh }) => {
  const [selectedProgramId, setSelectedProgramId] = useState<string>(
    programs[0]?.id || 'prog-01',
  );
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);

  const activeProgram = programs.find((p) => p.id === selectedProgramId) || programs[0];

  // Group subjects by semester
  const semesterMap: Record<number, Subject[]> = {};
  subjects.forEach((s) => {
    const sem = s.semesterNumber || 1;
    if (!semesterMap[sem]) semesterMap[sem] = [];
    semesterMap[sem].push(s);
  });

  const semesters = Object.keys(semesterMap)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      {/* Top Action Bar with Role Gating */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Program Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {programs.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProgramId(p.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedProgramId === p.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Admin Controls */}
        <RoleGate roles={['SUPER_ADMIN', 'COLLEGE_ADMIN']}>
          <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAllocateModalOpen(true)}
              leftIcon={<Layers className="w-4 h-4" />}
            >
              Assign to Semester
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsSubjectModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add New Course
            </Button>
          </div>
        </RoleGate>
      </div>

      {/* Program Summary Header */}
      {activeProgram && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{activeProgram.name}</h3>
              <Badge variant="primary" size="sm">
                {activeProgram.code}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {activeProgram.durationYears} Academic Years • {activeProgram.totalCredits} Total HEC/PNC Credit Hours
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Enrolled Candidates</span>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{activeProgram._count?.students || 360}</span>
            </div>
          </div>
        </div>
      )}

      {/* Semester by Semester Curriculum Breakdown */}
      <div className="space-y-6">
        {semesters.map((sem) => {
          const semSubjects = semesterMap[sem];
          const totalSemCredits = semSubjects.reduce((acc, curr) => acc + curr.creditHours, 0);

          return (
            <Card key={sem} className="p-6 space-y-4">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                      {sem}
                    </div>
                    <div>
                      <CardTitle className="text-base">Semester {sem} Curriculum</CardTitle>
                      <CardDescription>{semSubjects.length} Core & Clinical Course Modules</CardDescription>
                    </div>
                  </div>

                  <Badge variant="purple" size="sm">
                    {totalSemCredits} Total Credits
                  </Badge>
                </div>
              </CardHeader>

              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase">
                    <tr>
                      <th className="p-3.5">Course Code & Name</th>
                      <th className="p-3.5">Assigned Instructor</th>
                      <th className="p-3.5 text-center">Theory (h/wk)</th>
                      <th className="p-3.5 text-center">Lab / Practical</th>
                      <th className="p-3.5 text-center">PNC Clinical</th>
                      <th className="p-3.5 text-right">Credits</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {semSubjects.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                        <td className="p-3.5">
                          <p className="font-bold text-slate-900 dark:text-slate-100">{s.name}</p>
                          <span className="font-mono text-blue-600 dark:text-blue-400 text-[11px]">{s.code}</span>
                        </td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-400 font-medium">
                          {s.code === 'NUR-301' ? 'Dr. Tariq Mahmood' : s.code === 'NUR-302' ? 'Dr. Ayesha Malik' : 'Dr. Sarah Ahmed'}
                        </td>
                        <td className="p-3.5 text-center font-mono text-slate-600 dark:text-slate-400">
                          {s.theoryHours || 0} hrs
                        </td>
                        <td className="p-3.5 text-center font-mono text-slate-600 dark:text-slate-400">
                          {s.practicalHours || 0} hrs
                        </td>
                        <td className="p-3.5 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {s.clinicalHours || 0} hrs
                        </td>
                        <td className="p-3.5 text-right font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
                          {s.creditHours} CH
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Modals */}
      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        onSuccess={onRefresh}
      />

      <SemesterCourseAllocationModal
        isOpen={isAllocateModalOpen}
        onClose={() => setIsAllocateModalOpen(false)}
        onSuccess={onRefresh}
      />
    </div>
  );
};
