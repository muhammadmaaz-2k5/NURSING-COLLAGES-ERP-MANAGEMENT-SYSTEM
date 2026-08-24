'use client';

import React from 'react';
import { Bed, ArrowRightLeft, LogOut, Plus, ShieldCheck, Home } from 'lucide-react';
import { HostelBuilding, HostelRoom, HostelBed } from '../types/hostel.types';
import { Badge } from '../../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';

export interface HostelOccupancyGridProps {
  buildings: HostelBuilding[];
  onAllocateBed?: (bed: HostelBed) => void;
  onTransferBed?: (bed: HostelBed) => void;
  onCheckoutBed?: (bed: HostelBed) => void;
}

export const HostelOccupancyGrid: React.FC<HostelOccupancyGridProps> = ({
  buildings,
  onAllocateBed,
  onTransferBed,
  onCheckoutBed,
}) => {
  return (
    <div className="space-y-8">
      {buildings.map((building) => (
        <div key={building.id} className="space-y-4">
          {/* Building Header Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-base">{building.name}</h3>
                  <Badge variant="purple" size="sm">
                    {building.gender} HOSTEL
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{building.address}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-slate-400">
                Capacity:{' '}
                <strong className="text-white">
                  {building.occupiedBedsCount} / {building.totalBedsCount} Beds
                </strong>
              </span>
              <Badge
                variant={
                  building.occupancyRate > 85
                    ? 'danger'
                    : building.occupancyRate > 50
                    ? 'warning'
                    : 'success'
                }
                size="sm"
              >
                {building.occupancyRate}% Occupied
              </Badge>
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {building.rooms.map((room) => (
              <Card key={room.id} className="p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-sm">{room.roomNumber}</span>
                    <span className="text-[10px] font-mono text-slate-500">({room.floor})</span>
                  </div>
                  <Badge variant="primary" size="sm">
                    {room.type} ({room.occupiedBedsCount}/{room.capacity})
                  </Badge>
                </div>

                {/* Bed Matrix inside Room */}
                <div className="grid grid-cols-2 gap-2.5">
                  {room.beds.map((bed) => {
                    const isOccupied = bed.status === 'OCCUPIED';

                    return (
                      <div
                        key={bed.id}
                        className={`p-3 rounded-xl border flex flex-col justify-between min-h-[110px] transition-all ${
                          isOccupied
                            ? 'bg-rose-950/20 border-rose-500/30'
                            : 'bg-emerald-950/20 border-emerald-500/30'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-1.5">
                            <Bed
                              className={`w-3.5 h-3.5 ${
                                isOccupied ? 'text-rose-400' : 'text-emerald-400'
                              }`}
                            />
                            <span className="font-mono font-bold text-xs text-white">
                              {bed.bedNumber}
                            </span>
                          </div>

                          <span
                            className={`text-[8px] font-bold px-1 py-0.2 rounded uppercase ${
                              isOccupied
                                ? 'bg-rose-500/20 text-rose-300'
                                : 'bg-emerald-500/20 text-emerald-300'
                            }`}
                          >
                            {isOccupied ? 'OCCUPIED' : 'FREE'}
                          </span>
                        </div>

                        {isOccupied && bed.currentAllocation ? (
                          <div className="my-1 space-y-0.5">
                            <p className="font-bold text-slate-100 text-[11px] truncate">
                              {bed.currentAllocation.studentName}
                            </p>
                            <p className="font-mono text-blue-400 text-[9px]">
                              {bed.currentAllocation.studentRegId}
                            </p>
                          </div>
                        ) : (
                          <div className="my-auto text-center py-1">
                            <span className="text-[10px] text-emerald-400/80 font-medium">
                              Ready for Student
                            </span>
                          </div>
                        )}

                        {/* Bed Actions */}
                        <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between">
                          {isOccupied ? (
                            <>
                              <button
                                title="Transfer Bed"
                                onClick={() => onTransferBed?.(bed)}
                                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-blue-400 transition-colors"
                              >
                                <ArrowRightLeft className="w-3 h-3" />
                              </button>
                              <button
                                title="Check Out Resident"
                                onClick={() => onCheckoutBed?.(bed)}
                                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                              >
                                <LogOut className="w-3 h-3" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => onAllocateBed?.(bed)}
                              className="w-full py-0.5 text-[9px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 rounded transition-all flex items-center justify-center gap-1"
                            >
                              <Plus className="w-2.5 h-2.5" /> Allocate
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
