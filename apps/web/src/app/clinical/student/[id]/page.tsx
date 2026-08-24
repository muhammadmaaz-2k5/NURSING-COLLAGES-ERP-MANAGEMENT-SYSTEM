'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  Stethoscope,
  Building2,
  User,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Award,
} from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { ClinicalProgressRing } from '../../../../features/clinical/components/ClinicalProgressRing';
import { fetchStudentClinicalProgress } from '../../../../features/clinical/services/clinical.api';
import { StudentClinicalProgress } from '../../../../features/clinical/types/clinical.types';
import { formatDate } from '../../../../lib/utils';

export default function StudentClinicalPortfolioPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params?.id as string;

  const [progress, setProgress] = useState<StudentClinicalProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!studentId) return;
      setIsLoading(true);
      try {
        const data = await fetchStudentClinicalProgress(studentId);
        setProgress(data);
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
        <p className="text-xs text-slate-400 font-medium">Loading Clinical Portfolio & Logbook...</p>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="text-lg font-bold text-slate-200">Clinical Portfolio Not Found</h3>
        <Button variant="primary" size="sm" onClick={() => router.push('/clinical')}>
          Back to Clinical Command Center
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
          onClick={() => router.push('/clinical')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Clinical Command Center
        </Button>
      </div>

      {/* Overview Banner */}
      <div className="p-6 lg:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">{progress.studentName}</h1>
              <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                {progress.regId}
              </span>
            </div>
            <p className="text-xs text-slate-400">{progress.programName}</p>
          </div>

          <div className="flex items-center gap-6">
            <ClinicalProgressRing
              percentage={progress.hoursPercentage}
              label="Clinical Hours"
              sublabel={`${progress.completedHours} / ${progress.requiredHours}`}
              color="emerald"
              size={110}
            />

            <ClinicalProgressRing
              percentage={progress.skillsPercentage}
              label="Skills Competencies"
              sublabel={`${progress.verifiedSkillsCount} / ${progress.totalSkillsRequired}`}
              color="purple"
              size={110}
            />
          </div>
        </div>
      </div>

      {/* Active Rotation Card */}
      {progress.currentRotation && (
        <Card className="p-6 bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-teal-950/40 border-emerald-500/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <Badge variant="success" size="sm">
                Current Active Ward Posting
              </Badge>
              <h3 className="text-lg font-bold text-white">
                {progress.currentRotation.siteName}
              </h3>
              <p className="text-xs text-emerald-300 font-medium">
                {progress.currentRotation.department} • {progress.currentRotation.ward}
              </p>
              <p className="text-xs text-slate-400 font-mono pt-1">
                {formatDate(progress.currentRotation.startDate)} to{' '}
                {formatDate(progress.currentRotation.endDate)}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1 text-right">
              <span className="text-slate-500 font-medium block uppercase text-[10px]">
                Faculty Supervisor
              </span>
              <p className="font-bold text-white">{progress.currentRotation.facultyName}</p>
              <span className="text-slate-400 block text-[11px]">
                {progress.currentRotation.remarks || 'Morning Shift'}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Procedural Skills Logbook Table */}
      <Card className="p-6 space-y-4">
        <CardHeader className="pb-2">
          <div>
            <CardTitle className="text-base">PNC Bedside Procedural Skills Logbook</CardTitle>
            <CardDescription>
              Clinical competency verification records certified by licensed faculty supervisors
            </CardDescription>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-bold uppercase">Procedure Name</th>
                <th className="pb-3 font-bold uppercase">Clinical Category</th>
                <th className="pb-3 font-bold uppercase text-center">Required</th>
                <th className="pb-3 font-bold uppercase text-center">Completed</th>
                <th className="pb-3 font-bold uppercase text-center">Verified</th>
                <th className="pb-3 font-bold uppercase text-center">Score</th>
                <th className="pb-3 font-bold uppercase">Supervisor Stamp</th>
                <th className="pb-3 font-bold uppercase text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {progress.skills.map((sk) => (
                <tr key={sk.id} className="hover:bg-slate-800/30">
                  <td className="py-3 font-bold text-slate-100">{sk.skillName}</td>
                  <td className="py-3 text-slate-400">{sk.category}</td>
                  <td className="py-3 text-center font-mono">{sk.requiredAttempts}</td>
                  <td className="py-3 text-center font-mono font-bold text-blue-400">
                    {sk.completedAttempts}
                  </td>
                  <td className="py-3 text-center font-mono font-bold text-emerald-400">
                    {sk.verifiedAttempts}
                  </td>
                  <td className="py-3 text-center font-mono font-bold">
                    {sk.score ? `${sk.score}%` : '—'}
                  </td>
                  <td className="py-3 text-slate-300">
                    {sk.supervisorName ? (
                      <div>
                        <span className="font-semibold text-slate-200">{sk.supervisorName}</span>
                        <span className="font-mono text-[10px] text-slate-500 block">
                          {formatDate(sk.verifiedAt)}
                        </span>
                      </div>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <Badge
                      variant={
                        sk.status === 'VERIFIED'
                          ? 'success'
                          : sk.status === 'IN_PROGRESS'
                          ? 'warning'
                          : 'danger'
                      }
                      size="sm"
                    >
                      {sk.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
