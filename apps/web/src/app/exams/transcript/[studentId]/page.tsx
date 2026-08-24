'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { TranscriptView } from '../../../../features/exams/components/TranscriptView';
import { fetchStudentTranscript } from '../../../../features/exams/services/exams.api';
import { StudentOfficialTranscript } from '../../../../features/exams/types/exams.types';

export default function OfficialTranscriptPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params?.studentId as string;

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
        <p className="text-xs text-slate-400 font-medium">Generating Official Transcript...</p>
      </div>
    );
  }

  if (!transcript) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="text-lg font-bold text-slate-200">Transcript Not Available</h3>
        <Button variant="primary" size="sm" onClick={() => router.push('/exams')}>
          Back to Exams
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 print:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/exams')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Exams
        </Button>
      </div>

      <TranscriptView transcript={transcript} />
    </div>
  );
}
