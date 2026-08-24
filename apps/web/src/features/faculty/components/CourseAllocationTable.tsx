'use client';

import React from 'react';
import { BookOpen, Users, Layers, Award } from 'lucide-react';
import { FacultyCourseAllocation } from '../types/faculty.types';
import { Badge } from '../../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';

export interface CourseAllocationTableProps {
  allocations: FacultyCourseAllocation[];
}

export const CourseAllocationTable: React.FC<CourseAllocationTableProps> = ({ allocations }) => {
  return (
    <Card className="p-6 space-y-4">
      <CardHeader className="pb-2">
        <div>
          <CardTitle className="text-base">Assigned Courses & Class Sections</CardTitle>
          <CardDescription>
            Active instructional modules, student cohorts, and credit values
          </CardDescription>
        </div>
      </CardHeader>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="pb-3 font-bold uppercase">Course & Code</th>
              <th className="pb-3 font-bold uppercase">Cohort / Section</th>
              <th className="pb-3 font-bold uppercase text-center">Theory</th>
              <th className="pb-3 font-bold uppercase text-center">Practical</th>
              <th className="pb-3 font-bold uppercase text-center">Clinical</th>
              <th className="pb-3 font-bold uppercase text-center">Enrolled Students</th>
              <th className="pb-3 font-bold uppercase text-right">Total Credits</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {allocations.map((a) => (
              <tr key={a.id} className="hover:bg-slate-800/30">
                <td className="py-3">
                  <p className="font-bold text-slate-200">{a.subjectName}</p>
                  <span className="font-mono text-blue-400 text-[11px]">{a.subjectCode}</span>
                </td>
                <td className="py-3">
                  <p className="font-medium text-slate-300">{a.programName}</p>
                  <span className="text-slate-500 text-[11px]">
                    {a.semesterName} • {a.sectionName}
                  </span>
                </td>
                <td className="py-3 text-center font-mono text-slate-300">{a.theoryCredits} CH</td>
                <td className="py-3 text-center font-mono text-slate-300">{a.practicalCredits} CH</td>
                <td className="py-3 text-center font-mono font-bold text-emerald-400">
                  {a.clinicalCredits} CH
                </td>
                <td className="py-3 text-center">
                  <span className="inline-flex items-center gap-1 font-bold text-slate-200">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    {a.studentCount}
                  </span>
                </td>
                <td className="py-3 text-right font-mono font-bold text-blue-400 text-sm">
                  {a.totalCredits} CH
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
