'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Award,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowRight,
  ShieldCheck,
  Lock,
  Sparkles,
  Download,
  FileText,
  Printer,
} from 'lucide-react';
import { DataTable, Column } from '../../components/tables/DataTable';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { RoleGate } from '../../components/auth/RoleGate';
import { ExamCreateModal } from '../../features/exams/components/ExamCreateModal';
import { fetchExams } from '../../features/exams/services/exams.api';
import { ExamItem } from '../../features/exams/types/exams.types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../lib/utils';

export default function ExamsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const isStudent = user?.role === 'STUDENT';
  const studentName = user?.name || 'Amina Bibi';

  const [exams, setExams] = useState<ExamItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchExams();
      setExams(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredExams =
    selectedStatus === 'ALL'
      ? exams
      : exams.filter((e) => e.status === selectedStatus);

  const studentResults = [
    { code: 'NUR-301', name: 'Adult Health Nursing II', credits: 4, maxMarks: 100, obtained: 88, grade: 'A+', gp: 4.0, status: 'PASS' },
    { code: 'NUR-302', name: 'Pharmacology in Clinical Nursing', credits: 3, maxMarks: 100, obtained: 82, grade: 'A', gp: 3.7, status: 'PASS' },
    { code: 'NUR-303', name: 'Nursing Research & Biostatistics', credits: 3, maxMarks: 100, obtained: 79, grade: 'B+', gp: 3.3, status: 'PASS' },
    { code: 'NUR-304', name: 'Mental Health & Psychiatric Nursing', credits: 4, maxMarks: 100, obtained: 85, grade: 'A+', gp: 4.0, status: 'PASS' },
    { code: 'NUR-305', name: 'Professional Nursing Ethics & Law', credits: 2, maxMarks: 100, obtained: 92, grade: 'A+', gp: 4.0, status: 'PASS' },
    { code: 'CLN-306', name: 'Hospital Clinical Practicum VI', credits: 2, maxMarks: 100, obtained: 90, grade: 'A+', gp: 4.0, status: 'PASS' },
  ];

  const columns: Column<ExamItem>[] = [
    {
      header: 'Exam Title & Subject',
      accessorKey: 'name',
      sortable: true,
      cell: (e) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-slate-100">{e.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-mono text-blue-600 dark:text-blue-400 text-xs font-semibold">
              {e.subject.code}
            </span>
            <span className="text-slate-500 text-xs">• {e.subject.name}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Type',
      accessorKey: 'type',
      sortable: true,
      cell: (e) => <Badge variant="purple" size="sm">{e.type}</Badge>,
    },
    {
      header: 'Schedule & Venue',
      sortable: true,
      cell: (e) => (
        <div className="text-xs text-slate-600 dark:text-slate-300">
          <p className="font-medium">{formatDate(e.examDate)}</p>
          <p className="text-slate-400 font-mono">
            {e.startTime} - {e.endTime} • {e.roomName || 'Main Hall'}
          </p>
        </div>
      ),
    },
    {
      header: 'Marks Scale',
      sortable: true,
      cell: (e) => (
        <div className="text-xs font-mono">
          <span className="font-bold text-slate-900 dark:text-slate-100">{e.totalMarks} Max</span>
          <span className="text-slate-400 block">Pass: {e.passingMarks}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (e) => (
        <Badge
          variant={
            e.status === 'PUBLISHED'
              ? 'success'
              : e.status === 'GRADING'
              ? 'primary'
              : 'neutral'
          }
          size="sm"
        >
          {e.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (e) => (
        <Button
          variant="outline"
          size="xs"
          onClick={() => router.push(`/exams/${e.id}`)}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          {e.status === 'PUBLISHED' ? 'View Results' : 'Grade Exam'}
        </Button>
      ),
    },
  ];

  // STUDENT VIEW
  if (isStudent) {
    return (
      <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
        {/* Student Result Header Banner */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                My Examination Results & Academic Transcript
              </h1>
              <Badge variant="success" size="sm">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" />
                PNC Exam Cleared
              </Badge>
            </div>
            <p className="text-xs text-slate-300">
              Student: <span className="font-bold text-white">{studentName}</span> (NUR-2022-0041) • Generic BSN Semester 6
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={() => toast.success('Transcript Download', 'Downloading official digitally signed transcript PDF...')}
            >
              Download Transcript
            </Button>
          </div>
        </div>

        {/* GPA & Standing Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card hoverEffect className="p-5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Current Semester GPA
            </span>
            <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">3.82</h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">Rank #1 in Class Cohort</p>
          </Card>

          <Card hoverEffect className="p-5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Cumulative CGPA
            </span>
            <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">3.82</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">Scale 4.00 (Distinction)</p>
          </Card>

          <Card hoverEffect className="p-5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Exam Clearance Status
            </span>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">Cleared</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">Admit Card Active</p>
          </Card>

          <Card hoverEffect className="p-5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Credits Completed
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">94 Cr.</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">69.1% Degree Complete</p>
          </Card>
        </div>

        {/* Current Semester 6 Result Card */}
        <Card className="p-6 space-y-4">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Semester 6 Examination Result Sheet (Spring 2026)</CardTitle>
                <CardDescription>Digitally locked marks certified by the Controller of Examinations</CardDescription>
              </div>
              <Badge variant="purple" size="sm">
                Official Result Card
              </Badge>
            </div>
          </CardHeader>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-3.5">Course Code & Title</th>
                  <th className="p-3.5 text-center">Credit Hours</th>
                  <th className="p-3.5 text-center">Max Marks</th>
                  <th className="p-3.5 text-center">Marks Obtained</th>
                  <th className="p-3.5 text-center">Letter Grade</th>
                  <th className="p-3.5 text-center">Grade Points (GP)</th>
                  <th className="p-3.5 text-right">Result Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {studentResults.map((r) => (
                  <tr key={r.code} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <td className="p-3.5 font-medium">
                      <p className="font-bold text-slate-900 dark:text-slate-100">{r.name}</p>
                      <span className="font-mono text-blue-600 dark:text-blue-400 text-[11px]">{r.code}</span>
                    </td>
                    <td className="p-3.5 text-center font-mono text-slate-700 dark:text-slate-300">{r.credits} CH</td>
                    <td className="p-3.5 text-center font-mono text-slate-500">{r.maxMarks}</td>
                    <td className="p-3.5 text-center font-mono font-bold text-slate-900 dark:text-slate-100">{r.obtained}</td>
                    <td className="p-3.5 text-center">
                      <span className="font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        {r.grade}
                      </span>
                    </td>
                    <td className="p-3.5 text-center font-mono text-slate-700 dark:text-slate-300 font-semibold">{r.gp.toFixed(1)}</td>
                    <td className="p-3.5 text-right">
                      <Badge variant="success" size="xs">
                        {r.status}
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

  // FACULTY & ADMIN VIEW
  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Examinations & Results Governance
            </h1>
            <Badge variant="purple" size="sm">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              HEC/PNC Standard Grade Formula
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Schedule formal examinations, record marks with absolute GP calculation, and publish verified transcripts.
          </p>
        </div>

        <RoleGate roles={['SUPER_ADMIN', 'COLLEGE_ADMIN']}>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Schedule Examination
          </Button>
        </RoleGate>
      </div>

      {/* KPI Stats Deck */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Exams
          </span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{exams.length || 6}</h3>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium">Midterms & Final Practicals</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Published Results
          </span>
          <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {exams.filter((e) => e.status === 'PUBLISHED').length || 4}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">Transcripts Sealed</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Open for Grading
          </span>
          <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {exams.filter((e) => e.status === 'GRADING').length || 1}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">Faculty Marks Entry Active</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Average CGPA
          </span>
          <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">3.48</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">Institution Overall</p>
        </Card>
      </div>

      {/* Main Exams DataTable */}
      <Card className="p-6 space-y-4">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Examination Registry</CardTitle>
              <CardDescription>Filter exams by status to enter marks or publish result cards</CardDescription>
            </div>

            <div className="flex items-center gap-2">
              {['ALL', 'PUBLISHED', 'GRADING', 'SCHEDULED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedStatus === st
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <DataTable
          columns={columns}
          data={filteredExams}
          isLoading={isLoading}
          searchPlaceholder="Search exams by subject code or title..."
          pageSize={10}
        />
      </Card>

      {/* Exam Create Modal */}
      <ExamCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
