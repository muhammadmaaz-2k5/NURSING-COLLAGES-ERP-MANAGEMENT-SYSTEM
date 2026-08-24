'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  Route as RouteIcon,
  Plus,
  Bus,
  MapPin,
  Clock,
  Phone,
} from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { RouteTimeline } from '../../../../features/transport/components/RouteTimeline';
import { StopModal } from '../../../../features/transport/components/StopModal';
import { VehicleCapacityIndicator } from '../../../../features/transport/components/VehicleCapacityIndicator';
import { fetchRoutes } from '../../../../features/transport/services/transport.api';
import { TransportRoute } from '../../../../features/transport/types/transport.types';

export default function RouteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const routeId = params?.id as string;

  const [route, setRoute] = useState<TransportRoute | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);

  const loadData = async () => {
    if (!routeId) return;
    setIsLoading(true);
    try {
      const routes = await fetchRoutes();
      const found = routes.find((r) => r.id === routeId) || routes[0];
      setRoute(found || null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [routeId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-xs text-slate-400 font-medium">Loading Route Specifications...</p>
      </div>
    );
  }

  if (!route) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="text-lg font-bold text-slate-200">Route Not Found</h3>
        <Button variant="primary" size="sm" onClick={() => router.push('/transport')}>
          Back to Transport
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/transport')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Transit Routes
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsStopModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Pickup Stop
        </Button>
      </div>

      {/* Route Header Banner */}
      <div className="p-6 lg:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Badge variant="purple" size="sm">
              TRANSIT CORRIDOR
            </Badge>
            <h1 className="text-2xl font-black text-white">{route.name}</h1>
            <p className="text-xs text-slate-400 font-mono">
              {route.startPoint} → {route.endPoint}
            </p>
          </div>

          {route.vehicle && (
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center min-w-[140px]">
              <span className="text-[10px] uppercase font-bold text-slate-500">Assigned Bus</span>
              <p className="text-xl font-black font-mono text-blue-400 mt-0.5">
                {route.vehicle.registrationNo}
              </p>
              <span className="text-[10px] text-slate-400 block">{route.vehicle.driverName}</span>
            </div>
          )}
        </div>

        {/* Capacity Strip */}
        {route.vehicle && (
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <VehicleCapacityIndicator
              capacity={route.vehicle.capacity}
              allocated={route.vehicle.allocatedSeatsCount}
            />
          </div>
        )}
      </div>

      {/* Stops Timeline */}
      <Card className="p-6 space-y-6">
        <CardHeader className="pb-2">
          <div>
            <CardTitle className="text-base">Scheduled Pickup Stops & Morning Timeline</CardTitle>
            <CardDescription>
              Sequence order and departure times for morning transit commute
            </CardDescription>
          </div>
        </CardHeader>

        <RouteTimeline stops={route.stops} />
      </Card>

      {/* Stop Modal */}
      <StopModal
        isOpen={isStopModalOpen}
        onClose={() => setIsStopModalOpen(false)}
        routeId={route.id}
        routeName={route.name}
        nextSequence={route.stops.length + 1}
        onSuccess={loadData}
      />
    </div>
  );
}
