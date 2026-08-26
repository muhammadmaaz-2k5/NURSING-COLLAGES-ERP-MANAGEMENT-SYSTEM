'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Plus,
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
  Download,
  FileText,
  Building,
} from 'lucide-react';
import { DataTable, Column } from '../../components/tables/DataTable';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { RoleGate } from '../../components/auth/RoleGate';
import { InvoiceStatusBadge } from '../../features/finance/components/InvoiceStatusBadge';
import { InvoiceCreateModal } from '../../features/finance/components/InvoiceCreateModal';
import { FeeStructureModal } from '../../features/finance/components/FeeStructureModal';
import { ScholarshipModal } from '../../features/finance/components/ScholarshipModal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  fetchInvoices,
  fetchFeeStructures,
  fetchScholarships,
} from '../../features/finance/services/finance.api';
import {
  InvoiceItem,
  FeeStructure,
  Scholarship,
} from '../../features/finance/types/finance.types';
import { formatCurrency, formatDate } from '../../lib/utils';

type FinanceTab = 'invoices' | 'structures' | 'scholarships';

export default function FinancePage() {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const isStudent = user?.role === 'STUDENT';
  const studentName = user?.name || 'Amina Bibi';

  const [activeTab, setActiveTab] = useState<FinanceTab>('invoices');
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [structures, setStructures] = useState<FeeStructure[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isStructureModalOpen, setIsStructureModalOpen] = useState(false);
  const [isScholarshipModalOpen, setIsScholarshipModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [invRes, strRes, schRes] = await Promise.all([
        fetchInvoices(),
        fetchFeeStructures(),
        fetchScholarships(),
      ]);
      setInvoices(invRes.data);
      setStructures(strRes);
      setScholarships(schRes);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const studentChallans = [
    { challanNo: 'CHL-2026-604', term: 'Semester 6 (Spring 2026)', amount: 85000, scholarship: 25500, netPaid: 59500, status: 'PAID', paidDate: '2026-08-10', bankRef: 'MEEZAN-FT-99124' },
    { challanNo: 'CHL-2025-502', term: 'Semester 5 (Fall 2025)', amount: 85000, scholarship: 25500, netPaid: 59500, status: 'PAID', paidDate: '2026-01-15', bankRef: 'HBL-ONL-81203' },
    { challanNo: 'CHL-2025-401', term: 'Semester 4 (Spring 2025)', amount: 80000, scholarship: 24000, netPaid: 56000, status: 'PAID', paidDate: '2025-08-12', bankRef: 'MEEZAN-FT-44109' },
    { challanNo: 'CHL-2024-301', term: 'Semester 3 (Fall 2024)', amount: 80000, scholarship: 24000, netPaid: 56000, status: 'PAID', paidDate: '2025-01-18', bankRef: 'ALFALAH-77291' },
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
                My Tuition Fee Challans & Payment Ledger
              </h1>
              <Badge variant="success" size="sm">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" />
                All Accounts Cleared
              </Badge>
            </div>
            <p className="text-xs text-slate-300">
              Student: <span className="font-bold text-white">{studentName}</span> (NUR-2022-0041) • Active Merit Scholarship: <span className="text-emerald-400 font-semibold">30% Tuition Waiver</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={() => toast.success('Voucher Download', 'Downloading verified fee clearance certificate PDF...')}
            >
              Fee Clearance Certificate
            </Button>
          </div>
        </div>

        {/* Financial KPI Deck */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card hoverEffect className="p-5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Current Balance
            </span>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">₨ 0 Due</h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">Semester 6 Cleared</p>
          </Card>

          <Card hoverEffect className="p-5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Merit Scholarship
            </span>
            <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">30% Waiver</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">PNC Academic Honors</p>
          </Card>

          <Card hoverEffect className="p-5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Cumulative Paid
            </span>
            <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">₨ 357,000</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">6 Completed Semesters</p>
          </Card>

          <Card hoverEffect className="p-5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Exam Clearance
            </span>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">Cleared</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">No Financial Hold</p>
          </Card>
        </div>

        {/* Challans Ledger */}
        <Card className="p-6 space-y-4">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Institutional Fee Receipts & Challan History</CardTitle>
                <CardDescription>Verified bank wire transfers and official college voucher receipts</CardDescription>
              </div>
              <Badge variant="purple" size="sm">
                Bank Wire Verified
              </Badge>
            </div>
          </CardHeader>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-3.5">Challan Voucher #</th>
                  <th className="p-3.5">Semester Academic Term</th>
                  <th className="p-3.5 text-center">Gross Tuition</th>
                  <th className="p-3.5 text-center">Merit Waiver</th>
                  <th className="p-3.5 text-center">Net Amount Paid</th>
                  <th className="p-3.5">Payment Date & Bank Ref</th>
                  <th className="p-3.5 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {studentChallans.map((ch) => (
                  <tr key={ch.challanNo} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <td className="p-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {ch.challanNo}
                    </td>
                    <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">{ch.term}</td>
                    <td className="p-3.5 text-center font-mono text-slate-500">PKR {ch.amount.toLocaleString()}</td>
                    <td className="p-3.5 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">-PKR {ch.scholarship.toLocaleString()}</td>
                    <td className="p-3.5 text-center font-mono font-bold text-slate-900 dark:text-slate-100">PKR {ch.netPaid.toLocaleString()}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400">
                      <span className="font-bold block">{ch.paidDate}</span>
                      <span className="font-mono text-[10px] text-slate-500">{ch.bankRef}</span>
                    </td>
                    <td className="p-3.5 text-right">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => toast.success('Voucher Downloaded', `Downloading receipt #${ch.challanNo}...`)}
                        leftIcon={<Download className="w-3 h-3" />}
                      >
                        Receipt
                      </Button>
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

  // ACCOUNTANT & ADMIN VIEW
  const filteredInvoices =
    selectedStatus === 'ALL'
      ? invoices
      : invoices.filter((i) => i.status === selectedStatus);

  const invoiceColumns: Column<InvoiceItem>[] = [
    {
      header: 'Challan #',
      accessorKey: 'challanNumber',
      sortable: true,
      cell: (i) => (
        <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-500/20">
          {i.challanNumber}
        </span>
      ),
    },
    {
      header: 'Student Name & Program',
      accessorKey: 'studentName',
      sortable: true,
      cell: (i) => (
        <div className="flex items-center gap-3">
          <img
            src={i.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'}
            alt={i.studentName}
            className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
          />
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">{i.studentName}</p>
            <span className="text-xs text-slate-500">{i.programName || 'Generic BSN'} • {i.studentRegId}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Gross Total',
      accessorKey: 'grossAmount',
      sortable: true,
      cell: (i) => (
        <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs">
          {formatCurrency(i.grossAmount || i.netAmount)}
        </span>
      ),
    },
    {
      header: 'Paid Amount',
      accessorKey: 'paidAmount',
      sortable: true,
      cell: (i) => (
        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-xs">
          {formatCurrency(i.paidAmount)}
        </span>
      ),
    },
    {
      header: 'Due Date',
      accessorKey: 'dueDate',
      sortable: true,
      cell: (i) => <span className="text-xs text-slate-600 dark:text-slate-400">{formatDate(i.dueDate)}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (i) => <InvoiceStatusBadge status={i.status} />,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Finance & Billing Management
            </h1>
            <Badge variant="success" size="sm">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Automated Bank Reconciliation
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Institutional ledger for student tuition fee invoices, fee structure rules, and merit scholarships.
          </p>
        </div>

        <RoleGate roles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'ACCOUNTANT']}>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsStructureModalOpen(true)}
              leftIcon={<Layers className="w-4 h-4" />}
            >
              Fee Structure
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsInvoiceModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Generate Challans
            </Button>
          </div>
        </RoleGate>
      </div>

      {/* Main Invoices DataTable */}
      <Card className="p-6 space-y-4">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Student Invoices & Challan Registry</CardTitle>
              <CardDescription>Monitor collections, verified wire transfers, and pending dues</CardDescription>
            </div>

            <div className="flex items-center gap-2">
              {['ALL', 'PAID', 'PENDING', 'OVERDUE'].map((st) => (
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
          columns={invoiceColumns}
          data={filteredInvoices}
          isLoading={isLoading}
          searchPlaceholder="Search challans by student name or voucher number..."
          pageSize={10}
        />
      </Card>

      {/* Modals */}
      <InvoiceCreateModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        onSuccess={loadData}
      />

      <FeeStructureModal
        isOpen={isStructureModalOpen}
        onClose={() => setIsStructureModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
