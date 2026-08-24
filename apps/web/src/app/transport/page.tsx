'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bus,
  MapPin,
  Users,
  Plus,
  ArrowRight,
  ShieldCheck,
  Fuel,
  Route as RouteIcon,
  Phone,
} from 'lucide-react';
import { DataTable, Column } from '../../components/tables/DataTable';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { VehicleCapacityIndicator } from '../../features/transport/components/VehicleCapacityIndicator';
import { VehicleModal } from '../../features/transport/components/VehicleModal';
import { RouteModal } from '../../features/transport/components/RouteModal';
import { StudentBusPassModal } from '../../features/transport/components/StudentBusPassModal';
import {
  fetchTransportDashboard,
  fetchVehicles,
  fetchRoutes,
  fetchAssignments,
} from '../../features/transport/services/transport.api';
import {
  TransportVehicle,
  TransportRoute,
  TransportAssignment,
  TransportDashboardData,
} from '../../features/transport/types/transport.types';
import { formatDate } from '../../lib/utils';

type TransportTab = 'fleet' | 'routes' | 'passes';

export default function TransportPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TransportTab>('fleet');
  const [dashboard, setDashboard] = useState<TransportDashboardData | null>(null);
  const [vehicles, setVehicles] = useState<TransportVehicle[]>([]);
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [assignments, setAssignments] = useState<TransportAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [dashRes, vehRes, rtsRes, asgRes] = await Promise.all([
        fetchTransportDashboard(),
        fetchVehicles(),
        fetchRoutes(),
        fetchAssignments(),
      ]);
      setDashboard(dashRes);
      setVehicles(vehRes);
      setRoutes(rtsRes);
      setAssignments(asgRes);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const vehicleColumns: Column<TransportVehicle>[] = [
    {
      header: 'Vehicle & Model',
      accessorKey: 'registrationNo',
      sortable: true,
      cell: (v) => (
        <div>
          <p className="font-mono font-bold text-slate-100">{v.registrationNo}</p>
          <span className="text-xs text-blue-400 font-medium">{v.type || v.name}</span>
        </div>
      ),
    },
    {
      header: 'Assigned Driver',
      accessorKey: 'driverName',
      sortable: true,
      cell: (v) => (
        <div className="text-xs">
          <p className="font-bold text-slate-200">{v.driverName || '—'}</p>
          <span className="text-slate-400 font-mono flex items-center gap-1 mt-0.5">
            <Phone className="w-3 h-3" /> {v.driverPhone || '—'}
          </span>
        </div>
      ),
    },
    {
      header: 'Assigned Route',
      cell: (v) => (
        <span className="text-xs font-semibold text-purple-300">
          {v.currentRoute?.name || 'General Transit'}
        </span>
      ),
    },
    {
      header: 'Seating Capacity & Meter',
      cell: (v) => (
        <div className="w-48">
          <VehicleCapacityIndicator
            capacity={v.capacity}
            allocated={v.allocatedSeatsCount}
          />
        </div>
      ),
    },
    {
      header: 'Fleet Status',
      accessorKey: 'status',
      cell: (v) => (
        <Badge variant={v.status === 'ACTIVE' ? 'success' : 'warning'} size="sm" dot>
          {v.status}
        </Badge>
      ),
    },
    {
      header: 'Action',
      cell: (v) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/transport/vehicles/${v.id}`)}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Vehicle Log
        </Button>
      ),
    },
  ];

  const assignmentColumns: Column<TransportAssignment>[] = [
    {
      header: 'Student Resident',
      accessorKey: 'studentName',
      sortable: true,
      cell: (asg) => (
        <div className="flex items-center gap-3">
          <img
            src={asg.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'}
            alt={asg.studentName}
            className="w-8 h-8 rounded-lg object-cover border border-slate-700 shrink-0"
          />
          <div>
            <p className="font-bold text-slate-100">{asg.studentName}</p>
            <span className="font-mono text-blue-400 text-xs">{asg.studentRegId}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Vehicle & Route',
      sortable: true,
      cell: (asg) => (
        <div>
          <p className="font-mono font-bold text-slate-200 text-xs">{asg.vehicleRegNo}</p>
          <span className="text-xs text-purple-400">{asg.routeName}</span>
        </div>
      ),
    },
    {
      header: 'Assigned Pickup Stop',
      accessorKey: 'stopName',
      cell: (asg) => (
        <div className="text-xs">
          <p className="font-semibold text-white">{asg.stopName || 'Terminal Stop'}</p>
          <span className="font-mono text-amber-400">{asg.pickupTime || '07:30 AM'}</span>
        </div>
      ),
    },
    {
      header: 'Pass Valid Since',
      accessorKey: 'startDate',
      sortable: true,
      cell: (asg) => <span className="font-mono text-slate-400 text-xs">{formatDate(asg.startDate)}</span>,
    },
    {
      header: 'Pass Status',
      accessorKey: 'status',
      cell: (asg) => (
        <Badge variant="success" size="sm" dot>
          ACTIVE PASS
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
              Transport & Fleet Management
            </h1>
            <Badge variant="success" size="sm">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Seating Capacity Protection
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage college fleet vehicles, commuter routes, scheduled pickup stops, and student transit bus passes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsVehicleModalOpen(true)}
            leftIcon={<Bus className="w-4 h-4" />}
          >
            Register Vehicle
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsRouteModalOpen(true)}
            leftIcon={<RouteIcon className="w-4 h-4" />}
          >
            Define Route
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsPassModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Issue Bus Pass
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Fleet Vehicles
          </span>
          <h3 className="text-2xl font-black text-white mt-1">
            {dashboard?.totalVehicles || 4}
          </h3>
          <p className="text-xs text-blue-400 mt-2 font-medium">Buses & Clinical Shuttles</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Seating Capacity
          </span>
          <h3 className="text-2xl font-black text-purple-400 mt-1">
            {dashboard?.totalSeatsCapacity || 148} Seats
          </h3>
          <p className="text-xs text-purple-300 mt-2 font-medium">Across All Active Routes</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Enrolled Student Commuters
          </span>
          <h3 className="text-2xl font-black text-emerald-400 mt-1">
            {dashboard?.totalEnrolledStudents || 125}
          </h3>
          <p className="text-xs text-emerald-300 mt-2 font-medium">Active Transport Passes</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Fleet Capacity Utilization
          </span>
          <h3 className="text-2xl font-black text-amber-400 mt-1">
            {dashboard?.fleetUtilizationRate || 84.4}%
          </h3>
          <p className="text-xs text-amber-300 mt-2 font-medium">
            {dashboard?.availableSeats || 23} Available Seats
          </p>
        </Card>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {[
          { id: 'fleet' as const, label: 'Fleet Vehicles & Seating', icon: Bus, count: vehicles.length },
          { id: 'routes' as const, label: 'Transit Routes & Stops', icon: RouteIcon, count: routes.length },
          { id: 'passes' as const, label: 'Student Bus Pass Roster', icon: Users, count: assignments.length },
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

      {/* 1. FLEET VEHICLES */}
      {activeTab === 'fleet' && (
        <Card className="p-6 space-y-4">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-lg">College Fleet Vehicles & Seating Meters</CardTitle>
              <CardDescription>
                Real-time seating occupancy and assigned driver details
              </CardDescription>
            </div>
          </CardHeader>

          <DataTable
            columns={vehicleColumns}
            data={vehicles}
            isLoading={isLoading}
            searchPlaceholder="Search by registration number, driver, or type..."
            pageSize={10}
            onRowClick={(v) => router.push(`/transport/vehicles/${v.id}`)}
          />
        </Card>
      )}

      {/* 2. ROUTES & STOPS */}
      {activeTab === 'routes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {routes.map((rt) => (
            <Card key={rt.id} className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">{rt.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {rt.startPoint} → {rt.endPoint}
                  </p>
                </div>
                <Badge variant="purple" size="sm">
                  {rt.stops.length} Stops
                </Badge>
              </div>

              {rt.vehicle && (
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-blue-400 font-bold">
                      {rt.vehicle.registrationNo}
                    </span>
                    <span className="text-slate-300">Driver: {rt.vehicle.driverName}</span>
                  </div>

                  <VehicleCapacityIndicator
                    capacity={rt.vehicle.capacity}
                    allocated={rt.vehicle.allocatedSeatsCount}
                  />
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => router.push(`/transport/routes/${rt.id}`)}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                View Stops Timeline & Enrolled Students
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* 3. PASSES ROSTER */}
      {activeTab === 'passes' && (
        <Card className="p-6 space-y-4">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-lg">Student Transport Passes Roster</CardTitle>
              <CardDescription>
                Active commuter passes with assigned routes and designated pickup points
              </CardDescription>
            </div>
          </CardHeader>

          <DataTable
            columns={assignmentColumns}
            data={assignments}
            isLoading={isLoading}
            searchPlaceholder="Search by student, registration ID, or route..."
            pageSize={10}
            onRowClick={(asg) => router.push(`/transport/students/${asg.studentId}`)}
          />
        </Card>
      )}

      {/* Modals */}
      <VehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        onSuccess={loadData}
      />

      <RouteModal
        isOpen={isRouteModalOpen}
        onClose={() => setIsRouteModalOpen(false)}
        onSuccess={loadData}
      />

      <StudentBusPassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
