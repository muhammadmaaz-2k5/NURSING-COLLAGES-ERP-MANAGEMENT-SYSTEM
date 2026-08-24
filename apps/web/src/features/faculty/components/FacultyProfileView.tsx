'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  Award,
  BookOpen,
  Stethoscope,
  Clock,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { FacultyMember } from '../types/faculty.types';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { WorkloadSummary } from './WorkloadSummary';
import { CourseAllocationTable } from './CourseAllocationTable';
import { TimetableGrid } from '../../academic/components/TimetableGrid';
import { formatDate } from '../../../lib/utils';

export interface FacultyProfileViewProps {
  faculty: FacultyMember;
}

type FacultyTab = 'overview' | 'workload' | 'courses' | 'schedule' | 'clinical';

export const FacultyProfileView: React.FC<FacultyProfileViewProps> = ({ faculty }) => {
  const [activeTab, setActiveTab] = useState<FacultyTab>('overview');

  const facultyTimetableSlots = [
    {
      id: 'fac-slot-1',
      classId: 'cls-1',
      dayOfWeek: 1,
      startTime: '08:30',
      endTime: '10:00',
      subjectName: 'Fundamentals of Nursing II',
      subjectCode: 'FON-102',
      facultyName: `${faculty.firstName} ${faculty.lastName || ''}`,
      roomName: 'Clinical Skills Lab 1',
      sectionName: 'BSN-SecA',
    },
    {
      id: 'fac-slot-2',
      classId: 'cls-2',
      dayOfWeek: 2,
      startTime: '08:30',
      endTime: '11:30',
      subjectName: 'Hospital Clinical Rotation (Cardiology)',
      subjectCode: 'CLIN-301',
      facultyName: `${faculty.firstName} ${faculty.lastName || ''}`,
      roomName: 'Teaching Hospital Ward 4',
      sectionName: 'BSN-SecA',
    },
    {
      id: 'fac-slot-3',
      classId: 'cls-3',
      dayOfWeek: 4,
      startTime: '11:00',
      endTime: '12:30',
      subjectName: 'Adult Health Nursing II',
      subjectCode: 'AHN-302',
      facultyName: `${faculty.firstName} ${faculty.lastName || ''}`,
      roomName: 'Lecture Hall 101',
      sectionName: 'BSN-SecA',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Profile Banner */}
      <div className="p-6 lg:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={
                  faculty.user.avatarUrl ||
                  'https://images.unsplash.com/photo-1594824813689-53697e887640?w=150'
                }
                alt={faculty.firstName}
                className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl object-cover border-2 border-blue-500/40 shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-white" />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black text-white">
                  {faculty.firstName} {faculty.lastName}
                </h1>
                <Badge variant="primary" size="sm">
                  {faculty.designation}
                </Badge>
                <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  {faculty.employeeId}
                </span>
              </div>

              <p className="text-xs lg:text-sm text-slate-300 font-medium">
                {faculty.department.name}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {faculty.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {faculty.phone || '+92-300-1122334'}
                </span>
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {faculty.campus?.name || 'Main Healthcare Campus'}
                </span>
              </div>
            </div>
          </div>

          {/* KPI Metrics */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center min-w-[100px]">
              <span className="text-[10px] uppercase font-bold text-slate-400">Assigned Load</span>
              <p
                className={`text-xl font-black mt-0.5 ${
                  faculty.workload.isOverloaded ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {faculty.workload.totalHours} CH
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center min-w-[100px]">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Courses</span>
              <p className="text-xl font-black text-blue-400 mt-0.5">
                {faculty.courseAllocations.length}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center min-w-[100px]">
              <span className="text-[10px] uppercase font-bold text-slate-400">Enrolled Students</span>
              <p className="text-xl font-black text-purple-400 mt-0.5">
                {faculty.workload.totalStudents}
              </p>
            </div>
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 mt-6 border-t border-slate-800/80 scrollbar-none">
          {[
            { id: 'overview' as const, label: 'Profile & Credentials', icon: User },
            { id: 'workload' as const, label: 'Workload Breakdown', icon: Clock },
            { id: 'courses' as const, label: 'Assigned Courses', icon: BookOpen, count: faculty.courseAllocations.length },
            { id: 'schedule' as const, label: 'Weekly Timetable', icon: Calendar },
            { id: 'clinical' as const, label: 'Clinical Supervision', icon: Stethoscope, count: faculty.supervisions.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
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
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 space-y-4">
            <CardHeader>
              <CardTitle className="text-base">Academic Qualifications & Credentials</CardTitle>
            </CardHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-medium">Highest Degree</span>
                <p className="font-bold text-slate-200">{faculty.qualification}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-medium">Clinical Specialization</span>
                <p className="font-bold text-blue-400">
                  {faculty.specialization || 'Clinical Nursing & Critical Care'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-medium">Date of Joining</span>
                <p className="font-bold text-slate-200">{formatDate(faculty.joiningDate)}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-medium">Department</span>
                <p className="font-bold text-purple-400">{faculty.department.name}</p>
              </div>
            </div>
          </Card>

          <Card className="space-y-4">
            <CardHeader>
              <CardTitle className="text-base">PNC & HEC Licensing</CardTitle>
            </CardHeader>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">PNC Faculty Registered</p>
                  <p className="text-[11px] text-emerald-400/80">Approved Clinical Supervisor License</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 flex items-start gap-2.5">
                <CheckCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">HEC Recognized Designation</p>
                  <p className="text-[11px] text-blue-400/80">Teaching & Research Approved</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'workload' && <WorkloadSummary workload={faculty.workload} />}

      {activeTab === 'courses' && <CourseAllocationTable allocations={faculty.courseAllocations} />}

      {activeTab === 'schedule' && <TimetableGrid slots={facultyTimetableSlots} />}

      {activeTab === 'clinical' && (
        <Card className="p-6 space-y-4">
          <CardHeader>
            <div>
              <CardTitle className="text-base">Hospital Clinical Supervision & Ward Rotations</CardTitle>
              <CardDescription>
                Supervision of nursing candidates across teaching hospital wards
              </CardDescription>
            </div>
          </CardHeader>

          {faculty.supervisions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {faculty.supervisions.map((sup) => (
                <div
                  key={sup.id}
                  className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <Badge variant="success" size="sm">
                      Active Rotation
                    </Badge>
                    <span className="font-mono text-xs font-bold text-blue-400">
                      {sup.activeStudents} Candidates
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">{sup.rotationName}</h4>
                  <p className="text-xs text-slate-400">
                    {sup.siteName} • {sup.wardName}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-500">
              No hospital clinical supervision assigned for current term.
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
