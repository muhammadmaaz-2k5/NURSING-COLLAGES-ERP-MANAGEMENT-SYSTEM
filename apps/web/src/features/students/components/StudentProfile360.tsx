'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Stethoscope,
  BookOpen,
  Award,
  FileText,
  ShieldCheck,
  CheckCircle,
  Clock,
  Printer,
  ChevronRight,
  AlertCircle,
  Download,
  Upload,
  Activity,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { StudentProfile360 } from '../types/students.types';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Tabs } from '../../../components/ui/Tabs';
import { formatCurrency, formatDate } from '../../../lib/utils';
import { cn } from '../../../lib/utils';

export interface StudentProfile360Props {
  student: StudentProfile360;
}

export const StudentProfile360View: React.FC<StudentProfile360Props> = ({ student }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview & Bio', icon: User },
    { id: 'academic', label: 'Academics & Courses', icon: BookOpen, count: student.enrollments?.length || 0 },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'clinical', label: 'Clinical & PNC Log', icon: Stethoscope, count: student.clinical?.skills?.length || 0 },
    { id: 'results', label: 'Examinations & Marks', icon: Award, count: student.results?.length || 0 },
    { id: 'finance', label: 'Fees & Ledger', icon: CreditCard, count: student.feeLedger?.transactions?.length || 0 },
    { id: 'documents', label: 'Documents Vault', icon: FileText, count: student.documents?.length || 0 },
    { id: 'activity', label: 'Activity Audit', icon: Activity },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 360 Header Command Center */}
      <div className="p-6 lg:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            {/* Student Avatar */}
            <div className="relative">
              <img
                src={
                  student.user?.avatarUrl ||
                  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
                }
                alt={student.firstName}
                className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
            </div>

            {/* Core Info */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  {student.firstName} {student.lastName}
                </h1>
                <Badge variant="success" size="xs" dot>
                  {student.status}
                </Badge>
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                  {student.studentId}
                </span>
              </div>

              <p className="text-xs lg:text-sm text-slate-600 dark:text-slate-300 font-medium">
                {student.program?.name}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {student.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {student.phone || 'No phone'}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {student.city || 'Islamabad'}
                </span>
              </div>
            </div>
          </div>

            {/* Quick Metrics & Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                  Clinical Hours
                </p>
                <p className="text-base font-black text-emerald-600 dark:text-emerald-400">
                  {student.clinical?.completedHours ?? 340} / {student.clinical?.requiredHours ?? 500} hrs
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Stethoscope className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                leftIcon={<Printer className="w-3.5 h-3.5" />}
              >
                Print Dossier
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="underline"
      />

      {/* Tab Content Panels */}
      <div className="mt-6">
        {/* 1. OVERVIEW & BIO TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            <Card className="lg:col-span-2 space-y-6">
              <CardHeader className="pb-3">
                <div>
                  <CardTitle className="text-base">Personal & Biographic Dossier</CardTitle>
                  <CardDescription>Primary student identity and emergency records</CardDescription>
                </div>
              </CardHeader>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold">
                    National CNIC / B-Form
                  </span>
                  <p className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    {student.cnic || '61101-1234567-8'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold">
                    Date of Birth & Gender
                  </span>
                  <p className="font-bold text-slate-900 dark:text-slate-100">
                    {student.dateOfBirth ? formatDate(student.dateOfBirth) : '15 May 2004'} • {student.gender || 'FEMALE'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold">
                    Blood Group
                  </span>
                  <p className="font-bold text-rose-600 dark:text-rose-400">
                    {student.bloodGroup || 'B+'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold">
                    Permanent Address
                  </span>
                  <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                    {student.address || 'House #12, Street 4, Sector G-9/1, Islamabad'}
                  </p>
                </div>
              </div>

              {/* Parents / Guardians Roster */}
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Parents & Guardians
                </h4>
                <div className="space-y-2">
                  {student.parents && student.parents.length > 0 ? (
                    student.parents.map((p, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100">
                            {p.firstName} {p.lastName || ''}
                          </p>
                          <span className="text-slate-500 text-[11px]">
                            {p.relationship} • {p.occupation || 'Guardian'}
                          </span>
                        </div>
                        <span className="font-mono text-slate-700 dark:text-slate-300">
                          {p.phone}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500">No guardian registered yet.</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Quick Status Cards */}
            <div className="space-y-6">
              <Card className="space-y-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Academic Snapshot</CardTitle>
                </CardHeader>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Current Semester</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Semester 6</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Cumulative GPA</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">3.64 / 4.00</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Credits Completed</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">92 / 135</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">Overall Attendance</span>
                    <Badge variant="success" size="xs">94.2%</Badge>
                  </div>
                </div>
              </Card>

              <Card className="space-y-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Financial Status</CardTitle>
                </CardHeader>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                    <p className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                      Balance Status
                    </p>
                    <p className="text-lg font-black mt-0.5">All Dues Cleared</p>
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                      Challan #CH-2026-0881 Paid
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* 2. ACADEMICS & COURSES TAB */}
        {activeTab === 'academics' && (
          <Card className="space-y-4 animate-fade-in">
            <CardHeader className="pb-3">
              <div>
                <CardTitle className="text-base">Curriculum & Semester Enrollments</CardTitle>
                <CardDescription>Courses enrolled in the BSN curriculum</CardDescription>
              </div>
            </CardHeader>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                    <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Course Code</th>
                    <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Course Title</th>
                    <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Credit Hours</th>
                    <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Instructor</th>
                    <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">NUR-301</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100">Critical Care Nursing & ICU Operations</td>
                    <td className="p-3">4.0 (3-1)</td>
                    <td className="p-3">Dr. Tariq Mahmood</td>
                    <td className="p-3"><Badge variant="success" size="xs">Enrolled</Badge></td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">NUR-302</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100">Pediatric Nursing & Neonatal Care</td>
                    <td className="p-3">3.0 (2-1)</td>
                    <td className="p-3">Dr. Ayesha Malik</td>
                    <td className="p-3"><Badge variant="success" size="xs">Enrolled</Badge></td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">PHM-304</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100">Applied Pharmacology & Dosages</td>
                    <td className="p-3">3.0 (3-0)</td>
                    <td className="p-3">Dr. Bilal Ahmed</td>
                    <td className="p-3"><Badge variant="success" size="xs">Enrolled</Badge></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* 3. ATTENDANCE TAB */}
        {activeTab === 'attendance' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            <Card className="p-6 space-y-4 text-center flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full border-4 border-emerald-500 flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/40">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">94.2%</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Eligible for Examinations</h4>
                <p className="text-xs text-slate-500 mt-0.5">Threshold requirement is 75%</p>
              </div>
            </Card>

            <Card className="lg:col-span-2 space-y-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Subject-wise Attendance Breakdown</CardTitle>
              </CardHeader>
              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>Critical Care Nursing</span>
                    <span className="text-emerald-600 font-bold">96% (24/25 Classes)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '96%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>Pediatric Nursing</span>
                    <span className="text-emerald-600 font-bold">92% (23/25 Classes)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>Applied Pharmacology</span>
                    <span className="text-emerald-600 font-bold">95% (19/20 Classes)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '95%' }} />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* 4. CLINICAL & PNC LOG TAB */}
        {activeTab === 'clinical' && (
          <Card className="space-y-4 animate-fade-in">
            <CardHeader className="pb-3">
              <div>
                <CardTitle className="text-base">PNC Clinical Procedures & Rotations</CardTitle>
                <CardDescription>Verified hospital duty rotations and bedside sign-offs</CardDescription>
              </div>
            </CardHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <span className="text-[11px] font-bold uppercase text-blue-600 dark:text-blue-400">Total Rotations</span>
                <p className="text-xl font-black text-blue-700 dark:text-blue-300 mt-1">4 Hospital Units</p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <span className="text-[11px] font-bold uppercase text-emerald-600 dark:text-emerald-400">Verified Skills</span>
                <p className="text-xl font-black text-emerald-700 dark:text-emerald-300 mt-1">18 Verified</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                <span className="text-[11px] font-bold uppercase text-amber-600 dark:text-amber-400">Pending Sign-off</span>
                <p className="text-xl font-black text-amber-700 dark:text-amber-300 mt-1">2 Pending</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                    <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Procedure Name</th>
                    <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Hospital Ward</th>
                    <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Date Logged</th>
                    <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Faculty Supervisor</th>
                    <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Sign-off Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100">Intravenous (IV) Cannulation</td>
                    <td className="p-3">Emergency ICU Ward</td>
                    <td className="p-3">18 Aug 2026</td>
                    <td className="p-3">Dr. Tariq Mahmood</td>
                    <td className="p-3"><Badge variant="success" size="xs" dot>Verified</Badge></td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100">Foley Catheterization Insertion</td>
                    <td className="p-3">Surgical Ward 2</td>
                    <td className="p-3">14 Aug 2026</td>
                    <td className="p-3">Dr. Ayesha Malik</td>
                    <td className="p-3"><Badge variant="success" size="xs" dot>Verified</Badge></td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100">Nasogastric (NG) Tube Placement</td>
                    <td className="p-3">Medical Ward 1</td>
                    <td className="p-3">22 Aug 2026</td>
                    <td className="p-3">Dr. Tariq Mahmood</td>
                    <td className="p-3"><Badge variant="warning" size="xs" dot>Pending Review</Badge></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* 5. EXAMINATIONS & MARKS TAB */}
        {activeTab === 'results' && (
          <Card className="space-y-4 animate-fade-in">
            <CardHeader className="pb-3">
              <div>
                <CardTitle className="text-base">Examination Transcripts & Grade Progression</CardTitle>
                <CardDescription>Midterm, Final, OSPE/Viva examinations records</CardDescription>
              </div>
            </CardHeader>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                    <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Exam Title</th>
                    <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Course</th>
                    <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Marks Obtained</th>
                    <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Grade</th>
                    <th className="p-3 font-bold text-slate-600 dark:text-slate-400">GPA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100">Midterm Examination 2026</td>
                    <td className="p-3">Critical Care Nursing</td>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">88 / 100</td>
                    <td className="p-3"><Badge variant="success" size="xs">A+</Badge></td>
                    <td className="p-3 font-bold text-blue-600">4.00</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100">OSPE / Viva Bedside Exam</td>
                    <td className="p-3">Pediatric Nursing</td>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">82 / 100</td>
                    <td className="p-3"><Badge variant="success" size="xs">A</Badge></td>
                    <td className="p-3 font-bold text-blue-600">3.70</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* 6. FEES & LEDGER TAB */}
        {activeTab === 'finance' && (
          <Card className="space-y-4 animate-fade-in">
            <CardHeader className="pb-3">
              <div>
                <CardTitle className="text-base">Institutional Fee Invoices & Payment Ledger</CardTitle>
                <CardDescription>Bank challans and receipt audit records</CardDescription>
              </div>
            </CardHeader>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                    <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Challan No</th>
                    <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Billing Description</th>
                    <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Amount</th>
                    <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Paid Date</th>
                    <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">CH-2026-0881</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100">Semester 6 Tuition Fee + Lab Dues</td>
                    <td className="p-3 font-bold">PKR 85,000</td>
                    <td className="p-3">12 Aug 2026</td>
                    <td className="p-3"><Badge variant="success" size="xs">Paid</Badge></td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">CH-2026-0420</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100">Semester 5 Tuition Fee</td>
                    <td className="p-3 font-bold">PKR 85,000</td>
                    <td className="p-3">10 Jan 2026</td>
                    <td className="p-3"><Badge variant="success" size="xs">Paid</Badge></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* 7. DOCUMENTS VAULT TAB */}
        {activeTab === 'documents' && (
          <Card className="space-y-4 animate-fade-in">
            <CardHeader className="pb-3">
              <div>
                <CardTitle className="text-base">Verified Educational & Identification Documents</CardTitle>
                <CardDescription>Cloudinary CDN secure storage files</CardDescription>
              </div>
            </CardHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-xs text-slate-900 dark:text-slate-100">CNIC Copy</span>
                  </div>
                  <Badge variant="success" size="xs">Verified</Badge>
                </div>
                <p className="text-[11px] text-slate-500">cnic_front_back_scan.pdf</p>
                <Button variant="outline" size="xs" leftIcon={<Download className="w-3 h-3" />} className="w-full">
                  Download File
                </Button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-xs text-slate-900 dark:text-slate-100">FSc Pre-Medical</span>
                  </div>
                  <Badge variant="success" size="xs">Verified</Badge>
                </div>
                <p className="text-[11px] text-slate-500">fsc_transcript_verified.pdf</p>
                <Button variant="outline" size="xs" leftIcon={<Download className="w-3 h-3" />} className="w-full">
                  Download File
                </Button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-xs text-slate-900 dark:text-slate-100">PNC Registration</span>
                  </div>
                  <Badge variant="success" size="xs">Verified</Badge>
                </div>
                <p className="text-[11px] text-slate-500">pnc_registration_card.pdf</p>
                <Button variant="outline" size="xs" leftIcon={<Download className="w-3 h-3" />} className="w-full">
                  Download File
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* 8. ACTIVITY AUDIT TAB */}
        {activeTab === 'activity' && (
          <Card className="space-y-4 animate-fade-in">
            <CardHeader className="pb-3">
              <div>
                <CardTitle className="text-base">Student Chronological Activity Log</CardTitle>
                <CardDescription>Audit stream of enrollment, marks, payments, and skill sign-offs</CardDescription>
              </div>
            </CardHeader>

            <div className="space-y-3">
              <div className="flex items-start gap-3 text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-slate-900 dark:text-slate-100">Fee payment of PKR 85,000 confirmed</p>
                  <p className="text-slate-500 text-[11px]">Challan #CH-2026-0881 reconciled via Bank Al-Habib</p>
                  <span className="text-[10px] text-slate-400">12 Aug 2026, 11:30 AM</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                <Stethoscope className="w-4 h-4 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-slate-900 dark:text-slate-100">Clinical Bedside Skill Signed Off: "IV Cannulation"</p>
                  <p className="text-slate-500 text-[11px]">Approved by Dr. Tariq Mahmood in ICU Ward</p>
                  <span className="text-[10px] text-slate-400">18 Aug 2026, 02:15 PM</span>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
