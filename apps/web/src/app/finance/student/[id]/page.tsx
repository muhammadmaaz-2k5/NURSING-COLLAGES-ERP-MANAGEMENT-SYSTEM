'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { StudentLedgerView } from '../../../../features/finance/components/StudentLedgerView';
import { fetchStudentFinancialStatement } from '../../../../features/finance/services/finance.api';
import { StudentFinancialStatement } from '../../../../features/finance/types/finance.types';

export default function StudentFinancePage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params?.id as string;

  const [statement, setStatement] = useState<StudentFinancialStatement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!studentId) return;
      setIsLoading(true);
      try {
        const data = await fetchStudentFinancialStatement(studentId);
        setStatement(data);
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
        <p className="text-xs text-slate-400 font-medium">Loading Student Financial Statement...</p>
      </div>
    );
  }

  if (!statement) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="text-lg font-bold text-slate-200">Financial Record Not Found</h3>
        <Button variant="primary" size="sm" onClick={() => router.push('/finance')}>
          Back to Finance
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 print:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/finance')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Finance
        </Button>
      </div>

      <StudentLedgerView statement={statement} />
    </div>
  );
}
