'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  CalendarCheck,
  Stethoscope,
  CreditCard,
  BookOpen,
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  FileText,
  Download,
  Building,
  Bus,
  Home,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  TrendingUp,
  UserCheck,
  Printer,
  ExternalLink,
  Plus,
  ArrowRight,
  Check,
  RotateCcw,
  Sliders,
  Bookmark,
  MapPin,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Tabs, TabItem } from '../../../components/ui/Tabs';
import { DegreeProgressCard } from './DegreeProgressCard';
import { ClinicalProcedureModal } from '../../clinical/components/ClinicalProcedureModal';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { formatCurrency, formatDate } from '../../../lib/utils';

export const StudentPortalDashboard: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('clinical');
  const [isProcedureModalOpen, setIsProcedureModalOpen] = useState(false);

  const studentName = user?.name || 'Amina Bibi';
  const studentRoll = 'NUR-2022-0041';
  const programName = 'Generic BSN (4-Year Degree)';
  const currentSemester = 'Semester 6 (Spring 2026)';
  const cgpa = '3.82';

  const tabs: TabItem[] = [
    { id: 'degree', label: 'Degree Progress & Audit', icon: GraduationCap, badge: '69.1%' },
    { id: 'clinical', label: 'Clinical Skills & Logbook', icon: Stethoscope, badge: '840 / 1200h' },
    { id: 'courses', label: 'Enrolled Courses & Attendance', icon: BookOpen, badge: '6 Subjects' },
    { id: 'results', label: 'Exam Results & Transcripts', icon: Award, badge: 'CGPA 3.82' },
    { id: 'finance', label: 'Fee Challans & Receipts', icon: CreditCard, badge: 'Paid' },
    { id: 'campus', label: 'Hostel, Library & Transport', icon: Building },
  ];

  const handleDownloadTranscript = () => {
    toast.success('Official Transcript Generated', 'Downloading digitally signed semester transcript PDF...');
  };

  const handleDownloadReceipt = (challanNo: string) => {
    toast.success('Payment Receipt Ready', `Downloading verified payment voucher #${challanNo}...`);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12">
      {/* 1. Student Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 text-white p-6 sm:p-8 shadow-sm">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'}
              alt={studentName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-blue-500/30 shadow-md shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <Badge variant="purple" size="sm">
                  {studentRoll}
                </Badge>
                <Badge variant="success" size="sm">
                  <ShieldCheck className="w-3 h-3 mr-1 inline" /> PNC Verified Enrollment
                </Badge>
                <Badge variant="neutral" size="sm">
                  Section A (Morning)
                </Badge>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">{studentName}</h1>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
                {programName} • <span className="text-blue-400 font-semibold">{currentSemester}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-stretch sm:self-auto justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadTranscript}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              leftIcon={<Download className="w-4 h-4" />}
            >
              Download Transcript
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsProcedureModalOpen(true)}
              leftIcon={<Stethoscope className="w-4 h-4" />}
            >
              Log Bedside Procedure
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Contextual Status Cards (Section 3: NOT a raw KPI Wall) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Context Card */}
        <Card className="p-5 flex flex-col justify-between space-y-3 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attendance Standing</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-slate-100">91.4%</span>
              <Badge variant="success" size="xs">EXAM ELIGIBLE</Badge>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '91.4%' }} />
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            +16.4% above 75% minimum requirement
          </p>
        </Card>

        {/* Clinical Hours Context Card */}
        <Card className="p-5 flex flex-col justify-between space-y-3 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">PNC Clinical Training</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-slate-100">840 / 1200 hrs</span>
              <Badge variant="primary" size="xs">70% COMPLETE</Badge>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: '70%' }} />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            360 hours remaining across ward rotations
          </p>
        </Card>

        {/* Academic CGPA Context Card */}
        <Card className="p-5 flex flex-col justify-between space-y-3 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Academic Standing</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-slate-100">{cgpa}</span>
              <Badge variant="purple" size="xs">EXCELLENT STANDING</Badge>
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 font-bold mt-1">Rank #1 in Class Cohort</p>
          </div>
          <p className="text-[11px] text-slate-500">Semester 6 • 94 of 136 Credits Earned</p>
        </Card>

        {/* Financial Context Card */}
        <Card className="p-5 flex flex-col justify-between space-y-3 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tuition & Accounts</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₨ 0 Due</span>
              <Badge variant="success" size="xs">CLEAR</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">Semester 6 Tuition Paid & Verified</p>
          </div>
          <p className="text-[11px] text-slate-500">Challan #CHL-2026-604 (30% Merit Waiver)</p>
        </Card>
      </div>

      {/* 3. TODAY EXPERIENCE TIMELINE (Section 4) */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Today's Schedule & Timeline</h3>
              <p className="text-xs text-slate-500">Tuesday, August 25, 2026 • Live Schedule</p>
            </div>
          </div>

          <Badge variant="primary" size="sm">
            2 Activities Remaining
          </Badge>
        </div>

        {/* Timeline Row Items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Shift 1: Completed */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-500">08:00 AM - 02:00 PM</span>
              <Badge variant="neutral" size="xs">COMPLETED</Badge>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">🏥 Clinical Bedside Rotation</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">ICU & Critical Care Ward • Teaching Hospital</p>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1 font-medium">Supervisor: Sister Farida Bano</p>
            </div>
          </div>

          {/* Shift 2: Current */}
          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border-2 border-blue-500 space-y-2 relative shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">02:30 PM - 04:00 PM</span>
              <Badge variant="primary" size="xs">CURRENT ACTIVITY</Badge>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">📖 Adult Health Nursing II</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Lecture Hall 3 • Academic Block</p>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1 font-medium">Instructor: Dr. Tariq Mahmood</p>
            </div>
          </div>

          {/* Shift 3: Next */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-500">04:15 PM - 05:30 PM</span>
              <Badge variant="neutral" size="xs">UPCOMING</Badge>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">🧪 Pharmacology Lab Practicum</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Simulation Lab 2 • Medical Sciences Wing</p>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1 font-medium">Instructor: Dr. Ayesha Malik</p>
            </div>
          </div>
        </div>
      </Card>

      {/* 4. ATTENTION REQUIRED (Section 5) & 5. ACADEMIC HEALTH CENTER (Section 6) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attention Required Banner (2 Cols) */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            Attention Required
          </h3>

          <div className="space-y-3">
            {/* Alert 1: Clinical Sign-off Pending */}
            <div className="p-4 rounded-2xl border border-blue-200 dark:border-blue-800/60 bg-blue-50/40 dark:bg-blue-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Clinical Sign-off Pending Verification
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    2 procedure logs (IV Cannulation & NGT Insertion) are waiting for supervisor verification.
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="xs"
                onClick={() => setActiveTab('clinical')}
                rightIcon={<ArrowRight className="w-3 h-3" />}
                className="shrink-0 self-end sm:self-auto"
              >
                Review Logbook
              </Button>
            </div>

            {/* Alert 2: Exam Result Published */}
            <div className="p-4 rounded-2xl border border-purple-200 dark:border-purple-800/60 bg-purple-50/40 dark:bg-purple-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Exam Result Published: Adult Health Nursing II
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    Midterm assessment results (88/100, Grade A+, 4.0 GP) are published on your official transcript.
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="xs"
                onClick={() => setActiveTab('results')}
                rightIcon={<ArrowRight className="w-3 h-3" />}
                className="shrink-0 self-end sm:self-auto"
              >
                View Result
              </Button>
            </div>
          </div>
        </div>

        {/* Student Risk & Academic Health Center (Section 6) */}
        <Card className="p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Academic Health</h4>
                <p className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">Excellent Standing</p>
              </div>
              <Badge variant="success" size="sm">
                Healthy
              </Badge>
            </div>

            <div className="space-y-2.5 pt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Class Attendance Rate</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> 91.4% (Safe)
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">PNC Clinical Training</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> 840h (On Track)
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Financial Clearance</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> ₨ 0 Due (Cleared)
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Examination Standing</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> 3.82 CGPA (Distinction)
                </span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            Institutional Audit: No academic probation or administrative blocks active.
          </p>
        </Card>
      </div>

      {/* 6. MAIN DOSSIER TABS */}
      <Card className="p-6">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

        {/* TAB 1: DEGREE PROGRESS & AUDIT (Section 12) */}
        {activeTab === 'degree' && (
          <div className="animate-fade-in">
            <DegreeProgressCard
              studentName={studentName}
              programName={programName}
              totalCreditsRequired={136}
              creditsEarned={94}
              clinicalHoursRequired={1200}
              clinicalHoursCompleted={840}
              cgpa={Number(cgpa)}
              attendanceRate={91.4}
              isFinanceClear={true}
            />
          </div>
        )}

        {/* TAB 2: CLINICAL LOGBOOK (Section 9 & 10) */}
        {activeTab === 'clinical' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  PNC 1200 Hours Clinical Skills & Bedside Logbook
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified bedside nursing competencies and hospital supervisor sign-offs
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsProcedureModalOpen(true)}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Log Bedside Skill
              </Button>
            </div>

            {/* Current Active Ward Rotation */}
            <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 block tracking-wider">
                  Active Ward Duty
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  🏥 Teaching Hospital — ICU & Critical Care Ward
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Shift Schedule: Morning 08:00 AM - 02:00 PM • Rotation Dates: 08 Aug — 28 Aug 2026
                </p>
              </div>
              <Badge variant="primary" size="sm">
                Supervisor: Sister Farida Bano (Verified)
              </Badge>
            </div>

            {/* Core Competencies Matrix */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                PNC Core Procedural Competency Milestone
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { name: 'IV Cannulation & Fluid Infusion', completed: 20, target: 20, isVerified: true },
                  { name: 'Foley Catheterization & Care', completed: 15, target: 15, isVerified: true },
                  { name: 'Adult CPR & Basic Life Support', completed: 10, target: 10, isVerified: true },
                  { name: 'Nasogastric Tube (NGT) Insertion', completed: 8, target: 10, isVerified: false },
                  { name: 'Surgical Wound Aseptic Dressing', completed: 22, target: 25, isVerified: false },
                  { name: '12-Lead Electrocardiogram (ECG)', completed: 15, target: 15, isVerified: true },
                ].map((skill) => (
                  <div
                    key={skill.name}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shadow-2xs"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{skill.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {skill.completed} / {skill.target} Verified Logs
                      </p>
                    </div>
                    <Badge variant={skill.isVerified ? 'success' : 'primary'} size="xs">
                      {skill.isVerified ? '✓ Verified' : 'In Progress'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Clinical Log Activity Timeline */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Recent Bedside Activity Timeline
              </h4>

              <div className="space-y-2.5">
                {[
                  { title: 'IV Cannulation & Normal Saline Infusion (20G Left Cephalic)', ward: 'ICU Ward Bed 4', time: 'Today, 10:30 AM', supervisor: 'Sister Farida Bano', status: 'Pending Supervisor Verification', isPending: true },
                  { title: 'Adult Basic Life Support (BLS) & Defibrillator Protocol', ward: 'ER Trauma Room 2', time: 'Yesterday, 11:15 AM', supervisor: 'Sister Farida Bano', status: 'Supervisor Approved & Stamped', isPending: false },
                  { title: 'Foley Catheter Replacement & Aseptic Bladder Irrigation', ward: 'Medical Ward Bed 12', time: 'Aug 22, 09:00 AM', supervisor: 'Dr. Tariq Mahmood', status: 'Supervisor Approved & Stamped', isPending: false },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-900 dark:text-slate-100">{item.title}</p>
                      <p className="text-slate-500 text-[11px]">{item.ward} • {item.time} • Preceptor: {item.supervisor}</p>
                    </div>
                    <Badge variant={item.isPending ? 'warning' : 'success'} size="xs">
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ENROLLED COURSES & ATTENDANCE (Section 11) */}
        {activeTab === 'courses' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Enrolled Courses & Attendance Standing (Semester 6)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  18 Total Credit Hours registered with assigned faculty professors
                </p>
              </div>
              <Link href="/attendance">
                <Button variant="outline" size="xs" rightIcon={<ArrowRight className="w-3 h-3" />}>
                  Full Attendance Report
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { code: 'NUR-301', name: 'Adult Health Nursing II', credits: 4, instructor: 'Dr. Tariq Mahmood', attendance: 93.3, nextClass: 'Today, 02:30 PM (Hall 3)' },
                { code: 'NUR-302', name: 'Pharmacology in Clinical Nursing', credits: 3, instructor: 'Dr. Ayesha Malik', attendance: 91.6, nextClass: 'Today, 04:15 PM (Lab 2)' },
                { code: 'NUR-303', name: 'Nursing Research & Biostatistics', credits: 3, instructor: 'Prof. Muhammad Asif', attendance: 90.9, nextClass: 'Tomorrow, 09:00 AM' },
                { code: 'NUR-304', name: 'Mental Health & Psychiatric Nursing', credits: 4, instructor: 'Dr. Sarah Ahmed', attendance: 90.6, nextClass: 'Thursday, 10:00 AM' },
                { code: 'NUR-305', name: 'Professional Nursing Ethics & Law', credits: 2, instructor: 'Sister Farida Bano', attendance: 93.7, nextClass: 'Friday, 11:30 AM' },
                { code: 'CLN-306', name: 'Hospital Clinical Practicum VI', credits: 2, instructor: 'Sister Farida Bano', attendance: 93.3, nextClass: 'Daily, 08:00 AM (ICU)' },
              ].map((c) => (
                <div
                  key={c.code}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-blue-600 dark:text-blue-400">
                        {c.code} • {c.credits} Cr.
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{c.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Prof: {c.instructor}</p>
                    </div>
                    <Badge variant="success" size="xs">
                      {c.attendance}%
                    </Badge>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${c.attendance}%` }} />
                  </div>

                  <div className="text-[11px] text-slate-500 pt-1 flex items-center justify-between">
                    <span>Next: <strong>{c.nextClass}</strong></span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Exam Allowed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: EXAM RESULTS & TRANSCRIPTS (Section 13 & 14) */}
        {activeTab === 'results' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Official Examination Results & Transcript
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified grading scale stamped by the Controller of Examinations
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadTranscript}
                leftIcon={<Download className="w-4 h-4" />}
              >
                Download Signed Transcript PDF
              </Button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase">
                  <tr>
                    <th className="p-3.5">Course Code & Title</th>
                    <th className="p-3.5 text-center">Credit Hours</th>
                    <th className="p-3.5 text-center">Marks Obtained</th>
                    <th className="p-3.5 text-center">Letter Grade</th>
                    <th className="p-3.5 text-center">Grade Points (GP)</th>
                    <th className="p-3.5 text-right">Result Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {[
                    { code: 'NUR-301', name: 'Adult Health Nursing II', credits: 4, obtained: '88 / 100', grade: 'A+', gp: 4.0, status: 'PASS' },
                    { code: 'NUR-302', name: 'Pharmacology in Clinical Nursing', credits: 3, obtained: '82 / 100', grade: 'A', gp: 3.7, status: 'PASS' },
                    { code: 'NUR-303', name: 'Nursing Research & Biostatistics', credits: 3, obtained: '79 / 100', grade: 'B+', gp: 3.3, status: 'PASS' },
                    { code: 'NUR-304', name: 'Mental Health & Psychiatric Nursing', credits: 4, obtained: '85 / 100', grade: 'A+', gp: 4.0, status: 'PASS' },
                    { code: 'NUR-305', name: 'Professional Nursing Ethics & Law', credits: 2, obtained: '92 / 100', grade: 'A+', gp: 4.0, status: 'PASS' },
                    { code: 'CLN-306', name: 'Hospital Clinical Practicum VI', credits: 2, obtained: '90 / 100', grade: 'A+', gp: 4.0, status: 'PASS' },
                  ].map((r) => (
                    <tr key={r.code} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="p-3.5 font-medium">
                        <p className="font-bold text-slate-900 dark:text-slate-100">{r.name}</p>
                        <span className="font-mono text-blue-600 dark:text-blue-400 text-[11px]">{r.code}</span>
                      </td>
                      <td className="p-3.5 text-center font-mono text-slate-700 dark:text-slate-300">{r.credits} CH</td>
                      <td className="p-3.5 text-center font-mono font-bold text-slate-900 dark:text-slate-100">{r.obtained}</td>
                      <td className="p-3.5 text-center">
                        <span className="font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          {r.grade}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-mono text-slate-700 dark:text-slate-300 font-semibold">{r.gp.toFixed(1)}</td>
                      <td className="p-3.5 text-right">
                        <Badge variant="success" size="xs">
                          {r.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: FINANCE & RECEIPTS (Section 15) */}
        {activeTab === 'finance' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Tuition Fee Challans & Payment Receipts
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Semester 6 fee status: <strong className="text-emerald-600 dark:text-emerald-400">All Dues Cleared (₨ 0 Due)</strong>
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success('Clearance Certificate', 'Downloading annual fee clearance certificate PDF...')}
                leftIcon={<Download className="w-4 h-4" />}
              >
                Clearance Certificate
              </Button>
            </div>

            {/* Breakdown Card */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Gross Tuition Fee</span>
                <span className="font-mono text-base font-bold text-slate-900 dark:text-slate-100 mt-1 block">PKR 85,000</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Merit Scholarship</span>
                <span className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">-PKR 25,500 (30%)</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Net Amount Paid</span>
                <span className="font-mono text-base font-bold text-blue-600 dark:text-blue-400 mt-1 block">PKR 59,500</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Remaining Balance</span>
                <span className="font-mono text-base font-black text-emerald-600 dark:text-emerald-400 mt-1 block">₨ 0 (CLEAR)</span>
              </div>
            </div>

            {/* Challans History Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase">
                  <tr>
                    <th className="p-3.5">Challan Voucher #</th>
                    <th className="p-3.5">Academic Term</th>
                    <th className="p-3.5 text-center">Net Paid</th>
                    <th className="p-3.5">Bank Reference</th>
                    <th className="p-3.5">Payment Date</th>
                    <th className="p-3.5 text-right">Receipt Voucher</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {[
                    { challanNo: 'CHL-2026-604', term: 'Semester 6 (Spring 2026)', netPaid: 'PKR 59,500', bankRef: 'MEEZAN-FT-99124', paidDate: '2026-08-10' },
                    { challanNo: 'CHL-2025-502', term: 'Semester 5 (Fall 2025)', netPaid: 'PKR 59,500', bankRef: 'HBL-ONL-81203', paidDate: '2026-01-15' },
                    { challanNo: 'CHL-2025-401', term: 'Semester 4 (Spring 2025)', netPaid: 'PKR 56,000', bankRef: 'MEEZAN-FT-44109', paidDate: '2025-08-12' },
                  ].map((ch) => (
                    <tr key={ch.challanNo} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="p-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">{ch.challanNo}</td>
                      <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">{ch.term}</td>
                      <td className="p-3.5 text-center font-mono font-bold text-slate-900 dark:text-slate-100">{ch.netPaid}</td>
                      <td className="p-3.5 font-mono text-slate-500">{ch.bankRef}</td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-400">{ch.paidDate}</td>
                      <td className="p-3.5 text-right">
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => handleDownloadReceipt(ch.challanNo)}
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
          </div>
        )}

        {/* TAB 6: CAMPUS, HOSTEL & TRANSPORT (Section 16 & 17) */}
        {activeTab === 'campus' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hostel Accommodation */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <Home className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Residential Hostel</h4>
                      <p className="text-[11px] text-slate-500">Florence Nightingale Female Hostel</p>
                    </div>
                  </div>
                  <Badge variant="purple" size="xs">Room #204</Badge>
                </div>

                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
                    <span>Allotted Room & Bed:</span>
                    <strong className="text-slate-900 dark:text-slate-100">Room 204 (2nd Floor), Bed #2</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
                    <span>Hostel Superintendent:</span>
                    <strong className="text-slate-900 dark:text-slate-100">Sister Farida Bano</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Mess Facility:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Standard 3-Meals Active</span>
                  </div>
                </div>
              </div>

              {/* Commuter Transport */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <Bus className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Commuter Transport</h4>
                      <p className="text-[11px] text-slate-500">Route 1: Rawalpindi Saddar Corridor</p>
                    </div>
                  </div>
                  <Badge variant="success" size="xs">Seat #14</Badge>
                </div>

                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
                    <span>Assigned Vehicle:</span>
                    <strong className="text-slate-900 dark:text-slate-100">Coaster # ICT-8921</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
                    <span>Pickup Stop & Time:</span>
                    <strong className="text-slate-900 dark:text-slate-100">Faizabad Interchange (07:15 AM)</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Driver Contact:</span>
                    <strong className="text-slate-900 dark:text-slate-100">Ustad Rafiq (+92 300 5518290)</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Procedure Submission Modal */}
      <ClinicalProcedureModal
        isOpen={isProcedureModalOpen}
        onClose={() => setIsProcedureModalOpen(false)}
        onSuccess={() => setActiveTab('clinical')}
      />
    </div>
  );
};
