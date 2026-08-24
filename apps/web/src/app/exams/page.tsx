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
} from 'lucide-react';
import { DataTable, Column } from '../../components/tables/DataTable';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ExamCreateModal } from '../../features/exams/components/ExamCreateModal';
import { fetchExams } from '../../features/exams/services/exams.api';
import { ExamItem } from '../../features/exams/types/exams.types';
import { formatDate } from '../../lib/utils';

export default function ExamsPage() {
  const router = useRouter();
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

  const columns: Column<ExamItem>[] = [
    {
      header: 'Exam Title & Subject',
      accessorKey: 'name',
      sortable: true,
      cell: (e) => (
        <div>
          <p className="font-bold text-slate-100">{e.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-mono text-blue-400 text-xs font-semibold">
              {e.subject.code}
            </span>
            <span className="text-slate-400 text-xs">• {e.subject.name}</span>
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
        <div className="text-xs text-slate-300">
          <p className="font-medium">{formatDate(e.examDate)}</p>
          <p className="text-slate-500 font-mono">
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
          <span className="font-bold text-white">{e.totalMarks} Max</span>
          <span className="text-slate-500 block">Pass: {e.passingMarks}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (e) => (
        <Badge
          variant={
            e.status === 'PUBLISHED'
              ? 'success'
              : e.status === 'GRADING'
              ? 'warning'
              : 'primary'
          }
          size="sm"
          dot
        >
          {e.status}
        </Badge>
      ),
    },
    {
      header: 'Action',
      cell: (e) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/exams/${e.id}`)}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Marks Workspace
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Examinations & Results Management
            </h1>
            <Badge variant="primary" size="sm">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-blue-400" />
              HEC/PNC Standard Grading
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Conduct academic evaluations, manage marks compilation, auto-calculate GPA, and publish official transcripts.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Schedule Examination
        </Button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Examinations
          </span>
          <h3 className="text-2xl font-black text-white mt-1">14</h3>
          <p className="text-xs text-blue-400 mt-2 font-medium">Midterms, Finals & OSCE</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Grading in Progress
          </span>
          <h3 className="text-2xl font-black text-amber-400 mt-1">2</h3>
          <p className="text-xs text-amber-300 mt-2 font-medium">Awaiting final review</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Published Results
          </span>
          <h3 className="text-2xl font-black text-emerald-400 mt-1">12</h3>
          <p className="text-xs text-emerald-300 mt-2 font-medium">Locked & Transcribed</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Average Batch GPA
          </span>
          <h3 className="text-2xl font-black text-purple-400 mt-1">3.64</h3>
          <p className="text-xs text-purple-300 mt-2 font-medium">96.8% Overall Pass Rate</p>
        </Card>
      </div>

      {/* Directory Table */}
      <Card className="p-6 space-y-4">
        <CardHeader className="pb-2">
          <div>
            <CardTitle className="text-lg">Examination Calendar & Schedules</CardTitle>
            <CardDescription>
              Click any examination to enter marks, calculate grades, or publish results
            </CardDescription>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/60 border border-slate-800">
            {['ALL', 'SCHEDULED', 'GRADING', 'PUBLISHED'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedStatus === st
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </CardHeader>

        <DataTable
          columns={columns}
          data={filteredExams}
          isLoading={isLoading}
          searchPlaceholder="Search examination by subject, code, or title..."
          pageSize={10}
          onRowClick={(e) => router.push(`/exams/${e.id}`)}
        />
      </Card>

      {/* Create Exam Modal */}
      <ExamCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
