'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Users,
  BookOpen,
  Clock,
  AlertTriangle,
  Plus,
  ArrowRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { DataTable, Column } from '../../components/tables/DataTable';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { FacultyModal } from '../../features/faculty/components/FacultyModal';
import { fetchFaculty } from '../../features/faculty/services/faculty.api';
import { FacultyMember } from '../../features/faculty/types/faculty.types';

export default function FacultyPage() {
  const router = useRouter();
  const [facultyList, setFacultyList] = useState<FacultyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<string>('ALL');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchFaculty();
      setFacultyList(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredFaculty =
    selectedDept === 'ALL'
      ? facultyList
      : facultyList.filter((f) => f.department.id === selectedDept);

  const columns: Column<FacultyMember>[] = [
    {
      header: 'Employee ID',
      accessorKey: 'employeeId',
      sortable: true,
      cell: (f) => (
        <span className="font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
          {f.employeeId}
        </span>
      ),
    },
    {
      header: 'Faculty Member',
      accessorKey: 'firstName',
      sortable: true,
      cell: (f) => (
        <div>
          <p className="font-bold text-slate-100">
            {f.firstName} {f.lastName}
          </p>
          <p className="text-xs text-slate-400">{f.email}</p>
        </div>
      ),
    },
    {
      header: 'Designation & Qualifications',
      sortable: true,
      cell: (f) => (
        <div>
          <p className="font-semibold text-slate-200 text-xs">{f.designation}</p>
          <p className="text-[11px] text-purple-400">{f.qualification}</p>
        </div>
      ),
    },
    {
      header: 'Department',
      accessorKey: 'department',
      sortable: true,
      cell: (f) => <span className="text-slate-300 font-medium">{f.department.name}</span>,
    },
    {
      header: 'Weekly Workload',
      sortable: true,
      cell: (f) => (
        <div className="flex items-center gap-2">
          <span
            className={`font-mono font-bold ${
              f.workload.isOverloaded ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {f.workload.totalHours} CH
          </span>
          {f.workload.isOverloaded && (
            <Badge variant="danger" size="sm">
              Overload
            </Badge>
          )}
        </div>
      ),
    },
    {
      header: 'Action',
      cell: (f) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/faculty/${f.id}`)}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          View Profile
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Faculty & Instructional Mentors
            </h1>
            <Badge variant="primary" size="sm">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-blue-400" />
              PNC Certified Supervisors
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage academic appointments, teaching workloads, course allocations, and hospital clinical supervision.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Register Faculty
        </Button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Faculty
          </span>
          <h3 className="text-2xl font-black text-white mt-1">38</h3>
          <p className="text-xs text-blue-400 mt-2 font-medium">Full-time & Clinical</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Active Instructors
          </span>
          <h3 className="text-2xl font-black text-white mt-1">38</h3>
          <p className="text-xs text-emerald-400 mt-2 font-medium">100% Active Deployment</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Average Weekly Load
          </span>
          <h3 className="text-2xl font-black text-white mt-1">15.6 CH</h3>
          <p className="text-xs text-purple-400 mt-2 font-medium">Theory & Clinical Load</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Overload Alerts
          </span>
          <h3 className="text-2xl font-black text-rose-400 mt-1">1</h3>
          <p className="text-xs text-rose-300 mt-2 font-medium">&gt; 18 CH Weekly Limit</p>
        </Card>
      </div>

      {/* Directory DataTable */}
      <Card className="p-6 space-y-4">
        <CardHeader className="pb-2">
          <div>
            <CardTitle className="text-lg">Faculty Roster</CardTitle>
            <CardDescription>
              Click any faculty instructor to inspect credentials, workload, and courses
            </CardDescription>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/60 border border-slate-800">
            {[
              { id: 'ALL', label: 'All Departments' },
              { id: 'dept-01', label: 'Nursing & Clinical' },
              { id: 'dept-02', label: 'Allied Health' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDept(d.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedDept === d.id
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </CardHeader>

        <DataTable
          columns={columns}
          data={filteredFaculty}
          isLoading={isLoading}
          searchPlaceholder="Search faculty by name, ID, or designation..."
          pageSize={10}
          onRowClick={(f) => router.push(`/faculty/${f.id}`)}
        />
      </Card>

      {/* Faculty Creation Modal */}
      <FacultyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
