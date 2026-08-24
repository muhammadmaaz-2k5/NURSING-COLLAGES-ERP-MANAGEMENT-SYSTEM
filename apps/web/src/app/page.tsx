'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  GraduationCap,
  Stethoscope,
  Building2,
  Pill,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Plus,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  Activity,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { DataTable, Column } from '../components/tables/DataTable';
import { useModules } from '../context/ModuleContext';
import { formatCurrency, formatDate } from '../lib/utils';

interface StudentRosterItem {
  id: string;
  studentId: string;
  name: string;
  program: string;
  semester: string;
  clinicalHours: number;
  status: 'ACTIVE' | 'ON_LEAVE' | 'GRADUATED';
}

const mockStudents: StudentRosterItem[] = [
  {
    id: '1',
    studentId: 'NUR-2022-0041',
    name: 'Amina Bibi',
    program: 'Generic BSN (4-Year)',
    semester: 'Semester 6',
    clinicalHours: 340,
    status: 'ACTIVE',
  },
  {
    id: '2',
    studentId: 'NUR-2022-0089',
    name: 'Bilal Khan',
    program: 'Generic BSN (4-Year)',
    semester: 'Semester 6',
    clinicalHours: 310,
    status: 'ACTIVE',
  },
  {
    id: '3',
    studentId: 'NUR-2023-0104',
    name: 'Farah Naz',
    program: 'Post-RN BSN (2-Year)',
    semester: 'Semester 3',
    clinicalHours: 195,
    status: 'ACTIVE',
  },
  {
    id: '4',
    studentId: 'NUR-2024-0012',
    name: 'Zainab Qureshi',
    program: 'Generic BSN (4-Year)',
    semester: 'Semester 2',
    clinicalHours: 85,
    status: 'ACTIVE',
  },
  {
    id: '5',
    studentId: 'NUR-2021-0003',
    name: 'Hamza Tariq',
    program: 'Generic BSN (4-Year)',
    semester: 'Semester 8',
    clinicalHours: 520,
    status: 'GRADUATED',
  },
];

export default function DashboardPage() {
  const { modules, isModuleEnabled } = useModules();

  const stats = [
    {
      title: 'Enrolled Nursing Students',
      value: '450',
      change: '+12% from last intake',
      trend: 'up',
      icon: Users,
      color: 'from-blue-600 to-indigo-600',
      badge: 'Active Batch',
    },
    {
      title: 'Clinical Rotations Active',
      value: '184',
      change: 'Across 4 Hospital Wards',
      trend: 'up',
      icon: Stethoscope,
      color: 'from-emerald-600 to-teal-600',
      badge: 'PNC Certified',
    },
    {
      title: 'Monthly Fee Collections',
      value: 'PKR 14.8M',
      change: '94.2% recovery rate',
      trend: 'up',
      icon: CreditCard,
      color: 'from-purple-600 to-indigo-600',
      badge: 'August 2026',
    },
    {
      title: 'Hospital Bed Occupancy',
      value: '84%',
      change: '210 / 250 Wards Allotted',
      trend: 'neutral',
      icon: Building2,
      color: 'from-amber-600 to-orange-600',
      badge: 'Teaching Unit',
    },
  ];

  const columns: Column<StudentRosterItem>[] = [
    {
      header: 'Student ID',
      accessorKey: 'studentId',
      sortable: true,
      cell: (s) => <span className="font-mono text-blue-400 font-semibold">{s.studentId}</span>,
    },
    {
      header: 'Full Name',
      accessorKey: 'name',
      sortable: true,
      cell: (s) => (
        <div>
          <p className="font-bold text-slate-100">{s.name}</p>
          <p className="text-xs text-slate-400">{s.program}</p>
        </div>
      ),
    },
    {
      header: 'Current Level',
      accessorKey: 'semester',
      sortable: true,
      cell: (s) => <span className="text-slate-300 font-medium">{s.semester}</span>,
    },
    {
      header: 'Verified Clinical Hours',
      accessorKey: 'clinicalHours',
      sortable: true,
      cell: (s) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${Math.min((s.clinicalHours / 500) * 100, 100)}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-emerald-400">{s.clinicalHours} hrs</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (s) => (
        <Badge
          variant={
            s.status === 'ACTIVE' ? 'success' : s.status === 'GRADUATED' ? 'purple' : 'warning'
          }
          size="sm"
          dot
        >
          {s.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-6 lg:p-8 rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-indigo-950/60 border border-blue-500/20 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="primary" size="sm">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-blue-400" />
              PNC & HEC Accredited
            </Badge>
            <Badge variant="success" size="sm" dot>
              Neon PostgreSQL Live
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            National Medical & Nursing College ERP
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            Unified executive management control deck across academic operations, clinical duty
            rotations, hospital admissions, pharmacy batches, and student finance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <Link href="/students">
            <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
              Admit Student
            </Button>
          </Link>
          <Link href="/portal" target="_blank">
            <Button variant="outline" size="md" rightIcon={<ExternalLink className="w-4 h-4" />}>
              Public Portal
            </Button>
          </Link>
        </div>

        {/* Decorative Background Blob */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((st, idx) => {
          const Icon = st.icon;
          return (
            <Card key={idx} hoverEffect className="relative overflow-hidden p-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {st.title}
                  </span>
                  <h3 className="text-2xl lg:text-3xl font-black text-white mt-1 tracking-tight">
                    {st.value}
                  </h3>
                </div>
                <div
                  className={`p-3 rounded-2xl bg-gradient-to-tr ${st.color} text-white shadow-lg shrink-0`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">{st.change}</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-blue-400 font-bold text-[10px]">
                  {st.badge}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Access Speed Dial & Quick Module Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Panel */}
        <Card className="lg:col-span-1 p-6 space-y-4">
          <CardHeader className="pb-3">
            <div>
              <CardTitle className="text-base">Direct Operations Speed Dial</CardTitle>
              <CardDescription>Instant access to high-frequency actions</CardDescription>
            </div>
          </CardHeader>

          <div className="grid grid-cols-2 gap-2.5">
            <Link
              href="/attendance"
              className="p-3 rounded-xl bg-slate-950/60 hover:bg-blue-900/30 border border-slate-800/80 hover:border-blue-500/40 transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-slate-200">Daily Attendance</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Mark batch session</p>
            </Link>

            <Link
              href="/clinical"
              className="p-3 rounded-xl bg-slate-950/60 hover:bg-emerald-900/30 border border-slate-800/80 hover:border-emerald-500/40 transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                <Stethoscope className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-slate-200">Verify Skills</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Faculty sign-off</p>
            </Link>

            <Link
              href="/finance"
              className="p-3 rounded-xl bg-slate-950/60 hover:bg-purple-900/30 border border-slate-800/80 hover:border-purple-500/40 transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2">
                <CreditCard className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-slate-200">Fee Invoices</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Generate challans</p>
            </Link>

            <Link
              href="/pharmacy"
              className="p-3 rounded-xl bg-slate-950/60 hover:bg-amber-900/30 border border-slate-800/80 hover:border-amber-500/40 transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 group-hover:bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2">
                <Pill className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-slate-200">Dispense Medicine</p>
              <p className="text-[10px] text-slate-500 mt-0.5">FIFO stock release</p>
            </Link>
          </div>
        </Card>

        {/* Live Active Modules Status */}
        <Card className="lg:col-span-2 p-6 space-y-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between w-full">
              <div>
                <CardTitle className="text-base">Institutional SaaS Modules</CardTitle>
                <CardDescription>24 Multi-department micro-systems active</CardDescription>
              </div>
              <Link
                href="/modules"
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
              >
                <span>Manage</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </CardHeader>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-56 overflow-y-auto pr-1">
            {modules.slice(0, 12).map((m, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between gap-2"
              >
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-200 truncate">
                    {m.module.replace(/_/g, ' ')}
                  </p>
                  <span className="text-[10px] text-slate-500">Core Engine</span>
                </div>
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    m.enabled ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-slate-600'
                  }`}
                />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Interactive Active Student Roster Table */}
      <Card className="p-6 space-y-4">
        <CardHeader className="pb-2">
          <div>
            <CardTitle className="text-lg">Active Nursing Student Registry</CardTitle>
            <CardDescription>
              Preview of students enrolled in Generic BSN & Post-RN degrees
            </CardDescription>
          </div>
          <Link href="/students">
            <Button variant="outline" size="sm" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
              View Full Roster
            </Button>
          </Link>
        </CardHeader>

        <DataTable
          columns={columns}
          data={mockStudents}
          searchPlaceholder="Search student name, ID or program..."
          pageSize={5}
        />
      </Card>
    </div>
  );
}
