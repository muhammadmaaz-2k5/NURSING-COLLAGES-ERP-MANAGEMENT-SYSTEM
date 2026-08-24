'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileCheck, CheckCircle2, XCircle, Clock, ExternalLink } from 'lucide-react';
import { DataTable, Column } from '../../../components/tables/DataTable';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { fetchAdmissions } from '../../../features/portal/services/portal.api';
import { AdmissionApplication } from '../../../features/portal/types/portal.types';
import { formatDate } from '../../../lib/utils';
import { useToast } from '../../../context/ToastContext';

export default function AdmissionsPage() {
  const router = useRouter();
  const toast = useToast();
  const [admissions, setAdmissions] = useState<AdmissionApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdmissions();
      setAdmissions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDecision = (id: string, status: string) => {
    toast.success('Application Updated', `Status changed to ${status}.`);
  };

  const columns: Column<AdmissionApplication>[] = [
    {
      header: 'Applicant & Ref #',
      accessorKey: 'firstName',
      sortable: true,
      cell: (adm) => (
        <div>
          <p className="font-bold text-slate-100">
            {adm.firstName} {adm.lastName || ''}
          </p>
          <span className="font-mono text-blue-400 text-xs font-bold">{adm.referenceNo}</span>
        </div>
      ),
    },
    {
      header: 'Selected Degree Program',
      accessorKey: 'programName',
      sortable: true,
      cell: (adm) => (
        <span className="text-xs text-slate-200 font-semibold">{adm.programName}</span>
      ),
    },
    {
      header: 'FSc Merit Score',
      accessorKey: 'percentage',
      sortable: true,
      cell: (adm) => (
        <div className="font-mono text-xs">
          <span className="font-bold text-emerald-400 text-sm">{adm.percentage}%</span>
          <span className="text-slate-500 block text-[10px]">
            {adm.marksObtained} / {adm.totalMarks}
          </span>
        </div>
      ),
    },
    {
      header: 'Contact Info',
      cell: (adm) => (
        <div className="text-xs font-mono text-slate-400">
          <div>{adm.email}</div>
          <div>{adm.phone}</div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (adm) => (
        <Badge
          variant={
            adm.status === 'APPROVED'
              ? 'success'
              : adm.status === 'UNDER_REVIEW'
              ? 'warning'
              : 'neutral'
          }
          size="sm"
          dot
        >
          {adm.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      cell: (adm) =>
        adm.status === 'UNDER_REVIEW' ? (
          <div className="flex items-center gap-1.5">
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleDecision(adm.id, 'APPROVED')}
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
            >
              Approve
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDecision(adm.id, 'REJECTED')}
              leftIcon={<XCircle className="w-3.5 h-3.5" />}
            >
              Reject
            </Button>
          </div>
        ) : (
          <span className="text-slate-500 text-xs">Evaluated</span>
        ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/portal')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Portal Command Center
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/portal/apply')}
          leftIcon={<ExternalLink className="w-4 h-4" />}
        >
          Public Application Form
        </Button>
      </div>

      <Card className="p-6 space-y-4">
        <CardHeader className="pb-2">
          <div>
            <CardTitle className="text-lg">Online Admission Application Intake</CardTitle>
            <CardDescription>
              Review prospective student applications, merit marks, CNIC, and admission decisions
            </CardDescription>
          </div>
        </CardHeader>

        <DataTable
          columns={columns}
          data={admissions}
          isLoading={isLoading}
          searchPlaceholder="Search applicants by name, ref, or email..."
          pageSize={10}
        />
      </Card>
    </div>
  );
}
