'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  Bed,
  HeartPulse,
  Stethoscope,
  FileText,
  AlertTriangle,
  Phone,
  ShieldCheck,
  Calendar,
  Activity,
} from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { fetchPatientById } from '../../../../features/hospital/services/hospital.api';
import { Patient } from '../../../../features/hospital/types/hospital.types';
import { formatDate } from '../../../../lib/utils';

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params?.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!patientId) return;
      setIsLoading(true);
      try {
        const data = await fetchPatientById(patientId);
        setPatient(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [patientId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-xs text-slate-400 font-medium">Loading Patient Medical Record (EMR)...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="text-lg font-bold text-slate-200">Patient Record Not Found</h3>
        <Button variant="primary" size="sm" onClick={() => router.push('/hospital')}>
          Back to Hospital
        </Button>
      </div>
    );
  }

  const activeAdmission = patient.admissions?.find((a) => a.status === 'ACTIVE');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/hospital')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Hospital Directory
        </Button>
      </div>

      {/* Patient Demographic Banner */}
      <div className="p-6 lg:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={
                patient.avatarUrl ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
              }
              alt={patient.firstName}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shrink-0 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">
                  {patient.firstName} {patient.lastName || ''}
                </h1>
                <Badge variant={patient.status === 'ADMITTED' ? 'purple' : 'success'} size="sm" dot>
                  {patient.status}
                </Badge>
              </div>
              <p className="font-mono text-blue-400 font-bold text-xs mt-0.5">
                MRN: {patient.patientNo}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center min-w-[90px]">
              <span className="text-[10px] uppercase font-bold text-slate-500">Blood Group</span>
              <p className="text-xl font-bold text-rose-400 mt-0.5">{patient.bloodGroup || '—'}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center min-w-[90px]">
              <span className="text-[10px] uppercase font-bold text-slate-500">Gender</span>
              <p className="text-sm font-bold text-white mt-1.5">{patient.gender || '—'}</p>
            </div>
          </div>
        </div>

        {/* Demographic Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 font-medium block">Contact Phone</span>
            <span className="font-mono text-slate-200">{patient.phone || '—'}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">City / Address</span>
            <span className="text-slate-200">{patient.city || 'Islamabad'}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Emergency Contact</span>
            <span className="text-slate-200">{patient.emergencyContact || '—'}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Allergies & Contraindications</span>
            <span
              className={`font-semibold ${
                patient.allergies ? 'text-amber-400' : 'text-slate-500'
              }`}
            >
              {patient.allergies || 'No known allergies'}
            </span>
          </div>
        </div>
      </div>

      {/* Active Inpatient Admission Banner */}
      {activeAdmission && (
        <Card className="p-6 bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-indigo-950/40 border-purple-500/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <Badge variant="purple" size="sm">
                Active Inpatient Admission
              </Badge>
              <h3 className="text-lg font-bold text-white">
                Bed {activeAdmission.bedNumber} ({activeAdmission.wardName})
              </h3>
              <p className="text-xs text-purple-300 font-medium">
                Admitting Diagnosis: {activeAdmission.diagnosis || 'Clinical Observation'}
              </p>
              <p className="text-xs text-slate-400 font-mono pt-1">
                Admitted on: {formatDate(activeAdmission.admittedAt)}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/hospital')}
            >
              Manage Bed Allocation
            </Button>
          </div>
        </Card>
      )}

      {/* Medical History & Clinical Notes */}
      <Card className="p-6 space-y-4">
        <CardHeader className="pb-2">
          <div>
            <CardTitle className="text-base">Past Medical History & Comorbidities</CardTitle>
            <CardDescription>
              Chronic diseases, surgical history, and active medication regimens
            </CardDescription>
          </div>
        </CardHeader>

        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
          {patient.medicalHistory || 'No past surgical or chronic conditions recorded in EMR.'}
        </div>
      </Card>
    </div>
  );
}
