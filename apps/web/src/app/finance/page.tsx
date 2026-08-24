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
} from 'lucide-react';
import { DataTable, Column } from '../../components/tables/DataTable';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { InvoiceStatusBadge } from '../../features/finance/components/InvoiceStatusBadge';
import { InvoiceCreateModal } from '../../features/finance/components/InvoiceCreateModal';
import { FeeStructureModal } from '../../features/finance/components/FeeStructureModal';
import { ScholarshipModal } from '../../features/finance/components/ScholarshipModal';
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
        <span className="font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
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
            className="w-8 h-8 rounded-lg object-cover border border-slate-700 shrink-0"
          />
          <div>
            <p className="font-bold text-slate-100">{i.studentName}</p>
            <span className="text-xs text-slate-400">
              {i.studentRegId} • {i.programName}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Fee Description',
      accessorKey: 'feeStructureName',
      sortable: true,
      cell: (i) => <span className="text-slate-300 font-medium text-xs">{i.feeStructureName}</span>,
    },
    {
      header: 'Net Payable',
      accessorKey: 'netAmount',
      sortable: true,
      cell: (i) => (
        <div className="font-mono text-xs">
          <span className="font-bold text-white text-sm">{formatCurrency(i.netAmount)}</span>
          {i.scholarshipAmount > 0 && (
            <span className="text-purple-400 block text-[10px]">
              (Scholarship -{formatCurrency(i.scholarshipAmount)})
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Paid / Balance',
      sortable: true,
      cell: (i) => (
        <div className="font-mono text-xs">
          <span className="text-emerald-400 font-bold">
            {i.paidAmount > 0 ? formatCurrency(i.paidAmount) : 'Rs. 0'}
          </span>
          <span className="text-slate-500 block text-[10px]">
            Due: {formatCurrency(i.remainingAmount)}
          </span>
        </div>
      ),
    },
    {
      header: 'Due Date',
      accessorKey: 'dueDate',
      sortable: true,
      cell: (i) => <span className="font-mono text-slate-400 text-xs">{formatDate(i.dueDate)}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (i) => <InvoiceStatusBadge status={i.status} />,
    },
    {
      header: 'Action',
      cell: (i) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/finance/invoices/${i.id}`)}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Manage
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
              Finance, Billing & Student Fee Ledger
            </h1>
            <Badge variant="primary" size="sm">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-blue-400" />
              Audited Ledger Engine
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage student fee challans, atomic bank payment collections, scholarship concessions, and double-entry ledgers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsStructureModalOpen(true)}
            leftIcon={<Layers className="w-4 h-4" />}
          >
            Create Tariff
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsInvoiceModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Issue Fee Challan
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Billed
          </span>
          <h3 className="text-2xl font-black text-white mt-1">PKR 14.8M</h3>
          <p className="text-xs text-blue-400 mt-2 font-medium">Fall 2026 Invoiced</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Collected
          </span>
          <h3 className="text-2xl font-black text-emerald-400 mt-1">PKR 13.9M</h3>
          <p className="text-xs text-emerald-300 mt-2 font-medium">Cleared in Bank</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Outstanding Dues
          </span>
          <h3 className="text-2xl font-black text-rose-400 mt-1">PKR 860K</h3>
          <p className="text-xs text-rose-300 mt-2 font-medium">Pending Recovery</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Collection Rate
          </span>
          <h3 className="text-2xl font-black text-purple-400 mt-1">94.2%</h3>
          <p className="text-xs text-purple-300 mt-2 font-medium">High Recovery Tier</p>
        </Card>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {[
          { id: 'invoices' as const, label: 'Fee Challans & Invoices', icon: CreditCard },
          { id: 'structures' as const, label: 'Fee Tariffs & Schedules', icon: Layers, count: structures.length },
          { id: 'scholarships' as const, label: 'Scholarships & Concessions', icon: Award, count: scholarships.length },
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

      {/* 1. INVOICES */}
      {activeTab === 'invoices' && (
        <Card className="p-6 space-y-4">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-lg">Student Fee Challans Roster</CardTitle>
              <CardDescription>
                Click any challan to record payments, inspect fee breakdowns, or print receipts
              </CardDescription>
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/60 border border-slate-800">
              {['ALL', 'UNPAID', 'PARTIAL', 'PAID'].map((st) => (
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
            columns={invoiceColumns}
            data={filteredInvoices}
            isLoading={isLoading}
            searchPlaceholder="Search challan #, student name, or ID..."
            pageSize={10}
            onRowClick={(i) => router.push(`/finance/invoices/${i.id}`)}
          />
        </Card>
      )}

      {/* 2. FEE STRUCTURES */}
      {activeTab === 'structures' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {structures.map((s) => (
            <Card key={s.id} hoverEffect className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <Badge variant="primary" size="sm">
                  {s.feeType}
                </Badge>
                <span className="text-lg font-black text-white font-mono">
                  {formatCurrency(s.amount)}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-100 text-base">{s.name}</h4>
                <p className="text-xs text-slate-400 mt-1">{s.description || 'Institutional Tariff'}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
                <span>Program:</span>
                <span className="font-bold text-slate-200">{s.program?.name || 'All Programs'}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 3. SCHOLARSHIPS */}
      {activeTab === 'scholarships' && (
        <div className="space-y-6">
          <div className="flex items-center justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsScholarshipModalOpen(true)}
              leftIcon={<Award className="w-4 h-4" />}
            >
              Create Scholarship Scheme
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {scholarships.map((sch) => (
              <Card key={sch.id} hoverEffect className="p-6 space-y-3">
                <div className="flex items-start justify-between">
                  <Badge variant="purple" size="sm">
                    {sch.type}
                  </Badge>
                  <span className="font-bold text-emerald-400 font-mono text-sm">
                    {sch.percentage ? `${sch.percentage}% Waiver` : formatCurrency(sch.fixedAmount || 0)}
                  </span>
                </div>
                <h4 className="font-bold text-white text-base">{sch.name}</h4>
                <p className="text-xs text-slate-400">{sch.description}</p>
                <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-500">
                  Beneficiaries: <strong className="text-slate-300">{sch._count?.studentScholarships || 0} Enrolled Students</strong>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

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

      <ScholarshipModal
        isOpen={isScholarshipModalOpen}
        onClose={() => setIsScholarshipModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
