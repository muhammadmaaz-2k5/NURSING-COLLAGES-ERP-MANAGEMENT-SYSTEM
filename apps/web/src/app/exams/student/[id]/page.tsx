'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Award, Printer, ShieldCheck } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { GradeBadge } from '../../../../features/exams/components/GradeBadge';
import { fetchStudentTranscript } from '../../../../features/exams/services/exams.api';
import { StudentOfficialTranscript } from '../../../../features/exams/types/exams.types';

export default function StudentExamResultsPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params?.id as string;

  const [transcript, setTranscript] = useState<StudentOfficialTranscript | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!studentId) return;
      setIsLoading(true);
      try {
        const data = await fetchStudentTranscript(studentId);
        setTranscript(data);
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
        <p className="text-xs text-slate-400 font-medium">Loading Student Academic Records...</p>
      </div>
    );
  }

  if (!transcript) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="text-lg font-bold text-slate-200">Results Record Not Found</h3>
        <Button variant="primary" size="sm" onClick={() => router.push('/exams')}>
          Back to Exams
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/exams')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Exams
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={() => router.push(`/exams/transcript/${studentId}`)}
          leftIcon={<Printer className="w-4 h-4" />}
        >
          View Printable Transcript
        </Button>
      </div>

      {/* Overview Banner */}
      <div className="p-6 lg:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">{transcript.studentName}</h1>
              <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                {transcript.regId}
              </span>
            </div>
            <p className="text-xs text-slate-400">{transcript.programName}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center min-w-[100px]">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Credits</span>
              <p className="text-2xl font-black text-white mt-0.5">
                {transcript.totalCreditsCompleted} CH
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-center min-w-[100px]">
              <span className="text-[10px] uppercase font-bold text-emerald-400">Cumulative CGPA</span>
              <p className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
                {transcript.cumulativeCgpa.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Semester Results Breakdown */}
      <div className="space-y-6">
        {transcript.semesters.map((sem) => (
          <Card key={sem.semesterNumber} className="p-6 space-y-4">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between w-full">
                <CardTitle className="text-base">{sem.semesterName}</CardTitle>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400">Earned: {sem.totalCreditsEarned} CH</span>
                  <Badge variant="purple" size="sm">
                    SGPA: {sem.semesterGpa.toFixed(2)}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-bold uppercase">Course Code & Name</th>
                    <th className="pb-3 font-bold uppercase text-center">Credit Hours</th>
                    <th className="pb-3 font-bold uppercase text-center">Marks</th>
                    <th className="pb-3 font-bold uppercase text-center">Letter Grade</th>
                    <th className="pb-3 font-bold uppercase text-center">Grade Point</th>
                    <th className="pb-3 font-bold uppercase text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {sem.courses.map((c, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="py-3">
                        <span className="font-mono text-blue-400 mr-2 font-bold">{c.code}</span>
                        <span className="font-medium text-slate-200">{c.name}</span>
                      </td>
                      <td className="py-3 text-center font-mono">{c.creditHours}</td>
                      <td className="py-3 text-center font-mono">
                        {c.marksObtained} / {c.totalMarks}
                      </td>
                      <td className="py-3 text-center">
                        <GradeBadge grade={c.grade} />
                      </td>
                      <td className="py-3 text-center font-mono font-bold text-blue-400">
                        {c.gradePoint.toFixed(1)}
                      </td>
                      <td className="py-3 text-right">
                        <Badge variant={c.status === 'PASS' ? 'success' : 'danger'} size="sm">
                          {c.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
