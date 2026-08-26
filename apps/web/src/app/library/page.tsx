'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Layers,
  Clock,
  Plus,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Library,
  BookCopy,
  CheckCircle2,
  Bookmark,
  Search,
} from 'lucide-react';
import { DataTable, Column } from '../../components/tables/DataTable';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { RoleGate } from '../../components/auth/RoleGate';
import { OverdueFineBadge } from '../../features/library/components/OverdueFineBadge';
import { BookTitleModal } from '../../features/library/components/BookTitleModal';
import { IssueBookModal } from '../../features/library/components/IssueBookModal';
import { ReturnBookModal } from '../../features/library/components/ReturnBookModal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  fetchLibraryDashboard,
  fetchBooks,
  fetchCirculationIssues,
} from '../../features/library/services/library.api';
import {
  BookTitle,
  CirculationIssue,
  LibraryDashboardData,
} from '../../features/library/types/library.types';
import { formatDate } from '../../lib/utils';

type LibraryTab = 'catalog' | 'circulation';

export default function LibraryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const isStudent = user?.role === 'STUDENT';
  const studentName = user?.name || 'Amina Bibi';

  const [activeTab, setActiveTab] = useState<LibraryTab>('catalog');
  const [dashboard, setDashboard] = useState<LibraryDashboardData | null>(null);
  const [books, setBooks] = useState<BookTitle[]>([]);
  const [issues, setIssues] = useState<CirculationIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<CirculationIssue | null>(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [dashRes, bksRes, issRes] = await Promise.all([
        fetchLibraryDashboard(),
        fetchBooks(),
        fetchCirculationIssues(),
      ]);
      setDashboard(dashRes);
      setBooks(bksRes.data);
      setIssues(issRes);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const studentBorrowed = [
    { title: 'Brunner & Suddarth Textbook of Medical-Surgical Nursing', author: 'Janice L. Hinkle', barcode: 'LIB-ACC-1092', issueDate: '2026-08-15', dueDate: '2026-08-29', fine: 0, status: 'ACTIVE' },
    { title: 'Pharmacology for Nurses: A Pathophysiologic Approach', author: 'Michael Adams', barcode: 'LIB-ACC-2041', issueDate: '2026-08-18', dueDate: '2026-09-01', fine: 0, status: 'ACTIVE' },
  ];

  // STUDENT VIEW
  if (isStudent) {
    return (
      <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
        {/* Header Banner */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                My Library Card & Book Stacks Circulation
              </h1>
              <Badge variant="success" size="sm">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" />
                Active Borrower Card
              </Badge>
            </div>
            <p className="text-xs text-slate-300">
              Card Holder: <span className="font-bold text-white">{studentName}</span> (LIB-2022-041) • Borrowing Quota: <span className="text-blue-400 font-semibold">2 of 3 Books Active</span>
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Overdue Fines</span>
              <span className="text-xl font-black text-emerald-400">₨ 0 Due</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Borrowed Books Card */}
        <Card className="p-6 space-y-4">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Currently Borrowed Stacks & Due Dates</CardTitle>
                <CardDescription>Physical copies checked out on your active student library card</CardDescription>
              </div>
              <Badge variant="purple" size="sm">
                2 Books Issued
              </Badge>
            </div>
          </CardHeader>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-3.5">Book Title & Author</th>
                  <th className="p-3.5">Accession Barcode</th>
                  <th className="p-3.5">Issue Date</th>
                  <th className="p-3.5">Return Due Date</th>
                  <th className="p-3.5 text-center">Fine Status</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {studentBorrowed.map((b) => (
                  <tr key={b.barcode} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900 dark:text-slate-100">{b.title}</p>
                      <span className="text-xs text-slate-500">{b.author}</span>
                    </td>
                    <td className="p-3.5 font-mono text-blue-600 dark:text-blue-400 font-semibold">{b.barcode}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400">{b.issueDate}</td>
                    <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400">{b.dueDate}</td>
                    <td className="p-3.5 text-center">
                      <Badge variant="success" size="xs">
                        ₨ 0 Clear
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => toast.success('Book Renewed', `Extended loan period for "${b.title}" by 14 days.`)}
                        leftIcon={<RotateCcw className="w-3 h-3" />}
                      >
                        Renew Loan
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Book Stacks Explorer */}
        <Card className="p-6 space-y-4">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-base">Library Catalog & Physical Shelf Stacks</CardTitle>
              <CardDescription>Search text resources, nursing journals, and reserve available copies</CardDescription>
            </div>
          </CardHeader>

          <DataTable
            columns={[
              {
                header: 'Title & Author',
                accessorKey: 'title',
                sortable: true,
                cell: (bk) => (
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">{bk.title}</p>
                    <span className="text-xs text-blue-600 dark:text-blue-400">{bk.author || '—'}</span>
                  </div>
                ),
              },
              {
                header: 'Shelf / Rack Location',
                accessorKey: 'shelfLocation',
                sortable: true,
                cell: (bk) => (
                  <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {bk.shelfLocation || 'Shelf A-3, Bay 2'}
                  </span>
                ),
              },
              {
                header: 'Availability',
                accessorKey: 'availableCopies',
                sortable: true,
                cell: (bk) => (
                  <Badge variant={bk.availableCopies > 0 ? 'success' : 'neutral'} size="xs">
                    {bk.availableCopies} Available
                  </Badge>
                ),
              },
              {
                header: 'Reserve',
                accessorKey: 'id',
                cell: (bk) => (
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => toast.success('Book Reserved', `Reserved copy of "${bk.title}" for 24 hours.`)}
                    leftIcon={<Bookmark className="w-3 h-3" />}
                  >
                    Reserve
                  </Button>
                ),
              },
            ]}
            data={books}
            isLoading={isLoading}
            searchPlaceholder="Search textbook titles, authors, or ISBN..."
            pageSize={5}
          />
        </Card>
      </div>
    );
  }

  // LIBRARIAN & ADMIN VIEW
  const bookColumns: Column<BookTitle>[] = [
    {
      header: 'Book Title & Author',
      accessorKey: 'title',
      sortable: true,
      cell: (bk) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-slate-100">{bk.title}</p>
          <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{bk.author || '—'}</span>
        </div>
      ),
    },
    {
      header: 'Category & Edition',
      accessorKey: 'category',
      sortable: true,
      cell: (bk) => (
        <div className="text-xs">
          <Badge variant="purple" size="sm">
            {bk.category || 'General'}
          </Badge>
          <span className="text-slate-500 block mt-1">{bk.edition}</span>
        </div>
      ),
    },
    {
      header: 'Location',
      accessorKey: 'shelfLocation',
      sortable: true,
      cell: (bk) => <span className="font-mono text-xs text-slate-600 dark:text-slate-400">{bk.shelfLocation || 'Stack A'}</span>,
    },
    {
      header: 'Copies',
      accessorKey: 'availableCopies',
      sortable: true,
      cell: (bk) => (
        <div className="text-xs font-mono">
          <span className="font-bold text-emerald-600 dark:text-emerald-400">{bk.availableCopies} avail</span>
          <span className="text-slate-500 block">/ {bk.totalCopies} total</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Library & Accession Circulation
            </h1>
            <Badge variant="primary" size="sm">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Dewey Decimal Catalog Active
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Institutional management for accession barcoding, circulation loan desk, and automated fine enforcement.
          </p>
        </div>

        <RoleGate roles={['SUPER_ADMIN', 'COLLEGE_ADMIN']}>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsIssueModalOpen(true)}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Loan Desk (Issue)
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsBookModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Book Title
            </Button>
          </div>
        </RoleGate>
      </div>

      {/* Main Catalog DataTable */}
      <Card className="p-6 space-y-4">
        <CardHeader className="pb-2">
          <div>
            <CardTitle className="text-lg">Accession Book Registry</CardTitle>
            <CardDescription>Cataloged titles, copies inventory, and physical shelf coordinates</CardDescription>
          </div>
        </CardHeader>

        <DataTable
          columns={bookColumns}
          data={books}
          isLoading={isLoading}
          searchPlaceholder="Search catalog by title, author, or ISBN..."
          pageSize={10}
        />
      </Card>

      {/* Modals */}
      <BookTitleModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onSuccess={loadData}
      />

      <IssueBookModal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
