'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  Bus,
  MapPin,
  Clock,
  QrCode,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { fetchAssignments } from '../../../../features/transport/services/transport.api';
import { TransportAssignment } from '../../../../features/transport/types/transport.types';
import { formatDate } from '../../../../lib/utils';

export default function StudentBusPassProfilePage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params?.id as string;

  const [assignment, setAssignment] = useState<TransportAssignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!studentId) return;
      setIsLoading(true);
      try {
        const assignments = await fetchAssignments();
        const found =
          assignments.find((a) => a.studentId === studentId) || assignments[0];
        setAssignment(found || null);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [studentId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-xs text-slate-400 font-medium">Loading Student Bus Pass Profile...</p>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="text-lg font-bold text-slate-200">No Active Transport Pass</h3>
        <Button variant="primary" size="sm" onClick={() => router.push('/transport')}>
          Back to Transport
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/transport')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Transport
        </Button>
      </div>

      {/* Bus Pass Card */}
      <div className="p-6 lg:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={
                assignment.avatarUrl ||
                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
              }
              alt={assignment.studentName}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shrink-0 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">{assignment.studentName}</h1>
                <Badge variant="success" size="sm" dot>
                  ACTIVE BUS PASS
                </Badge>
              </div>
              <p className="font-mono text-blue-400 font-bold text-xs mt-0.5">
                {assignment.studentRegId}
              </p>
              <p className="text-xs text-slate-400 mt-1">{assignment.programName || 'Generic BSN'}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center min-w-[140px]">
            <span className="text-[10px] uppercase font-bold text-slate-500">Assigned Bus</span>
            <p className="text-xl font-black font-mono text-blue-400 mt-0.5">
              {assignment.vehicleRegNo}
            </p>
            <span className="text-[10px] text-slate-400 block">Transit Route</span>
          </div>
        </div>

        {/* Route Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 font-medium block">Route Title</span>
            <span className="font-bold text-slate-200">{assignment.routeName}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Designated Pickup Point</span>
            <span className="font-bold text-white">{assignment.stopName || 'Faizabad Terminal'}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Morning Scheduled Time</span>
            <span className="font-mono font-bold text-amber-400">
              {assignment.pickupTime || '07:20 AM'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
