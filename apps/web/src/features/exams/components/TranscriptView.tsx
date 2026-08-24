'use client';

import React from 'react';
import { Printer, ShieldCheck, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { StudentOfficialTranscript } from '../types/exams.types';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { GradeBadge } from './GradeBadge';
import { formatDate } from '../../../lib/utils';

export interface TranscriptViewProps {
  transcript: StudentOfficialTranscript;
}

export const TranscriptView: React.FC<TranscriptViewProps> = ({ transcript }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Print Trigger Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 print:hidden">
        <div className="flex items-center gap-2">
          <Badge variant="success" size="sm">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            Verified Institutional Record
          </Badge>
          <span className="text-xs text-slate-400">Official HEC/PNC Grading Format</span>
        </div>

        <Button variant="primary" size="sm" onClick={handlePrint} leftIcon={<Printer className="w-4 h-4" />}>
          Print Official Transcript
        </Button>
      </div>

      {/* Official Transcript Sheet */}
      <div className="bg-slate-950 border border-slate-800 text-slate-100 p-8 sm:p-12 rounded-3xl shadow-2xl space-y-8 print:p-0 print:border-none print:shadow-none">
        {/* Institutional Header */}
        <div className="text-center space-y-2 border-b-2 border-slate-800 pb-6">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase text-white">
            National Medical & Healthcare College
          </h1>
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest">
            Affiliated with PNC & Higher Education Commission
          </p>
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider pt-2">
            Official Academic Transcript
          </h2>
        </div>

        {/* Student Demographic Deck */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 font-medium block">Student Full Name</span>
            <span className="font-bold text-slate-100 text-sm">{transcript.studentName}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Registration / Roll No</span>
            <span className="font-mono font-bold text-blue-400 text-sm">{transcript.regId}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Father / Guardian Name</span>
            <span className="font-bold text-slate-200">{transcript.fatherName || 'Muhammad Iqbal'}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">CNIC / B-Form</span>
            <span className="font-mono text-slate-200">{transcript.cnic || '37405-1234567-2'}</span>
          </div>

          <div className="col-span-2">
            <span className="text-slate-500 font-medium block">Degree Program</span>
            <span className="font-bold text-slate-200">{transcript.programName}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Enrollment Date</span>
            <span className="font-mono text-slate-200">{formatDate(transcript.enrollmentDate)}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Academic Standing</span>
            <Badge variant="success" size="sm">
              {transcript.academicStanding}
            </Badge>
          </div>
        </div>

        {/* Semesters Performance */}
        <div className="space-y-6">
          {transcript.semesters.map((sem) => (
            <div key={sem.semesterNumber} className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                <h4 className="font-bold text-sm text-slate-200">{sem.semesterName}</h4>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-slate-400">
                    Earned Credits:{' '}
                    <span className="font-bold text-white">{sem.totalCreditsEarned} CH</span>
                  </span>
                  <span className="text-slate-400">
                    Semester GPA:{' '}
                    <span className="font-mono font-bold text-emerald-400">
                      {sem.semesterGpa.toFixed(2)}
                    </span>
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-2 font-bold uppercase">Course Code & Name</th>
                      <th className="pb-2 font-bold uppercase text-center">Credit Hours</th>
                      <th className="pb-2 font-bold uppercase text-center">Marks</th>
                      <th className="pb-2 font-bold uppercase text-center">Letter Grade</th>
                      <th className="pb-2 font-bold uppercase text-center">Grade Point</th>
                      <th className="pb-2 font-bold uppercase text-right">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {sem.courses.map((c, cIdx) => (
                      <tr key={cIdx}>
                        <td className="py-2.5">
                          <span className="font-mono text-blue-400 mr-2 font-bold">{c.code}</span>
                          <span className="font-medium text-slate-200">{c.name}</span>
                        </td>
                        <td className="py-2.5 text-center font-mono">{c.creditHours}</td>
                        <td className="py-2.5 text-center font-mono">
                          {c.marksObtained} / {c.totalMarks}
                        </td>
                        <td className="py-2.5 text-center">
                          <GradeBadge grade={c.grade} />
                        </td>
                        <td className="py-2.5 text-center font-mono font-bold text-blue-400">
                          {c.gradePoint.toFixed(1)}
                        </td>
                        <td className="py-2.5 text-right">
                          <Badge variant={c.status === 'PASS' ? 'success' : 'danger'} size="sm">
                            {c.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Final Cumulative Standing Footer */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">
              Degree Completion Progress
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              {transcript.totalCreditsCompleted} Total Credit Hours Completed
            </h3>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Cumulative CGPA
              </span>
              <span className="text-3xl font-black text-emerald-400 font-mono">
                {transcript.cumulativeCgpa.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Security & Verification Stamp */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500 font-mono">
          <div>
            <span>DIGITAL VERIFICATION SIGNATURE HASH:</span>
            <p className="text-[9px] text-slate-400 truncate max-w-md mt-0.5">
              {transcript.verificationHash}
            </p>
          </div>
          <div className="text-right">
            <span>OFFICE OF THE CONTROLLER OF EXAMINATIONS</span>
            <p className="text-[9px] text-slate-400 mt-0.5">NATIONAL MEDICAL & HEALTHCARE COLLEGE</p>
          </div>
        </div>
      </div>
    </div>
  );
};
