'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  BookOpen,
  Plus,
  QrCode,
  Layers,
  MapPin,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { BookCopyModal } from '../../../../features/library/components/BookCopyModal';
import { fetchBookById } from '../../../../features/library/services/library.api';
import { BookTitle } from '../../../../features/library/types/library.types';
import { formatDate } from '../../../../lib/utils';

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params?.id as string;

  const [book, setBook] = useState<BookTitle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);

  const loadData = async () => {
    if (!bookId) return;
    setIsLoading(true);
    try {
      const data = await fetchBookById(bookId);
      setBook(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [bookId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-xs text-slate-400 font-medium">Loading Book Catalog Record...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="text-lg font-bold text-slate-200">Book Title Not Found</h3>
        <Button variant="primary" size="sm" onClick={() => router.push('/library')}>
          Back to Library
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
          onClick={() => router.push('/library')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Book Catalog
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsCopyModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Accession Copy
        </Button>
      </div>

      {/* Book Metadata Banner */}
      <div className="p-6 lg:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="purple" size="sm">
                {book.category}
              </Badge>
              <Badge variant="primary" size="sm">
                {book.edition}
              </Badge>
            </div>

            <h1 className="text-2xl font-black text-white">{book.title}</h1>
            <p className="text-xs text-blue-400 font-medium">{book.author}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center min-w-[120px]">
              <span className="text-[10px] uppercase font-bold text-slate-500">Available</span>
              <p className="text-2xl font-black font-mono text-emerald-400 mt-0.5">
                {book.availableCopies}
              </p>
              <span className="text-[10px] text-slate-400 block">of {book.totalCopies} Copies</span>
            </div>
          </div>
        </div>

        {/* Catalog Attributes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 font-medium block">ISBN-13</span>
            <span className="font-mono text-slate-200">{book.isbn || '—'}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Publisher</span>
            <span className="text-slate-200">{book.publisher || '—'}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Library Stacks Location</span>
            <span className="font-mono text-slate-200">{book.shelfLocation || 'Stack A — 04'}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Single-Copy Loan Lock</span>
            <span className="font-semibold text-emerald-400">Strictly Enforced</span>
          </div>
        </div>
      </div>

      {/* Accession Copies Inventory Table */}
      <Card className="p-6 space-y-4">
        <CardHeader className="pb-2">
          <div>
            <CardTitle className="text-base">Physical Accession Copies & Loan Status</CardTitle>
            <CardDescription>
              Each physical volume possesses a unique accession barcode number and loan tracking state
            </CardDescription>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-bold uppercase">Accession / Barcode #</th>
                <th className="pb-3 font-bold uppercase">Shelf Location</th>
                <th className="pb-3 font-bold uppercase">Condition</th>
                <th className="pb-3 font-bold uppercase">Copy Status</th>
                <th className="pb-3 font-bold uppercase">Current Borrower</th>
                <th className="pb-3 font-bold uppercase text-right">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {book.copies?.map((copy) => (
                <tr key={copy.id} className="hover:bg-slate-800/30">
                  <td className="py-3 font-mono font-bold text-blue-400">{copy.accessionNo}</td>
                  <td className="py-3 font-mono text-slate-300">{copy.shelfLocation || '—'}</td>
                  <td className="py-3 text-slate-300">{copy.condition || 'Good'}</td>
                  <td className="py-3">
                    <Badge
                      variant={copy.status === 'ISSUED' ? 'purple' : 'success'}
                      size="sm"
                      dot
                    >
                      {copy.status}
                    </Badge>
                  </td>
                  <td className="py-3">
                    {copy.currentIssue ? (
                      <span className="font-semibold text-white">
                        {copy.currentIssue.studentName} ({copy.currentIssue.studentRegId})
                      </span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                  <td className="py-3 text-right font-mono">
                    {copy.currentIssue ? (
                      <span
                        className={
                          copy.currentIssue.isOverdue
                            ? 'text-rose-400 font-bold'
                            : 'text-slate-300'
                        }
                      >
                        {formatDate(copy.currentIssue.dueDate)}
                      </span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Copy Modal */}
      <BookCopyModal
        isOpen={isCopyModalOpen}
        onClose={() => setIsCopyModalOpen(false)}
        bookId={book.id}
        bookTitle={book.title}
        onSuccess={loadData}
      />
    </div>
  );
}
