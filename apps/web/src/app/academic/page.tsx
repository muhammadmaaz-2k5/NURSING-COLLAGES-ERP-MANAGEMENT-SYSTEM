'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  GraduationCap,
  Building2,
  Calendar,
  Clock,
  Plus,
  Layers,
  Sparkles,
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable, Column } from '../../components/tables/DataTable';
import { RoleGate } from '../../components/auth/RoleGate';
import { ProgramModal } from '../../features/academic/components/ProgramModal';
import { CurriculumView } from '../../features/academic/components/CurriculumView';
import { FacilitiesHierarchy } from '../../features/academic/components/FacilitiesHierarchy';
import { SessionsSemestersView } from '../../features/academic/components/SessionsSemestersView';
import { TimetableGrid } from '../../features/academic/components/TimetableGrid';
import { useAuth } from '../../context/AuthContext';
import {
  fetchPrograms,
  fetchDepartments,
  fetchCurriculum,
  fetchCampuses,
  fetchSessions,
  fetchTimetable,
} from '../../features/academic/services/academic.api';
import {
  Program,
  Department,
  Subject,
  Campus,
  AcademicSession,
  TimetableSlot,
} from '../../features/academic/types/academic.types';

type AcademicTab = 'programs' | 'curriculum' | 'facilities' | 'sessions' | 'timetable';

export default function AcademicPage() {
  const { user } = useAuth();
  const isStudent = user?.role === 'STUDENT';
  const [activeTab, setActiveTab] = useState<AcademicTab>(isStudent ? 'curriculum' : 'programs');
  const [programs, setPrograms] = useState<Program[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [sessions, setSessions] = useState<AcademicSession[]>([]);
  const [timetableSlots, setTimetableSlots] = useState<TimetableSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [p, d, s, c, sess, tt] = await Promise.all([
        fetchPrograms(),
        fetchDepartments(),
        fetchCurriculum(),
        fetchCampuses(),
        fetchSessions(),
        fetchTimetable(),
      ]);
      setPrograms(p);
      setDepartments(d);
      setSubjects(s);
      setCampuses(c);
      setSessions(sess);
      setTimetableSlots(tt);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const programColumns: Column<Program>[] = [
    {
      header: 'Program Code',
      accessorKey: 'code',
      sortable: true,
      cell: (p) => (
        <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-500/20">
          {p.code}
        </span>
      ),
    },
    {
      header: 'Degree Program Name',
      accessorKey: 'name',
      sortable: true,
      cell: (p) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-slate-100">{p.name}</p>
          <span className="text-xs text-slate-500">{p.durationYears} Years Duration • {p.totalCredits} Credit Hours</span>
        </div>
      ),
    },
    {
      header: 'Total Credits',
      accessorKey: 'totalCredits',
      sortable: true,
      cell: (p) => (
        <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs">
          {p.totalCredits} Credits
        </span>
      ),
    },
    {
      header: 'Status',
      sortable: true,
      cell: (p) => (
        <Badge variant={p.isActive ? 'success' : 'neutral'} size="sm">
          {p.isActive ? 'Accredited & Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  const studentTabs = [
    { id: 'curriculum' as const, label: 'Enrolled Curriculum & Syllabi', icon: BookOpen },
    { id: 'timetable' as const, label: 'Weekly Timetable & Venues', icon: Clock, badge: 'Live' },
    { id: 'programs' as const, label: 'Degree Program Directory', icon: GraduationCap },
  ];

  const adminTabs = [
    { id: 'programs' as const, label: 'Degree Programs', icon: GraduationCap },
    { id: 'curriculum' as const, label: 'Curriculum & Courses', icon: BookOpen },
    { id: 'facilities' as const, label: 'Campuses & Labs', icon: Building2 },
    { id: 'sessions' as const, label: 'Sessions & Semesters', icon: Calendar },
    { id: 'timetable' as const, label: 'Weekly Timetable', icon: Clock, badge: 'Live Grid' },
  ];

  const tabsToRender = isStudent ? studentTabs : adminTabs;

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isStudent ? 'My Academic Curriculum & Timetable' : 'Academic & Curriculum Management'}
            </h1>
            <Badge variant="primary" size="sm">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-blue-500 dark:text-blue-400" />
              HEC & PNC Compliant
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isStudent
              ? 'Complete semester course syllabus, credit hour distribution, faculty contacts, and classroom timetable.'
              : 'Administrative command center for degree programs, curriculum breakdowns, physical venues, and conflict-free timetables.'}
          </p>
        </div>

        <RoleGate roles={['SUPER_ADMIN', 'COLLEGE_ADMIN']}>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsProgramModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Program
          </Button>
        </RoleGate>
      </div>

      {/* KPI Stats Deck */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {isStudent ? 'My Program' : 'Degree Programs'}
          </span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {isStudent ? 'Generic BSN' : '4'}
          </h3>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium">
            {isStudent ? 'Semester 6 • Spring 2026' : 'BSN, Post-RN, DPT, MLT'}
          </p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {isStudent ? 'Active Courses' : 'Departments'}
          </span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {isStudent ? '6 Modules' : '2'}
          </h3>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 font-medium">
            {isStudent ? '18 Credit Hours' : 'Nursing & Allied Sciences'}
          </p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {isStudent ? 'Clinical Shifts' : 'Active Sections'}
          </span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {isStudent ? '3 Days/Wk' : '18'}
          </h3>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
            {isStudent ? 'Teaching Hospital ICU' : 'Allotted Class Cohorts'}
          </p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {isStudent ? 'Total Degree Cr.' : 'Labs & Halls'}
          </span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {isStudent ? '94 / 136' : '5'}
          </h3>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 font-medium">
            {isStudent ? '69.1% Completed' : 'Simulation Labs & Halls'}
          </p>
        </Card>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 scrollbar-none">
        {tabsToRender.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === 'programs' && (
        <Card className="p-6 space-y-4">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-lg">Accredited Academic Offerings</CardTitle>
              <CardDescription>
                Undergraduate and postgraduate degrees recognized by PNC and HEC
              </CardDescription>
            </div>
          </CardHeader>

          <DataTable
            columns={programColumns}
            data={programs}
            isLoading={isLoading}
            searchPlaceholder="Search programs by title or code..."
            pageSize={10}
          />
        </Card>
      )}

      {activeTab === 'curriculum' && (
        <CurriculumView programs={programs} subjects={subjects} onRefresh={loadData} />
      )}

      {activeTab === 'facilities' && (
        <FacilitiesHierarchy campuses={campuses} />
      )}

      {activeTab === 'sessions' && (
        <SessionsSemestersView sessions={sessions} />
      )}

      {activeTab === 'timetable' && (
        <TimetableGrid slots={timetableSlots} />
      )}

      {/* Program Modal */}
      <ProgramModal
        isOpen={isProgramModalOpen}
        onClose={() => setIsProgramModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
