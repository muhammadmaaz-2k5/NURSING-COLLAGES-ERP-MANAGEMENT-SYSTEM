'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  BookOpen,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { OverdueFineBadge } from '../../../../features/library/components/OverdueFineBadge';
import { ReturnBookModal } from '../../../../features/library/components/ReturnBookModal';
import { fetchCirculationIssues } from '../../../../features/library/services/library.api';
import { CirculationIssue } from '../../../../features/library/types/library.types';
import { formatCurrency, formatDate } from '../../../../lib/utils';

export default function StudentLibraryProfilePage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params?.id as string;

  const [issues, setIssues] = useState<CirculationIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<CirculationIssue | null>(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  const loadData = async () => {
    if (!studentId) return;
    setIsLoading(true);
    try {
      const data = await fetchCirculationIssues({ studentId });
      setIssues(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [studentId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-xs text-slate-400 font-medium">Loading Student Library Record...</p>
      </div>
    );
  }

  const activeIssues = issues.filter((i) => i.status === 'ISSUED' || i.status === 'OVERDUE');
  const totalFine = issues.reduce((acc, i) => acc + (i.fineAmount || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/library')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Library
        </Button>
      </div>

      {/* Student Profile Card */}
      <div className="p-6 lg:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"
              alt="Student"
              className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shrink-0 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">Student Library Account</h1>
                <Badge variant="primary" size="sm">
                  Active Card
                </Badge>
              </div>
              <p className="font-mono text-blue-400 font-bold text-xs mt-0.5">
                ID: {studentId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center min-w-[120px]">
              <span className="text-[10px] uppercase font-bold text-slate-500">Active Loans</span>
              <p className="text-2xl font-black font-mono text-emerald-400 mt-0.5">
                {activeIssues.length}
              </p>
              <span className="text-[10px] text-slate-400 block">Limit: 3 Books</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center min-w-[120px]">
              <span className="text-[10px] uppercase font-bold text-slate-500">Unpaid Fines</span>
              <p
                className={`text-2xl font-black font-mono mt-0.5 ${
                  totalFine > 0 ? 'text-rose-400' : 'text-slate-400'
                }`}
              >
                {formatCurrency(totalFine)}
              </p>
              <span className="text-[10px] text-slate-400 block">Total Accrued</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Borrowings Table */}
      <Card className="p-6 space-y-4">
        <CardHeader className="pb-2">
          <div>
            <CardTitle className="text-base">Current Borrowed Volumes</CardTitle>
            <CardDescription>
              Books currently issued under this student library card
            </CardDescription>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-bold uppercase">Book Title</th>
                <th className="pb-3 font-bold uppercase">Accession #</th>
                <th className="pb-3 font-bold uppercase">Issue Date</th>
                <th className="pb-3 font-bold uppercase">Due Date</th>
                <th className="pb-3 font-bold uppercase">Status</th>
                <th className="pb-3 font-bold uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {activeIssues.map((iss) => (
                <tr key={iss.id} className="hover:bg-slate-800/30">
                  <td className="py-3 font-bold text-slate-100">{iss.bookTitle}</td>
                  <td className="py-3 font-mono font-bold text-blue-400">{iss.accessionNo}</td>
                  <td className="py-3 font-mono text-slate-400">{formatDate(iss.issuedAt)}</td>
                  <td className="py-3 font-mono">
                    <span className={iss.isOverdue ? 'text-rose-400 font-bold' : 'text-white'}>
                      {formatDate(iss.dueDate)}
                    </span>
                  </td>
                  <td className="py-3">
                    <OverdueFineBadge
                      isOverdue={iss.isOverdue}
                      daysOverdue={iss.daysOverdue}
                      fineAmount={iss.fineAmount}
                    />
                  </td>
                  <td className="py-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedIssue(iss);
                        setIsReturnModalOpen(true);
                      }}
                      leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                    >
                      Return Book
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Return Modal */}
      <ReturnBookModal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        issue={selectedIssue}
        onSuccess={loadData}
      />
    </div>
  );
}
