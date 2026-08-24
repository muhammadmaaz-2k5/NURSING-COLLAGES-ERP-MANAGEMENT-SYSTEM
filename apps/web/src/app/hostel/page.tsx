'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Home,
  Bed,
  Users,
  Plus,
  ArrowRight,
  ShieldCheck,
  Building2,
  Layers,
  DoorClosed,
} from 'lucide-react';
import { DataTable, Column } from '../../components/tables/DataTable';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { HostelOccupancyGrid } from '../../features/hostel/components/HostelOccupancyGrid';
import { HostelBuildingModal } from '../../features/hostel/components/HostelBuildingModal';
import { RoomModal } from '../../features/hostel/components/RoomModal';
import { BedAllocationModal } from '../../features/hostel/components/BedAllocationModal';
import { BedTransferModal } from '../../features/hostel/components/BedTransferModal';
import { CheckoutModal } from '../../features/hostel/components/CheckoutModal';
import {
  fetchHostelDashboard,
  fetchHostels,
} from '../../features/hostel/services/hostel.api';
import {
  HostelBuilding,
  HostelBed,
  HostelDashboardData,
  HostelAllocation,
} from '../../features/hostel/types/hostel.types';
import { formatDate } from '../../lib/utils';

type HostelTab = 'buildings' | 'residents' | 'rooms';

export default function HostelPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<HostelTab>('buildings');
  const [dashboard, setDashboard] = useState<HostelDashboardData | null>(null);
  const [buildings, setBuildings] = useState<HostelBuilding[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState<HostelBed | null>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [dashRes, hstRes] = await Promise.all([
        fetchHostelDashboard(),
        fetchHostels(),
      ]);
      setDashboard(dashRes);
      setBuildings(hstRes);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Flatten active residents
  const activeResidents: HostelAllocation[] = buildings.flatMap((b) =>
    b.rooms.flatMap((r) =>
      r.beds
        .filter((bd) => bd.status === 'OCCUPIED' && bd.currentAllocation)
        .map((bd) => ({
          id: bd.currentAllocation!.id,
          studentId: bd.currentAllocation!.studentId,
          studentName: bd.currentAllocation!.studentName,
          studentRegId: bd.currentAllocation!.studentRegId,
          avatarUrl: bd.currentAllocation!.avatarUrl,
          programName: bd.currentAllocation!.programName,
          hostelId: b.id,
          hostelName: b.name,
          roomNumber: r.roomNumber,
          bedNumber: bd.bedNumber,
          startDate: bd.currentAllocation!.startDate,
          status: 'ACTIVE' as const,
        })),
    ),
  );

  const residentColumns: Column<HostelAllocation>[] = [
    {
      header: 'Resident Student',
      accessorKey: 'studentName',
      sortable: true,
      cell: (res) => (
        <div className="flex items-center gap-3">
          <img
            src={res.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'}
            alt={res.studentName}
            className="w-8 h-8 rounded-lg object-cover border border-slate-700 shrink-0"
          />
          <div>
            <p className="font-bold text-slate-100">{res.studentName}</p>
            <span className="font-mono text-blue-400 text-xs font-semibold">{res.studentRegId}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Hostel & Room',
      sortable: true,
      cell: (res) => (
        <div>
          <p className="font-semibold text-slate-200">{res.hostelName}</p>
          <span className="text-xs text-purple-400">
            {res.roomNumber} • Bed {res.bedNumber}
          </span>
        </div>
      ),
    },
    {
      header: 'Academic Program',
      accessorKey: 'programName',
      sortable: true,
      cell: (res) => <span className="text-slate-300 text-xs">{res.programName || 'Generic BSN'}</span>,
    },
    {
      header: 'Allocated Since',
      accessorKey: 'startDate',
      sortable: true,
      cell: (res) => <span className="font-mono text-slate-400 text-xs">{formatDate(res.startDate)}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (res) => (
        <Badge variant="success" size="sm" dot>
          RESIDENT
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
              Hostel & Student Accommodation
            </h1>
            <Badge variant="primary" size="sm">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-blue-400" />
              Single-Occupant Isolation
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage student residences, room-to-bed visual matrix layouts, single-occupant allocation locks, and room transfers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsBuildingModalOpen(true)}
            leftIcon={<Building2 className="w-4 h-4" />}
          >
            Add Hostel
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsRoomModalOpen(true)}
            leftIcon={<DoorClosed className="w-4 h-4" />}
          >
            Create Room
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setSelectedBed(null);
              setIsAllocationModalOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Allocate Bed
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Hostel Complexes
          </span>
          <h3 className="text-2xl font-black text-white mt-1">
            {dashboard?.totalBuildings || 2}
          </h3>
          <p className="text-xs text-blue-400 mt-2 font-medium">Male & Female Wings</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Residential Rooms
          </span>
          <h3 className="text-2xl font-black text-purple-400 mt-1">
            {dashboard?.totalRooms || 48}
          </h3>
          <p className="text-xs text-purple-300 mt-2 font-medium">Single, Double & Triple</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Active Student Residents
          </span>
          <h3 className="text-2xl font-black text-emerald-400 mt-1">
            {dashboard?.occupiedBeds || 142}
          </h3>
          <p className="text-xs text-emerald-300 mt-2 font-medium">Occupying Bed Slots</p>
        </Card>

        <Card hoverEffect className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Hostel Occupancy Rate
          </span>
          <h3 className="text-2xl font-black text-amber-400 mt-1">
            {dashboard?.occupancyRate || 78.8}%
          </h3>
          <p className="text-xs text-amber-300 mt-2 font-medium">
            {dashboard?.availableBeds || 38} Beds Available
          </p>
        </Card>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {[
          { id: 'buildings' as const, label: 'Hostels & Room Bed Matrix', icon: Home },
          { id: 'residents' as const, label: 'Resident Students Directory', icon: Users, count: activeResidents.length },
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

      {/* 1. BUILDINGS & ROOM BED MATRIX */}
      {activeTab === 'buildings' && (
        <HostelOccupancyGrid
          buildings={buildings}
          onAllocateBed={(bed) => {
            setSelectedBed(bed);
            setIsAllocationModalOpen(true);
          }}
          onTransferBed={(bed) => {
            setSelectedBed(bed);
            setIsTransferModalOpen(true);
          }}
          onCheckoutBed={(bed) => {
            setSelectedBed(bed);
            setIsCheckoutModalOpen(true);
          }}
        />
      )}

      {/* 2. RESIDENT DIRECTORY */}
      {activeTab === 'residents' && (
        <Card className="p-6 space-y-4">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-lg">Hostel Resident Students Directory</CardTitle>
              <CardDescription>
                Active boarders residing in campus hostel accommodations
              </CardDescription>
            </div>
          </CardHeader>

          <DataTable
            columns={residentColumns}
            data={activeResidents}
            isLoading={isLoading}
            searchPlaceholder="Search by student, registration ID, or room..."
            pageSize={10}
          />
        </Card>
      )}

      {/* Modals */}
      <HostelBuildingModal
        isOpen={isBuildingModalOpen}
        onClose={() => setIsBuildingModalOpen(false)}
        onSuccess={loadData}
      />

      <RoomModal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        onSuccess={loadData}
      />

      <BedAllocationModal
        isOpen={isAllocationModalOpen}
        onClose={() => setIsAllocationModalOpen(false)}
        selectedBed={selectedBed}
        onSuccess={loadData}
      />

      <BedTransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        bed={selectedBed}
        onSuccess={loadData}
      />

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        bed={selectedBed}
        onSuccess={loadData}
      />
    </div>
  );
}
