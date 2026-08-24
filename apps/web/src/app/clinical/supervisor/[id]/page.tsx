'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  Clock,
  Award,
} from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { SkillVerificationModal } from '../../../../features/clinical/components/SkillVerificationModal';
import { fetchSupervisorDashboard } from '../../../../features/clinical/services/clinical.api';
import {
  SupervisorDashboardData,
  SupervisorPendingVerification,
} from '../../../../features/clinical/types/clinical.types';

export default function SupervisorWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const supervisorId = params?.id as string;

  const [data, setData] = useState<SupervisorDashboardData | null>(null);
  const [selectedVerification, setSelectedVerification] =
    useState<SupervisorPendingVerification | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    if (!supervisorId) return;
    setIsLoading(true);
    try {
      const res = await fetchSupervisorDashboard(supervisorId);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [supervisorId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-xs text-slate-400 font-medium">Loading Supervisor Workspace...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="text-lg font-bold text-slate-200">Supervisor Record Not Found</h3>
        <Button variant="primary" size="sm" onClick={() => router.push('/clinical')}>
          Back to Clinical Command Center
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/clinical')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Clinical Center
        </Button>
      </div>

      {/* Header Banner */}
      <div className="p-6 lg:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">{data.supervisorName}</h1>
              <Badge variant="success" size="sm">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                Licensed PNC Supervisor
              </Badge>
            </div>
            <p className="text-xs text-slate-400">
              Authorized clinical verification and hospital bedside assessment deck
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center min-w-[90px]">
              <span className="text-[10px] uppercase font-bold text-slate-400">Rotators</span>
              <p className="text-xl font-bold text-white mt-0.5">{data.assignedRotatorsCount}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/20 text-center min-w-[90px]">
              <span className="text-[10px] uppercase font-bold text-amber-400">Pending</span>
              <p className="text-xl font-bold text-amber-400 mt-0.5">
                {data.pendingVerificationsCount}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-center min-w-[90px]">
              <span className="text-[10px] uppercase font-bold text-emerald-400">Verified</span>
              <p className="text-xl font-bold text-emerald-400 mt-0.5">
                {data.verifiedThisMonthCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Queue Card */}
      <Card className="p-6 space-y-4">
        <CardHeader className="pb-2">
          <div>
            <CardTitle className="text-base">Bedside Procedures Awaiting Sign-off</CardTitle>
            <CardDescription>
              Authorize procedural attempts recorded by nursing candidates in your assigned hospital wards
            </CardDescription>
          </div>
        </CardHeader>

        {data.pendingQueue.length > 0 ? (
          <div className="divide-y divide-slate-800/60">
            {data.pendingQueue.map((item) => (
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
                  Verify Skill
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-xs text-slate-500">
            All procedural skills have been evaluated. No pending verifications.
          </div>
        )}
      </Card>

      {/* Modal */}
      <SkillVerificationModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        item={selectedVerification}
        onSuccess={loadData}
      />
    </div>
  );
}
