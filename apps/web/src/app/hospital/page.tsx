'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Activity,
  Bed,
  Users,
  Calendar,
  Clock,
  Plus,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Building2,
  FileText,
} from 'lucide-react';
import { DataTable, Column } from '../../components/tables/DataTable';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { WardOccupancyGrid } from '../../features/hospital/components/WardOccupancyGrid';
import { PatientRegistrationModal } from '../../features/hospital/components/PatientRegistrationModal';
import { AdmissionModal } from '../../features/hospital/components/AdmissionModal';
import { BedTransferModal } from '../../features/hospital/components/BedTransferModal';
import { DischargeModal } from '../../features/hospital/components/DischargeModal';
import { OPDTokenModal } from '../../features/hospital/components/OPDTokenModal';
import { ConsultationModal } from '../../features/hospital/components/ConsultationModal';
import {
  fetchHospitalProfile,
  fetchHospitalWards,
  fetchPatients,
  fetchAppointments,
} from '../../features/hospital/services/hospital.api';
import {
  HospitalProfile,
  HospitalWard,
  HospitalBed,
  Patient,
  Appointment,
} from '../../features/hospital/types/hospital.types';
import { formatDate } from '../../lib/utils';

type HospitalTab = 'wards' | 'opd' | 'patients' | 'consultations';

export default function HospitalPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<HospitalTab>('wards');
  const [profile, setProfile] = useState<HospitalProfile | null>(null);
  const [wards, setWards] = useState<HospitalWard[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const [isOPDModalOpen, setIsOPDModalOpen] = useState(false);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState<HospitalBed | null>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isDischargeModalOpen, setIsDischargeModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [profRes, wRes, patRes, appRes] = await Promise.all([
        fetchHospitalProfile(),
        fetchHospitalWards(),
        fetchPatients(),
        fetchAppointments(),
      ]);
      setProfile(profRes);
      setWards(wRes);
      setPatients(patRes.data);
      setAppointments(appRes);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const patientColumns: Column<Patient>[] = [
    {
      header: 'MRN & Patient Name',
      accessorKey: 'firstName',
      sortable: true,
      cell: (p) => (
        <div className="flex items-center gap-3">
          <img
            src={p.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
            alt={p.firstName}
            className="w-8 h-8 rounded-lg object-cover border border-slate-700 shrink-0"
          />
          <div>
            <p className="font-bold text-slate-100">
              {p.firstName} {p.lastName || ''}
            </p>
            <span className="font-mono text-blue-400 text-xs font-semibold">{p.patientNo}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Demographics',
      sortable: true,
      cell: (p) => (
        <div className="text-xs text-slate-300">
          <p>{p.gender || 'Unknown'} • {p.bloodGroup || '—'}</p>
          <span className="text-slate-500 font-mono">{p.phone || '—'}</span>
        </div>
      ),
    },
    {
      header: 'City / Location',
      accessorKey: 'city',
      sortable: true,
      cell: (p) => <span className="text-slate-400 text-xs">{p.city || 'Islamabad'}</span>,
    },
    {
      header: 'Allergies / Flags',
      accessorKey: 'allergies',
      cell: (p) => (
        <span className={`text-xs ${p.allergies ? 'text-amber-400 font-semibold' : 'text-slate-500'}`}>
          {p.allergies || 'None recorded'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (p) => (
        <Badge variant={p.status === 'ADMITTED' ? 'purple' : 'success'} size="sm" dot>
          {p.status}
        </Badge>
      ),
    },
    {
      header: 'Action',
      cell: (p) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/hospital/patients/${p.id}`)}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          EMR Chart
        </Button>
      ),
    },
  ];

  const appointmentColumns: Column<Appointment>[] = [
    {
      header: 'Token #',
      accessorKey: 'tokenNumber',
      sortable: true,
      cell: (a) => (
        <span className="font-mono font-black text-sm text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
          #{a.tokenNumber}
        </span>
      ),
    },
    {
      header: 'Patient Details',
      accessorKey: 'patientName',
      sortable: true,
      cell: (a) => (
        <div>
          <p className="font-bold text-slate-100">{a.patientName}</p>
          <span className="font-mono text-xs text-slate-400">{a.patientNo}</span>
        </div>
      ),
    },
    {
      header: 'Doctor & Department',
      accessorKey: 'doctorName',
      sortable: true,
      cell: (a) => (
        <div>
          <p className="font-semibold text-slate-200">{a.doctorName}</p>
          <span className="text-xs text-purple-400">{a.departmentName}</span>
        </div>
      ),
    },
    {
      header: 'Reason / Complaint',
      accessorKey: 'reason',
      cell: (a) => <span className="text-xs text-slate-300">{a.reason || 'General Checkup'}</span>,
    },
    {
      header: 'Queue Status',
      accessorKey: 'status',
      cell: (a) => (
        <Badge
          variant={
            a.status === 'IN_CONSULTATION'
              ? 'purple'
              : a.status === 'WAITING'
              ? 'warning'
              : 'success'
          }
          size="sm"
          dot
        >
          {a.status}
        </Badge>
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
              Hospital, OPD, IPD & Bed Management
            </h1>
            <Badge variant="primary" size="sm">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-blue-400" />
              Clinical EMR & Inpatient Core
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage outpatient token queues, inpatient admissions, real-time visual bed matrices, and electronic medical records.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPatientModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Register Patient
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOPDModalOpen(true)}
            leftIcon={<Clock className="w-4 h-4" />}
          >
            Issue OPD Token
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setSelectedBed(null);
              setIsAdmissionModalOpen(true);
            }}
            leftIcon={<Bed className="w-4 h-4" />}
          >
            Admit Patient
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Patients Registered
          </span>
          <h3 className="text-2xl font-black text-white mt-1">
            {profile?.totalPatients || '2,450'}
          </h3>
          <p className="text-xs text-blue-400 mt-2 font-medium">Electronic Medical Records</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            OPD Tokens Today
          </span>
          <h3 className="text-2xl font-black text-amber-400 mt-1">
            {profile?.opdTodayCount || 142}
          </h3>
          <p className="text-xs text-amber-300 mt-2 font-medium">Active Outpatient Flow</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            IPD Inpatient Admissions
          </span>
          <h3 className="text-2xl font-black text-rose-400 mt-1">
            {profile?.activeAdmissionsCount || 86}
          </h3>
          <p className="text-xs text-rose-300 mt-2 font-medium">Occupying Ward Beds</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Bed Occupancy Rate
          </span>
          <h3 className="text-2xl font-black text-emerald-400 mt-1">
            {profile?.occupancyRate || 71.6}%
          </h3>
          <p className="text-xs text-emerald-300 mt-2 font-medium">
            {profile?.availableBeds || 34} Beds Currently Available
          </p>
        </Card>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {[
          { id: 'wards' as const, label: 'Wards & Bed Occupancy Matrix', icon: Bed },
          { id: 'opd' as const, label: 'OPD Token Queue', icon: Clock, count: appointments.length },
          { id: 'patients' as const, label: 'Patient EMR Directory', icon: Users, count: patients.length },
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

      {/* Tab Panels */}

      {/* 1. WARDS & BED OCCUPANCY MATRIX */}
      {activeTab === 'wards' && (
        <WardOccupancyGrid
          wards={wards}
          onAdmitToBed={(bed) => {
            setSelectedBed(bed);
            setIsAdmissionModalOpen(true);
          }}
          onTransferBed={(bed) => {
            setSelectedBed(bed);
            setIsTransferModalOpen(true);
          }}
          onDischargeBed={(bed) => {
            setSelectedBed(bed);
            setIsDischargeModalOpen(true);
          }}
        />
      )}

      {/* 2. OPD TOKEN QUEUE */}
      {activeTab === 'opd' && (
        <Card className="p-6 space-y-4">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-lg">Live OPD Consultation Roster</CardTitle>
              <CardDescription>
                Real-time patient queue for active clinical consultation chambers
              </CardDescription>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsConsultModalOpen(true)}
              leftIcon={<Stethoscope className="w-4 h-4" />}
            >
              Record Doctor Consultation
            </Button>
          </CardHeader>

          <DataTable
            columns={appointmentColumns}
            data={appointments}
            isLoading={isLoading}
            searchPlaceholder="Search token #, patient name, or doctor..."
            pageSize={10}
          />
        </Card>
      )}

      {/* 3. PATIENT DIRECTORY */}
      {activeTab === 'patients' && (
        <Card className="p-6 space-y-4">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-lg">Electronic Medical Records (EMR) Directory</CardTitle>
              <CardDescription>
                Search patients by MRN, name, phone, or clinical allergy flags
              </CardDescription>
            </div>
          </CardHeader>

          <DataTable
            columns={patientColumns}
            data={patients}
            isLoading={isLoading}
            searchPlaceholder="Search by MRN, patient name, or contact..."
            pageSize={10}
            onRowClick={(p) => router.push(`/hospital/patients/${p.id}`)}
          />
        </Card>
      )}

      {/* Modals */}
      <PatientRegistrationModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSuccess={loadData}
      />

      <AdmissionModal
        isOpen={isAdmissionModalOpen}
        onClose={() => setIsAdmissionModalOpen(false)}
        selectedBed={selectedBed}
        onSuccess={loadData}
      />

      <BedTransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        bed={selectedBed}
        onSuccess={loadData}
      />

      <DischargeModal
        isOpen={isDischargeModalOpen}
        onClose={() => setIsDischargeModalOpen(false)}
        bed={selectedBed}
        onSuccess={loadData}
      />

      <OPDTokenModal
        isOpen={isOPDModalOpen}
        onClose={() => setIsOPDModalOpen(false)}
        onSuccess={loadData}
      />

      <ConsultationModal
        isOpen={isConsultModalOpen}
        onClose={() => setIsConsultModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
