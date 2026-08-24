'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  CreditCard,
  Stethoscope,
  BookOpen,
  Award,
  FileText,
  ShieldCheck,
  CheckCircle,
  Clock,
  ExternalLink,
  Printer,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { StudentProfile360 } from '../types/students.types';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { formatCurrency, formatDate } from '../../../lib/utils';
import { cn } from '../../../lib/utils';

export interface StudentProfile360Props {
  student: StudentProfile360;
}

type TabType =
  | 'overview'
  | 'parents'
  | 'academics'
  | 'attendance'
  | 'clinical'
  | 'finance'
  | 'results'
  | 'documents';

export const StudentProfile360View: React.FC<StudentProfile360Props> = ({ student }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs: { id: TabType; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'overview', label: 'Overview & Bio', icon: User },
    { id: 'parents', label: 'Parents & Guardians', icon: Phone, count: student.parents.length },
    { id: 'academics', label: 'Enrollments', icon: BookOpen, count: student.enrollments.length },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'clinical', label: 'Clinical & PNC Logbook', icon: Stethoscope, count: student.clinical.skills.length },
    { id: 'finance', label: 'Fees & Ledger', icon: CreditCard, count: student.feeLedger.transactions.length },
    { id: 'results', label: 'Exam Results', icon: Award, count: student.results.length },
    { id: 'documents', label: 'Documents', icon: FileText, count: student.documents.length },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 360 Header Banner */}
      <div className="p-6 lg:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            {/* Student Avatar */}
            <div className="relative">
              <img
                src={
                  student.user.avatarUrl ||
                  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
                }
                alt={student.firstName}
                className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl object-cover border-2 border-blue-500/40 shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-white" />
            </div>

            {/* Core Info */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black text-white">
                  {student.firstName} {student.lastName}
                </h1>
                <Badge variant="success" size="sm" dot>
                  {student.status}
                </Badge>
                <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-md border border-blue-500/20">
                  {student.studentId}
                </span>
              </div>

              <p className="text-xs lg:text-sm text-slate-300 font-medium">{student.program.name}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {student.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {student.phone || '—'}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {student.city || 'Islamabad'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stat Pill Cards */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center min-w-[100px]">
              <span className="text-[10px] uppercase font-bold text-slate-400">Current CGPA</span>
              <p className="text-xl font-black text-blue-400 mt-0.5">{student.cgpa || '3.82'}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center min-w-[100px]">
              <span className="text-[10px] uppercase font-bold text-slate-400">Attendance</span>
              <p className="text-xl font-black text-emerald-400 mt-0.5">
                {student.attendance.percentage}%
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center min-w-[100px]">
              <span className="text-[10px] uppercase font-bold text-slate-400">Clinical Hours</span>
              <p className="text-xl font-black text-purple-400 mt-0.5">
                {student.clinical.completedHours} / {student.clinical.requiredHours}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 mt-6 border-t border-slate-800/80 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer',
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60',
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={cn(
                      'px-1.5 py-0.2 rounded-md text-[10px] font-bold',
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300',
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Display */}

      {/* 1. OVERVIEW & BIO */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 space-y-4">
            <CardHeader>
              <CardTitle className="text-base">Personal & Demographic Bio</CardTitle>
            </CardHeader>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                <span className="text-slate-400 font-medium">CNIC / B-Form</span>
                <p className="font-bold text-slate-200 mt-1 font-mono">{student.cnic || '—'}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                <span className="text-slate-400 font-medium">Date of Birth</span>
                <p className="font-bold text-slate-200 mt-1">{formatDate(student.dateOfBirth)}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                <span className="text-slate-400 font-medium">Blood Group</span>
                <p className="font-bold text-rose-400 mt-1">{student.bloodGroup || '—'}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                <span className="text-slate-400 font-medium">Gender</span>
                <p className="font-bold text-slate-200 mt-1">{student.gender || '—'}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                <span className="text-slate-400 font-medium">Admission Date</span>
                <p className="font-bold text-slate-200 mt-1">{formatDate(student.createdAt)}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                <span className="text-slate-400 font-medium">Current Semester</span>
                <p className="font-bold text-blue-400 mt-1">Semester {student.currentSemester}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-xs space-y-1">
              <span className="text-slate-400 font-medium">Residential Address</span>
              <p className="font-medium text-slate-200">{student.address || 'Sector G-10, Islamabad'}</p>
            </div>
          </Card>

          <Card className="space-y-4">
            <CardHeader>
              <CardTitle className="text-base">Institutional Accreditation</CardTitle>
            </CardHeader>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold">Pakistan Nursing Council (PNC)</p>
                  <p className="text-[11px] text-emerald-400/80">Active Nursing Candidate Verified</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300">
                <CheckCircle className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <p className="font-bold">HEC Degree Track</p>
                  <p className="text-[11px] text-blue-400/80">135 Total Credit Hours Requirement</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 2. PARENTS & GUARDIANS */}
      {activeTab === 'parents' && (
        <Card className="space-y-4">
          <CardHeader>
            <div>
              <CardTitle className="text-base">Linked Parents & Legal Guardians</CardTitle>
              <CardDescription>Primary contacts for emergency and institutional circulars</CardDescription>
            </div>
          </CardHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {student.parents.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm">
                      {p.firstName} {p.lastName}
                    </h4>
                    <p className="text-xs text-blue-400 font-semibold">{p.relationship}</p>
                  </div>
                  {p.isPrimary && (
                    <Badge variant="primary" size="sm">
                      Primary Contact
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Contact Phone</span>
                    <span className="font-mono font-semibold">{p.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Occupation</span>
                    <span>{p.occupation || '—'}</span>
                  </div>
                  {p.email && (
                    <div className="col-span-2 mt-1">
                      <span className="text-slate-400 text-[10px] block">Email</span>
                      <span className="font-mono text-slate-300">{p.email}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 3. CLINICAL ROTATIONS & PNC LOGBOOK */}
      {activeTab === 'clinical' && (
        <div className="space-y-6">
          {/* Current Rotation Banner */}
          {student.clinical.currentRotation && (
            <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <Badge variant="success" size="sm">
                  Active Clinical Practicum
                </Badge>
                <h4 className="text-base font-bold text-white">
                  {student.clinical.currentRotation.rotationName}
                </h4>
                <p className="text-xs text-emerald-300">
                  {student.clinical.currentRotation.siteName} • {student.clinical.currentRotation.wardName}
                </p>
              </div>

              <div className="text-xs text-right text-slate-300">
                <span className="text-slate-400 block">Supervisor</span>
                <span className="font-bold text-white">
                  {student.clinical.currentRotation.supervisorName}
                </span>
              </div>
            </div>
          )}

          {/* Skills Verification Matrix */}
          <Card className="p-6 space-y-4">
            <CardHeader>
              <div>
                <CardTitle className="text-base">PNC Clinical Procedures & Skills Logbook</CardTitle>
                <CardDescription>
                  Verified surgical & medical procedures signed off by clinical faculty
                </CardDescription>
              </div>
            </CardHeader>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-bold uppercase">Procedure / Skill Name</th>
                    <th className="pb-3 font-bold uppercase">Category</th>
                    <th className="pb-3 font-bold uppercase text-center">Required</th>
                    <th className="pb-3 font-bold uppercase text-center">Completed</th>
                    <th className="pb-3 font-bold uppercase text-center">Verified</th>
                    <th className="pb-3 font-bold uppercase text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {student.clinical.skills.map((sk, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="py-3 font-bold text-slate-200">{sk.skillName}</td>
                      <td className="py-3 text-slate-400">{sk.category}</td>
                      <td className="py-3 text-center font-mono">{sk.requiredAttempts}</td>
                      <td className="py-3 text-center font-mono font-bold text-blue-400">
                        {sk.completedAttempts}
                      </td>
                      <td className="py-3 text-center font-mono font-bold text-emerald-400">
                        {sk.verifiedAttempts}
                      </td>
                      <td className="py-3 text-right">
                        <Badge
                          variant={sk.verifiedAttempts >= sk.requiredAttempts ? 'success' : 'warning'}
                          size="sm"
                        >
                          {sk.verifiedAttempts >= sk.requiredAttempts ? 'Verified' : 'In Progress'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* 4. FEES & FINANCIAL LEDGER */}
      {activeTab === 'finance' && (
        <Card className="p-6 space-y-6">
          {/* Summary Balance Meter */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Total Invoiced</span>
              <h3 className="text-xl font-bold text-slate-100 mt-1">
                {formatCurrency(student.feeLedger.totalBilled)}
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20">
              <span className="text-xs text-emerald-400 font-medium">Total Paid / Cleared</span>
              <h3 className="text-xl font-bold text-emerald-300 mt-1">
                {formatCurrency(student.feeLedger.totalPaid)}
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/20">
              <span className="text-xs text-rose-400 font-medium">Outstanding Balance</span>
              <h3 className="text-xl font-bold text-rose-300 mt-1">
                {formatCurrency(student.feeLedger.outstandingBalance)}
              </h3>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-bold uppercase">Date</th>
                  <th className="pb-3 font-bold uppercase">Description</th>
                  <th className="pb-3 font-bold uppercase">Challan #</th>
                  <th className="pb-3 font-bold uppercase text-right">Debit (PKR)</th>
                  <th className="pb-3 font-bold uppercase text-right">Credit (PKR)</th>
                  <th className="pb-3 font-bold uppercase text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {student.feeLedger.transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/30">
                    <td className="py-3 font-mono text-slate-400">{formatDate(tx.date)}</td>
                    <td className="py-3 font-medium text-slate-200">{tx.description}</td>
                    <td className="py-3 font-mono text-blue-400">{tx.challanNo || '—'}</td>
                    <td className="py-3 text-right font-mono font-bold text-rose-400">
                      {tx.debit > 0 ? formatCurrency(tx.debit) : '—'}
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-emerald-400">
                      {tx.credit > 0 ? formatCurrency(tx.credit) : '—'}
                    </td>
                    <td className="py-3 text-right">
                      <Badge variant={tx.status === 'PAID' ? 'success' : 'danger'} size="sm">
                        {tx.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* 5. EXAM RESULTS & TRANSCRIPT */}
      {activeTab === 'results' && (
        <Card className="p-6 space-y-6">
          <CardHeader>
            <div>
              <CardTitle className="text-base">Official Semester Examination Results</CardTitle>
              <CardDescription>Academic transcript records and semester GPAs</CardDescription>
            </div>
            <Button variant="outline" size="sm" leftIcon={<Printer className="w-4 h-4" />}>
              Print Transcript
            </Button>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-bold uppercase">Subject Code & Name</th>
                  <th className="pb-3 font-bold uppercase text-center">Credit Hours</th>
                  <th className="pb-3 font-bold uppercase text-center">Marks</th>
                  <th className="pb-3 font-bold uppercase text-center">Percentage</th>
                  <th className="pb-3 font-bold uppercase text-center">Grade</th>
                  <th className="pb-3 font-bold uppercase text-center">GP</th>
                  <th className="pb-3 font-bold uppercase text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {student.results.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/30">
                    <td className="py-3">
                      <p className="font-bold text-slate-200">{r.subject.name}</p>
                      <span className="font-mono text-slate-500">{r.subject.code}</span>
                    </td>
                    <td className="py-3 text-center font-mono">{r.subject.creditHours}</td>
                    <td className="py-3 text-center font-mono font-bold">
                      {r.marksObtained} / {r.totalMarks}
                    </td>
                    <td className="py-3 text-center font-mono">{r.percentage}%</td>
                    <td className="py-3 text-center font-bold text-blue-400">{r.grade}</td>
                    <td className="py-3 text-center font-mono font-bold">{r.gpa.toFixed(1)}</td>
                    <td className="py-3 text-right">
                      <Badge variant={r.status === 'PASS' ? 'success' : 'danger'} size="sm">
                        {r.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* 6. DOCUMENTS & ATTACHMENTS */}
      {activeTab === 'documents' && (
        <Card className="p-6 space-y-4">
          <CardHeader>
            <div>
              <CardTitle className="text-base">Verified Educational Attachments</CardTitle>
              <CardDescription>Documents stored on Cloudinary Media Storage</CardDescription>
            </div>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {student.documents.map((d) => (
              <div
                key={d.id}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="primary" size="sm">
                    {d.type}
                  </Badge>
                  {d.isVerified && (
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  )}
                </div>

                <p className="text-xs font-bold text-slate-200 truncate">{d.fileName}</p>

                <a
                  href={d.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:underline pt-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View in CDN</span>
                </a>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 7. ATTENDANCE */}
      {activeTab === 'attendance' && (
        <Card className="p-6 space-y-6">
          <CardHeader>
            <div>
              <CardTitle className="text-base">Semester Attendance Record</CardTitle>
              <CardDescription>Minimum 75% attendance mandatory for PNC examination eligibility</CardDescription>
            </div>
          </CardHeader>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400">Total Classes</span>
              <p className="text-2xl font-bold text-white mt-1">{student.attendance.totalClasses}</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20">
              <span className="text-xs text-emerald-400">Present</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{student.attendance.present}</p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/20">
              <span className="text-xs text-rose-400">Absent</span>
              <p className="text-2xl font-bold text-rose-400 mt-1">{student.attendance.absent}</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/20">
              <span className="text-xs text-amber-400">Approved Leaves</span>
              <p className="text-2xl font-bold text-amber-400 mt-1">{student.attendance.leave}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
