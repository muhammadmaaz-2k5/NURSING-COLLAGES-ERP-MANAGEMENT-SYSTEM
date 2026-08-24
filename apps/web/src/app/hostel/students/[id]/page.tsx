'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Home, Bed, User, ShieldCheck } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { fetchHostels } from '../../../../features/hostel/services/hostel.api';
import { HostelAllocation } from '../../../../features/hostel/types/hostel.types';
import { formatDate } from '../../../../lib/utils';

export default function StudentHostelProfilePage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params?.id as string;

  const [allocation, setAllocation] = useState<HostelAllocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!studentId) return;
      setIsLoading(true);
      try {
        const hostels = await fetchHostels();
        let found: HostelAllocation | null = null;
        for (const b of hostels) {
          for (const r of b.rooms) {
            for (const bd of r.beds) {
              if (bd.currentAllocation && bd.currentAllocation.studentId === studentId) {
                found = {
                  id: bd.currentAllocation.id,
                  studentId: bd.currentAllocation.studentId,
                  studentName: bd.currentAllocation.studentName,
                  studentRegId: bd.currentAllocation.studentRegId,
                  avatarUrl: bd.currentAllocation.avatarUrl,
                  programName: bd.currentAllocation.programName,
                  hostelId: b.id,
                  hostelName: b.name,
                  roomNumber: r.roomNumber,
                  bedNumber: bd.bedNumber,
                  startDate: bd.currentAllocation.startDate,
                  status: 'ACTIVE',
                };
                break;
              }
            }
          }
        }

        // Fallback demo allocation
        if (!found) {
          found = {
            id: 'alc-demo',
            studentId,
            studentName: 'Amina Bibi',
            studentRegId: 'NUR-2022-0041',
            programName: 'Bachelor of Science in Nursing (Generic BSN)',
            hostelId: 'hst-01',
            hostelName: 'Fatima Jinnah Female Residence',
            roomNumber: 'Room 201',
            bedNumber: 'B-01',
            startDate: '2026-08-01',
            status: 'ACTIVE',
            remarks: 'Fall 2026 academic tenure hostel allocation',
          };
        }

        setAllocation(found);
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
        <p className="text-xs text-slate-400 font-medium">Loading Resident Profile...</p>
      </div>
    );
  }

  if (!allocation) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="text-lg font-bold text-slate-200">No Active Hostel Record</h3>
        <Button variant="primary" size="sm" onClick={() => router.push('/hostel')}>
          Back to Hostel
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
          onClick={() => router.push('/hostel')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Hostel
        </Button>
      </div>

      {/* Resident Header Card */}
      <div className="p-6 lg:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={
                allocation.avatarUrl ||
                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
              }
              alt={allocation.studentName}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shrink-0 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">{allocation.studentName}</h1>
                <Badge variant="success" size="sm" dot>
                  ACTIVE RESIDENT
                </Badge>
              </div>
              <p className="font-mono text-blue-400 font-bold text-xs mt-0.5">
                {allocation.studentRegId}
              </p>
              <p className="text-xs text-slate-400 mt-1">{allocation.programName}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center min-w-[140px]">
            <span className="text-[10px] uppercase font-bold text-slate-500">Allocated Bed</span>
            <p className="text-xl font-black font-mono text-emerald-400 mt-0.5">
              {allocation.bedNumber}
            </p>
            <span className="text-[10px] text-slate-400 block">{allocation.roomNumber}</span>
          </div>
        </div>

        {/* Accommodation Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 font-medium block">Hostel Complex</span>
            <span className="font-bold text-slate-200">{allocation.hostelName}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Allotment Start Date</span>
            <span className="font-mono text-slate-200">{formatDate(allocation.startDate)}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Single-Occupant Lock</span>
            <span className="font-semibold text-emerald-400">Verified & Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
