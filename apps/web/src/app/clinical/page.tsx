'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Stethoscope,
  Building2,
  Users,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Plus,
  ArrowRight,
  Sparkles,
  Award,
  Check,
  FileCheck,
} from 'lucide-react';
import { DataTable, Column } from '../../components/tables/DataTable';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { RoleGate } from '../../components/auth/RoleGate';
import { ClinicalProgressRing } from '../../features/clinical/components/ClinicalProgressRing';
import { ClinicalSiteModal } from '../../features/clinical/components/ClinicalSiteModal';
import { RotationCreateModal } from '../../features/clinical/components/RotationCreateModal';
import { SkillVerificationModal } from '../../features/clinical/components/SkillVerificationModal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  fetchClinicalSites,
  fetchClinicalRotations,
  fetchNursingSkills,
  fetchSupervisorDashboard,
} from '../../features/clinical/services/clinical.api';
import {
  ClinicalSite,
  ClinicalRotation,
  NursingSkill,
  SupervisorPendingVerification,
} from '../../features/clinical/types/clinical.types';
import { formatDate } from '../../lib/utils';

type ClinicalTab = 'rotations' | 'sites' | 'skills' | 'supervisor';

export default function ClinicalPage() {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const isStudent = user?.role === 'STUDENT';
  const studentName = user?.name || 'Amina Bibi';

  const [activeTab, setActiveTab] = useState<ClinicalTab>('rotations');
  const [rotations, setRotations] = useState<ClinicalRotation[]>([]);
  const [sites, setSites] = useState<ClinicalSite[]>([]);
  const [skills, setSkills] = useState<NursingSkill[]>([]);
  const [pendingQueue, setPendingQueue] = useState<SupervisorPendingVerification[]>([]);
  const [selectedVerification, setSelectedVerification] =
    useState<SupervisorPendingVerification | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSiteModalOpen, setIsSiteModalOpen] = useState(false);
  const [isRotationModalOpen, setIsRotationModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [rRes, sRes, skRes, supRes] = await Promise.all([
        fetchClinicalRotations(),
        fetchClinicalSites(),
        fetchNursingSkills(),
        fetchSupervisorDashboard('fac-01'),
      ]);
      setRotations(rRes.data);
      setSites(sRes);
      setSkills(skRes);
      setPendingQueue(supRes.pendingQueue);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const studentSkills = [
    { code: 'SKL-01', name: 'IV Cannulation & Fluid Infusion', requiredCount: 20, completedCount: 20, status: 'VERIFIED', supervisor: 'Sister Farida Bano' },
    { code: 'SKL-02', name: 'Foley Catheterization & Urethral Care', requiredCount: 15, completedCount: 15, status: 'VERIFIED', supervisor: 'Sister Farida Bano' },
    { code: 'SKL-03', name: 'Nasogastric Tube (NGT) Insertion', requiredCount: 10, completedCount: 8, status: 'IN_PROGRESS', supervisor: 'Dr. Tariq Mahmood' },
    { code: 'SKL-04', name: 'Adult CPR & Basic Life Support (BLS)', requiredCount: 10, completedCount: 10, status: 'VERIFIED', supervisor: 'Sister Farida Bano' },
    { code: 'SKL-05', name: 'Surgical Wound Dressing & Aseptic Care', requiredCount: 25, completedCount: 22, status: 'IN_PROGRESS', supervisor: 'Dr. Sarah Ahmed' },
    { code: 'SKL-06', name: '12-Lead Electrocardiogram (ECG) Recording', requiredCount: 15, completedCount: 15, status: 'VERIFIED', supervisor: 'Sister Farida Bano' },
  ];

  // STUDENT VIEW
  if (isStudent) {
    return (
      <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
        {/* Header Banner */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                My PNC Clinical Skills & Bedside Logbook
              </h1>
              <Badge variant="purple" size="sm">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" />
                1200 Hours PNC Mandate
              </Badge>
            </div>
            <p className="text-xs text-slate-300">
              Student: <span className="font-bold text-white">{studentName}</span> (NUR-2022-0041) • Assigned Preceptor: <span className="text-blue-400 font-semibold">Sister Farida Bano</span>
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => toast.success('Logbook Entry', 'Opening clinical procedure entry form...')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Log Bedside Procedure
          </Button>
        </div>

        {/* Clinical Hours KPI Deck */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card hoverEffect className="p-5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Clinical Hours
            </span>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">840 / 1200h</h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">70.0% Completed</p>
          </Card>

          <Card hoverEffect className="p-5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active Ward Posting
            </span>
            <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">ICU Ward</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">Teaching Hospital Bed 1-12</p>
          </Card>

          <Card hoverEffect className="p-5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Verified Procedures
            </span>
            <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">90 / 95</h3>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 font-medium">94.7% Competency Rate</p>
          </Card>

          <Card hoverEffect className="p-5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Supervisor Sign-off
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">Certified</h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">Logbook Up-to-Date</p>
          </Card>
        </div>

        {/* Procedural Competency Matrix */}
        <Card className="p-6 space-y-4">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">PNC Core Bedside Nursing Procedures</CardTitle>
                <CardDescription>Verified clinical competencies stamped by hospital supervisors</CardDescription>
              </div>
              <Badge variant="success" size="sm">
                Logbook Verified
              </Badge>
            </div>
          </CardHeader>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-3.5">Procedure Code & Title</th>
                  <th className="p-3.5 text-center">Required Count</th>
                  <th className="p-3.5 text-center">Completed</th>
                  <th className="p-3.5">Verified By (Preceptor)</th>
                  <th className="p-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {studentSkills.map((sk) => (
                  <tr key={sk.code} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900 dark:text-slate-100">{sk.name}</p>
                      <span className="font-mono text-blue-600 dark:text-blue-400 text-[11px]">{sk.code}</span>
                    </td>
                    <td className="p-3.5 text-center font-mono text-slate-500">{sk.requiredCount} times</td>
                    <td className="p-3.5 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {sk.completedCount} / {sk.requiredCount}
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400 font-medium">{sk.supervisor}</td>
                    <td className="p-3.5 text-right">
                      <Badge variant={sk.status === 'VERIFIED' ? 'success' : 'primary'} size="xs">
                        {sk.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }

  // FACULTY & ADMIN VIEW
  const rotationColumns: Column<ClinicalRotation>[] = [
    {
      header: 'Nursing Candidate',
      accessorKey: 'studentName',
      sortable: true,
      cell: (r) => (
        <div className="flex items-center gap-3">
          <img
            src={r.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'}
            alt={r.studentName}
            className="w-8 h-8 rounded-lg object-cover border border-slate-700 shrink-0"
          />
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">{r.studentName}</p>
            <span className="font-mono text-blue-600 dark:text-blue-400 text-[11px]">{r.studentRegId}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Hospital & Ward Posting',
      accessorKey: 'siteName',
      sortable: true,
      cell: (r) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs">{r.siteName}</p>
          <span className="text-slate-500 text-[11px]">{r.ward || r.department || 'Ward Duty'}</span>
        </div>
      ),
    },
    {
      header: 'Duration Schedule',
      accessorKey: 'startDate',
      sortable: true,
      cell: (r) => (
        <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
          {formatDate(r.startDate)} - {formatDate(r.endDate)}
        </span>
      ),
    },
    {
      header: 'Clinical Preceptor',
      accessorKey: 'facultyName',
      sortable: true,
      cell: (r) => <span className="text-xs text-slate-600 dark:text-slate-400">{r.facultyName || 'Sister Farida Bano'}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (r) => (
        <Badge variant={r.status === 'ACTIVE' ? 'success' : 'neutral'} size="sm">
          {r.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Clinical & Nursing Practicum Governance
            </h1>
            <Badge variant="purple" size="sm">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              PNC 1200h Mandate Active
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Supervise bedside hospital ward rotations, verify student procedural competencies, and monitor hours.
          </p>
        </div>

        <RoleGate roles={['SUPER_ADMIN', 'COLLEGE_ADMIN']}>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsSiteModalOpen(true)}
              leftIcon={<Building2 className="w-4 h-4" />}
            >
              Add Hospital Site
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsRotationModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Assign Rotation
            </Button>
          </div>
        </RoleGate>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Active Rotations
          </span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{rotations.length || 24}</h3>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium">Teaching Hospital Wards</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Hospital Sites
          </span>
          <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">{sites.length || 3}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">Affiliated Teaching Centers</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Pending Log Verifications
          </span>
          <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{pendingQueue.length || 6}</h3>
          <p className="text-xs text-amber-500 dark:text-amber-300 mt-2 font-medium">Supervisor Sign-offs Needed</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Avg. Logbook Hours
          </span>
          <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">840h</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">70% PNC Completion</p>
        </Card>
      </div>

      {/* Main Rotations DataTable */}
      <Card className="p-6 space-y-4">
        <CardHeader className="pb-2">
          <div>
            <CardTitle className="text-lg">Active Clinical Rotations</CardTitle>
            <CardDescription>Monitor bedside shift postings and supervisor sign-offs</CardDescription>
          </div>
        </CardHeader>

        <DataTable
          columns={rotationColumns}
          data={rotations}
          isLoading={isLoading}
          searchPlaceholder="Search candidates by name or hospital site..."
          pageSize={10}
        />
      </Card>

      {/* Modals */}
      <ClinicalSiteModal
        isOpen={isSiteModalOpen}
        onClose={() => setIsSiteModalOpen(false)}
        onSuccess={loadData}
      />

      <RotationCreateModal
        isOpen={isRotationModalOpen}
        onClose={() => setIsRotationModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
