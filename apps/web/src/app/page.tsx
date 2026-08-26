'use client';

import React, { useState } from 'react';
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
  AlertTriangle,
  Activity,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  FileCheck2,
  AlertCircle,
  Calendar,
  DollarSign,
  UserPlus,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { DataTable, Column } from '../components/tables/DataTable';
import { useModules } from '../context/ModuleContext';
import { useAuth } from '../context/AuthContext';
import { StudentPortalDashboard } from '../features/students/components/StudentPortalDashboard';
import { formatCurrency, formatDate } from '../lib/utils';

interface StudentRosterItem {
  id: string;
  studentId: string;
  name: string;
  program: string;
  semester: string;
  clinicalHours: number;
  attendanceRate: number;
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
    attendanceRate: 92,
    status: 'ACTIVE',
  },
  {
    id: '2',
    studentId: 'NUR-2022-0089',
    name: 'Bilal Khan',
    program: 'Generic BSN (4-Year)',
    semester: 'Semester 6',
    clinicalHours: 310,
    attendanceRate: 88,
    status: 'ACTIVE',
  },
  {
    id: '3',
    studentId: 'NUR-2023-0104',
    name: 'Farah Naz',
    program: 'Post-RN BSN (2-Year)',
    semester: 'Semester 3',
    clinicalHours: 195,
    attendanceRate: 95,
    status: 'ACTIVE',
  },
  {
    id: '4',
    studentId: 'NUR-2024-0012',
    name: 'Zainab Qureshi',
    program: 'Generic BSN (4-Year)',
    semester: 'Semester 2',
    clinicalHours: 85,
    attendanceRate: 74,
    status: 'ACTIVE',
  },
  {
    id: '5',
    studentId: 'NUR-2021-0003',
    name: 'Hamza Tariq',
    program: 'Generic BSN (4-Year)',
    semester: 'Semester 8',
    clinicalHours: 520,
    attendanceRate: 98,
    status: 'GRADUATED',
  },
];

interface AttentionItem {
  id: string;
  category: 'Admissions' | 'Attendance' | 'Finance' | 'Clinical' | 'Pharmacy';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  actionUrl: string;
  actionText: string;
}

const attentionItems: AttentionItem[] = [
  {
    id: 'att-1',
    category: 'Admissions',
    title: '14 Online Applications Awaiting Review',
    description: 'Fall 2026 intake applications with uploaded CNIC/FSc documents pending verification.',
    severity: 'high',
    actionUrl: '/admissions',
    actionText: 'Review Queue',
  },
  {
    id: 'att-2',
    category: 'Attendance',
    title: '8 Students Below 75% Attendance Threshold',
    description: 'Semester 4 Pharmacology course attendance warnings for upcoming midterm exams.',
    severity: 'high',
    actionUrl: '/attendance',
    actionText: 'Send Warnings',
  },
  {
    id: 'att-3',
    category: 'Clinical',
    title: '5 Bedside Skills Pending Faculty Sign-Off',
    description: 'ICU & Medical Ward nursing logbook procedures performed by final-year students.',
    severity: 'medium',
    actionUrl: '/clinical',
    actionText: 'Verify Logbook',
  },
  {
    id: 'att-4',
    category: 'Finance',
    title: 'PKR 2.4M Overdue Semester Fee Challans',
    description: '28 student invoices past due date for August 2026 installment.',
    severity: 'medium',
    actionUrl: '/finance',
    actionText: 'View Defaulters',
  },
  {
    id: 'att-5',
    category: 'Pharmacy',
    title: '3 Medicine Batches Expiring Within 30 Days',
    description: 'IV Cannula 20G & Ceftriaxone 1g batches nearing expiry in Main Pharmacy.',
    severity: 'low',
    actionUrl: '/pharmacy',
    actionText: 'Stock Audit',
  },
];

interface ActivityItem {
  id: string;
  title: string;
  time: string;
  type: 'admission' | 'finance' | 'clinical' | 'exam' | 'hospital';
  icon: React.ElementType;
}

const recentActivities: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'Student Fee Paid: PKR 85,000 for NUR-2022-0041 (Amina Bibi)',
    time: '12 mins ago',
    type: 'finance',
    icon: CreditCard,
  },
  {
    id: 'act-2',
    title: 'Clinical Skill Approved: "IV Cannulation" signed by Dr. Tariq',
    time: '45 mins ago',
    type: 'clinical',
    icon: Stethoscope,
  },
  {
    id: 'act-3',
    title: 'New Admission Registered: Generic BSN Intake (Zainab Qureshi)',
    time: '2 hours ago',
    type: 'admission',
    icon: UserPlus,
  },
  {
    id: 'act-4',
    title: 'Patient Admitted: Ward 3B, Bed 04 (Emergency Referral)',
    time: '4 hours ago',
    type: 'hospital',
    icon: Building2,
  },
];

export default function DashboardPage() {
  const { modules } = useModules();
  const { user } = useAuth();

  // If active persona/session is a student, render the personalized Student Command Dashboard
  if (user?.role === 'STUDENT') {
    return <StudentPortalDashboard />;
  }

  const stats = [
    {
      title: 'Enrolled Nursing Students',
      value: '450',
      change: '+12% vs last intake',
      trend: 'up',
      icon: Users,
      color: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
      badge: 'Active Batch',
    },
    {
      title: 'Clinical Rotations Active',
      value: '184',
      change: '4 Hospital Teaching Units',
      trend: 'up',
      icon: Stethoscope,
      color: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
      badge: 'PNC Certified',
    },
    {
      title: 'Monthly Fee Collections',
      value: 'PKR 14.8M',
      change: '94.2% recovery target',
      trend: 'up',
      icon: CreditCard,
      color: 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800',
      badge: 'August 2026',
    },
    {
      title: 'Hospital Bed Occupancy',
      value: '84%',
      change: '210 / 250 Beds Allotted',
      trend: 'neutral',
      icon: Building2,
      color: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
      badge: 'Teaching Unit',
    },
  ];

  const columns: Column<StudentRosterItem>[] = [
    {
      header: 'Student ID',
      accessorKey: 'studentId',
      sortable: true,
      cell: (s) => (
        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
          {s.studentId}
        </span>
      ),
    },
    {
      header: 'Student Name',
      accessorKey: 'name',
      sortable: true,
      cell: (s) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-slate-100">{s.name}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">{s.program}</p>
        </div>
      ),
    },
    {
      header: 'Current Level',
      accessorKey: 'semester',
      sortable: true,
      cell: (s) => (
        <span className="text-slate-700 dark:text-slate-300 font-medium">
          {s.semester}
        </span>
      ),
    },
    {
      header: 'Clinical Hours',
      accessorKey: 'clinicalHours',
      sortable: true,
      cell: (s) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${Math.min((s.clinicalHours / 500) * 100, 100)}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {s.clinicalHours} hrs
          </span>
        </div>
      ),
    },
    {
      header: 'Attendance',
      accessorKey: 'attendanceRate',
      sortable: true,
      cell: (s) => (
        <Badge
          variant={s.attendanceRate >= 85 ? 'success' : s.attendanceRate >= 75 ? 'warning' : 'danger'}
          size="xs"
        >
          {s.attendanceRate}%
        </Badge>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (s) => (
        <Badge
          variant={
            s.status === 'ACTIVE'
              ? 'success'
              : s.status === 'GRADUATED'
              ? 'purple'
              : 'warning'
          }
          size="xs"
          dot
        >
          {s.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Welcome & Accreditation Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="primary" size="xs">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              PNC & HEC Accredited
            </Badge>
            <Badge variant="success" size="xs" dot>
              PostgreSQL Dedicated DB
            </Badge>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            National Medical & Nursing College ERP
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
            Unified command deck for academics, clinical rotas, hospital wards, pharmacy, and fees.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/students">
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Admit Student
            </Button>
          </Link>
          <Link href="/portal" target="_blank">
            <Button
              variant="outline"
              size="sm"
              rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
            >
              Public Portal
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((st, idx) => {
          const Icon = st.icon;
          return (
            <Card key={idx} hoverEffect compact className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {st.title}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5 tracking-tight">
                    {st.value}
                  </h3>
                </div>
                <div className={`p-2.5 rounded-xl ${st.color} shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">{st.change}</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[10px]">
                  {st.badge}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Attention Required Action Center */}
      <Card className="border-amber-200/60 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/10 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Attention Required ({attentionItems.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Institutional items requiring executive or faculty decision
              </p>
            </div>
          </div>
          <Badge variant="warning" size="xs">Action Center</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {attentionItems.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant={
                      item.severity === 'high'
                        ? 'danger'
                        : item.severity === 'medium'
                        ? 'warning'
                        : 'neutral'
                    }
                    size="xs"
                  >
                    {item.category}
                  </Badge>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <Link href={item.actionUrl} className="self-end">
                <Button variant="outline" size="xs" rightIcon={<ChevronRight className="w-3 h-3" />}>
                  {item.actionText}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </Card>

      {/* Operations Dial, Live Trends & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Direct Operations Speed Dial */}
        <Card className="p-5 space-y-4">
          <CardHeader className="pb-3 mb-0">
            <div>
              <CardTitle className="text-sm">Operations Speed Dial</CardTitle>
              <CardDescription>Instant actions for daily college workflows</CardDescription>
            </div>
          </CardHeader>

          <div className="grid grid-cols-2 gap-2.5">
            <Link
              href="/attendance"
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-700 transition-all text-left group"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Attendance</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Mark daily session</p>
            </Link>

            <Link
              href="/clinical"
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all text-left group"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
                <Stethoscope className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Verify Skills</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Bedside sign-off</p>
            </Link>

            <Link
              href="/finance"
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200 dark:border-slate-700/80 hover:border-purple-300 dark:hover:border-purple-700 transition-all text-left group"
            >
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2">
                <CreditCard className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Fee Invoices</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Issue bank challan</p>
            </Link>

            <Link
              href="/pharmacy"
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-700/80 hover:border-amber-300 dark:hover:border-amber-700 transition-all text-left group"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 group-hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2">
                <Pill className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Dispensary</p>
              <p className="text-[10px] text-slate-500 mt-0.5">FIFO stock release</p>
            </Link>
          </div>
        </Card>

        {/* Live Academic & Hospital Visual Trends */}
        <Card className="p-5 space-y-4">
          <CardHeader className="pb-3 mb-0">
            <div>
              <CardTitle className="text-sm">Key Operational Trends</CardTitle>
              <CardDescription>Attendance & Clinical Hours Progression</CardDescription>
            </div>
          </CardHeader>

          <div className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Overall Student Attendance
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">89.4% Avg</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '89.4%' }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Clinical Target Hours Logged
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400">78.2%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '78.2%' }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Fee Recovery (Current Month)
                </span>
                <span className="font-bold text-purple-600 dark:text-purple-400">94.2%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: '94.2%' }} />
              </div>
            </div>
          </div>
        </Card>

        {/* Recent System Activity */}
        <Card className="p-5 space-y-4">
          <CardHeader className="pb-3 mb-0">
            <div>
              <CardTitle className="text-sm">Recent System Activity</CardTitle>
              <CardDescription>Live institutional audit trail</CardDescription>
            </div>
          </CardHeader>

          <div className="space-y-3 pt-1">
            {recentActivities.map((act) => {
              const Icon = act.icon;
              return (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 dark:text-slate-200 font-medium truncate">
                      {act.title}
                    </p>
                    <span className="text-[10px] text-slate-400">{act.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Active Nursing Student Registry Table */}
      <Card className="p-6 space-y-4">
        <CardHeader className="pb-2">
          <div>
            <CardTitle className="text-base">Active Nursing Student Registry</CardTitle>
            <CardDescription>
              Preview of students enrolled in Generic BSN & Post-RN degrees
            </CardDescription>
          </div>
          <Link href="/students">
            <Button
              variant="outline"
              size="sm"
              rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
            >
              Full Directory
            </Button>
          </Link>
        </CardHeader>

        <DataTable
          columns={columns}
          data={mockStudents}
          searchPlaceholder="Search student name, ID or program..."
          pageSize={5}
          exportFilename="active_nursing_students"
        />
      </Card>
    </div>
  );
}
