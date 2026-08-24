'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Calendar, MapPin, Award, BookOpen, User } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { MarksEntryGrid } from '../../../features/exams/components/MarksEntryGrid';
import { fetchExamById } from '../../../features/exams/services/exams.api';
import { ExamDetail } from '../../../features/exams/types/exams.types';
import { formatDate } from '../../../lib/utils';

export default function ExamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params?.id as string;

  const [exam, setExam] = useState<ExamDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadExam = async () => {
    if (!examId) return;
    setIsLoading(true);
    try {
      const data = await fetchExamById(examId);
      setExam(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExam();
  }, [examId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-xs text-slate-400 font-medium">Loading Examination Workspace...</p>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="text-lg font-bold text-slate-200">Examination Not Found</h3>
        <Button variant="primary" size="sm" onClick={() => router.push('/exams')}>
          Back to Exams Directory
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
          onClick={() => router.push('/exams')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Examination Calendar
        </Button>
      </div>

      {/* Exam Header Overview */}
      <div className="p-6 lg:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="purple" size="sm">
                {exam.type}
              </Badge>
              <Badge
                variant={
                  exam.status === 'PUBLISHED'
                    ? 'success'
                    : exam.status === 'GRADING'
                    ? 'warning'
                    : 'primary'
                }
                size="sm"
                dot
              >
                {exam.status}
              </Badge>
            </div>

            <h1 className="text-2xl font-black text-white tracking-tight">{exam.name}</h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                {exam.subject.code} — {exam.subject.name}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formatDate(exam.examDate)} ({exam.startTime} - {exam.endTime})
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {exam.roomName || 'Lecture Hall 101'}
              </span>
              {exam.faculty && (
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Examiner: Dr. {exam.faculty.firstName} {exam.faculty.lastName}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center min-w-[110px]">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Marks</span>
              <p className="text-2xl font-black text-white mt-0.5">{exam.totalMarks}</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-center min-w-[110px]">
              <span className="text-[10px] uppercase font-bold text-emerald-400">Pass Mark</span>
              <p className="text-2xl font-black text-emerald-400 mt-0.5">{exam.passingMarks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Marks Entry Grid */}
      <MarksEntryGrid
        examId={exam.id}
        examName={exam.name}
        maxMarks={exam.totalMarks}
        passingMarks={exam.passingMarks}
        status={exam.status}
        results={exam.results}
        onSuccess={loadExam}
      />
    </div>
  );
}
