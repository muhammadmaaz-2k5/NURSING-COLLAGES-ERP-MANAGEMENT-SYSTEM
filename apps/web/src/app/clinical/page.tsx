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
} from 'lucide-react';
import { DataTable, Column } from '../../components/tables/DataTable';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ClinicalProgressRing } from '../../features/clinical/components/ClinicalProgressRing';
import { ClinicalSiteModal } from '../../features/clinical/components/ClinicalSiteModal';
import { RotationCreateModal } from '../../features/clinical/components/RotationCreateModal';
import { SkillVerificationModal } from '../../features/clinical/components/SkillVerificationModal';
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
            <p className="font-bold text-slate-100">{r.studentName}</p>
            <span className="font-mono text-blue-400 text-[11px]">{r.studentRegId}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Hospital & Ward Posting',
      sortable: true,
      cell: (r) => (
        <div>
          <p className="font-semibold text-slate-200">{r.siteName}</p>
          <p className="text-xs text-purple-400">
            {r.department} • {r.ward}
          </p>
        </div>
      ),
    },
    {
      header: 'Supervisor',
      accessorKey: 'facultyName',
      sortable: true,
      cell: (r) => <span className="text-slate-300 font-medium">{r.facultyName || 'Dr. Sarah Khan'}</span>,
    },
    {
      header: 'Term Duration',
      sortable: true,
      cell: (r) => (
        <div className="text-xs font-mono text-slate-400">
          <span>{formatDate(r.startDate)}</span>
          <span className="block text-slate-500">to {formatDate(r.endDate)}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (r) => (
        <Badge variant={r.status === 'ACTIVE' ? 'success' : 'neutral'} size="sm" dot>
          {r.status}
        </Badge>
      ),
    },
    {
      header: 'Action',
      cell: (r) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/clinical/student/${r.studentId}`)}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Clinical Portfolio
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Clinical Training & Nursing Logbook
            </h1>
            <Badge variant="success" size="sm">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              1,200 Hours PNC Requirement
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage hospital ward rotations, bedside procedural competencies, and authorized faculty supervisor verifications.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSiteModalOpen(true)}
            leftIcon={<Building2 className="w-4 h-4" />}
          >
            Add Hospital Site
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsRotationModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Assign Rotation
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Active Rotators
          </span>
          <h3 className="text-2xl font-black text-white mt-1">184</h3>
          <p className="text-xs text-emerald-400 mt-2 font-medium">Across 4 Teaching Units</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Partner Hospitals
          </span>
          <h3 className="text-2xl font-black text-white mt-1">3</h3>
          <p className="text-xs text-blue-400 mt-2 font-medium">Tertiary Clinical Sites</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Pending Sign-offs
          </span>
          <h3 className="text-2xl font-black text-amber-400 mt-1">4</h3>
          <p className="text-xs text-amber-300 mt-2 font-medium">Supervisor Queue</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Clinical Hours
          </span>
          <h3 className="text-2xl font-black text-purple-400 mt-1">24,500+</h3>
          <p className="text-xs text-purple-300 mt-2 font-medium">Recorded in Logbook</p>
        </Card>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {[
          { id: 'rotations' as const, label: 'Active Ward Rotations', icon: Stethoscope },
          { id: 'sites' as const, label: 'Hospital Partner Sites', icon: Building2, count: sites.length },
          { id: 'skills' as const, label: 'PNC Skills Catalog', icon: Award, count: skills.length },
          { id: 'supervisor' as const, label: 'Supervisor Sign-off Queue', icon: ShieldCheck, badge: `${pendingQueue.length} Pending` },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-amber-400'
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

      {/* 1. WARD ROTATIONS */}
      {activeTab === 'rotations' && (
        <Card className="p-6 space-y-4">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-lg">Clinical Rotation Roster</CardTitle>
              <CardDescription>
                Live hospital ward postings, shift timings, and student portfolios
              </CardDescription>
            </div>
          </CardHeader>

          <DataTable
            columns={rotationColumns}
            data={rotations}
            isLoading={isLoading}
            searchPlaceholder="Search by student, ward, or hospital..."
            pageSize={10}
            onRowClick={(r) => router.push(`/clinical/student/${r.studentId}`)}
          />
        </Card>
      )}

      {/* 2. PARTNER SITES */}
      {activeTab === 'sites' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sites.map((s) => (
            <Card key={s.id} hoverEffect className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Building2 className="w-6 h-6" />
                </div>
                <Badge variant="success" size="sm">
                  {s.type}
                </Badge>
              </div>

              <div>
                <h4 className="font-bold text-slate-100 text-base">{s.name}</h4>
                <p className="text-xs text-slate-400 mt-1">{s.address}, {s.city}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-300 space-y-1">
                <p className="text-[11px] text-slate-400">Contact Person:</p>
                <p className="font-semibold text-white">{s.contactPerson || 'Dr. Medical Superintendent'}</p>
                <p className="font-mono text-blue-400">{s.phone}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 3. SKILLS CATALOG */}
      {activeTab === 'skills' && (
        <Card className="p-6 space-y-4">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-lg">PNC Institutional Procedural Competencies</CardTitle>
              <CardDescription>
                Standardized surgical, critical care, and general nursing procedural requirements
              </CardDescription>
            </div>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skills.map((sk) => (
              <div
                key={sk.id}
                className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400">{sk.category}</span>
                  <Badge variant="purple" size="sm">
                    {sk.requiredAttempts} Required Attempts
                  </Badge>
                </div>
                <h4 className="font-bold text-slate-100 text-sm">{sk.name}</h4>
                <p className="text-xs text-slate-400">{sk.description}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 4. SUPERVISOR QUEUE */}
      {activeTab === 'supervisor' && (
        <Card className="p-6 space-y-6">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-lg">Pending Supervisor Clinical Sign-off Queue</CardTitle>
              <CardDescription>
                Bedside nursing skills submitted by candidates awaiting evaluator verification
              </CardDescription>
            </div>
          </CardHeader>

          {pendingQueue.length > 0 ? (
            <div className="divide-y divide-slate-800/60">
              {pendingQueue.map((item) => (
                <div
                  key={item.id}
                  className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={
                        item.avatarUrl ||
                        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
                      }
                      alt={item.studentName}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-100 text-sm">{item.skillName}</h4>
                        <Badge variant="purple" size="sm">
                          Attempt #{item.attemptNumber}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Candidate: <strong className="text-slate-200">{item.studentName}</strong> (
                        {item.studentRegId}) • {item.wardName}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setSelectedVerification(item);
                      setIsVerifyModalOpen(true);
                    }}
                    leftIcon={<ShieldCheck className="w-4 h-4" />}
                  >
                    Evaluate & Sign
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-slate-500">
              All student logbook procedure attempts have been verified. No pending sign-offs.
            </div>
          )}
        </Card>
      )}

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

      <SkillVerificationModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        item={selectedVerification}
        onSuccess={loadData}
      />
    </div>
  );
}
