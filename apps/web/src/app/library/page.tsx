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
} from 'lucide-react';
import { DataTable, Column } from '../../components/tables/DataTable';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { OverdueFineBadge } from '../../features/library/components/OverdueFineBadge';
import { BookTitleModal } from '../../features/library/components/BookTitleModal';
import { IssueBookModal } from '../../features/library/components/IssueBookModal';
import { ReturnBookModal } from '../../features/library/components/ReturnBookModal';
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

  const bookColumns: Column<BookTitle>[] = [
    {
      header: 'Book Title & Author',
      accessorKey: 'title',
      sortable: true,
      cell: (bk) => (
        <div>
          <p className="font-bold text-slate-100">{bk.title}</p>
          <span className="text-xs text-blue-400 font-semibold">{bk.author || '—'}</span>
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
          <span className="text-slate-400 block mt-1">{bk.edition}</span>
        </div>
      ),
    },
    {
      header: 'Physical Stacks Location',
      accessorKey: 'shelfLocation',
      cell: (bk) => <span className="font-mono text-slate-300 text-xs">{bk.shelfLocation || '—'}</span>,
    },
    {
      header: 'Available / Total Copies',
      sortable: true,
      cell: (bk) => (
        <div className="font-mono text-xs">
          <span className="font-bold text-emerald-400 text-sm">{bk.availableCopies}</span>
          <span className="text-slate-500"> / {bk.totalCopies} Copies</span>
        </div>
      ),
    },
    {
      header: 'Action',
      cell: (bk) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/library/books/${bk.id}`)}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Accession Copies
        </Button>
      ),
    },
  ];

  const circulationColumns: Column<CirculationIssue>[] = [
    {
      header: 'Book Title & Accession Copy',
      accessorKey: 'bookTitle',
      sortable: true,
      cell: (iss) => (
        <div>
          <p className="font-bold text-slate-100">{iss.bookTitle}</p>
          <span className="font-mono text-xs text-blue-400">Copy: {iss.accessionNo}</span>
        </div>
      ),
    },
    {
      header: 'Borrower Student',
      accessorKey: 'studentName',
      sortable: true,
      cell: (iss) => (
        <div className="flex items-center gap-2">
          <img
            src={iss.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'}
            alt={iss.studentName}
            className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0"
          />
          <div>
            <p className="font-semibold text-white text-xs">{iss.studentName}</p>
            <span className="font-mono text-slate-400 text-[10px]">{iss.studentRegId}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Loan Issue Date',
      accessorKey: 'issuedAt',
      sortable: true,
      cell: (iss) => <span className="font-mono text-slate-400 text-xs">{formatDate(iss.issuedAt)}</span>,
    },
    {
      header: 'Due Date',
      accessorKey: 'dueDate',
      sortable: true,
      cell: (iss) => (
        <span
          className={`font-mono text-xs font-bold ${
            iss.isOverdue ? 'text-rose-400' : 'text-slate-200'
          }`}
        >
          {formatDate(iss.dueDate)}
        </span>
      ),
    },
    {
      header: 'Loan Status',
      cell: (iss) => (
        <OverdueFineBadge
          isOverdue={iss.isOverdue}
          daysOverdue={iss.daysOverdue}
          fineAmount={iss.fineAmount}
        />
      ),
    },
    {
      header: 'Action',
      cell: (iss) => (
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
              Library & Circulation Management
            </h1>
            <Badge variant="success" size="sm">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Accession Barcode Tracking
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage academic book titles, physical copy accession records, student loan circulation, and automated overdue fines.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsBookModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Catalog Book
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsIssueModalOpen(true)}
            leftIcon={<BookOpen className="w-4 h-4" />}
          >
            Issue Book Loan
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Catalog Titles
          </span>
          <h3 className="text-2xl font-black text-white mt-1">
            {dashboard?.totalTitles.toLocaleString() || '1,240'}
          </h3>
          <p className="text-xs text-blue-400 mt-2 font-medium">Distinct Book Works</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Physical Volumes
          </span>
          <h3 className="text-2xl font-black text-purple-400 mt-1">
            {dashboard?.totalVolumes.toLocaleString() || '4,850'}
          </h3>
          <p className="text-xs text-purple-300 mt-2 font-medium">
            {dashboard?.availableCopies.toLocaleString() || '4,120'} Available on Stacks
          </p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Active Circulation Loans
          </span>
          <h3 className="text-2xl font-black text-emerald-400 mt-1">
            {dashboard?.activeIssuesCount || 730}
          </h3>
          <p className="text-xs text-emerald-300 mt-2 font-medium">Currently Loaned Out</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Overdue Loans (&gt;14d)
          </span>
          <h3 className="text-2xl font-black text-rose-400 mt-1">
            {dashboard?.overdueIssuesCount || 18}
          </h3>
          <p className="text-xs text-rose-300 mt-2 font-medium">Fines Accruing</p>
        </Card>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {[
          { id: 'catalog' as const, label: 'Book Titles Catalog', icon: Library, count: books.length },
          { id: 'circulation' as const, label: 'Circulation & Active Loans', icon: BookCopy, count: issues.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}

      {/* 1. CATALOG */}
      {activeTab === 'catalog' && (
        <Card className="p-6 space-y-4">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-lg">Library Book Catalog & Accession Inventory</CardTitle>
              <CardDescription>
                Search catalog by title, author, subject category, or ISBN
              </CardDescription>
            </div>
          </CardHeader>

          <DataTable
            columns={bookColumns}
            data={books}
            isLoading={isLoading}
            searchPlaceholder="Search by title, author, or category..."
            pageSize={10}
            onRowClick={(bk) => router.push(`/library/books/${bk.id}`)}
          />
        </Card>
      )}

      {/* 2. CIRCULATION */}
      {activeTab === 'circulation' && (
        <Card className="p-6 space-y-4">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-lg">Circulation Desk & Active Student Loans</CardTitle>
              <CardDescription>
                Active book loans, due date tracking, and overdue fine status
              </CardDescription>
            </div>
          </CardHeader>

          <DataTable
            columns={circulationColumns}
            data={issues}
            isLoading={isLoading}
            searchPlaceholder="Search by book title, accession number, or student..."
            pageSize={10}
          />
        </Card>
      )}

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

      <ReturnBookModal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        issue={selectedIssue}
        onSuccess={loadData}
      />
    </div>
  );
}
