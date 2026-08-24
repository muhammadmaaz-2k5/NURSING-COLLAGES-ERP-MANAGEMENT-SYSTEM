'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Bed, Building2 } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { WardOccupancyGrid } from '../../../../features/hospital/components/WardOccupancyGrid';
import { fetchHospitalWards } from '../../../../features/hospital/services/hospital.api';
import { HospitalWard } from '../../../../features/hospital/types/hospital.types';

export default function WardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const wardId = params?.id as string;

  const [ward, setWard] = useState<HospitalWard | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!wardId) return;
      setIsLoading(true);
      try {
        const wards = await fetchHospitalWards();
        const found = wards.find((w) => w.id === wardId) || wards[0];
        setWard(found || null);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [wardId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-xs text-slate-400 font-medium">Loading Ward Floor Plan...</p>
      </div>
    );
  }

  if (!ward) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="text-lg font-bold text-slate-200">Ward Record Not Found</h3>
        <Button variant="primary" size="sm" onClick={() => router.push('/hospital')}>
          Back to Hospital
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
          onClick={() => router.push('/hospital')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Hospital Command Center
        </Button>
      </div>

      <WardOccupancyGrid wards={[ward]} />
    </div>
  );
}
