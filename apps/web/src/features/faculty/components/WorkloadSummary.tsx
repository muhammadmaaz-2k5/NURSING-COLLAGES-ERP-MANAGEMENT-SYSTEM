'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2, Clock, BookOpen, Stethoscope, Layers } from 'lucide-react';
import { FacultyWorkload } from '../types/faculty.types';
import { Badge } from '../../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';

export interface WorkloadSummaryProps {
  workload: FacultyWorkload;
}

export const WorkloadSummary: React.FC<WorkloadSummaryProps> = ({ workload }) => {
  const percentage = Math.min((workload.totalHours / workload.maxRecommendedHours) * 100, 100);

  return (
    <Card className="p-6 space-y-6">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between w-full">
          <div>
            <CardTitle className="text-base">Weekly Teaching & Clinical Workload</CardTitle>
            <CardDescription>
              Institutional standard: Maximum 18 Credit Hours (CH) / week
            </CardDescription>
          </div>
          {workload.isOverloaded ? (
            <Badge variant="danger" size="sm" dot>
              Workload Overloaded ({workload.totalHours} CH)
            </Badge>
          ) : (
            <Badge variant="success" size="sm" dot>
              Optimal Workload ({workload.totalHours} / {workload.maxRecommendedHours} CH)
            </Badge>
          )}
        </div>
      </CardHeader>

      {/* Overload Alert Notification if Overloaded */}
      {workload.isOverloaded && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <div>
            <p className="font-bold">Faculty Overload Warning</p>
            <p className="text-[11px] text-rose-300/80 mt-0.5">
              Assigned workload exceeds HEC/PNC recommended 18 Credit Hours weekly cap. Consider reallocating sections.
            </p>
          </div>
        </div>
      )}

      {/* Credit Hours Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center gap-2 text-blue-400">
            <BookOpen className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">Theory</span>
          </div>
          <p className="text-2xl font-black text-white mt-1">{workload.theoryHours} CH</p>
          <span className="text-[10px] text-slate-500">Classroom lectures</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center gap-2 text-purple-400">
            <Layers className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">Practical / Lab</span>
          </div>
          <p className="text-2xl font-black text-white mt-1">{workload.practicalHours} CH</p>
          <span className="text-[10px] text-slate-500">Wet lab simulations</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center gap-2 text-emerald-400">
            <Stethoscope className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">Clinical Duty</span>
          </div>
          <p className="text-2xl font-black text-white mt-1">{workload.clinicalHours} CH</p>
          <span className="text-[10px] text-slate-500">Hospital bedside</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">Total Load</span>
          </div>
          <p
            className={`text-2xl font-black mt-1 ${
              workload.isOverloaded ? 'text-rose-400' : 'text-blue-400'
            }`}
          >
            {workload.totalHours} CH
          </p>
          <span className="text-[10px] text-slate-500">Weekly contact</span>
        </div>
      </div>

      {/* Visual Horizontal Stacked Workload Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>Weekly Load Utilization</span>
          <span>{workload.totalHours} of {workload.maxRecommendedHours} Max CH</span>
        </div>

        <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden flex">
          <div
            className="bg-blue-500 h-full"
            style={{ width: `${(workload.theoryHours / workload.maxRecommendedHours) * 100}%` }}
            title={`Theory: ${workload.theoryHours} CH`}
          />
          <div
            className="bg-purple-500 h-full"
            style={{ width: `${(workload.practicalHours / workload.maxRecommendedHours) * 100}%` }}
            title={`Practical: ${workload.practicalHours} CH`}
          />
          <div
            className="bg-emerald-500 h-full"
            style={{ width: `${(workload.clinicalHours / workload.maxRecommendedHours) * 100}%` }}
            title={`Clinical: ${workload.clinicalHours} CH`}
          />
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Theory ({workload.theoryHours} CH)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Practical ({workload.practicalHours} CH)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Clinical ({workload.clinicalHours} CH)
          </span>
        </div>
      </div>
    </Card>
  );
};
