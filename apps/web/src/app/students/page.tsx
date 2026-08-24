'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  GraduationCap,
  Stethoscope,
  Plus,
  ArrowRight,
  Filter,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { DataTable, Column } from '../../components/tables/DataTable';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { StudentAdmissionModal } from '../../features/students/components/StudentAdmissionModal';
import { fetchStudents } from '../../features/students/services/students.api';
import { StudentSummaryItem, StudentStatus } from '../../features/students/types/students.types';

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<StudentSummaryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchStudents();
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredStudents =
    selectedStatus === 'ALL'
      ? students
      : students.filter((s) => s.status === selectedStatus);

  const columns: Column<StudentSummaryItem>[] = [
    {
      header: 'Reg ID',
      accessorKey: 'studentId',
      sortable: true,
      cell: (s) => (
        <span className="font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
          {s.studentId}
        </span>
      ),
    },
    {
      header: 'Student Name',
      accessorKey: 'firstName',
      sortable: true,
      cell: (s) => (
        <div>
          <p className="font-bold text-slate-100">
            {s.firstName} {s.lastName}
          </p>
          <p className="text-xs text-slate-400">{s.email}</p>
        </div>
      ),
    },
    {
      header: 'Program / Major',
      accessorKey: 'program',
      sortable: true,
      cell: (s) => <span className="text-slate-300 font-medium">{s.program?.name}</span>,
    },
    {
      header: 'Level',
      accessorKey: 'currentSemester',
      sortable: true,
      cell: (s) => <span className="font-semibold text-slate-300">Semester {s.currentSemester || 6}</span>,
    },
    {
      header: 'CGPA',
      accessorKey: 'cgpa',
      sortable: true,
      cell: (s) => (
        <span className="font-bold text-emerald-400 font-mono">
          {s.cgpa ? s.cgpa.toFixed(2) : '3.80'}
        </span>
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
          size="sm"
          dot
        >
          {s.status}
        </Badge>
      ),
    },
    {
      header: 'Action',
      cell: (s) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/students/${s.id}`)}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          360° Profile
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Student Lifecycle Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage student registrations, academic cohorts, and complete 360° profiles
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsAdmissionOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Admit New Student
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card hoverEffect className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Enrolled Students
              </span>
              <h3 className="text-2xl font-black text-white mt-1">450</h3>
            </div>
            <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-emerald-400 mt-3 flex items-center gap-1 font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            98.5% Active Enrollment
          </p>
        </Card>

        <Card hoverEffect className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Generic BSN Degree (4-Yr)
              </span>
              <h3 className="text-2xl font-black text-white mt-1">360</h3>
            </div>
            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3 font-medium">8 Co-ed Academic Semesters</p>
        </Card>

        <Card hoverEffect className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Active Clinical Practicum
              </span>
              <h3 className="text-2xl font-black text-white mt-1">184</h3>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Stethoscope className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-purple-400 mt-3 font-medium">Hospital Wards Allotted</p>
        </Card>
      </div>

      {/* Directory Table with Status Filter */}
      <Card className="p-6 space-y-4">
        <CardHeader className="pb-2">
          <div>
            <CardTitle className="text-lg">Student Roster</CardTitle>
            <CardDescription>
              Click any student row to view full 360-degree academic & clinical history
            </CardDescription>
          </div>

          {/* Filter Status Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/60 border border-slate-800">
            {['ALL', 'ACTIVE', 'GRADUATED'].map((st) => (
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
          columns={columns}
          data={filteredStudents}
          isLoading={isLoading}
          searchPlaceholder="Search student by name, ID, or program..."
          pageSize={10}
          onRowClick={(s) => router.push(`/students/${s.id}`)}
        />
      </Card>

      {/* Admission Modal */}
      <StudentAdmissionModal
        isOpen={isAdmissionOpen}
        onClose={() => setIsAdmissionOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
