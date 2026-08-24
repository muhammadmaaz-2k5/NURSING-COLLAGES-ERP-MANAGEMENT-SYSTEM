'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Home, Bed } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { HostelOccupancyGrid } from '../../../../features/hostel/components/HostelOccupancyGrid';
import { fetchHostels } from '../../../../features/hostel/services/hostel.api';
import { HostelBuilding, HostelRoom } from '../../../../features/hostel/types/hostel.types';

export default function HostelRoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params?.id as string;

  const [building, setBuilding] = useState<HostelBuilding | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!roomId) return;
      setIsLoading(true);
      try {
        const hostels = await fetchHostels();
        const foundBuilding = hostels.find((b) => b.rooms.some((r) => r.id === roomId)) || hostels[0];
        setBuilding(foundBuilding || null);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [roomId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-xs text-slate-400 font-medium">Loading Room Bed Matrix...</p>
      </div>
    );
  }

  if (!building) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="text-lg font-bold text-slate-200">Room Record Not Found</h3>
        <Button variant="primary" size="sm" onClick={() => router.push('/hostel')}>
          Back to Hostel
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
          onClick={() => router.push('/hostel')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Hostel Command Center
        </Button>
      </div>

      <HostelOccupancyGrid buildings={[building]} />
    </div>
  );
}
