'use client';

import React, { useState } from 'react';
import { BookOpen, Plus, Sparkles, Layers, Award } from 'lucide-react';
import { Subject, Program } from '../types/academic.types';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';

export interface CurriculumViewProps {
  programs: Program[];
  subjects: Subject[];
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({ programs, subjects }) => {
  const [selectedProgramId, setSelectedProgramId] = useState<string>(
    programs[0]?.id || 'prog-01',
  );

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
      {/* Program Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {programs.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedProgramId(p.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedProgramId === p.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Program Summary Header */}
      {activeProgram && (
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">{activeProgram.name}</h3>
              <Badge variant="primary" size="sm">
                {activeProgram.code}
              </Badge>
            </div>
            <p className="text-xs text-slate-400">
              {activeProgram.durationYears} Academic Years • {activeProgram.totalCredits} Total HEC/PNC Credit Hours
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Enrolled Candidates</span>
              <span className="text-lg font-black text-emerald-400">{activeProgram._count?.students || 360}</span>
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
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
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

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-3 font-bold uppercase">Course Code & Name</th>
                      <th className="pb-3 font-bold uppercase text-center">Theory (Hrs)</th>
                      <th className="pb-3 font-bold uppercase text-center">Lab / Practical</th>
                      <th className="pb-3 font-bold uppercase text-center">Clinical Rotation</th>
                      <th className="pb-3 font-bold uppercase text-right">Credit Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {semSubjects.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-800/30">
                        <td className="py-3">
                          <p className="font-bold text-slate-200">{s.name}</p>
                          <span className="font-mono text-blue-400 text-[11px]">{s.code}</span>
                        </td>
                        <td className="py-3 text-center font-mono text-slate-300">
                          {s.theoryHours || 0} hrs/wk
                        </td>
                        <td className="py-3 text-center font-mono text-slate-300">
                          {s.practicalHours || 0} hrs/wk
                        </td>
                        <td className="py-3 text-center font-mono font-bold text-emerald-400">
                          {s.clinicalHours || 0} hrs/wk
                        </td>
                        <td className="py-3 text-right font-mono font-bold text-blue-400 text-sm">
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
    </div>
  );
};
