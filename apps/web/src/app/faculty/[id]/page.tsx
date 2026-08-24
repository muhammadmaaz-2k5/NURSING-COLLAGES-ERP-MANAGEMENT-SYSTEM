'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { FacultyProfileView } from '../../../features/faculty/components/FacultyProfileView';
import { fetchFacultyById } from '../../../features/faculty/services/faculty.api';
import { FacultyMember } from '../../../features/faculty/types/faculty.types';

export default function FacultyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const facultyId = params?.id as string;

  const [faculty, setFaculty] = useState<FacultyMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!facultyId) return;
      setIsLoading(true);
      try {
        const data = await fetchFacultyById(facultyId);
        setFaculty(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [facultyId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-xs text-slate-400 font-medium">Loading Faculty Profile & Workload...</p>
      </div>
    );
  }

  if (!faculty) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="text-lg font-bold text-slate-200">Faculty Member Not Found</h3>
        <Button variant="primary" size="sm" onClick={() => router.push('/faculty')}>
          Back to Faculty Directory
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/faculty')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Directory
        </Button>
      </div>

      <FacultyProfileView faculty={faculty} />
    </div>
  );
}
