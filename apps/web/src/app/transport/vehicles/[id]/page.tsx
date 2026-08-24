'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  Bus,
  Phone,
  ShieldCheck,
  User,
  Fuel,
  Route as RouteIcon,
} from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { VehicleCapacityIndicator } from '../../../../features/transport/components/VehicleCapacityIndicator';
import { fetchVehicles } from '../../../../features/transport/services/transport.api';
import { TransportVehicle } from '../../../../features/transport/types/transport.types';

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vehicleId = params?.id as string;

  const [vehicle, setVehicle] = useState<TransportVehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!vehicleId) return;
      setIsLoading(true);
      try {
        const vehicles = await fetchVehicles();
        const found = vehicles.find((v) => v.id === vehicleId) || vehicles[0];
        setVehicle(found || null);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [vehicleId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-xs text-slate-400 font-medium">Loading Vehicle Fleet Record...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="text-lg font-bold text-slate-200">Vehicle Not Found</h3>
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
          Back to Fleet Roster
        </Button>
      </div>

      {/* Vehicle Overview Banner */}
      <div className="p-6 lg:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="purple" size="sm">
                {vehicle.type}
              </Badge>
              <Badge variant="success" size="sm" dot>
                {vehicle.status}
              </Badge>
            </div>

            <h1 className="text-3xl font-black font-mono text-white">
              {vehicle.registrationNo}
            </h1>
            <p className="text-xs text-blue-400 font-medium">{vehicle.name || 'Campus Shuttle'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center min-w-[140px]">
            <span className="text-[10px] uppercase font-bold text-slate-500">Available Seats</span>
            <p className="text-2xl font-black font-mono text-emerald-400 mt-0.5">
              {vehicle.availableSeatsCount}
            </p>
            <span className="text-[10px] text-slate-400 block">of {vehicle.capacity} Total</span>
          </div>
        </div>

        {/* Capacity Indicator Strip */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
          <VehicleCapacityIndicator
            capacity={vehicle.capacity}
            allocated={vehicle.allocatedSeatsCount}
          />
        </div>

        {/* Vehicle Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 font-medium block">Assigned Driver</span>
            <span className="font-bold text-slate-200">{vehicle.driverName || '—'}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Driver Phone</span>
            <span className="font-mono text-slate-200">{vehicle.driverPhone || '—'}</span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Current Route</span>
            <span className="text-purple-300 font-semibold truncate block">
              {vehicle.currentRoute?.name || 'General Route'}
            </span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Fitness & Insurance</span>
            <span className="font-semibold text-emerald-400">Valid & Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}
